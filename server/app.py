#!/usr/bin/env python3
"""
SmoothGo local API server.

This server uses only the Python standard library:
- static web files from ../web
- SQLite user/session storage
- phone OTP verification
- mock SMS by default
- optional Aliyun SMS or a generic SMS webhook

Run:
    python3 server/app.py

Real SMS requires provider credentials in server/.env.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import math
import os
import re
import secrets
import sqlite3
import time
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlencode, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
WEB_DIR = ROOT.parent / "web"
DATA_DIR = ROOT / "data"
BOOKING_CHANNELS_FILE = ROOT / "booking_channels.json"


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env(ROOT / ".env")

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8080"))
DB_PATH = Path(os.environ.get("SMOOTHGO_DB", str(DATA_DIR / "smoothgo.db")))
OTP_SECRET = os.environ.get("OTP_SECRET", "dev-only-change-this-secret")
OTP_TTL_SECONDS = int(os.environ.get("OTP_TTL_SECONDS", "300"))
OTP_RESEND_SECONDS = int(os.environ.get("OTP_RESEND_SECONDS", "60"))
SESSION_TTL_DAYS = int(os.environ.get("SESSION_TTL_DAYS", "30"))
PBKDF2_ITERATIONS = int(os.environ.get("PBKDF2_ITERATIONS", "200000"))
MIN_PASSWORD_LENGTH = 6
QUEUE_MONTHLY_LIMIT = int(os.environ.get("QUEUE_MONTHLY_LIMIT", "2"))
QUEUE_PRICES = {30: 10, 60: 18, 90: 26}
DEV_SHOW_CODE = os.environ.get("DEV_SHOW_CODE", "1") == "1"
SMS_PROVIDER = os.environ.get("SMS_PROVIDER", "mock").strip().lower()
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*")

# Amap POI proxy (optional). The browser can also call AMap.PlaceSearch directly
# with the JS key, so this endpoint only exists for people who deploy server/
# and prefer to keep a Web-service key on the server side.
AMAP_WEB_SERVICE_KEY = os.environ.get("AMAP_WEB_SERVICE_KEY", "").strip()
AMAP_POI_TEXT_URL = "https://restapi.amap.com/v3/place/text"
AMAP_POI_AROUND_URL = "https://restapi.amap.com/v3/place/around"
AMAP_POI_PAGE_SIZE = 20

if SMS_PROVIDER != "mock" and OTP_SECRET == "dev-only-change-this-secret":
    raise RuntimeError("Set a strong OTP_SECRET in server/.env before using real SMS.")


def db_connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def ensure_column(conn, table: str, column: str, definition: str) -> None:
    """Add a column when an older database is missing it.

    Accounts created through the SMS code flow predate password support, so
    the columns must be added in place instead of recreating the table.
    """
    existing = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})")}
    if column not in existing:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def init_db() -> None:
    with db_connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT UNIQUE NOT NULL,
                created_at INTEGER NOT NULL,
                password_hash TEXT,
                password_salt TEXT
            );
            CREATE TABLE IF NOT EXISTS otp_codes (
                phone TEXT PRIMARY KEY,
                code_hash TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0,
                last_sent INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS searches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                query TEXT NOT NULL,
                keywords TEXT NOT NULL DEFAULT '',
                route TEXT NOT NULL DEFAULT '',
                days TEXT NOT NULL DEFAULT '[]',
                created_at INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE INDEX IF NOT EXISTS idx_searches_user
                ON searches(user_id, created_at DESC);
            CREATE TABLE IF NOT EXISTS queue_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                place_id TEXT NOT NULL,
                place_name TEXT NOT NULL,
                minutes INTEGER NOT NULL,
                price INTEGER NOT NULL,
                category TEXT NOT NULL DEFAULT 'attraction',
                tables_ahead INTEGER NOT NULL DEFAULT 0,
                people_ahead INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'submitted',
                created_at INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
            CREATE INDEX IF NOT EXISTS idx_queue_requests_user
                ON queue_requests(user_id, created_at DESC);
            """
        )
        # Databases created before password support lack these columns.
        ensure_column(conn, "users", "password_hash", "TEXT")
        ensure_column(conn, "users", "password_salt", "TEXT")
        ensure_column(conn, "searches", "days", "TEXT NOT NULL DEFAULT '[]'")
        ensure_column(conn, "queue_requests", "category", "TEXT NOT NULL DEFAULT 'attraction'")
        ensure_column(conn, "queue_requests", "tables_ahead", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "queue_requests", "people_ahead", "INTEGER NOT NULL DEFAULT 0")


def normalize_phone(value: str) -> str:
    raw = str(value or "").strip()
    digits = re.sub(r"\D", "", raw)
    if not digits:
        raise ValueError("请输入有效手机号")
    if raw.startswith("+"):
        normalized = "+" + digits
    elif raw.startswith("00"):
        normalized = "+" + digits[2:]
    elif len(digits) == 11 and digits.startswith("1"):
        normalized = "+86" + digits
    else:
        normalized = "+" + digits
    if not 8 <= len(normalized.replace("+", "")) <= 15:
        raise ValueError("手机号格式不正确")
    return normalized


def mask_phone(phone: str) -> str:
    return phone[:3] + "****" + phone[-4:] if len(phone) >= 7 else phone


def code_hash(phone: str, code: str) -> str:
    return hmac.new(
        OTP_SECRET.encode("utf-8"),
        f"{phone}:{code}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    """Derive a password hash with PBKDF2, returning (hash, salt)."""
    raw_salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        raw_salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    )
    return digest.hex(), raw_salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Check a password against its stored hash in constant time."""
    if not stored_hash or not salt:
        return False
    candidate, _ = hash_password(password, salt)
    return hmac.compare_digest(candidate, stored_hash)


def percent_encode(value: str) -> str:
    return quote(str(value), safe="~")


def api_post_json(request: Request, label: str = "API") -> dict:
    """POST a request and always surface the real error message.

    Aliyun answers business failures with a non-2xx status, so urlopen raises
    before the body holding the actual reason is ever read. Without this the
    caller only sees a bare "HTTP Error 404". Bodies that are not JSON (or are
    empty, which most webhooks return) decode to an empty dict.
    """
    try:
        with urlopen(request, timeout=12) as response:
            raw = response.read().decode("utf-8")
    except HTTPError as exc:
        body = ""
        try:
            body = exc.read().decode("utf-8", "replace")
        except Exception:
            body = ""
        try:
            payload = json.loads(body)
        except ValueError:
            raise RuntimeError(f"{label} HTTP {exc.code}: {body[:200] or exc.reason}") from exc
        code = payload.get("Code") or payload.get("code") or str(exc.code)
        detail = payload.get("Message") or payload.get("msg") or body[:200] or exc.reason
        raise RuntimeError(f"{label} {code}: {detail}") from exc
    try:
        return json.loads(raw)
    except ValueError:
        return {}


def send_aliyun_sms(phone: str, code: str) -> dict:
    access_key_id = os.environ.get("ALIYUN_SMS_ACCESS_KEY_ID", "").strip()
    access_key_secret = os.environ.get("ALIYUN_SMS_ACCESS_KEY_SECRET", "").strip()
    sign_name = os.environ.get("ALIYUN_SMS_SIGN_NAME", "").strip()
    template_code = os.environ.get("ALIYUN_SMS_TEMPLATE_CODE", "").strip()
    if not all([access_key_id, access_key_secret, sign_name, template_code]):
        raise RuntimeError("Aliyun SMS is selected but credentials/template are incomplete.")

    params = {
        "AccessKeyId": access_key_id,
        "Action": "SendSms",
        "Format": "JSON",
        "PhoneNumbers": phone,
        "RegionId": os.environ.get("ALIYUN_SMS_REGION_ID", "cn-hangzhou"),
        "SignName": sign_name,
        "SignatureMethod": "HMAC-SHA1",
        "SignatureNonce": secrets.token_hex(16),
        "SignatureVersion": "1.0",
        "TemplateCode": template_code,
        "TemplateParam": json.dumps({"code": code}, separators=(",", ":")),
        "Timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "Version": "2017-05-25",
    }
    canonical = "&".join(
        f"{percent_encode(key)}={percent_encode(params[key])}" for key in sorted(params)
    )
    string_to_sign = f"GET&%2F&{percent_encode(canonical)}"
    digest = hmac.new(
        (access_key_secret + "&").encode("utf-8"),
        string_to_sign.encode("utf-8"),
        hashlib.sha1,
    ).digest()
    params["Signature"] = base64.b64encode(digest).decode("ascii")
    url = "https://dysmsapi.aliyuncs.com/?" + urlencode(params, quote_via=quote)

    request = Request(url, headers={"User-Agent": "SmoothGo/1.0"})
    payload = api_post_json(request, "Aliyun")
    if payload.get("Code") != "OK":
        raise RuntimeError(payload.get("Message") or f"Aliyun SMS failed: {payload}")
    return {"provider": "aliyun", "requestId": payload.get("RequestId")}


def send_aliyun_verify_sms(phone: str, code: str) -> dict:
    """Send the code via Aliyun Phone Number Verification Service (Dypnsapi).

    Unlike the classic SendSms API, this needs no enterprise qualification, no
    signature filing and no template review: it sends using the system-granted
    signature and template, so a personally verified account can send real
    verification codes the same day. The code itself is still generated and
    verified locally, Aliyun is only used as the delivery channel.
    """
    access_key_id = (
        os.environ.get("ALIYUN_VERIFY_ACCESS_KEY_ID", "").strip()
        or os.environ.get("ALIYUN_SMS_ACCESS_KEY_ID", "").strip()
    )
    access_key_secret = (
        os.environ.get("ALIYUN_VERIFY_ACCESS_KEY_SECRET", "").strip()
        or os.environ.get("ALIYUN_SMS_ACCESS_KEY_SECRET", "").strip()
    )
    sign_name = os.environ.get("ALIYUN_VERIFY_SIGN_NAME", "").strip()
    template_code = os.environ.get("ALIYUN_VERIFY_TEMPLATE_CODE", "100001").strip()
    if not access_key_id or not access_key_secret:
        raise RuntimeError("Aliyun verification SMS is selected but AccessKey is missing.")
    if not sign_name:
        raise RuntimeError(
            "ALIYUN_VERIFY_SIGN_NAME is empty. Copy a granted signature from "
            "the Dypns console (SMS verify > parameter config > granted signatures)."
        )

    # The API expects a bare mainland number plus a separate country code,
    # while the app stores numbers as +8613800138000.
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 13 and digits.startswith("86"):
        digits = digits[2:]
    if not re.fullmatch(r"1[3-9]\d{9}", digits):
        raise RuntimeError(f"Aliyun verification SMS only accepts mainland numbers: {mask_phone(phone)}")

    valid_minutes = max(1, OTP_TTL_SECONDS // 60)
    raw_param = os.environ.get(
        "ALIYUN_VERIFY_TEMPLATE_PARAM", '{"code":"##code##","min":"##min##"}'
    ).strip()
    raw_param = raw_param.replace("##code##", code).replace("##min##", str(valid_minutes))
    try:
        json.loads(raw_param)
    except ValueError as exc:
        raise RuntimeError(f"ALIYUN_VERIFY_TEMPLATE_PARAM is not valid JSON: {exc}") from exc

    params = {
        "AccessKeyId": access_key_id,
        "Action": "SendSmsVerifyCode",
        "CodeLength": len(code),
        "CountryCode": os.environ.get("ALIYUN_VERIFY_COUNTRY_CODE", "86"),
        "Format": "JSON",
        "PhoneNumber": digits,
        "RegionId": os.environ.get("ALIYUN_VERIFY_REGION_ID", "cn-hangzhou"),
        "SignName": sign_name,
        "SignatureMethod": "HMAC-SHA1",
        "SignatureNonce": secrets.token_hex(16),
        "SignatureVersion": "1.0",
        "TemplateCode": template_code,
        "TemplateParam": raw_param,
        "Timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ValidTime": OTP_TTL_SECONDS,
        "Version": "2017-05-25",
    }
    canonical = "&".join(
        f"{percent_encode(key)}={percent_encode(params[key])}" for key in sorted(params)
    )
    string_to_sign = f"GET&%2F&{percent_encode(canonical)}"
    digest = hmac.new(
        (access_key_secret + "&").encode("utf-8"),
        string_to_sign.encode("utf-8"),
        hashlib.sha1,
    ).digest()
    params["Signature"] = base64.b64encode(digest).decode("ascii")
    url = "https://dypnsapi.aliyuncs.com/?" + urlencode(params, quote_via=quote)

    request = Request(url, headers={"User-Agent": "SmoothGo/1.0"})
    payload = api_post_json(request, "Aliyun")
    if payload.get("Code") != "OK":
        raise RuntimeError(payload.get("Message") or f"Aliyun verification SMS failed: {payload}")
    model = payload.get("Model") or {}
    if model.get("Code") and model.get("Code") != "OK":
        raise RuntimeError(f"Aliyun verification SMS rejected: {model.get('Code')}")
    return {"provider": "aliyun_verify", "requestId": payload.get("RequestId")}


PUSHPLUS_ENDPOINT = "https://www.pushplus.plus/send"


def send_webhook_sms(phone: str, code: str) -> dict:
    """Deliver the code through a webhook, in raw form or via PushPlus.

    Raw mode posts {"phone", "code", "template"} to your own gateway.
    PushPlus mode speaks the {token, title, content} contract that WeChat push
    gateways expect, so the code reaches a phone without any SMS provider,
    qualification or shim service.
    """
    url = os.environ.get("SMS_WEBHOOK_URL", "").strip()
    token = os.environ.get("SMS_WEBHOOK_TOKEN", "").strip()
    template = os.environ.get("SMS_WEBHOOK_TEMPLATE", "smoothgo_login").strip()
    fmt = os.environ.get("SMS_WEBHOOK_FORMAT", "raw").strip().lower()
    headers = {"Content-Type": "application/json", "User-Agent": "SmoothGo/1.0"}

    if fmt == "pushplus":
        if not token:
            raise RuntimeError("SMS_WEBHOOK_FORMAT=pushplus requires SMS_WEBHOOK_TOKEN.")
        url = url or PUSHPLUS_ENDPOINT
        valid_minutes = max(1, OTP_TTL_SECONDS // 60)
        body = json.dumps(
            {
                "token": token,
                "title": "SmoothGo 登录验证码",
                "content": (
                    f"验证码：{code}\n"
                    f"有效期：{valid_minutes} 分钟\n"
                    f"接收号码：{mask_phone(phone)}"
                ),
                "template": "txt",
            },
            ensure_ascii=False,
        ).encode("utf-8")
    elif fmt == "raw":
        if not url:
            raise RuntimeError("SMS_WEBHOOK_URL is not configured.")
        if token:
            headers["Authorization"] = f"Bearer {token}"
        body = json.dumps({"phone": phone, "code": code, "template": template}).encode(
            "utf-8"
        )
    else:
        raise RuntimeError(f"Unsupported SMS_WEBHOOK_FORMAT: {fmt}")

    request = Request(url, data=body, headers=headers, method="POST")
    payload = api_post_json(request, "PushPlus" if fmt == "pushplus" else "Webhook")
    if fmt == "pushplus" and payload.get("code") != 200:
        raise RuntimeError(
            f"PushPlus {payload.get('code')}: {payload.get('msg') or payload.get('data')}"
        )
    return {"provider": "webhook", "format": fmt}


def send_sms(phone: str, code: str) -> dict:
    provider = SMS_PROVIDER.replace("-", "_")
    if provider == "mock":
        print(f"[SMS MOCK] {mask_phone(phone)} verification code: {code}", flush=True)
        return {"provider": "mock"}
    if provider == "aliyun":
        return send_aliyun_sms(phone, code)
    if provider == "aliyun_verify":
        return send_aliyun_verify_sms(phone, code)
    if provider == "webhook":
        return send_webhook_sms(phone, code)
    raise RuntimeError(f"Unsupported SMS provider: {SMS_PROVIDER}")


def normalize_poi(poi: dict) -> dict:
    """Reduce an Amap POI down to the fields SmoothGo actually shows."""
    lng, _, lat = str(poi.get("location") or "").partition(",")
    return {
        "id": poi.get("id") or "",
        "name": poi.get("name") or "",
        "type": poi.get("type") or "",
        "address": poi.get("address") or "",
        "tel": poi.get("tel") or "",
        "province": poi.get("pname") or "",
        "city": poi.get("cityname") or "",
        "district": poi.get("adname") or "",
        "lng": lng,
        "lat": lat,
    }


def fetch_amap_poi(keywords: str, city: str = "", location: str = "", radius: int = 3000) -> list[dict]:
    """Query the Amap Web-service POI API.

    Requires a Web-service key (not the browser JS key). Raises RuntimeError with
    a readable message when the key is missing or Amap rejects the request.
    """
    if not keywords:
        raise RuntimeError("缺少 keywords 参数")
    if not AMAP_WEB_SERVICE_KEY:
        raise RuntimeError(
            "AMAP_WEB_SERVICE_KEY 未配置。到 https://console.amap.com/dev/key/app 申请"
            "「Web服务」类型的 Key（JS API Key 不能用于此接口），写入 server/.env。"
        )

    radius = max(1, min(int(radius or 3000), 50000))
    params = {
        "key": AMAP_WEB_SERVICE_KEY,
        "keywords": keywords,
        "offset": str(AMAP_POI_PAGE_SIZE),
        "page": "1",
        "extensions": "all",
    }
    if location:
        url = AMAP_POI_AROUND_URL
        params["location"] = location
        params["radius"] = str(radius)
    else:
        url = AMAP_POI_TEXT_URL
        params["city"] = city or "长春"
        params["citylimit"] = "true"

    request = Request(f"{url}?{urlencode(params)}", headers={"User-Agent": "SmoothGo/1.0"})
    with urlopen(request, timeout=8) as response:
        payload = json.loads(response.read().decode("utf-8"))
    if payload.get("status") != "1":
        raise RuntimeError(f"高德返回 {payload.get('info') or payload.get('infocode') or '未知错误'}")
    return [normalize_poi(poi) for poi in payload.get("pois", [])]


def issue_session(user_id: int) -> dict:
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    expires_at = now + SESSION_TTL_DAYS * 86400
    with db_connect() as conn:
        conn.execute(
            "INSERT INTO sessions(token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
            (token_hash(token), user_id, expires_at, now),
        )
    return {"token": token, "expiresAt": expires_at}


def user_from_token(token: str):
    if not token:
        return None
    now = int(time.time())
    with db_connect() as conn:
        row = conn.execute(
            """
            SELECT users.id, users.phone, users.created_at
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token_hash = ? AND sessions.expires_at > ?
            """,
            (token_hash(token), now),
        ).fetchone()
    if not row:
        return None
    return {"id": row["id"], "phone": row["phone"]}


def split_list(value: str) -> list[str]:
    """Decode a pipe-separated column back into a list."""
    return [item for item in str(value or "").split("|") if item]


# --- Booking handoff -------------------------------------------------------
#
# SmoothGo does not sell anything. Every channel below is somewhere else's
# checkout, and this layer exists for two reasons: the links live in one file
# that can be corrected without redeploying the front end, and nothing here
# accepts a URL from the caller -- an open redirect would let anybody mint
# https://oursite/api/go?url=phish.tld with our domain on it.

CHANNEL_KEYS = (
    "official_miniprogram",
    "official_site",
    "phone",
    "amap",
    "meituan",
    "dianping",
    "douyin",
)

# Measured, not assumed. Both of these were checked with a mobile UA and a
# follow-redirects request; the web search pages are not reachable by a logged
# out visitor, so linking to them as if they were is a lie.
#   点评 m.dianping.com/search/keyword/... -> 302 to mlogin.dianping.com (login wall)
#   美团 i.meituan.com/s/...              -> 302 to verify.meituan.com (bot wall)
# What does work is the native app: a keyword they can paste into it.
OTA_SEARCH_ONLY = {"meituan", "dianping"}


def load_booking_channels() -> dict:
    if not BOOKING_CHANNELS_FILE.exists():
        return {}
    try:
        with BOOKING_CHANNELS_FILE.open(encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, ValueError):
        return {}
    places = data.get("places")
    return places if isinstance(places, dict) else {}


def safe_lnglat(lng: str, lat: str):
    try:
        lng_val = float(lng)
        lat_val = float(lat)
    except (TypeError, ValueError):
        return None
    if not (-180 <= lng_val <= 180 and -90 <= lat_val <= 90):
        return None
    return lng_val, lat_val


def clean_tel(value: str) -> str:
    """Keep only characters a phone scheme can carry."""
    tel = re.sub(r"[^0-9+\-(),;]", "", str(value or "").strip())
    return tel[:32]


def amap_poi_url(lng: float, lat: float, name: str) -> str:
    return (
        f"https://uri.amap.com/marker?position={lng},{lat}"
        f"&name={quote(str(name)[:40])}&src=SmoothGo&coordinate=gaode&callnative=1"
    )


def channel_url(key: str, query: dict, entry: dict):
    """Resolve one channel to a URL, or None when it is not available.

    `query` carries only data, never a URL: name, lng, lat, tel.
    """
    name = str(query.get("name") or "")[:60].strip()
    tel = clean_tel(query.get("tel") or "")
    coords = safe_lnglat(query.get("lng") or "", query.get("lat") or "")

    if key == "official_miniprogram":
        mini = (entry or {}).get("miniprogram") or {}
        return mini.get("urlLink") or None
    if key == "official_site":
        site = str((entry or {}).get("site") or "").strip()
        if not site:
            return None
        return site if site.startswith(("http://", "https://")) else f"https://{site}"
    if key == "phone":
        return f"tel:{tel}" if tel else None
    if key == "amap":
        return amap_poi_url(*coords, name) if coords else None
    if key == "meituan":
        return f"https://i.meituan.com/search/keyword?q={quote(name)}" if name else None
    if key == "dianping":
        return f"https://m.dianping.com/search/keyword/0/0_{quote(name)}" if name else None
    if key == "douyin":
        return f"https://www.douyin.com/search/{quote(name)}" if name else None
    return None


def booking_channels_for(query: dict) -> list[dict]:
    """Describe every channel for one place, including the missing ones.

    A channel that is not available is still returned with `available: false`
    so the panel can say why instead of silently dropping the row.
    """
    entry = load_booking_channels().get(str(query.get("place") or ""), {}) or {}
    name = str(query.get("name") or "").strip()
    tel = clean_tel(query.get("tel") or "")
    mini = entry.get("miniprogram") or {}
    channels = []

    for key in CHANNEL_KEYS:
        url = channel_url(key, query, entry)
        if key == "official_miniprogram":
            state = "ok" if url or mini.get("appid") else "missing"
            note = (
                "微信内直接打开该景区小程序"
                if state == "ok"
                else "未收录链接 —— 复制名称，到微信搜索官方小程序"
            )
            channels.append(
                {
                    "key": key,
                    "label": mini.get("name") or "官方小程序",
                    "note": note,
                    "available": state == "ok",
                    "url": url,
                    "kind": (
                        "miniprogram"
                        if mini.get("appid")
                        else "link"
                        if url
                        else "search"
                    ),
                    "appid": mini.get("appid") or "",
                    "path": mini.get("path") or "",
                    "searchHint": name,
                }
            )
            continue
        if key == "phone":
            channels.append(
                {
                    "key": key,
                    "label": f"电话 {tel}" if tel else "场馆电话",
                    "note": "订票、订座与开放时间以对方答复为准" if tel else "该地点暂无登记电话",
                    "available": bool(tel),
                    "url": url,
                    "kind": "tel" if url else "none",
                }
            )
            continue
        if key == "official_site":
            site = str(entry.get("site") or "").strip()
            channels.append(
                {
                    "key": key,
                    "label": "官方网站",
                    "note": "该机构登记的官网地址" if site else "未收录官方站点",
                    "available": bool(site),
                    "url": url,
                    "kind": "link" if site else "none",
                }
            )
            continue
        if key == "amap":
            channels.append(
                {
                    "key": key,
                    "label": "高德 POI 详情页",
                    "note": "完整档案：电话、公告与商家入口",
                    "available": bool(url),
                    "url": url,
                    "kind": "link" if url else "none",
                }
            )
            continue
        # OTA rows: reachable only inside the native app.
        label = {"meituan": "美团", "dianping": "大众点评", "douyin": "抖音"}[key]
        channels.append(
            {
                "key": key,
                "label": label,
                "note": (
                    f"在本机 {label} App 内搜索「{name}」"
                    if key in OTA_SEARCH_ONLY
                    else f"搜索「{name}」查看团购"
                ),
                "available": bool(url) and key not in OTA_SEARCH_ONLY,
                "url": url,
                "kind": "search" if key in OTA_SEARCH_ONLY else "link",
                "searchHint": name,
            }
        )
    return channels


def join_list(values) -> str:
    """Encode a list into a pipe-separated column.

    Pipes are replaced so a stray value cannot forge extra entries.
    """
    return "|".join(
        str(item).strip().replace("|", "/")
        for item in (values or [])
        if str(item).strip()
    )


def row_to_search(row) -> dict:
    try:
        days = json.loads(row["days"] or "[]")
        if not isinstance(days, list):
            days = []
    except (TypeError, ValueError):
        days = []
    return {
        "id": row["id"],
        "query": row["query"],
        "keywords": split_list(row["keywords"]),
        "route": split_list(row["route"]),
        "days": [
            [str(place_id) for place_id in day if str(place_id).strip()]
            for day in days
            if isinstance(day, list)
        ],
        "createdAt": row["created_at"],
    }


def month_start(now: int | None = None) -> int:
    """Return local midnight on the first day of the current month."""
    local = datetime.fromtimestamp(now or time.time()).astimezone()
    start = local.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return int(start.timestamp())


def queue_quota_for_user(conn, user_id: int, now: int | None = None) -> dict:
    used = conn.execute(
        "SELECT COUNT(*) FROM queue_requests WHERE user_id = ? AND created_at >= ?",
        (user_id, month_start(now)),
    ).fetchone()[0]
    limit = max(0, QUEUE_MONTHLY_LIMIT)
    return {
        "limit": limit,
        "used": int(used),
        "remaining": max(0, limit - int(used)),
    }


def row_to_queue_request(row) -> dict:
    return {
        "id": row["id"],
        "requestId": f"SG-{row['id']:06d}",
        "placeId": row["place_id"],
        "placeName": row["place_name"],
        "minutes": row["minutes"],
        "price": row["price"],
        "category": row["category"],
        "tablesAhead": row["tables_ahead"],
        "peopleAhead": row["people_ahead"],
        "status": row["status"],
        "createdAt": row["created_at"],
    }


class Handler(SimpleHTTPRequestHandler):
    server_version = "SmoothGo/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGINS)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def json_response(self, status: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length > 8192:
            raise ValueError("Request body is too large")
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def bearer_token(self) -> str:
        value = self.headers.get("Authorization", "")
        return value[7:].strip() if value.startswith("Bearer ") else ""

    def redirect_response(self, location: str):
        self.send_response(302)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def booking_params(self) -> dict:
        query = parse_qs(urlparse(self.path).query)
        return {
            "place": (query.get("place") or [""])[0][:64],
            "name": (query.get("name") or [""])[0][:60],
            "lng": (query.get("lng") or [""])[0][:16],
            "lat": (query.get("lat") or [""])[0][:16],
            "tel": (query.get("tel") or [""])[0][:48],
        }

    def handle_booking(self, path: str):
        params = self.booking_params()
        if path == "/api/booking/channels":
            self.json_response(
                200,
                {
                    "place": params["place"],
                    "name": params["name"],
                    "channels": booking_channels_for(params),
                },
            )
            return

        key = parse_qs(urlparse(self.path).query).get("ch", [""])[0]
        if key not in CHANNEL_KEYS:
            self.json_response(400, {"error": "未知渠道"})
            return
        entry = load_booking_channels().get(params["place"], {}) or {}
        url = channel_url(key, params, entry)
        if not url:
            self.json_response(404, {"error": "该渠道未收录"})
            return
        # 美团/点评网页版会跳登录页或风控页，跳过去等于把用户丢在门口。
        if key in OTA_SEARCH_ONLY:
            self.json_response(
                409,
                {"error": "网页版需登录或被风控拦截，请在本机 App 内搜索", "searchHint": params["name"]},
            )
            return
        self.redirect_response(url)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            self.json_response(200, {"ok": True, "provider": SMS_PROVIDER})
            return
        if path in ("/api/booking/channels", "/api/go"):
            self.handle_booking(path)
            return
        if path == "/api/poi/search":
            query = parse_qs(urlparse(self.path).query)
            try:
                pois = fetch_amap_poi(
                    (query.get("keywords") or [""])[0].strip(),
                    city=(query.get("city") or [""])[0].strip(),
                    location=(query.get("location") or [""])[0].strip(),
                    radius=int((query.get("radius") or ["3000"])[0]),
                )
            except (ValueError, RuntimeError) as exc:
                self.json_response(400, {"error": str(exc)})
                return
            except (URLError, HTTPError) as exc:
                self.json_response(502, {"error": f"无法连接高德：{exc}"})
                return
            self.json_response(200, {"pois": pois, "count": len(pois)})
            return
        if path == "/api/me":
            user = user_from_token(self.bearer_token())
            if not user:
                self.json_response(401, {"error": "请先登录"})
                return
            self.json_response(200, {"user": user})
            return
        if path == "/api/searches":
            user = user_from_token(self.bearer_token())
            if not user:
                self.json_response(401, {"error": "请先登录"})
                return
            with db_connect() as conn:
                rows = conn.execute(
                    "SELECT id, query, keywords, route, days, created_at"
                    " FROM searches WHERE user_id = ?"
                    " ORDER BY created_at DESC, id DESC LIMIT 50",
                    (user["id"],),
                ).fetchall()
            self.json_response(200, {"searches": [row_to_search(row) for row in rows]})
            return
        if path == "/api/queue-requests":
            user = user_from_token(self.bearer_token())
            if not user:
                self.json_response(401, {"error": "请先登录"})
                return
            with db_connect() as conn:
                rows = conn.execute(
                    "SELECT id, place_id, place_name, minutes, price, category,"
                    " tables_ahead, people_ahead, status, created_at"
                    " FROM queue_requests WHERE user_id = ?"
                    " ORDER BY created_at DESC, id DESC LIMIT 20",
                    (user["id"],),
                ).fetchall()
                quota = queue_quota_for_user(conn, user["id"])
            self.json_response(
                200,
                {
                    "requests": [row_to_queue_request(row) for row in rows],
                    "quota": quota,
                },
            )
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            payload = self.read_json()
            if path == "/api/auth/send-code":
                phone_raw = payload.get("phone", "")
                phone = normalize_phone(phone_raw)
                now = int(time.time())
                with db_connect() as conn:
                    row = conn.execute(
                        "SELECT last_sent FROM otp_codes WHERE phone = ?", (phone,)
                    ).fetchone()
                    if row and now - row["last_sent"] < OTP_RESEND_SECONDS:
                        wait = OTP_RESEND_SECONDS - (now - row["last_sent"])
                        self.json_response(429, {"error": f"请 {wait} 秒后再试"})
                        return
                code = f"{secrets.randbelow(1000000):06d}"
                expiry = now + OTP_TTL_SECONDS
                with db_connect() as conn:
                    conn.execute(
                        """
                        INSERT INTO otp_codes(phone, code_hash, expires_at, attempts, last_sent)
                        VALUES (?, ?, ?, 0, ?)
                        ON CONFLICT(phone) DO UPDATE SET
                            code_hash=excluded.code_hash,
                            expires_at=excluded.expires_at,
                            attempts=0,
                            last_sent=excluded.last_sent
                        """,
                        (phone, code_hash(phone, code), expiry, now),
                    )
                try:
                    delivery = send_sms(phone, code)
                except Exception as exc:
                    with db_connect() as conn:
                        conn.execute("DELETE FROM otp_codes WHERE phone = ?", (phone,))
                    print(f"[SMS ERROR] {mask_phone(phone)}: {exc}", flush=True)
                    self.json_response(502, {"error": "短信发送失败，请检查短信服务配置"})
                    return
                response = {
                    "ok": True,
                    "expiresIn": OTP_TTL_SECONDS,
                    "phone": mask_phone(phone),
                    "provider": delivery.get("provider", SMS_PROVIDER),
                }
                if SMS_PROVIDER == "mock" and DEV_SHOW_CODE:
                    response["devCode"] = code
                self.json_response(200, response)
                return

            if path == "/api/auth/verify":
                phone = normalize_phone(payload.get("phone", ""))
                code = re.sub(r"\D", "", str(payload.get("code", "")))
                now = int(time.time())
                with db_connect() as conn:
                    row = conn.execute(
                        "SELECT * FROM otp_codes WHERE phone = ?", (phone,)
                    ).fetchone()
                if not row or row["expires_at"] < now:
                    self.json_response(401, {"error": "验证码已过期，请重新获取"})
                    return
                if row["attempts"] >= 5:
                    self.json_response(429, {"error": "尝试次数过多，请重新获取验证码"})
                    return
                if not hmac.compare_digest(row["code_hash"], code_hash(phone, code)):
                    with db_connect() as conn:
                        conn.execute(
                            "UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ?",
                            (phone,),
                        )
                    self.json_response(401, {"error": "验证码不正确"})
                    return
                with db_connect() as conn:
                    conn.execute("DELETE FROM otp_codes WHERE phone = ?", (phone,))
                    conn.execute(
                        "INSERT OR IGNORE INTO users(phone, created_at) VALUES (?, ?)",
                        (phone, now),
                    )
                    user = conn.execute(
                        "SELECT id, phone FROM users WHERE phone = ?", (phone,)
                    ).fetchone()
                session = issue_session(user["id"])
                self.json_response(
                    200,
                    {
                        "ok": True,
                        "token": session["token"],
                        "expiresAt": session["expiresAt"],
                        "user": {"id": user["id"], "phone": user["phone"]},
                    },
                )
                return

            if path == "/api/auth/register":
                phone = normalize_phone(payload.get("phone", ""))
                password = str(payload.get("password", ""))
                if len(password) < MIN_PASSWORD_LENGTH:
                    self.json_response(
                        400, {"error": f"密码至少 {MIN_PASSWORD_LENGTH} 位"}
                    )
                    return
                now = int(time.time())
                with db_connect() as conn:
                    existing = conn.execute(
                        "SELECT id, password_hash FROM users WHERE phone = ?", (phone,)
                    ).fetchone()
                    if existing:
                        # An account created through the SMS flow has no password.
                        # Converting it requires proving control of the number, so
                        # refuse here instead of letting anyone claim it.
                        if existing["password_hash"]:
                            error = "该手机号已注册，请直接登录"
                        else:
                            error = "该手机号已注册，请先用验证码登录后再设置密码"
                        self.json_response(409, {"error": error})
                        return
                    digest, salt = hash_password(password)
                    cursor = conn.execute(
                        "INSERT INTO users(phone, password_hash, password_salt, created_at)"
                        " VALUES (?, ?, ?, ?)",
                        (phone, digest, salt, now),
                    )
                    user_id = int(cursor.lastrowid)
                session = issue_session(user_id)
                self.json_response(
                    200,
                    {
                        "ok": True,
                        "token": session["token"],
                        "expiresAt": session["expiresAt"],
                        "user": {"id": user_id, "phone": phone},
                    },
                )
                return

            if path == "/api/auth/login":
                phone = normalize_phone(payload.get("phone", ""))
                password = str(payload.get("password", ""))
                with db_connect() as conn:
                    row = conn.execute(
                        "SELECT id, phone, password_hash, password_salt"
                        " FROM users WHERE phone = ?",
                        (phone,),
                    ).fetchone()
                if not row:
                    # Reveals whether a number is registered. Fine for a course
                    # demo, but a public service should answer with a generic
                    # "wrong phone or password" to prevent account enumeration.
                    self.json_response(401, {"error": "该手机号尚未注册，请先注册"})
                    return
                if not row["password_hash"]:
                    self.json_response(401, {"error": "该账号未设置密码，请使用验证码登录"})
                    return
                if not verify_password(password, row["password_hash"], row["password_salt"]):
                    self.json_response(401, {"error": "手机号或密码不正确"})
                    return
                session = issue_session(row["id"])
                self.json_response(
                    200,
                    {
                        "ok": True,
                        "token": session["token"],
                        "expiresAt": session["expiresAt"],
                        "user": {"id": row["id"], "phone": row["phone"]},
                    },
                )
                return

            if path == "/api/searches":
                user = user_from_token(self.bearer_token())
                if not user:
                    self.json_response(401, {"error": "请先登录"})
                    return
                query = str(payload.get("query", "")).strip()
                if not query:
                    self.json_response(400, {"error": "搜索内容不能为空"})
                    return
                raw_days = payload.get("days", [])
                day_list = []
                if isinstance(raw_days, list):
                    for day in raw_days[:21]:
                        if not isinstance(day, list):
                            continue
                        clean_day = [
                            str(place_id).strip()[:80]
                            for place_id in day[:5]
                            if str(place_id).strip()
                        ]
                        if clean_day:
                            day_list.append(clean_day)
                now = int(time.time())
                with db_connect() as conn:
                    cursor = conn.execute(
                        "INSERT INTO searches(user_id, query, keywords, route, days, created_at)"
                        " VALUES (?, ?, ?, ?, ?, ?)",
                        (
                            user["id"],
                            query,
                            join_list(payload.get("keywords")),
                            join_list(payload.get("route")),
                            json.dumps(day_list, ensure_ascii=False),
                            now,
                        ),
                    )
                    search_id = int(cursor.lastrowid)
                self.json_response(200, {"ok": True, "id": search_id})
                return

            if path == "/api/queue-requests":
                user = user_from_token(self.bearer_token())
                if not user:
                    self.json_response(401, {"error": "请先登录"})
                    return
                place_id = str(payload.get("placeId", "")).strip()
                place_name = str(payload.get("placeName", "")).strip()
                try:
                    minutes = int(payload.get("minutes", 0))
                except (TypeError, ValueError):
                    minutes = 0
                try:
                    people_ahead = max(0, min(100000, int(payload.get("peopleAhead", 0))))
                except (TypeError, ValueError):
                    people_ahead = 0
                category = "food" if payload.get("category") == "food" else "attraction"
                if not place_id or not place_name:
                    self.json_response(400, {"error": "缺少地点信息"})
                    return
                if len(place_id) > 80 or len(place_name) > 120:
                    self.json_response(400, {"error": "地点信息过长"})
                    return
                if minutes not in QUEUE_PRICES:
                    self.json_response(400, {"error": "排队时长不支持"})
                    return
                tables_ahead = math.ceil(minutes / 4) if category == "food" else 0
                if category != "food":
                    people_ahead = people_ahead or minutes * 12

                now = int(time.time())
                with db_connect() as conn:
                    quota = queue_quota_for_user(conn, user["id"], now)
                    if quota["remaining"] <= 0:
                        self.json_response(
                            429,
                            {"error": "本月演示额度已用完", "quota": quota},
                        )
                        return
                    cursor = conn.execute(
                        "INSERT INTO queue_requests"
                        "(user_id, place_id, place_name, minutes, price, category,"
                        " tables_ahead, people_ahead, status, created_at)"
                        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?)",
                        (
                            user["id"],
                            place_id,
                            place_name,
                            minutes,
                            QUEUE_PRICES[minutes],
                            category,
                            tables_ahead,
                            people_ahead if category != "food" else 0,
                            now,
                        ),
                    )
                    request_id = int(cursor.lastrowid)
                    row = conn.execute(
                        "SELECT id, place_id, place_name, minutes, price, category,"
                        " tables_ahead, people_ahead, status, created_at"
                        " FROM queue_requests WHERE id = ?",
                        (request_id,),
                    ).fetchone()
                    quota = queue_quota_for_user(conn, user["id"], now)
                self.json_response(
                    200,
                    {
                        "ok": True,
                        "request": row_to_queue_request(row),
                        "quota": quota,
                    },
                )
                return

            if path == "/api/auth/logout":
                token = self.bearer_token()
                if token:
                    with db_connect() as conn:
                        conn.execute(
                            "DELETE FROM sessions WHERE token_hash = ?", (token_hash(token),)
                        )
                self.json_response(200, {"ok": True})
                return

            self.json_response(404, {"error": "Not found"})
        except ValueError as exc:
            self.json_response(400, {"error": str(exc)})
        except (URLError, HTTPError) as exc:
            print(f"[UPSTREAM ERROR] {exc}", flush=True)
            self.json_response(502, {"error": "外部短信服务请求失败"})
        except Exception as exc:
            print(f"[SERVER ERROR] {exc}", flush=True)
            self.json_response(500, {"error": "服务器错误"})


def main():
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"SmoothGo API + web: http://{HOST}:{PORT}", flush=True)
    print(f"SMS provider: {SMS_PROVIDER}", flush=True)
    print(f"Web directory: {WEB_DIR}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

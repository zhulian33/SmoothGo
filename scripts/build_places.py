"""Turn scripts/poi_raw.json into web/places.poi.js.

Run after fetch_poi.py:

    python3 scripts/build_places.py

Filtering rules:
- drop anything farther than 40 km from downtown (the rural counties are not
  useful for a one-day city itinerary)
- drop non-visit POIs by name/type (toilets, car parks, banks, schools, ...)
- de-duplicate by Amap id, and by name+street so that different branches of the
  same chain survive. Deduping on name alone would collapse 700cc's 20+ stores
  into one, which is exactly the bug this replaces.
- keep up to LIMIT_ATTRACTION attractions and LIMIT_FOOD restaurants, ordering
  featured Changchun places first, then entries with a phone number, then closer
  ones

Amap returns a star rating and opening hours once PlaceSearch runs with
extensions:"all", plus up to three photos per POI. Those are copied as-is and
surfaced in the detail card -- the rating is Amap's own score, not a Dianping
score, and the UI says so. Ticket price stays null: Amap has no such field, and
inventing one would be worse than showing 待接入.

Average spend is a category band (see estimate_spend), not a measured price --
it exists so the budget field actually influences planning instead of silently
evaluating to zero. Queue ranges are likewise estimates. Both are therefore
marked confidence:"低" and labelled as estimates in the UI.

FEATURED_* below is the editorial layer: Amap has no idea what is "a Changchun
thing", so the list is hand-maintained. It drives the 长春特色 badge and lets the
UI sort local specialties above generic chains.
"""

import json
import math
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
RAW = HERE / "poi_raw.json"
OUT = HERE.parent / "web" / "places.poi.js"

CENTER = (125.3235, 43.8171)
MAX_KM = 40
LIMIT_ATTRACTION = 200
LIMIT_FOOD = 360

# Changchun signatures. A hit marks the POI as a local specialty.
# Proper nouns only. Category words like 东北菜 or 火锅 belong in the keyword
# list for *fetching*, not here -- matching them would badge half the library
# and the badge would stop meaning anything.
FEATURED_ATTRACTION = [
    "净月潭", "伪满皇宫", "长影", "雕塑园", "南湖", "莲花山", "天定山", "庙香山",
    "冰雪新天地", "吉林省博物院", "伪满", "地质宫", "般若寺", "文庙", "农博园",
    "北湖", "水文化生态园", "动植物园", "胜利公园", "君子兰",
]
# No 熏肉大饼 / 烤冷面 here: they are real Changchun snacks, but dozens of
# unrelated corner shops carry the name, and badging them all dilutes the badge.
FEATURED_FOOD = [
    "700cc", "老昌春饼", "王记酱骨", "福义德", "杨麻子", "东方肉馆", "元盛居",
    "老白肉馆", "韩庄", "金达莱", "天宝鹿园", "向阳屯", "老韩头", "回宝珍",
    "鼎丰真", "鼎盛园", "老李头", "老字号",
]

BAD_NAME = [
    "厕所", "停车场", "加油站", "银行", "ATM", "医院", "诊所", "药店",
    "幼儿园", "公司", "小区", "住宅", "公交",
    "地铁", "车站", "收费站", "服务区", "快递", "洗衣", "派出所", "政府",
    "收费处", "出入口", "电梯", "宿舍", "食堂", "后勤", "公寓", "办公楼",
    "售票", "检票", "游客中心", "服务中心", "咨询中心", "管理处", "派出所",
    "律师事务所", "会计师事务所", "房地产", "售楼", "中介", "婚庆", "培训",
    "摄影工作室", "化妆", "美容", "按摩", "足道", "网吧", "桌球", "棋牌",
    "充电站", "监测中心", "派出所", "环卫", "供电", "水务", "燃气",
    "公园站", "地铁站", "停车场", "游船码头", "码头",
]

# Matched as a whole trailing segment rather than a substring -- "办事处" appears
# inside legitimate shop names, and 大学/学院 inside branch names such as
# 700CC(吉林大学前卫南区日新楼店). Losing that branch to the word 大学 inside
# 吉林大学 is why 700CC vanished from the library entirely.
BAD_NAME_EXACT = [
    "办事处", "售票处", "检票口", "游客服务中心", "管理处", "值班室",
    "学校", "幼儿园", "小学", "中学", "大学", "学院", "研究所", "驾校",
]
BAD_TYPE = [
    "交通设施服务", "金融保险服务", "医疗保健服务", "政府机构及社会团体",
    "道路附属设施", "门址", "地名地址信息", "公共设施", "商务住宅", "科教文化服务",
    "生活服务", "住宿服务", "房地产", "法律服务", "摄影服务", "美容美发",
    "运动场馆", "休闲场所", "购物服务", "餐饮相关场所",
]

# ...but 科教文化服务 and 购物服务 also cover the venues a visitor actually
# wants: 这有山 is typed 购物服务;商场;购物中心 and 长影旧址博物馆 is typed
# 科教文化服务;博物馆. Filtering those wholesale deleted half the landmarks, so
# a type is only dropped when it carries no keep-hint.
KEEP_TYPE_HINTS = [
    "商场", "购物中心", "百货", "商业街", "博物馆", "纪念馆", "展览馆",
    "美术馆", "剧院", "音乐厅", "文化宫", "科技馆", "体育馆",
]
# Deliberately absent: 图书馆 / 档案馆. They rode in with 博物馆 when that hint
# was added to rescue 长影旧址博物馆, but a university reading room is not
# somewhere a visitor goes -- it seeded 26 rows into the attraction pool, 23 of
# them with no Amap rating at all.

# Amap returns a scenic area as one POI plus every sub-attraction inside it
# ("净月潭国家森林公园-月潭览胜", "净月潭国家森林公园-猛兽观赏区"). One destination
# should be one row, so a hyphen after a known scenic name folds the child into
# the parent and is dropped here. Same for "(暂停营业)" style suffixes, which are
# operational noise rather than a separate place.
SCENIC_ROOTS = [
    "净月潭", "北湖", "莲花山", "雕塑园", "世界雕塑公园", "南湖", "天定山",
    "庙香山", "长影世纪城", "伪满皇宫", "般若寺", "文庙", "农博园",
    "水文化生态园", "长春动植物公园", "胜利公园", "君子兰", "劳动公园",
    "长春公园", "儿童公园", "伊通河", "新立湖", "吊水壶", "双阳",
]

# Head-ends that mean the part before a hyphen is a venue, not a spot inside it.
SCENIC_WRAPPERS = [
    "公园", "景区", "风景区", "风景名胜区", "森林公园", "湿地", "森林",
    "广场", "博物院", "博物馆", "纪念馆", "寺", "庙", "故居", "遗址", "湖", "山",
]

# Inside a scenic area, only these read as destinations a visitor would plan a
# stop at. "净月潭游船" and "净月潭景区音乐喷泉" are facilities inside 净月潭; a
# 度假区 or 滑雪场 is its own stop.
KEEP_SUB_VENUES = [
    "度假区", "度假村", "小镇", "滑雪场", "雪场", "乐园", "营地", "山庄",
    "温泉", "花海", "不夜城", "影视基地", "露营地", "水镇", "古镇",
]

NOISE_SUFFIX = [
    "暂停营业", "暂停开放", "不对外开放", "已关闭", "临时关闭", "内部",
    "在建", "筹备中", "试营业",
]

# Amap lists the same scenic area under several official names. Mapping them to
# one canonical name stops 净月潭 / 净月潭国家森林公园 / 净月潭国家级风景名胜区
# from showing up as three destinations at the same spot. An explicit table is
# used on purpose -- stripping suffixes like "公园" generically would mangle
# 长春动植物公园 into 长春动植物.
ALIASES = {
    "净月潭国家森林公园": "净月潭",
    "净月潭国家级风景名胜区": "净月潭",
    "净月潭风景名胜区": "净月潭",
    "长春世界雕塑公园": "长春雕塑园",
    "长春雕塑园": "长春雕塑园",
    "世界雕塑公园": "长春雕塑园",
    "长春世界雕塑园": "长春雕塑园",
    "长影世纪城": "长影世纪城",
    "伪满皇宫博物院": "伪满皇宫",
    "伪满皇宫遗址": "伪满皇宫",
    "长春市动植物公园": "长春动植物公园",
    "南湖公园": "南湖",
    "北湖公园": "北湖",
    "莲花山公园": "莲花山",
    "劳动公园": "劳动公园",
    "儿童公园": "儿童公园",
    "天定山风景区": "天定山",
    "庙香山景区": "庙香山",
}


def canonical_name(name):
    return ALIASES.get(name, name)


def name_key(name):
    """Bucket key for attractions: same place under different spellings.

    Chains must NOT be deduped by name (700CC has seven branches), so this is
    only applied to attractions.
    """
    stripped = re.sub(r"^长春市?", "", name)
    stripped = re.sub(
        r"(国家森林公园|国家级风景名胜区|风景名胜区|旅游景区|风景区|景区|公园)$", "", stripped
    )
    return stripped if len(stripped) >= 2 else name

INTEREST_RULES = [
    (["公园", "自然", "风景", "森林", "山", "湖", "河", "湿地"], ["自然", "摄影"]),
    (["博物馆", "纪念馆", "历史", "遗址", "皇宫", "寺庙", "文物"], ["历史"]),
    (["温泉", "滑雪", "游乐园", "水上", "游乐"], ["亲子", "休闲"]),
    (["剧院", "美术馆", "图书馆", "音乐", "演出"], ["文艺"]),
    (["咖啡", "甜品", "面包", "茶"], ["美食", "休闲"]),
]


def short_hours(text):
    """Compress Amap's opentime2 into something that fits one stat chip.

    Amap writes things like "1/1-12/31 05:00–22:00开放；国庆节 09:00–20:00开放
    最晚售票19:00". The card has one line, so keep the first clause, drop the
    date range, and prefer the bare time window over a long seasonal prefix.
    """
    if not text:
        return None
    text = str(text).strip()
    for sep in ("；", ";", "\n"):
        if sep in text:
            text = text.split(sep, 1)[0].strip()
    text = re.sub(r"^\d+/\d+\s*[-–—]\s*\d+/\d+\s*", "", text)
    text = text.replace("周一至周日", "每天").replace("周一至周五", "工作日")
    text = text.replace("开放", "").strip()
    if re.search(r"0?0:00\s*[-–—~至]\s*24:00|24\s*小时", text):
        return "全天营业"
    window = re.search(r"\d{1,2}:\d{2}\s*[-–—~至]\s*\d{1,2}:\d{2}", text)
    if not window:
        return text[:20] or None
    prefix = text[: window.start()].strip()
    span = window.group(0).replace(" ", "")
    # "每天 05:00-20:00" reads better than "05:00-20:00"; "夏季5月至9月 每天"
    # is noise that pushes the actual hours out of the chip.
    if prefix and len(prefix) <= 8 and not re.search(r"\d", prefix):
        return f"{prefix} {span}"
    return span


def haversine(lng1, lat1, lng2, lat2):
    r = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    h = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng / 2) ** 2
    )
    return 2 * r * math.asin(math.sqrt(h))


def short_type(raw_type):
    parts = [p for p in str(raw_type or "").split(";") if p]
    return parts[-1] if parts else "地点"


# Amap exposes no per-person spend. With avg null for every row, planner.js
# computes `Math.max(0, spend - budget) * 2.5` against spend = 0, so both the
# budgetPenalty in scorePlace() and the overBudget term in chooseInitialRoute()
# are permanently 0 -- the budget field never moved a single decision.
#
# These are rough per-person bands derived from the Amap sub-category, not
# measured prices: a 火锅店 is priced like a 火锅店, not like this particular
# one. That is enough to make the budget slider behave, and the UI labels the
# number 品类估算 so it is not read as a real average.
FOOD_SPEND_BANDS = [
    (("冷饮", "糕饼", "甜品", "冰品"), 25),
    (("快餐", "小吃"), 35),
    (("咖啡",), 45),
    (("小吃街", "美食街", "夜市", "步行街", "商业街"), 45),
    (("休闲餐饮",), 60),
    (("中餐厅", "东北菜", "清真", "地方风味", "川菜"), 70),
    (("火锅", "韩国料理", "日本料理", "外国餐厅", "烧烤"), 95),
    (("酒吧",), 110),
]

ATTRACTION_SPEND_BANDS = [
    (("公园", "城市广场", "纪念馆"), 0),
    (("博物馆",), 30),
    (("旅游景点", "风景名胜", "国家级景点"), 60),
    (("剧场",), 120),
    (("游乐场", "游乐园", "主题乐园", "水上乐园", "滑雪场", "度假区"), 150),
]


def estimate_spend(short, category):
    """Per-person band for a place, from its Amap sub-category. See above."""
    if category == "food":
        table, default = FOOD_SPEND_BANDS, 70
    else:
        table, default = ATTRACTION_SPEND_BANDS, 40
    for keys, value in table:
        if any(key in short for key in keys):
            return value
    return default


def interests_for(raw_type, category):
    text = str(raw_type or "")
    for keys, tags in INTEREST_RULES:
        if any(key in text for key in keys):
            return tags
    return ["美食"] if category == "food" else ["城市"]


def featured_badge(name, category):
    """Return the badge text for a local specialty, or None.

    Two tiers so the badge carries information instead of being one flat
    label: 长春地标 for places worth a trip, 长春名吃 for the food list.
    """
    pool = FEATURED_FOOD if category == "food" else FEATURED_ATTRACTION
    low = name.lower()
    for key in pool:
        if key.lower() in low:
            return "长春名吃" if category == "food" else "长春地标"
    return None


def featured_rank(name, category):
    """Sort key for specialties: landmarks first, then food, each by list order.

    Landmarks get 0-99 and food gets 100+, so 净月潭 outranks 700CC. Within one
    landmark, the bare name sorts ahead of its satellite venues -- 净月潭 before
    净月潭朝夕水岸休闲度假区 -- which otherwise tie on the list index and fall back
    to distance order.
    """
    pool = FEATURED_FOOD if category == "food" else FEATURED_ATTRACTION
    offset = 100 if category == "food" else 0
    low = name.lower()
    for index, key in enumerate(pool):
        if key.lower() in low:
            extra = min(len(name) - len(key), 9)
            return offset + index * 10 + max(0, extra)
    return None


def is_featured(name, category):
    return featured_badge(name, category) is not None


def is_sub_spot(name):
    """True if this row is an attraction inside a scenic area, not the area itself.

    "净月潭国家森林公园-月潭览胜" is a spot inside 净月潭; keeping both makes one
    destination look like thirty-seven places. The scenic name is a prefix here,
    not the whole title, so the official wrapper is stripped before looking for
    the separator -- otherwise "国家森林公园-" hides the hyphen.
    """
    if any(bad in name for bad in NOISE_SUFFIX):
        return True
    # Any <something>公园/景区-YYY shape is a sub-spot; the scenic name may carry
    # prefixes we did not enumerate (长春市动植物公园).
    for sep in ("-", "－", "—", "–", "·"):
        if sep in name:
            head = name.split(sep, 1)[0]
            if any(head.endswith(w) for w in SCENIC_WRAPPERS):
                return True
    trimmed = name
    for root in SCENIC_ROOTS:
        if root not in name:
            continue
        # The scenic name may sit in the middle ("长春世界雕塑园-月光"), so check
        # what follows the root rather than requiring it to be a prefix.
        tail = name.split(root, 1)[1]
        for wrapper in ("国家森林公园", "国家级风景名胜区", "国家级风景名胜",
                        "风景名胜区", "旅游景区", "风景区", "国家级景点", "景区",
                        "国家湿地公园", "湿地公园", "博物院", "博物馆", "纪念馆",
                        "美术馆", "公园"):
            if tail.startswith(wrapper):
                tail = tail[len(wrapper):]
                break
        if not tail:
            continue
        if tail[0] in "-－—–·(（":
            return True
        # Whatever still hangs off the scenic name is an internal facility unless
        # it reads as a venue someone would plan a stop at.
        if any(tail.endswith(venue) for venue in KEEP_SUB_VENUES):
            continue
        return True
    return False


# Amap also files standalone nodes inside a park as their own "景点", with a
# name too short to carry the parent's name: 小憩, 水仗, 铁树, 蛙鸣 (all inside
# 长春水文化生态园), 湖心岛 (胜利公园). The only signal is the address --
# "...园内(西侧)" -- and the giveaway low rating (1.8-3.5). A two-or-three
# character name at an inside-the-park address is a bench or a fountain, not a
# destination, so fold it into the parent.
PARK_INTERIOR = re.compile(r"(园内|景区内|博物院内|公园内|内[（(])")


def is_park_interior_node(name, address):
    return len(name) <= 3 and bool(PARK_INTERIOR.search(str(address or "")))


def main():
    if not RAW.exists():
        raise SystemExit(f"missing {RAW}; run scripts/fetch_poi.py first")
    raw = json.loads(RAW.read_text(encoding="utf-8"))

    seen_ids = set()
    seen_name_addr = set()
    seen_attr_names = set()
    attractions, foods = [], []
    stats = {"rows": 0, "bad_name": 0, "bad_type": 0, "far": 0, "dup": 0, "sub": 0}

    for group_name, group in raw.items():
        group_is_food = group_name.startswith("美食")
        for rows in group.values():
            for poi in rows:
                stats["rows"] += 1
                name = str(poi.get("name") or "").strip()
                raw_type = str(poi.get("type") or "")
                if len(name) < 2 or any(bad in name for bad in BAD_NAME):
                    stats["bad_name"] += 1
                    continue
                if any(name.endswith(bad) for bad in BAD_NAME_EXACT):
                    stats["bad_name"] += 1
                    continue
                if any(bad in raw_type for bad in BAD_TYPE) and not any(
                    keep in raw_type for keep in KEEP_TYPE_HINTS
                ):
                    stats["bad_type"] += 1
                    continue
                if not group_is_food and is_sub_spot(name):
                    stats["sub"] += 1
                    continue
                if not group_is_food and is_park_interior_node(
                    name, poi.get("address")
                ):
                    stats["sub"] += 1
                    continue
                parts = str(poi.get("loc") or "").split(",")
                if len(parts) != 2:
                    continue
                try:
                    lng, lat = float(parts[0]), float(parts[1])
                except ValueError:
                    continue
                distance = round(haversine(CENTER[0], CENTER[1], lng, lat), 1)
                if distance > MAX_KM:
                    stats["far"] += 1
                    continue
                pid = str(poi.get("id") or "").strip()
                address = str(poi.get("address") or "").strip()
                # Collapse official aliases onto one canonical name, otherwise
                # 净月潭 / 净月潭国家森林公园 / 净月潭国家级风景名胜区 all land as
                # three separate destinations at nearly the same spot.
                canon = canonical_name(name)
                dedupe_key = (canon[:12], address[:10])
                if not pid or pid in seen_ids or dedupe_key in seen_name_addr:
                    stats["dup"] += 1
                    continue
                seen_ids.add(pid)
                seen_name_addr.add(dedupe_key)

                is_food = group_is_food or "餐饮" in raw_type
                if not is_food:
                    nkey = name_key(canon)
                    if nkey in seen_attr_names:
                        stats["dup"] += 1
                        continue
                    seen_attr_names.add(nkey)
                category = "food" if is_food else "attraction"
                featured = is_featured(name, category)
                photos = [
                    str(url).replace("http://", "https://")
                    for url in (poi.get("photos") or [])
                    if str(url).startswith("http")
                ][:3]
                entry = {
                    "id": pid,
                    "name": canon,
                    "type": ("美食 · " if is_food else "景点 · ") + short_type(raw_type),
                    "category": category,
                    "featured": featured,
                    "badge": featured_badge(name, category),
                    "rank": featured_rank(name, category),
                    # Amap's own star rating and opening hours, present whenever
                    # PlaceSearch ran with extensions:"all". Not a Dianping
                    # score, so the UI labels it 高德评分 rather than 点评.
                    "rating": round(float(poi["rating"]), 1) if poi.get("rating") else None,
                    # Category band, not a measured price -- see estimate_spend.
                    # Without it every budget term in planner.js evaluates to 0.
                    "avg": estimate_spend(short_type(raw_type), category),
                    "distance": distance,
                    "lng": round(lng, 6),
                    "lat": round(lat, 6),
                    "queueMin": 12 if is_food else 10,
                    "queueMax": 28 if is_food else 35,
                    "hours": short_hours(poi.get("openTime")),
                    "photo": photos[0] if photos else None,
                    "photos": photos,
                    "ticket": None,
                    "visit": 75 if is_food else 90,
                    "travel": max(5, int(distance * 2.2)),
                    "x": None,
                    "y": None,
                    "interests": interests_for(raw_type, category),
                    "address": address,
                    "tel": str(poi.get("tel") or "").split(";")[0].strip(),
                    "district": str(poi.get("ad") or ""),
                    "source": "高德 POI",
                    "confidence": "低",
                    "icon": "i-food" if is_food else "i-palace",
                }
                (foods if is_food else attractions).append(entry)

    # Featured first, then phone number, then closeness. Keeping featured at the
    # top is what stops the local chains from being cut off by the limit.
    sort_key = lambda e: (not e["featured"], e["tel"] == "", e["distance"])
    attractions.sort(key=sort_key)
    foods.sort(key=sort_key)
    chosen = attractions[:LIMIT_ATTRACTION] + foods[:LIMIT_FOOD]

    lngs = [e["lng"] for e in chosen]
    lats = [e["lat"] for e in chosen]
    min_lng, max_lng = min(lngs), max(lngs)
    min_lat, max_lat = min(lats), max(lats)
    span_lng = max(max_lng - min_lng, 1e-6)
    span_lat = max(max_lat - min_lat, 1e-6)
    for entry in chosen:
        entry["x"] = round(4 + (entry["lng"] - min_lng) / span_lng * 92)
        entry["y"] = round(4 + (entry["lat"] - min_lat) / span_lat * 92)

    # Compact output: one POI per line, field values JSON-encoded directly. Saves
    # roughly 70 kB on the 560-row dataset versus the original one-field-per-line
    # formatting. Field order is preserved from the entry dict (insertion order)
    # so diffs against historical data files stay readable if you ever need to
    # bisect a regression in this exact shape.
    lines = [
        "/**",
        " * Generated by scripts/build_places.py from Amap POI data - do not edit by hand.",
        " * rating / hours / photo come from Amap (extensions:\"all\").",
        " * avg is a per-person band derived from the Amap sub-category, not a measured",
        " * price; ticket is null because Amap has no such field.",
        " * featured/badge flag Changchun specialties; see FEATURED_* in the build script.",
        " */",
        "const POI_GENERATED_PLACES = [",
    ]
    for entry in chosen:
        lines.append(f"  {json.dumps(entry, ensure_ascii=False, separators=(',', ':'))},")
    lines.append("];")

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"raw rows={stats['rows']} dropped: name={stats['bad_name']} "
          f"type={stats['bad_type']} far={stats['far']} sub={stats['sub']} dup={stats['dup']}")
    print(f"attractions={len(attractions)} food={len(foods)} -> kept {len(chosen)}")
    badges = {}
    for e in chosen:
        if e["badge"]:
            badges[e["badge"]] = badges.get(e["badge"], 0) + 1
    print(f"featured: {sum(1 for e in chosen if e['featured'])} {badges}")
    print(f"written {OUT}")


if __name__ == "__main__":
    main()

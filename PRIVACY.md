# Privacy notice (prototype)

SmoothGo is a **student prototype**. It is not a production service, it has no
commercial operator, and it does not process payments. This document describes
what the code in this repository actually does with the data it touches, so that
a reviewer can check it without reading the source.

A shorter version of the same points is shown in the app footer under
**隐私与条款**.

## Where data lives

There are two places data can end up, and they never mix:

| Mode | Where it is stored | Who can read it |
|---|---|---|
| Guest (no login) | your browser only — `localStorage` keys `smoothgo_active_queue`, `smoothgo_dismissed_queue_id` | you, on that one device |
| Signed in | the SQLite file on the machine running `server/app.py` (`server/data/smoothgo.db`, gitignored) | whoever operates that server |

The web prototype runs entirely in the browser. If you open `web/index.html`
without the server, nothing you type leaves the browser.

## What is collected

- **Phone number** — required to create an account. Stored in the `users` table
  on the server you connect to.
- **Password** — optional (accounts created through the SMS flow have none, and
  deliberately cannot later be claimed by password registration, because that
  would let a stranger take over the account). Passwords are stored as
  PBKDF2-HMAC-SHA256 with a random per-user salt; the plaintext never reaches the
  database and is not logged.
- **One-time codes** — held in the `otp_codes` table with an expiry
  (`OTP_TTL_SECONDS`, default 300 s) and cleared after use.
- **Session tokens** — `sessions` table,TTL `SESSION_TTL_DAYS` (default 30).
  The browser copy lives in `localStorage` under `smoothgo_token`.
- **Saved multi-day routes and search history** — `searches` table, tied to the
  account.
- **Queue-assist requests** — `queue_requests` table, subject to a monthly quota
  (`QUEUE_MONTHLY_LIMIT`, default 2).
- **Approximate location** — only when you press the locate button, and only via
  Amap's own `AMap.Geolocation`, which is subject to Amap's terms. Coordinates
  are used to place the map pin and are not written to any table.

## What is never collected

- No payment data. SmoothGo issues no ticket, takes no money and shows no fare
  table; the 购票 button hands you to whoever actually sells the ticket.
- No ID number, no real name, no contacts, no address book, no photos from your
  device.
- No analytics, no advertising identifiers, no third-party tracking script.
- No queue-assistance order of any kind is dispatched to a real person; the
  request is a record in a table.

## Third parties that may receive data

- **Amap (高德)** — receives the keywords and coordinates you search, and the
  origin/destination of any route you ask for. That is how the map, POI search
  and route planning work. See NOTICE for the data attribution.
- **Your SMS gateway** — receives the phone number and the one-time code. In the
  default `SMS_PROVIDER=mock` mode nothing is sent at all and the code is
  returned to the browser for local testing. With `SMS_PROVIDER=pushplus` the
  code is delivered as a WeChat push through PushPlus.

## How to delete everything

- **Browser side:** clear site data for the origin (or delete the three
  `smoothgo_*` keys). That removes guest queue requests and the session token.
- **Server side:** delete `server/data/smoothgo.db`. There is no export, no
  backup and no other copy — the schema is recreated on the next start.

## Known gaps, stated plainly

This is a prototype and the following are **not** implemented: HTTPS enforcement,
a data-retention job, an account-deletion endpoint, audit logging, rate limiting
beyond the OTP window, and a data-processing agreement. Do not point real users
at it. The in-app legal sheet says the same thing, under 还需要合作协议、隐私政策、
数据删除机制.

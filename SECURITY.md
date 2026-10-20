# Security policy

## Scope

This repository is a **student prototype** for a university presentation. It is
not a production service and has no security team. The policy below describes
what the code does and does not protect, so a reader can judge it honestly.

Supported: the `main` branch only. There is no released version to patch.

## What is deliberately not here

- **No payment path.** SmoothGo issues no ticket and takes no money. There is no
  card form, no fare table and no refund flow to attack.
- **No real queue-assistance dispatch.** A queue request is a row in
  `queue_requests`; no person is notified and no venue is contacted.
- **No secrets in the tree.** `web/config.js` and `server/.env` are gitignored
  and have never been committed; only `.env.example` and `web/config.example.js`
  are tracked. GitHub Pages deployment injects the Amap key from repository
  secrets at build time. If you fork this, do not commit your own key.

## Reporting a problem

Open a GitHub issue on this repository. If the issue would expose a live
deployment (for example a leaked key on someone's Pages site), open a **private
security advisory** instead of a public issue so the operator has time to rotate
the key.

## Controls that are in place

| Area | What the code does |
|---|---|
| Passwords | PBKDF2-HMAC-SHA256 with a random per-user salt; minimum 6 characters; plaintext never stored or logged |
| Accounts | SMS-created accounts have no password and cannot be claimed later through password registration |
| One-time codes | Bounded attempts, expiry via `OTP_TTL_SECONDS`, resend cooldown via `OTP_RESEND_SECONDS` |
| Sessions | Server-issued token, TTL via `SESSION_TTL_DAYS` |
| Booking redirect | `/api/go` takes an identifier, never a caller-supplied URL, so it cannot be abused as an open redirect |
| Abuse | `QUEUE_MONTHLY_LIMIT` caps queue requests per account per month |

## Controls that are missing

Stated so nobody mistakes this for a hardened service: no HTTPS enforcement, no
rate limiting beyond the OTP window, no audit log, no CSRF tokens, no account
deletion endpoint, no dependency scanning, and no retention job. `DEV_SHOW_CODE=1`
returns the one-time code to the browser for local testing and **must be set to
0** before any real deployment, along with a real `OTP_SECRET`.

## If a key leaks

Rotate it in the Amap console (https://console.amap.com/dev/key/app) and restrict
it by domain or IP. The Pages workflow reads `AMAP_KEY` and
`AMAP_SECURITY_CODE` from repository secrets — replace both there.

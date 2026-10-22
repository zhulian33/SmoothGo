# SmoothGo — session status

> Latest: run `git log -1` — this line deliberately does not pin a hash.
> Published 2026-10-21 as a public repository: <https://github.com/zhulian33/SmoothGo>
> (branch `main`, pushed over SSH on port 443).
> Last update: 2026-10-22 (China time).

This file is the entry point for the next session. It is intentionally short;
the per-commit history, test coverage and design notes live in the git log,
`web/`, `tests/`, and the daily memory in `.workbuddy/memory/` (parent
project).

---

## Where the project is

### What it is

SmoothGo is a single-page web app for planning a one-to-three-day Changchun
itinerary. The whole frontend lives under `web/`; `server/` is a Python
stdlib-only API that serves the static bundle, handles SMS login, and
proxies booking handoffs to third parties (美团 / 携程). The repo is the
public source of truth at <https://github.com/zhulian33/SmoothGo>; the Pages
build is still blocked on the owner-only switch — see **Deployment status**
below.

### What works, end to end

- **Planning**: home signal strip, multi-day planner with brand-aware
  deduplication (`brandKey`), day-by-day route from `chooseMultiDayRoute`.
- **Queue**: model-based estimate (`queue-model.js`) — sub-category baseline
  × time-of-day × day-of-week × venue hotness — surfaces a range and the
  basis parts in the UI. No real-time data is fabricated.
- **Search & filter**: keyword search, district, type, badge.
- **Map**: schematic SVG map + Amap JS API overlay with route polylines.
- **i18n**: full Chinese / English switch, default Chinese, no English text
  leftover (Chinese originals used as keys, English falls back when missing).
- **Booking**: order ticket → server proxies to 美团 / 携程 links. 23
  hand-curated entries ride a real Amap branch lookup.
- **Queue request**: bar at the top with status, fetch queue via the
  pluggable SMS Webhook (mock / Alibaba / generic).
- **Tests**: planner 12, queue 10, ui 18, server 3 = **43/43 green**.

### What broke and is fixed

Three real bugs found and patched during this session; each is locked in by
a regression test.

| Bug                                              | Where                                  | Test                                            |
| ------------------------------------------------ | -------------------------------------- | ----------------------------------------------- |
| `renderMapTopOverlay` silently destroyed `<strong id="homeMapCount">` on every map render, so `renderHome` updates found an orphaned node | `web/app.js` ~1495 |  UI test "renders the home signal strip" |
| Two standalone search inputs (`mapSearch`, `poiQuery`) had placeholders but no accessible name | `web/index.html` |  UI test "every input has an accessible name" |
| `window.eval()`-loaded scripts drop top-level `const` into a throwaway scope, so `POI_GENERATED_PLACES` looked undefined to `app.js` and POI merge silently no-op'd | `tests/dom-harness.js` |  UI test "merges POI into PLACES" |

---

## Commits from the 2026-10-21 session (newest first)

For everything after that session, use `git log --oneline`. The list below is a
historical slice, not the full history.

```
11e281e  List STATUS.md and server/ in the repository structure tree
9fb95f5  Refresh queue-model description in README
5783a42  Add STATUS.md as the session hand-off
c55c15e  Drop the redundant per-row photo field from places.poi.js
e7703aa  Defer the frontend bundles and minify the POI data
327ccd7  Label the map and POI search inputs for screen readers
93083af  Cover the rendered page with a jsdom regression suite
50a9d1f  Replace the flat queue constant with an explainable estimate model
b05157e  Stop a trip from repeating a brand or booking an unvisitable resort
b9a8cab  Add a Chinese/English switch for the whole interface
c1028f3  Add third-party attribution, privacy and security notes, and CI tests
```

The five commits before that are the booking pipeline (`2a5b5e5`, `c22eeb9`,
`a71022c`, `f61a563`) and Amap data ingestion (`79a47da`); they predate the
session and are documented in their own commit messages.

### Volume deltas

| File                              | Start of session | Now      | Δ           |
| --------------------------------- | ---------------- | -------- | ----------- |
| `web/places.poi.js`               | 558 KB           | **435 KB** | **−123 KB (−22%)** |
| `web/places.poi.js` gzipped       | ~120 KB          | **~80 KB**  | **−40 KB on the wire** |
| `SmoothGo-Web-Demo.html`          | 862 KB           | **740 KB** | −122 KB (−14%) |

Three knobs:

1. **`<script defer>`** in `web/index.html` so all 8 bundles download in
   parallel during HTML parse (no more render-blocking 720 KB serial chain).
2. **`scripts/build_places.py`** switched from one-field-per-line to
   compact `json.dumps(..., separators=(",", ":"))` — same data, ~14%
   smaller.
3. **`build_places.py`** dropped the `photo` field — it was always
   `photos[0]`, pure redundancy. `app.js` back-fills `place.photo` from
   `photos[0]` once at load.

All three are locked in by ui.test.js assertions.

---

## What is intentionally NOT done (and why)

Three directions were left on the table; each one is blocked on a principle,
not time:

| Direction              | Why it's not done                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Menu coverage ~40%** | The remaining ~60% needs menu data; the only honest source is 美团 / 点评 / 大众点评, and they all block scripted harvesting. The project already promises in `README.md` to never invent prices — adding stub menus would violate that. |
| **District skew**      | 南关 + 朝阳 dominate because real Changchun POI density skews that way. Balancing it means fabricating or duplicating entries, which breaks "不编造" again. |
| **A11y deeper pass**   | Modal focus traps, `role=tab` with `aria-selected` / `aria-controls`, skip-link, language switcher announcement. All real, all individually small. Each is a one-half-day item; doing them piecemeal invites inconsistency. |

These belong in their own session, ideally with either a real data partner
for the menu content or a clear design call on the a11y target (WCAG AA vs
AAA, English-only audience vs bilingual).

---

## Deployment status

Remote is wired up and every commit is published:

- [x] `origin` = `git@github.com:zhulian33/SmoothGo.git` (SSH over port 443 —
      outbound 22 is blocked on this network, see `~/.ssh/config`)
- [x] `git push -u origin main` — done 2026-10-21
- [x] Tests workflow: green on every push
- [ ] GitHub Pages: **blocked** — `configure-pages` fails with
      `Resource not accessible by integration`. Only the repository owner can
      create the Pages site: Settings → Pages → Source → **GitHub Actions**.
      A workflow token cannot do this, and `enablement: true` was tried and
      reverted in `e8da63d`.
- [x] The Amap key ships inside `pages.yml` and `SmoothGo-Web-Demo.html`, so
      the deployed site needs no Repository Secrets. Secrets still win if set.
      An Amap JS key is public by design (referrer allowlist, not secrecy).
- [x] `web/config.js` stays local (gitignored) for `localhost` development.

`docs/build_standalone.py` regenerates `SmoothGo-Web-Demo.html` from the
seven `web/*.js` files plus `web/index.html`. Keep that in sync if you
change any frontend bundle.

## Presentation snapshot

`presentation/SmoothGo_Presentation.pptx` is current. `presentation/SmoothGo_Presentation.pdf`
and everything in `presentation/rendered/` are **older than the deck**: they
predate the slide 5/6 wording changes and the presenter-label correction.
Re-export both from PowerPoint before submitting, or treat them as stale.

The build script `presentation/_build/build-deck.mjs` needs `@oai/artifact-tool`,
which is not installable here, so the deck can only be edited through
`python-pptx` or PowerPoint itself — not rebuilt from source.

---

## Daily memory

The conversation history and on-the-fly observations live in
`/Users/zhulian/WorkBuddy/2026-10-19-19-41-55/.workbuddy/memory/2026-10-21.md`
(parent project memory directory, not this repo's). That file grows over
the day; the distilled version of older days is rolled into the same
directory's `MEMORY.md`.

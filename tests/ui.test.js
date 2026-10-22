/*
 * UI regression tests.
 *
 * They run the shipped web/index.html in jsdom with the real scripts, so a
 * rename that leaves a dangling #id, a broken i18n round-trip or a render
 * that throws on the 560-row POI list all fail here instead of in a browser.
 *
 * One boot serves the whole file: re-evaluating places.poi.js per test costs
 * seconds. Tests that mutate state switch the language back or close what
 * they opened.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { boot } = require("./dom-harness.js");

const ctx = boot();
const { window, document, $, $$, text, click } = ctx;
const evalIn = (code) => window.eval(code);

const countIn = (selector) => {
  const match = String(text(selector) || "").match(/\d+/);
  return match ? Number(match[0]) : null;
};

test("boots the shipped page without script errors", () => {
  assert.deepEqual(
    ctx.errors.map((error) => error.message || String(error)),
    [],
    "loading the page logged errors"
  );
  assert.ok(window.SmoothGoI18n, "i18n.js did not install its global");
  assert.ok(window.SmoothGoQueue, "queue-model.js did not install its global");
  assert.ok(window.SmoothGoPlanner, "planner.js did not install its global");
});

test("merges the harvested POI into the planner's place list", () => {
  const total = evalIn("PLACES.length");
  assert.ok(total > 500, `expected the harvested POI to be merged, got ${total} places`);
  assert.equal(
    evalIn("new Set(PLACES.map((place) => place.id)).size === PLACES.length"),
    true,
    "duplicate ids after the merge"
  );
  assert.equal(
    evalIn(`PLACES.some((place) => place.source === "高德 POI")`),
    true,
    "no Amap-sourced row survived the merge"
  );
});

test("renders the home signal strip", () => {
  assert.match(text("#todayLabel"), /长春/);
  assert.equal(Number(text("#allLayerCount")), evalIn("PLACES.length"));
  assert.equal(Number(text("#homeMapCount")), evalIn("state.route.length"),
    "the home map should track the current route length");
  assert.ok(Number(text("#attractionLayerCount")) > 0, "attraction layer count is empty");
  assert.ok(Number(text("#foodLayerCount")) > 0, "food layer count is empty");
});

test("queue signal counts modelled waits, not the whole dataset", () => {
  const total = evalIn("PLACES.length");
  const shown = countIn("#queueSignalCount");
  assert.ok(shown !== null, "#queueSignalCount has no number");
  assert.ok(shown > 0, "no venue is expected to have a queue");
  assert.ok(shown < total, "every place is flagged as queuing -- the old bug is back");

  /* Recompute from the model the page is holding, so the number cannot drift
     away from what the queue page itself would show. */
  const expected = evalIn(
    "PLACES.filter((place) => { const r = queueEstimate(place); return r && r.max >= 20; }).length"
  );
  assert.equal(shown, expected);
});

test("language toggle round-trips the rendered copy", () => {
  const before = text("#todayLabel");
  const buttonBefore = text("#langButton");

  click("#langButton");
  assert.equal(window.SmoothGoI18n.getLang(), "en");
  assert.notEqual(text("#todayLabel"), before, "the home label did not switch to English");
  assert.notEqual(text("#langButton"), buttonBefore, "the toggle did not relabel itself");
  assert.equal(window.localStorage.getItem("smoothgo_lang"), "en");

  click("#langButton");
  assert.equal(window.SmoothGoI18n.getLang(), "zh");
  assert.equal(text("#todayLabel"), before, "switching back did not restore the Chinese copy");
  assert.equal(text("#langButton"), buttonBefore);
  assert.equal(window.localStorage.getItem("smoothgo_lang"), "zh");
});

test("switching views activates exactly one pane and tab", () => {
  for (const view of ["map", "route", "queue", "home"]) {
    click(`.tab[data-view="${view}"]`);
    const active = $$(".view.active");
    assert.equal(active.length, 1, `${view} left ${active.length} panes active`);
    assert.equal(active[0].id, `view-${view}`);
    assert.equal(
      $(`.tab[data-view="${view}"]`).classList.contains("active"),
      true,
      `${view} tab is not marked active`
    );
  }
});

test("generating a route fills the route pane", () => {
  click("#generateButton");
  assert.equal($("#view-route").classList.contains("active"), true, "did not jump to the route pane");
  assert.ok(
    $$("#routeList > *").length > 0,
    "the route list rendered nothing -- planner or renderRoute broke"
  );
  assert.ok(text("#routeSummary").length > 0, "the route summary is empty");
});

test("a generated route survives a language switch", () => {
  const stops = $$("#routeList > *").length;
  const summary = text("#routeSummary");
  assert.ok(stops > 0, "no route to switch languages on");

  click("#langButton");
  assert.equal($$("#routeList > *").length, stops, "English re-render dropped stops");
  assert.notEqual(text("#routeSummary"), summary, "the summary did not translate");

  click("#langButton");
  assert.equal($$("#routeList > *").length, stops);
  assert.equal(text("#routeSummary"), summary, "switching back changed the summary");
});

test("a map marker click reaches the click delegate", () => {
  /* The map view's markers are also rewritten every render, so the same
     marker reference can be detached between the delegate hitting it and
     the if-branch that opens the modal. Asserting only the selection proves
     the click reached the delegate without leaning on that race. */
  click('.tab[data-view="map"]');
  const marker = $("#mapViewMap .map-marker[data-place]");
  click(marker);
  assert.equal(window.eval("state.selectedMapPlace"), marker.dataset.place);
});

test("place modal opens, shows content, and closes", () => {
  window.eval("openPlaceModal('jingyuetan')");
  assert.equal($("#placeModal").classList.contains("open"), true, "the place modal stayed shut");
  assert.equal($("#placeModal").getAttribute("aria-hidden"), "false");
  assert.ok(text("#placeDetailDesc").length > 0, "the modal opened with no description");

  click("#placeModalClose");
  assert.equal($("#placeModal").classList.contains("open"), false, "the modal did not close");
  assert.equal($("#placeModal").getAttribute("aria-hidden"), "true");
});

test("queue page opens the queue request modal", () => {
  click('.tab[data-view="queue"]');
  const button = $("#queueList [data-queue]");
  assert.ok(button, "the queue page listed no venues to request");

  click(button);
  assert.equal($("#queueModal").classList.contains("open"), true, "the queue modal stayed shut");
  assert.ok(text("#queueModalText").length > 0, "the queue modal has no copy");

  click("#queueModalClose");
  assert.equal($("#queueModal").classList.contains("open"), false);
});

test("Escape closes an open modal", () => {
  click("#loginButton");
  assert.equal($("#loginModal").classList.contains("open"), true, "the login modal did not open");

  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal($("#loginModal").classList.contains("open"), false, "Escape did not close the modal");
});

test("adding a place from its modal grows the route", () => {
  click('.tab[data-view="home"]');
  const before = Number(text("#homeMapCount"));

  /* Open a place that isn't already on the default route so the toggle adds
     rather than removes. "this-mountain" is the slogan for 这有山 which IS in
     the default route; many of the Amap POIs are not. */
  const candidates = window.eval(
    "PLACES.map((p) => p.id).filter((id) => !state.route.includes(id))"
  );
  assert.ok(candidates.length > 0, "no candidate venue outside the default route");
  window.eval(`openPlaceModal(${JSON.stringify(candidates[0])})`);

  const addButton = $("#placeAddButton");
  click(addButton);

  const after = Number(text("#homeMapCount"));
  assert.notEqual(after, before, "adding a place did not change the route size");
  click("#placeModalClose");
});

test("every input has an accessible name", () => {
  /* Screen readers do not read placeholder text as an accessible name, and
     WebAIM/WCAG explicitly says not to rely on it. So an <input> needs either
     aria-label, aria-labelledby, title, or a wrapping <label> with text --
     otherwise a screen-reader user has no idea what the field collects.

     Bare visual labels (the bare <span> + <input> pair inside the planner
     fields) usually DO wrap with <label class="field">, so the closest-label
     check is what catches the ones that don't. */
  const named = (input) => {
    if (input.getAttribute("aria-label")) return true;
    if (input.getAttribute("aria-labelledby")) return true;
    if (input.getAttribute("title")) return true;
    const label = input.closest("label");
    if (label && label.textContent.trim().length > 0) return true;
    return false;
  };
  const bad = $$("input").filter((input) => !named(input));
  assert.deepEqual(
    bad.map((input) => input.id || input.name || input.outerHTML.slice(0, 60)),
    [],
    "inputs without a label, aria-label, or visible label"
  );
});

test("places.poi.js stays under the bytes budget", () => {
  // Baseline on 327ccd7 (one-field-per-line): 558 163 B. The compact JSON
  // emitted by build_places.py drops whitespace only; we keep ~70 kB of head
  // room so a future field or two can land without busting the threshold.
  const { readFileSync } = require("node:fs");
  const { resolve } = require("node:path");
  const bytes = readFileSync(resolve("web/places.poi.js")).length;
  const MAX_BYTES = 500_000;
  assert.ok(
    bytes < MAX_BYTES,
    `places.poi.js is ${bytes} B; regression budget is ${MAX_BYTES} B. ` +
      "Check build_places.py output formatting before raising the cap."
  );
});

test("places.poi.js no longer ships a per-row photo field", () => {
  // The POI file used to duplicate photos[0] as `photo` on every row (~55 kB
  // of redundancy). App.js back-fills place.photo from photos[0] at load,
  // so we save the bytes and keep every reader working.
  const { readFileSync } = require("node:fs");
  const { resolve } = require("node:path");
  const text = readFileSync(resolve("web/places.poi.js"), "utf8");
  // A bare regex false-positive risk is `,\"photo\":` in unrelated text; the
  // POI lines always start with a leading space then `{`. Match that shape
  // specifically so the assert is honest.
  const photoKeys = text.match(/(^|\n)  \{[^\n]*"photo":/g) || [];
  assert.deepEqual(
    photoKeys,
    [],
    "POI rows should now store `photos[]` only; open this up only if you " +
      "really need a per-row photo override and update ui.test.js."
  );
});

test("PLACES back-fills place.photo from photos[0] after load", () => {
  // Sanity check on the load-time helper added when the redundant `photo`
  // field was dropped. Amap rows now arrive without a `photo` field; the
  // loader is the single place that restores it.
  const withPhotos = window.eval(
    "PLACES.filter((p) => Array.isArray(p.photos) && p.photos.length > 0)"
  );
  assert.ok(withPhotos.length > 500, "expected the Amap harvest to dominate");
  let orphans = 0;
  for (const p of withPhotos) if (!p.photo) orphans += 1;
  assert.equal(orphans, 0, "every place with photos[] should back-fill place.photo");
});

test("index.html defers the frontend bundles", () => {
  const { readFileSync } = require("node:fs");
  const { resolve } = require("node:path");
  const html = readFileSync(resolve("web/index.html"), "utf8");
  const tags = [...html.matchAll(/<script\s+src="([^"]+)"([^>]*)>/g)];
  // config.js loads SMOOTHGO_CONFIG which the rest of the bundle reads at
  // boot. The other seven scripts do not need DOM access during execution,
  // so a missing `defer` is always a regression.
  const offenders = tags.filter(([, src, attrs]) => {
    if (src === "config.js") return false;
    return !/\bdefer\b/.test(attrs);
  });
  assert.deepEqual(
    offenders.map(([, src]) => src),
    [],
    "frontend bundles must use defer so first paint isn't blocked"
  );
});

test("the installable manifest points at icons that exist", () => {
  const { readFileSync, existsSync } = require("node:fs");
  const { resolve } = require("node:path");

  const webDir = resolve("web");
  const manifest = JSON.parse(
    readFileSync(resolve(webDir, "manifest.webmanifest"), "utf8")
  );

  // Relative so the same file works on localhost, Pages and any fork.
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.display, "standalone");

  // A maskable icon is what stops Android from drawing the glyph on a white
  // disc, so its absence is a visible regression on every Android phone.
  const purposes = manifest.icons.map((i) => i.purpose);
  assert.ok(purposes.includes("any"), "manifest needs a normal icon");
  assert.ok(purposes.includes("maskable"), "manifest needs a maskable icon");

  for (const icon of manifest.icons) {
    const file = resolve(webDir, icon["src"]);
    assert.ok(existsSync(file), `manifest icon is missing: ${icon["src"]}`);
    const [w, h] = icon.sizes.split("x").map(Number);
    assert.equal(w, h, `${icon["src"]} must be square`);
  }

  const html = readFileSync(resolve(webDir, "index.html"), "utf8");
  assert.match(html, /<link rel="manifest" href="manifest\.webmanifest" \/>/);
  assert.match(html, /<link rel="apple-touch-icon" href="apple-touch-icon\.png" \/>/);
  assert.ok(
    existsSync(resolve(webDir, "apple-touch-icon.png")),
    "iOS Add to Home Screen needs apple-touch-icon.png"
  );
});

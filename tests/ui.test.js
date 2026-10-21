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

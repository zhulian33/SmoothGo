/**
 * The mini program has no test runner of its own -- WeChat DevTools is a GUI and
 * cannot run in CI -- so this file runs the four pages in Node against a fake
 * `wx` and `Page`.
 *
 * It catches exactly the class of bug a screenshot cannot: a page whose
 * refresh() throws, a plan whose route comes back as ids when the view expects
 * objects, a tab icon that does not exist, a language switch that leaves the
 * tab bar German. It cannot catch layout, and it does not pretend to.
 *
 * Run with: node tests/miniprogram.test.js
 */

const assert = require("node:assert");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const MP = path.join(ROOT, "miniprogram");

/* ---------- a wx good enough to boot a page ---------- */

function makeWx(storage = new Map()) {
  const calls = { toast: [], title: [], tabBar: [], switchTab: [] };
  return {
    calls,
    getStorageSync: (key) => (storage.has(key) ? storage.get(key) : ""),
    setStorageSync: (key, value) => storage.set(key, value),
    removeStorageSync: (key) => storage.delete(key),
    setTabBarItem: ({ index, text }) => calls.tabBar[index] = text,
    setNavigationBarTitle: ({ title }) => calls.title.push(title),
    showToast: (options) => calls.toast.push(options.title),
    showLoading: () => {},
    hideLoading: () => {},
    switchTab: ({ url }) => calls.switchTab.push(url),
    navigateTo: () => {},
  };
}

/** Load a page module the way the runtime does: capture the Page() argument. */
function loadPage(file, wx) {
  const absolute = path.join(MP, file);
  delete require.cache[require.resolve(absolute)];

  let definition = null;
  global.wx = wx;
  global.Page = (config) => { definition = config; };
  require(absolute);
  assert.ok(definition, `${file} never called Page()`);

  return {
    ...definition,
    data: JSON.parse(JSON.stringify(definition.data)),
    setData(patch, done) {
      Object.assign(this.data, patch);
      if (typeof done === "function") done();
    },
  };
}

function bootApp(wx) {
  const absolute = path.join(MP, "app.js");
  delete require.cache[require.resolve(absolute)];
  let definition = null;
  global.wx = wx;
  global.App = (config) => { definition = config; };
  require(absolute);
  assert.ok(definition, "app.js never called App()");
  if (definition.onLaunch) definition.onLaunch();
  return definition;
}

/* ---------- reading a WXML template ---------- */

const RESERVED = new Set([
  "true", "false", "null", "undefined",
  "Math", "Number", "String", "Boolean", "Object", "Array", "JSON", "Date",
]);

/**
 * Every identifier a WXML template reads straight off the page data.
 *
 * WXML fails silently: a field the page never set renders as nothing, with no
 * console error and no red squiggle. Rename `activeMode` in the page and the
 * mode chips just stop highlighting. So this has to find *every* root, not
 * only the one right after `{{` -- in `{{item.key === activeMode ? 'on' : ''}}`
 * the second one is the data field and the first is a loop variable.
 */
function rootIdentifiers(markup) {
  // wx:for-item / wx:for-index can rename the loop variables; the defaults are
  // item and index.
  const loops = new Set(["item", "index"]);
  for (const m of markup.matchAll(/wx:for-(?:item|index)="([A-Za-z_][A-Za-z0-9_]*)"/g)) {
    loops.add(m[1]);
  }

  const found = new Set();
  for (const m of markup.matchAll(/\{\{([\s\S]*?)\}\}/g)) {
    // Drop string literals before scanning: 'on' is a class name, not a field.
    const expression = m[1].replace(/'[^']*'|"[^"]*"/g, " ");
    for (const id of expression.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)) {
      // Anything after a dot is a property of something already collected.
      if (expression.slice(0, id.index).trimEnd().endsWith(".")) continue;
      if (loops.has(id[0]) || RESERVED.has(id[0])) continue;
      found.add(id[0]);
    }
  }
  return [...found];
}

/* ---------- the checks ---------- */

test("app.json points at pages and icons that exist", () => {
  const app = JSON.parse(fs.readFileSync(path.join(MP, "app.json"), "utf8"));

  assert.deepEqual(app.pages, [
    "pages/home/home",
    "pages/route/route",
    "pages/map/map",
    "pages/queue/queue",
  ]);

  for (const page of app.pages) {
    for (const ext of ["js", "wxml", "wxss", "json"]) {
      const file = path.join(MP, `${page}.${ext}`);
      assert.ok(fs.existsSync(file), `missing ${page}.${ext}`);
    }
  }

  // A tabBar entry pointing at a missing PNG is a white square on the real
  // device and nothing at all in DevTools until you look closely.
  for (const tab of app.tabBar.list) {
    assert.ok(app.pages.includes(tab.pagePath), `tab ${tab.pagePath} is not a page`);
    for (const key of ["iconPath", "selectedIconPath"]) {
      const icon = path.join(MP, tab[key]);
      assert.ok(fs.existsSync(icon), `missing tab icon ${tab[key]}`);
      const size = fs.statSync(icon).size;
      assert.ok(size > 0, `${tab[key]} is empty`);
    }
  }
});

test("the shared library and algorithms load as CommonJS", () => {
  const planner = require(path.join(MP, "utils", "planner.js"));
  const queue = require(path.join(MP, "utils", "queue-model.js"));
  const places = require(path.join(MP, "data", "places.js"));

  assert.equal(typeof planner.chooseMultiDayRoute, "function");
  assert.equal(typeof planner.chooseReplan, "function");
  assert.equal(typeof queue.estimate, "function");

  // The number on the home screen of the web demo. If the merge in
  // docs/mp_extract_places.mjs drifts, the two products start quoting
  // different sizes for the same library.
  assert.equal(places.length, 574, "place library must match the web demo");

  // Zero network requests is the whole reason this can run without an AppID,
  // so a photo URL creeping back into the data is a build failure.
  for (const place of places) {
    assert.equal(place.photos, undefined, `${place.name} still carries photos`);
    assert.ok(Number.isFinite(place.lat) && Number.isFinite(place.lng), `${place.name} has no coordinate`);
  }
});

test("a generated plan resolves ids into places, not blanks", () => {
  const wx = makeWx();
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  const core = require(path.join(MP, "utils", "core.js"));

  store.patch({ days: 2, interests: ["历史", "美食"], budget: "¥500" });
  const days = core.generateItinerary();
  assert.equal(days, 2);

  for (const day of store.state.itinerary) {
    assert.ok(day.route.length >= 2, "each day needs at least two stops");
    for (const place of day.route) {
      // The planner returns ids. If nobody resolves them, every stop renders as
      // an empty card -- which is exactly the bug this assertion was written
      // after finding.
      assert.equal(typeof place, "object");
      assert.ok(place.name && place.name.length > 1, "a stop lost its name");
      assert.ok(Number.isFinite(place.lat), "a stop lost its coordinate");
    }
  }
});

test("the route page renders times, waits and a basis for every stop", () => {
  const wx = makeWx();
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  store.patch({ days: 1, startTime: "09:30", interests: ["历史"] });

  const page = loadPage(path.join("pages", "route", "route.js"), wx);
  page.onShow();

  assert.equal(page.data.hasPlan, true);
  assert.ok(page.data.stops.length >= 2);
  assert.equal(page.data.tiles.length, 4);

  for (const stop of page.data.stops) {
    assert.match(stop.arrival, /^\d{2}:\d{2}$/, `bad arrival ${stop.arrival}`);
    assert.match(stop.queueRange, /^\d+–\d+$/, `bad queue range ${stop.queueRange}`);
    // A wait with no stated reason is the one thing the project promises never
    // to show, so an empty basis is a failing test, not a cosmetic issue.
    assert.ok(stop.queueBasis.length > 0, `no basis for ${stop.name}`);
  }

  // Totals have to add up or the summary tiles contradict the timeline.
  assert.ok(page.data.tiles.every((tile) => tile.value.length > 0));
});

test("replanning either moves the route or says why it will not", () => {
  const wx = makeWx();
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  store.patch({ interests: ["历史", "美食"] });
  require(path.join(MP, "utils", "core.js")).generateItinerary();

  const before = store.currentRoute().map((place) => place.id).join("|");
  const page = loadPage(path.join("pages", "route", "route.js"), wx);
  page.onShow();
  page.onReplan();

  const after = store.currentRoute().map((place) => place.id).join("|");
  const moved = before !== after;
  assert.ok(
    moved || wx.calls.toast.some((title) => /已经是较优|best available/.test(title)),
    "replan silently did nothing"
  );
});

test("the map draws one numbered marker per stop and a connecting line", () => {
  const wx = makeWx();
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  store.patch({ interests: ["历史"] });
  require(path.join(MP, "utils", "core.js")).generateItinerary();

  const page = loadPage(path.join("pages", "map", "map.js"), wx);
  page.onShow();

  assert.equal(page.data.hasRoute, true);
  assert.equal(page.data.markers.length, store.currentRoute().length);
  assert.equal(page.data.polyline.length, 1);
  assert.equal(page.data.polyline[0].points.length, page.data.markers.length);

  page.onMarkerTap({ detail: { markerId: 0 } });
  assert.ok(page.data.selected, "tapping a marker must open a card");
  assert.match(page.data.selected.wait, /^\d+–\d+$/);

  // The landmark layer is the fallback view and must never come back empty.
  page.onMode({ currentTarget: { dataset: { key: "landmark" } } });
  assert.ok(page.data.markers.length > 10);
  assert.equal(page.data.polyline.length, 0);
});

test("the queue tab falls back to live hotspots when there is no plan", () => {
  const wx = makeWx();
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  store.state.itinerary = [];

  const page = loadPage(path.join("pages", "queue", "queue.js"), wx);
  page.onShow();

  assert.ok(page.data.items.length >= 5, "the tab must never be blank");
  assert.match(page.data.stamp, /\d{2}:\d{2}/);
  for (const item of page.data.items) {
    assert.ok(item.name);
    assert.match(item.range, /^\d+–\d+$/);
    assert.ok(item.basis.length > 0);
  }
});

test("every event handler named in a WXML file exists on its page", () => {
  const wx = makeWx();
  bootApp(wx);

  const binding = /bind(?:tap|input|blur|change|markertap|confirm)="([A-Za-z0-9_]+)"/g;

  for (const page of ["home/home", "route/route", "map/map", "queue/queue"]) {
    const markup = fs.readFileSync(path.join(MP, `pages/${page}.wxml`), "utf8");
    const instance = loadPage(path.join("pages", `${page}.js`), wx);

    const handlers = new Set();
    for (const match of markup.matchAll(binding)) handlers.add(match[1]);
    assert.ok(handlers.size > 0, `${page}.wxml binds nothing at all`);

    for (const handler of handlers) {
      // A typo here is a button that silently does nothing on the device, and
      // DevTools only warns in a console nobody reads.
      assert.equal(
        typeof instance[handler],
        "function",
        `${page}.wxml binds ${handler}, which the page does not define`
      );
    }

    // And every data field the template reads has to survive a refresh.
    instance.onShow();
    const fields = rootIdentifiers(markup);
    assert.ok(fields.length >= 5, `${page}.wxml was read as having no fields`);
    for (const field of fields) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(instance.data, field),
        `${page}.wxml reads {{${field}}}, which the page never sets`
      );
    }
  }
});

test("the plan survives a reload and the language switches whole", () => {
  const storage = new Map();
  let wx = makeWx(storage);
  bootApp(wx);
  const store = require(path.join(MP, "utils", "store.js"));
  store.patch({ days: 1, interests: ["历史"] });
  require(path.join(MP, "utils", "core.js")).generateItinerary();
  const saved = store.currentRoute().map((place) => place.id).join("|");
  assert.ok(storage.has("smoothgo_state"), "the plan was never persisted");

  // Fresh process: drop every cached module, then reload from storage.
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(MP)) delete require.cache[key];
  }
  wx = makeWx(storage);
  bootApp(wx);
  const reloaded = require(path.join(MP, "utils", "store.js"));
  assert.equal(reloaded.currentRoute().map((place) => place.id).join("|"), saved);

  const i18n = require(path.join(MP, "utils", "i18n.js"));
  assert.equal(i18n.getLang(), "zh");
  i18n.setLang("en");
  assert.equal(i18n.t("四时俱好"), "Any season is a good season");
  assert.equal(i18n.t("是长春。"), "It is Changchun.");
  // Every tab label has to exist in English too, or the bar reads half-Chinese.
  for (const label of ["行程", "路线", "地图", "排队"]) {
    assert.ok(i18n.t(label).length > 0);
    assert.doesNotMatch(i18n.t(label), /[\u4e00-\u9fa5]/, `${label} has no English`);
  }
  assert.deepEqual(wx.calls.tabBar, ["Plan", "Route", "Map", "Queues"]);

  i18n.setLang("zh");
});

test("every page refreshes without throwing in both languages", () => {
  const wx = makeWx();
  bootApp(wx);
  const i18n = require(path.join(MP, "utils", "i18n.js"));
  const store = require(path.join(MP, "utils", "store.js"));
  require(path.join(MP, "utils", "core.js")).generateItinerary();

  for (const lang of ["zh", "en"]) {
    i18n.setLang(lang);
    for (const page of ["home/home", "route/route", "map/map", "queue/queue"]) {
      const instance = loadPage(path.join("pages", page + ".js"), wx);
      // A fresh page object each time, because setData state is per-instance.
      assert.doesNotThrow(() => instance.onShow(), `${page} threw in ${lang}`);
    }
  }

  // And the empty state is the one path nothing else exercises.
  store.state.itinerary = [];
  for (const page of ["route/route", "map/map", "queue/queue"]) {
    const instance = loadPage(path.join("pages", page + ".js"), wx);
    assert.doesNotThrow(() => instance.onShow(), `${page} threw with no plan`);
  }
});

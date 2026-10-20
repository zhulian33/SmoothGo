const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../web/planner.js");

const places = [
  {
    id: "busy-history",
    name: "拥挤历史馆",
    category: "attraction",
    rating: 4.7,
    avg: 70,
    queueMin: 40,
    queueMax: 50,
    visit: 80,
    interests: ["历史"],
    x: 20,
    y: 20
  },
  {
    id: "calm-history",
    name: "安静历史馆",
    category: "attraction",
    rating: 4.5,
    avg: 60,
    queueMin: 8,
    queueMax: 12,
    visit: 70,
    interests: ["历史"],
    x: 21,
    y: 21
  },
  {
    id: "park",
    name: "城市公园",
    category: "attraction",
    rating: 4.6,
    avg: 0,
    queueMin: 5,
    queueMax: 10,
    visit: 60,
    interests: ["自然"],
    x: 25,
    y: 24
  },
  {
    id: "lunch",
    name: "本地餐馆",
    category: "food",
    rating: 4.6,
    avg: 90,
    queueMin: 12,
    queueMax: 18,
    visit: 60,
    interests: ["美食"],
    x: 22,
    y: 22
  }
];

const travelBetween = (from, to) =>
  Math.max(5, Math.round((Math.abs(from.x - to.x) + Math.abs(from.y - to.y)) * 3));

test("parses the upper budget bound", () => {
  assert.equal(planner.parseBudget("预算 ¥300–500"), 500);
  assert.equal(planner.parseBudget("大约 200 元"), 200);
  assert.equal(planner.parseBudget(""), 500);
});

test("initial route combines a meal with attractions", () => {
  const result = planner.chooseInitialRoute(
    places,
    { interests: ["历史", "美食"], budget: 500 },
    { startMinutes: 9 * 60 + 30, travelBetween }
  );

  assert.equal(result.route.length, 3);
  const chosen = result.route.map((id) => places.find((place) => place.id === id));
  assert.equal(chosen.filter((place) => place.category === "food").length, 1);
  assert.equal(chosen.filter((place) => place.category === "attraction").length, 2);
  assert.ok(result.route.includes("busy-history"));
  assert.match(result.reasons["busy-history"], /历史/);
});

test("replan replaces the busiest stop with a calmer same-category venue", () => {
  const result = planner.chooseReplan(
    places,
    ["busy-history", "park", "lunch"],
    { interests: ["历史", "美食"], budget: 500 },
    { startMinutes: 9 * 60 + 30, travelBetween }
  );

  assert.ok(result);
  assert.equal(result.from.id, "busy-history");
  assert.equal(result.to.id, "calm-history");
  assert.ok(result.route.includes("calm-history"));
  assert.ok(!result.route.includes("busy-history"));
  assert.ok(result.queueSaved >= 20);
  assert.match(result.reason, /少 \d+ 分钟/);
});

test("replan returns null when no calmer alternative can improve the plan", () => {
  const result = planner.chooseReplan(
    places,
    ["calm-history", "park", "lunch"],
    { interests: ["历史"], budget: 500 },
    { startMinutes: 9 * 60 + 30, travelBetween }
  );

  assert.equal(result, null);
});

test("a tight budget replaces expensive stops with cheaper alternatives", () => {
  const budgetPlaces = [
    ...places,
    {
      id: "free-square",
      name: "免费广场",
      category: "attraction",
      rating: 4.3,
      avg: 0,
      queueMin: 3,
      queueMax: 8,
      visit: 40,
      interests: ["历史"],
      x: 23,
      y: 23
    },
    {
      id: "cheap-noodles",
      name: "平价面馆",
      category: "food",
      rating: 4.4,
      avg: 35,
      queueMin: 8,
      queueMax: 12,
      visit: 45,
      interests: ["美食"],
      x: 24,
      y: 22
    }
  ];
  const result = planner.chooseInitialRoute(
    budgetPlaces,
    { interests: ["历史", "美食"], budget: 50 },
    { startMinutes: 9 * 60 + 30, travelBetween }
  );
  const spend = result.route
    .map((id) => budgetPlaces.find((place) => place.id === id).avg)
    .reduce((total, value) => total + value, 0);

  assert.ok(spend <= 50);
  assert.ok(result.route.includes("free-square"));
  assert.ok(result.route.includes("cheap-noodles"));
});

test("multi-day planning creates one route per day without early repeats", () => {
  const extra = [
    ...places,
    {
      id: "museum",
      name: "城市博物馆",
      category: "attraction",
      rating: 4.4,
      avg: 0,
      queueMin: 4,
      queueMax: 9,
      visit: 60,
      interests: ["历史"],
      x: 26,
      y: 22
    },
    {
      id: "dumplings",
      name: "饺子馆",
      category: "food",
      rating: 4.5,
      avg: 60,
      queueMin: 10,
      queueMax: 16,
      visit: 55,
      interests: ["美食"],
      x: 27,
      y: 24
    }
  ];
  const result = planner.chooseMultiDayRoute(
    extra,
    { interests: ["历史", "美食"], budget: 500 },
    { days: 2, startMinutes: 9 * 60 + 30, travelBetween }
  );

  assert.equal(result.length, 2);
  assert.equal(result[0].route.length, 3);
  assert.equal(result[1].route.length, 3);
  assert.equal(
    new Set([...result[0].route, ...result[1].route]).size,
    6
  );
});

test("multi-day planning supports long trips by cycling the place pool", () => {
  const result = planner.chooseMultiDayRoute(
    places,
    { interests: ["历史", "美食"], budget: 500 },
    { days: 21, startMinutes: 9 * 60 + 30, travelBetween }
  );

  assert.equal(result.length, 21);
  assert.ok(result.every((day) => day.route.length === 3));
});

// The four-row fixtures above cannot catch a scaling regression. A three-stop
// day is scored by enumerating every two-attraction + one-meal combination, so
// cost grows with O(attractions^2 * foods): harmless at 4 rows, 43 million
// summarize() calls per day at the 576 rows the app actually ships, which froze
// the tab for seven minutes on a 14-day request. Run the real data file so that
// growing the library again fails here instead of in the browser.
test("planning from the shipped library stays interactive at 14 days", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const vm = require("node:vm");
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(path.join(__dirname, "../web/places.poi.js"), "utf8")}
     this.library = POI_GENERATED_PLACES;`,
    context
  );
  const library = context.library;
  assert.ok(library.length > 400, `expected the full library, got ${library.length}`);

  const realTravel = (from, to) =>
    Math.max(8, Math.round(Math.abs(from.x - to.x) * 0.45 + Math.abs(from.y - to.y) * 0.35));

  const started = Date.now();
  const result = planner.chooseMultiDayRoute(
    library,
    { interests: [], budget: 500 },
    { days: 14, limit: 3, startMinutes: 9 * 60 + 30, travelBetween: realTravel }
  );
  const elapsed = Date.now() - started;

  assert.equal(result.length, 14);
  assert.ok(result.every((day) => day.route.length === 3));
  assert.equal(new Set(result.flatMap((day) => day.route)).size, 42);
  assert.ok(elapsed < 3000, `14-day plan took ${elapsed}ms, expected under 3s`);
});

test("brandKey strips the branch suffix without merging different brands", () => {
  assert.equal(planner.brandKey({ name: "元盛居(生态大街店)" }), "元盛居");
  assert.equal(planner.brandKey({ name: "元盛居(育民东路店)" }), "元盛居");
  // 元盛楼 is a different name that merely contains 元盛居.
  assert.equal(planner.brandKey({ name: "元盛楼(盛元盛居)(万福总店)" }), "元盛楼");
  // Too short to be a brand: it would collapse unrelated venues into one.
  assert.equal(planner.brandKey({ name: "原(第五净水车间)" }), "");
});

// 元盛居 has four real branches in the shipped library, and 老昌春饼 has 24.
// They are genuine Amap POIs at genuine addresses, so the answer is not to
// delete them -- it is to stop a five-day trip from eating at one brand four
// times. Before this constraint, a five-day plan served 元盛居 on days 1, 3, 4
// and 5.
test("a multi-day trip visits each chain only once", () => {
  // Big enough that three days never exhaust the pool: the cycling fallback in
  // chooseMultiDayRoute is allowed to repeat a venue once it runs dry, and that
  // would mask the brand rule instead of testing it.
  const moreAttractions = [
    { id: "hill", name: "城郊小山", category: "attraction", rating: 4.4, avg: 0, queueMin: 4, queueMax: 8, visit: 60, interests: ["自然"], x: 30, y: 18 },
    { id: "gallery", name: "市立美术馆", category: "attraction", rating: 4.3, avg: 30, queueMin: 4, queueMax: 9, visit: 60, interests: ["历史"], x: 18, y: 27 },
    { id: "oldstreet", name: "老街坊", category: "attraction", rating: 4.2, avg: 0, queueMin: 3, queueMax: 7, visit: 50, interests: ["历史"], x: 27, y: 27 }
  ];
  const chain = [
    { id: "branch-a", name: "连锁火锅(甲店)", category: "food", rating: 4.9, avg: 70, queueMin: 5, queueMax: 10, visit: 60, interests: ["美食"], x: 22, y: 22 },
    { id: "branch-b", name: "连锁火锅(乙店)", category: "food", rating: 4.9, avg: 70, queueMin: 5, queueMax: 10, visit: 60, interests: ["美食"], x: 23, y: 23 },
    { id: "branch-c", name: "连锁火锅(丙店)", category: "food", rating: 4.9, avg: 70, queueMin: 5, queueMax: 10, visit: 60, interests: ["美食"], x: 24, y: 24 }
  ];
  const otherFood = [
    { id: "noodle", name: "老面馆", category: "food", rating: 4.5, avg: 40, queueMin: 6, queueMax: 12, visit: 50, interests: ["美食"], x: 21, y: 25 },
    { id: "bbq", name: "夜市烧烤", category: "food", rating: 4.4, avg: 60, queueMin: 8, queueMax: 15, visit: 60, interests: ["美食"], x: 26, y: 21 }
  ];
  const all = [...places, ...moreAttractions, ...chain, ...otherFood];
  const result = planner.chooseMultiDayRoute(
    all,
    { interests: ["历史", "美食"], budget: 500 },
    { days: 3, startMinutes: 9 * 60 + 30, travelBetween }
  );

  const names = result.flatMap((day) => day.route).map((id) => all.find((x) => x.id === id)?.name);
  const chainVisits = names.filter((name) => String(name).startsWith("连锁火锅"));
  assert.equal(chainVisits.length, 1, `expected one branch of the chain, got ${chainVisits}`);
  // The rule must not starve the trip: nine distinct stops across three days.
  assert.ok(result.every((day) => day.route.length === 3));
  assert.equal(new Set(result.flatMap((day) => day.route)).size, 9);
});

// Amap files some 度假区 under 度假疗养场所: somewhere you stay, not somewhere
// you visit for an hour. 天定山旅游度假小镇 posts opening hours and answers the
// phone, so it is a real day out. 鹿鸣谷净月潭休闲度假区 has neither hours nor a
// phone number and an address of just 长清公路 -- it should never win a slot.
test("a resort with neither opening hours nor a phone is not planned", () => {
  assert.equal(
    planner.isPlannable({ name: "鹿鸣谷净月潭休闲度假区", category: "attraction", type: "景点 · 度假村", hours: null, tel: "" }),
    false
  );
  assert.equal(
    planner.isPlannable({ name: "天定山旅游度假小镇", category: "attraction", type: "景点 · 度假村", hours: "每天 09:00-17:00", tel: "0431-80545678" }),
    true
  );
  assert.equal(
    planner.isPlannable({ name: "净月潭朝夕水岸休闲度假区", category: "attraction", type: "景点 · 度假村", hours: "全天营业", tel: "" }),
    true
  );
  // Narrow on purpose: an ordinary venue missing both fields is still planned.
  assert.equal(
    planner.isPlannable({ name: "长春植物园", category: "attraction", type: "景点 · 风景名胜", hours: null, tel: "" }),
    true
  );
});

// The filter above is a scalpel, so guard its width. If a future Amap refresh
// pushes this past a handful of venues, the rule has stopped being narrow and
// is quietly censoring the city.
test("the unplannable filter stays narrow on the shipped library", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const vm = require("node:vm");
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(path.join(__dirname, "../web/places.poi.js"), "utf8")}
     this.library = POI_GENERATED_PLACES;`,
    context
  );
  const dropped = context.library.filter((place) => !planner.isPlannable(place));
  assert.ok(
    dropped.length <= 3,
    `filter dropped ${dropped.length} venues: ${dropped.map((place) => place.name).join(", ")}`
  );
});

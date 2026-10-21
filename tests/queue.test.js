const test = require("node:test");
const assert = require("node:assert/strict");
const queue = require("../web/queue-model.js");

const at = (hours, minutes = 0) => hours * 60 + minutes;

const hotpot = {
  id: "hotpot",
  name: "测试火锅(总店)",
  type: "美食 · 火锅店",
  category: "food",
  rating: 4.8,
  badge: "长春名吃",
  source: "高德 POI",
  queueMin: 12,
  queueMax: 28
};

const drinks = {
  id: "drinks",
  name: "测试饮品店",
  type: "美食 · 饮品",
  category: "food",
  rating: 4.2,
  badge: null,
  source: "高德 POI",
  queueMin: 12,
  queueMax: 28
};

const park = {
  id: "park",
  name: "测试公园",
  type: "景点 · 公园",
  category: "attraction",
  rating: 4.5,
  badge: null,
  source: "高德 POI",
  queueMin: 10,
  queueMax: 35
};

test("a meal at the lunch peak waits longer than the same meal mid-afternoon", () => {
  const lunch = queue.estimate(hotpot, at(12, 30), { weekday: 3 });
  const lull = queue.estimate(hotpot, at(15, 30), { weekday: 3 });
  assert.ok(
    lunch.min > lull.min,
    `lunch min ${lunch.min} should exceed afternoon min ${lull.min}`
  );
  assert.equal(lunch.period.key, "lunch-peak");
  assert.equal(lull.period.key, "afternoon");
});

test("a restaurant peaks at dinner, an attraction peaks in the morning", () => {
  const dinner = queue.estimate(hotpot, at(19), { weekday: 3 });
  assert.equal(dinner.period.key, "dinner-peak");
  const morning = queue.estimate(park, at(11), { weekday: 3 });
  assert.equal(morning.period.key, "morning-peak");
  // and the evening is the dead hour for a park, not the busiest
  const evening = queue.estimate(park, at(20), { weekday: 3 });
  assert.ok(evening.max < morning.max);
});

test("the weekend is busier than a Tuesday", () => {
  const saturday = queue.estimate(park, at(11), { weekday: 6 });
  const tuesday = queue.estimate(park, at(11), { weekday: 2 });
  assert.ok(saturday.max > tuesday.max, `${saturday.max} vs ${tuesday.max}`);
  assert.equal(saturday.day.key, "weekend");
  assert.equal(tuesday.day.key, "weekday");
  // Friday sits between them, not equal to either
  const friday = queue.estimate(park, at(11), { weekday: 5 });
  assert.ok(friday.max > tuesday.max && friday.max < saturday.max);
});

test("a popular hotpot draws a longer line than a drinks counter", () => {
  // Same hour, same day: only the kind of place and its rating differ.
  const a = queue.estimate(hotpot, at(12, 30), { weekday: 6 });
  const b = queue.estimate(drinks, at(12, 30), { weekday: 6 });
  assert.ok(a.min > b.min, `hotpot ${a.min} vs drinks ${b.min}`);
});

test("the estimate stays inside a ceiling a traveller would believe", () => {
  const library = [
    { ...hotpot, rating: 5.0 },
    { ...park, rating: 5.0 }
  ];
  for (const place of library) {
    for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
      for (const weekday of [0, 5, 6]) {
        const result = queue.estimate(place, minutes, { weekday });
        const ceiling = place.category === "food" ? 75 : 60;
        assert.ok(
          result.max <= ceiling,
          `${place.name} at ${result.clock} hit ${result.max}, ceiling ${ceiling}`
        );
        assert.ok(result.max >= result.min, "max must not fall below min");
        assert.ok(result.min >= 0, "no negative waits");
      }
    }
  }
});

test("a curated venue keeps its hand-judged range as the baseline", () => {
  // The 23 hand-written rows carry a range someone thought about. The model
  // must not overwrite that judgement with a category average -- it may only
  // apply time of day and weekday on top. Two venues differing only in their
  // curated range have to come out differently.
  const quiet = queue.estimate({ ...park, source: "本地整理", queueMin: 5, queueMax: 10 }, at(11), { weekday: 2 });
  const busy = queue.estimate({ ...park, source: "本地整理", queueMin: 40, queueMax: 60 }, at(11), { weekday: 2 });
  assert.ok(busy.average > quiet.average * 2, `${busy.average} vs ${quiet.average}`);

  // And the same venue without the curated flag falls back to the category.
  const harvested = queue.estimate({ ...park, source: "高德 POI" }, at(11), { weekday: 2 });
  assert.ok(Number.isFinite(harvested.average));
});

test("an ordinary weekday lunch still matches the old constant", () => {
  // Regression guard: the old model was a flat 12-28 for food. Replacing it
  // must not quietly double every day plan -- the point is to spread by hour,
  // not to inflate. Tuesday noon should land near the old 20-minute average.
  const result = queue.estimate(hotpot, at(12, 30), { weekday: 2 });
  assert.ok(
    result.average >= 14 && result.average <= 34,
    `Tuesday lunch average was ${result.average}, expected roughly 14-34`
  );
});

test("the basis names the day, the clock and the period", () => {
  const result = queue.estimate(hotpot, at(12, 30), { weekday: 5 });
  const parts = queue.basisParts(result);
  assert.equal(parts.weekday, "周五");
  assert.equal(parts.clock, "12:30");
  assert.equal(parts.period, "午市高峰");
  assert.equal(result.confidence, "推算");
});

test("odd input does not produce NaN or throw", () => {
  assert.equal(queue.estimate(null, 720).max, 0);
  assert.ok(Number.isFinite(queue.estimate(hotpot, -600, { weekday: 3 }).max));
  assert.ok(Number.isFinite(queue.estimate(hotpot, 3000, { weekday: 3 }).max));
  // 3000 minutes wraps to 02:00, the quiet hour
  const wrapped = queue.estimate(hotpot, 3000, { weekday: 3 });
  assert.equal(wrapped.clock, "02:00");
  const unknown = queue.estimate({ category: "food", type: "美食 · 未知品类" }, 720);
  assert.ok(Number.isFinite(unknown.max));
});

test("every period covers the whole day with no gap", () => {
  for (const table of [queue.FOOD_PERIODS, queue.SIGHT_PERIODS]) {
    for (let minutes = 0; minutes < 24 * 60; minutes += 1) {
      const slot = table.find((entry) => minutes >= entry.from && minutes < entry.to);
      assert.ok(slot, `no period covers minute ${minutes}`);
    }
    const sorted = table.slice().sort((a, b) => a.from - b.from);
    assert.equal(sorted[0].from, 0);
    assert.equal(sorted[sorted.length - 1].to, 24 * 60);
  }
});

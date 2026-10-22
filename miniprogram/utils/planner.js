(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.SmoothGoPlanner = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DEFAULT_START_MINUTES = 9 * 60 + 30;
  const DEFAULT_LIMIT = 3;
  const LUNCH_START = 11 * 60 + 30;
  const LUNCH_END = 13 * 60 + 30;

  // The three-stop day is scored by brute force: every two-attraction + one-meal
  // combination, reordered by optimizeOrder(). That is O(A^2 * F * 6) and the
  // place library now holds ~200 attractions and ~360 restaurants, so the full
  // cross product costs 43 million summarize() calls per day -- 29 s for one
  // day, and 14 days froze the tab for seven minutes.
  //
  // ranked[] is already sorted by scorePlace(), so the tail is by definition the
  // worst-scoring tail. Trimming to the top N before the cross product drops it
  // to ~5.5k calls per day with no measurable change to which day wins.
  const MAX_ATTRACTION_CANDIDATES = 14;
  const MAX_FOOD_CANDIDATES = 10;

  function parseBudget(value, fallback = 500) {
    const numbers = String(value ?? "").match(/\d+(?:\.\d+)?/g);
    if (!numbers || !numbers.length) return fallback;
    return Math.round(Math.max(...numbers.map(Number)));
  }

  function averageQueue(place) {
    if (!place) return 0;
    const min = Number(place.queueMin) || 0;
    const max = Number(place.queueMax) || min;
    return Math.round((min + Math.max(min, max)) / 2);
  }

  // A chain is one brand. 元盛居(生态大街店) and 元盛居(育民东路店) are two real
  // Amap POIs at two real addresses, but a five-day trip that eats at the same
  // brand four times is a broken trip, not a thorough one. Everything before
  // the first parenthesis is the brand, so 元盛楼(盛元盛居)(万福总店) keeps its
  // own brand -- 元盛楼 is a different name that happens to contain 元盛居.
  // Names shorter than two characters are skipped: 原(第五净水车间) would
  // otherwise collapse unrelated venues into one "brand".
  function brandKey(place) {
    const name = String(place?.name || "").split(/[（(]/)[0].trim();
    return name.length >= 2 ? name : "";
  }

  // Amap files some 度假区 under 度假疗养场所: somewhere you stay, not somewhere
  // you visit for an hour. Most still carry opening hours or a phone number,
  // which is what makes them a real day out -- 天定山旅游度假小镇 has a ski slope
  // and answers the phone. The ones with neither are usually a plot of land
  // with no reception to speak of, so they should not win a slot in a day
  // plan. This test is deliberately narrow: in the shipped library it matches
  // 鹿鸣谷净月潭休闲度假区 and nothing else.
  function isPlannable(place) {
    if (place?.category !== "attraction") return true;
    if (!/度假村/.test(place.type || "")) return true;
    return Boolean(place.hours) || Boolean(place.tel);
  }

  function interestMatches(place, interests) {
    const wanted = interests instanceof Set ? interests : new Set(interests || []);
    return (place?.interests || []).filter((interest) => wanted.has(interest));
  }

  function scorePlace(place, interests, budget) {
    const matches = interestMatches(place, interests);
    const budgetCeiling = Number(budget) || 500;
    const spend = Number(place.avg) || 0;
    const budgetPenalty = Math.max(0, spend - budgetCeiling * 0.34) * 0.45;
    return (
      matches.length * 42 +
      ((Number(place.rating) || 4) - 4.2) * 28 -
      averageQueue(place) * 0.55 -
      budgetPenalty
    );
  }

  function summarize(route, startMinutes, travelBetween, options = {}) {
    const places = (route || []).filter(Boolean);
    let cursor = Number.isFinite(startMinutes) ? startMinutes : DEFAULT_START_MINUTES;
    let totalTravel = 0;
    let queueMinutes = 0;
    let budget = 0;

    const stops = places.map((place, index) => {
      if (index > 0) {
        const travel = Math.max(1, Number(travelBetween(places[index - 1], place)) || 15);
        cursor += travel;
        totalTravel += travel;
      }
      const arrival = cursor;
      // The library's queueMin/queueMax is a flat constant per category. When
      // the caller has a real estimate model, use it -- otherwise the timeline
      // books a flat 20 minutes for a venue the card says is waiting 45.
      const queue = typeof options.queueFor === "function"
        ? Math.max(0, Math.round(Number(options.queueFor(place, arrival)) || 0))
        : averageQueue(place);
      cursor += queue + (Number(place.visit) || 60);
      queueMinutes += queue;
      budget += Number(place.avg) || 0;
      return { ...place, arrival, arrivalLabel: timeLabel(arrival), queueAverage: queue };
    });

    return {
      stops,
      totalDuration: cursor - (Number.isFinite(startMinutes) ? startMinutes : DEFAULT_START_MINUTES),
      totalTravel,
      queueMinutes,
      budget
    };
  }

  function timeLabel(minutes) {
    const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
    return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(
      normalized % 60
    ).padStart(2, "0")}`;
  }

  function permutations(values) {
    if (values.length <= 1) return [values.slice()];
    const result = [];
    values.forEach((value, index) => {
      const rest = values.slice(0, index).concat(values.slice(index + 1));
      permutations(rest).forEach((tail) => result.push([value, ...tail]));
    });
    return result;
  }

  function mealTimingPenalty(stops) {
    return stops.reduce((penalty, stop) => {
      if (stop.category !== "food") return penalty;
      if (stop.arrival >= LUNCH_START && stop.arrival <= LUNCH_END) return penalty;
      const distance = stop.arrival < LUNCH_START
        ? LUNCH_START - stop.arrival
        : stop.arrival - LUNCH_END;
      return penalty + Math.min(90, distance);
    }, 0);
  }

  function optimizeOrder(route, options = {}) {
    const places = (route || []).filter(Boolean);
    if (places.length < 2) return places;
    if (places.length > 6) return places;

    const startMinutes = Number.isFinite(options.startMinutes)
      ? options.startMinutes
      : DEFAULT_START_MINUTES;
    const travelBetween = options.travelBetween;
    let best = null;

    permutations(places).forEach((order) => {
      const summary = summarize(order, startMinutes, travelBetween, options);
      const score = summary.totalDuration + mealTimingPenalty(summary.stops) * 1.4;
      if (!best || score < best.score) best = { order, score };
    });

    return best?.order || places;
  }

  function chooseInitialRoute(places, preferences = {}, options = {}) {
    const supplied = (places || []).filter(Boolean);
    // Drop venues that cannot carry a visit before scoring, so they never take
    // a slot from a place that can. Falls back to the raw list if a fixture
    // happens to be made entirely of unplannable venues.
    const plannable = supplied.filter(isPlannable);
    const available = plannable.length ? plannable : supplied;
    const limit = Math.max(1, Number(options.limit) || DEFAULT_LIMIT);
    if (!available.length) return { route: [], reasons: {} };

    const interests = preferences.interests || [];
    const budget = Number(preferences.budget) || 500;
    const ranked = available
      .slice()
      .sort(
        (a, b) =>
          scorePlace(b, interests, budget) - scorePlace(a, interests, budget) ||
          averageQueue(a) - averageQueue(b) ||
          Number(b.rating) - Number(a.rating)
      );

    const selected = [];
    const add = (place) => {
      if (place && !selected.some((item) => item.id === place.id) && selected.length < limit) {
        selected.push(place);
      }
    };

    const startMinutes = Number.isFinite(options.startMinutes)
      ? options.startMinutes
      : DEFAULT_START_MINUTES;
    const attractions = ranked.filter((place) => place.category === "attraction");
    const foods = ranked.filter((place) => place.category === "food");
    let ordered = [];

    // For a three-stop day plan, compare every two-attraction + one-meal
    // combination. This keeps the result interest-led but makes the budget
    // field real rather than decorative.
    if (limit === 3 && attractions.length >= 2 && foods.length) {
      let best = null;
      const attractionPool = attractions.slice(0, MAX_ATTRACTION_CANDIDATES);
      const foodPool = foods.slice(0, MAX_FOOD_CANDIDATES);
      for (let first = 0; first < attractionPool.length; first += 1) {
        for (let second = first + 1; second < attractionPool.length; second += 1) {
          foodPool.forEach((food) => {
            const combo = [attractionPool[first], attractionPool[second], food];
            const order = optimizeOrder(combo, {
              startMinutes,
              travelBetween: options.travelBetween
            });
            const spend = combo.reduce((total, place) => total + (Number(place.avg) || 0), 0);
            const overBudget = Math.max(0, spend - budget) * 2.5;
            const fit = combo.reduce(
              (total, place) => total + scorePlace(place, interests, budget),
              0
            );
            const score = fit - overBudget;
            if (!best || score > best.score) best = { score, order };
          });
        }
      }
      if (best) ordered = best.order;
    }

    if (!ordered.length) {
      ranked.forEach(add);
      ordered = optimizeOrder(selected, {
        startMinutes,
        travelBetween: options.travelBetween
      });
    }

    return {
      route: ordered.map((place) => place.id),
      reasons: Object.fromEntries(
        ordered.map((place) => {
          const matches = interestMatches(place, interests);
          if (matches.length) {
            return [place.id, `匹配偏好「${matches.join("、")}」`];
          }
          if (place.category === "food") {
            return [place.id, "补齐一天行程里的用餐停留"];
          }
          return [place.id, "综合评分、排队和顺路程度选出"];
        })
      )
    };
  }

  function chooseMultiDayRoute(places, preferences = {}, options = {}) {
    const available = (places || []).filter(Boolean);
    const dayCount = Math.min(21, Math.max(1, Number(options.days) || 1));
    const limit = Math.max(1, Number(options.limit) || DEFAULT_LIMIT);
    const startMinutes = Number.isFinite(options.startMinutes)
      ? options.startMinutes
      : DEFAULT_START_MINUTES;
    const used = new Set();
    const usedBrands = new Set();
    const byId = new Map(available.map((place) => [place.id, place]));
    const days = [];

    const fillsADay = (pool) =>
      pool.length >= limit &&
      pool.filter((place) => place.category === "attraction").length >= 2 &&
      pool.filter((place) => place.category === "food").length >= 1;

    for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
      let pool = available.filter((place) => !used.has(place.id));

      // The Changchun seed set is intentionally small. Once a full pass runs
      // out of suitable venues, start a new pass and let later days reuse them.
      // usedBrands has to clear alongside used: on its own it would filter the
      // second pass down to an empty pool and every later day would come back
      // blank.
      if (!fillsADay(pool)) {
        used.clear();
        usedBrands.clear();
        pool = available;
      }

      // One visit per brand across the whole trip. 老昌春饼 alone has 24
      // branches in the library and would otherwise fill a week by itself.
      const brandFresh = pool.filter((place) => {
        const key = brandKey(place);
        return !key || !usedBrands.has(key);
      });
      if (fillsADay(brandFresh)) pool = brandFresh;

      const plan = chooseInitialRoute(pool, preferences, {
        limit,
        startMinutes,
        travelBetween: options.travelBetween
      });
      plan.route.forEach((id) => {
        used.add(id);
        const key = brandKey(byId.get(id));
        if (key) usedBrands.add(key);
      });
      days.push(plan);
    }

    return days;
  }

  function chooseReplan(places, route, preferences = {}, options = {}) {
    const currentPlaces = (route || [])
      .map((place) =>
        typeof place === "string"
          ? (places || []).find((candidate) => candidate.id === place)
          : place
      )
      .filter(Boolean);
    if (currentPlaces.length < 2) return null;

    const startMinutes = Number.isFinite(options.startMinutes)
      ? options.startMinutes
      : DEFAULT_START_MINUTES;
    const travelBetween = options.travelBetween;
    const current = summarize(currentPlaces, startMinutes, travelBetween, options);
    const target = current.stops.reduce((busiest, stop) => {
      if (!busiest) return stop;
      return stop.queueAverage > busiest.queueAverage ? stop : busiest;
    }, null);

    if (!target) return null;

    const currentIds = new Set(currentPlaces.map((place) => place.id));
    const replacementPool = (places || []).filter(
      (place) => !currentIds.has(place.id) && place.category === target.category
    );
    const fallbackPool = (places || []).filter((place) => !currentIds.has(place.id));
    const candidatePool = replacementPool.length ? replacementPool : fallbackPool;
    const interests = preferences.interests || [];
    const targetMatches = interestMatches(target, interests);
    const typeFamily = (place) => String(place.type || "").split("·")[0].trim();
    const otherFamilies = new Set(
      currentPlaces
        .filter((place) => place.id !== target.id)
        .map(typeFamily)
        .filter(Boolean)
    );
    let best = null;

    candidatePool.forEach((candidate) => {
      const nextPlaces = currentPlaces.map((place) =>
        place.id === target.id ? candidate : place
      );
      const next = summarize(nextPlaces, startMinutes, travelBetween, options);
      const queueSaved = current.queueMinutes - next.queueMinutes;
      const durationSaved = current.totalDuration - next.totalDuration;
      if (queueSaved < 3) return;

      const matches = interestMatches(candidate, interests);
      const repeatsScene = otherFamilies.has(typeFamily(candidate)) ? 20 : 0;
      const benefit =
        queueSaved * 1.1 +
        durationSaved * 0.55 +
        matches.length * 10 +
        (matches.length - targetMatches.length) * 28 +
        (Number(candidate.rating) - Number(target.rating)) * 5 -
        repeatsScene;
      if (!best || benefit > best.benefit) {
        best = {
          benefit,
          nextPlaces,
          candidate,
          target,
          next,
          queueSaved,
          durationSaved,
          matches
        };
      }
    });

    if (!best) return null;

    const queueSaved = Math.max(1, Math.round(best.queueSaved));
    const durationSaved = Math.round(best.durationSaved);
    const fitText = best.matches.length
      ? `${best.candidate.name}符合「${best.matches.join("、")}」`
      : `${best.candidate.name}作为同类地点替代`;
    const timingText =
      durationSaved >= 5
        ? `整条路线预计提前 ${durationSaved} 分钟结束。`
        : durationSaved <= -5
          ? `游览时间稍长，预计晚 ${Math.abs(durationSaved)} 分钟结束，但排队更少。`
          : "整条路线总时长基本不变。";

    return {
      route: best.nextPlaces.map((place) => place.id),
      from: best.target,
      to: best.candidate,
      queueSaved,
      durationSaved,
      reason:
        `${fitText}，当前约 ${averageQueue(best.candidate)} 分钟排队，` +
        `比${best.target.name}少 ${queueSaved} 分钟。${timingText}`
    };
  }

  return {
    DEFAULT_START_MINUTES,
    parseBudget,
    averageQueue,
    brandKey,
    isPlannable,
    interestMatches,
    scorePlace,
    summarize,
    optimizeOrder,
    chooseInitialRoute,
    chooseMultiDayRoute,
    chooseReplan
  };
});

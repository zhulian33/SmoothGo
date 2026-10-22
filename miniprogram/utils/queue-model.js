/**
 * Queue estimate model.
 *
 * The shipped library carries a hard-coded pair -- 12-28 minutes for food,
 * 10-35 for attractions -- applied to all 560 venues alike. That makes 净月潭
 * and an unvisited sculpture share one wait, and makes 12:00 the same as 15:00.
 * It is the core claim of the product resting on two constants.
 *
 * This module replaces the constants with a model instead of with invented
 * live data. Nothing here observes a queue. It combines three things the app
 * already knows:
 *
 *   1. what kind of place it is, and how popular (rating, 长春地标/长春名吃)
 *   2. what time the visit lands at
 *   3. what day of the week it is
 *
 * Every coefficient is a named constant in this file, and the caller is
 * expected to show the basis ("周五 12:10 · 餐厅午市高峰") next to the number.
 * A number with a stated reason is defensible; a bare "参考等候 12–28 分钟"
 * is not.
 *
 * The 23 hand-written venues (source: "本地整理") already carry a considered
 * queue range, so their own midpoint is used as the baseline and only the
 * time-of-day and weekday factors are applied on top.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.SmoothGoQueue = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MINUTES_IN_DAY = 24 * 60;

  // --- 1. Baseline: how long this kind of place tends to make people wait ---

  // Keyed on the Amap sub-category, the second half of "美食 · 火锅店".
  const BASE_BY_KIND = [
    [["火锅店", "清真菜馆", "中餐厅", "烧烤", "海鲜", "自助餐", "东北菜", "韩国料理", "湘菜", "川菜"], 12],
    [["快餐", "小吃", "饮品", "甜品", "冰品", "面包", "蛋糕", "熟食"], 4],
    [["咖啡厅", "茶座", "茶艺馆"], 6],
    [["国家级景点", "风景名胜", "旅游景点"], 12],
    [["公园", "城市广场", "植物园", "动物园", "海滩"], 7],
    [["博物馆", "纪念馆", "展览馆", "美术馆", "培训机构"], 10],
    [["剧场", "娱乐场所", "游戏厅", "体育休闲服务场所", "综合体育馆"], 14],
    [["购物中心", "步行街"], 8],
    [["寺庙道观"], 5],
    [["度假村"], 10],
    [["公司"], 3]
  ];

  const BASE_FALLBACK = { food: 10, attraction: 8 };

  // Popularity, from fields the app already has. A 4.8 venue that the city
  // calls 长春地标 draws a longer line than a 3.9 one at the same hour.
  //
  // Deliberately gentle. These multiply with the service-peak and weekend
  // factors, and at 1.35 / 1.25 a popular hotpot at Saturday dinner came out
  // at 103 minutes -- the model compounding its own enthusiasm. A venue that
  // is busy anyway does not get 2.5x busier because it is also 18:00.
  const RATING_FACTOR = [
    [4.5, 1.2],
    [4.0, 1.05],
    [0, 0.9]
  ];
  const BADGE_FACTOR = 1.15;

  // --- 2. Time of day ---

  // Restaurants live and die by the two services.
  const FOOD_PERIODS = [
    { from: 0, to: 10 * 60 + 30, key: "quiet", label: "非正餐时段", factor: 0.35 },
    { from: 10 * 60 + 30, to: 11 * 60 + 30, key: "pre-lunch", label: "午市前", factor: 1.15 },
    { from: 11 * 60 + 30, to: 13 * 60 + 30, key: "lunch-peak", label: "午市高峰", factor: 1.7 },
    { from: 13 * 60 + 30, to: 14 * 60 + 30, key: "post-lunch", label: "午市回落", factor: 0.95 },
    { from: 14 * 60 + 30, to: 17 * 60, key: "afternoon", label: "下午平峰", factor: 0.6 },
    { from: 17 * 60, to: 17 * 60 + 30, key: "pre-dinner", label: "晚市前", factor: 1.3 },
    { from: 17 * 60 + 30, to: 20 * 60, key: "dinner-peak", label: "晚市高峰", factor: 1.9 },
    { from: 20 * 60, to: 21 * 60 + 30, key: "post-dinner", label: "晚市回落", factor: 1.1 },
    { from: 21 * 60 + 30, to: MINUTES_IN_DAY, key: "late", label: "夜宵时段", factor: 0.5 }
  ];

  // Attractions build through the morning, dip at lunch, peak again mid-afternoon.
  const SIGHT_PERIODS = [
    { from: 0, to: 9 * 60, key: "closed", label: "未开园", factor: 0.2 },
    { from: 9 * 60, to: 10 * 60, key: "opening", label: "开园", factor: 0.8 },
    { from: 10 * 60, to: 12 * 60, key: "morning-peak", label: "上午高峰", factor: 1.4 },
    { from: 12 * 60, to: 14 * 60, key: "midday", label: "午间回落", factor: 1.0 },
    { from: 14 * 60, to: 16 * 60, key: "afternoon-peak", label: "午后高峰", factor: 1.3 },
    { from: 16 * 60, to: 18 * 60, key: "closing", label: "临近闭园", factor: 0.75 },
    { from: 18 * 60, to: MINUTES_IN_DAY, key: "closed", label: "闭园后", factor: 0.2 }
  ];

  // --- 3. Day of week ---

  const WEEKDAY_FACTOR = {
    0: { key: "weekend", label: "周日", factor: 1.3 },
    1: { key: "weekday", label: "周一", factor: 1.0 },
    2: { key: "weekday", label: "周二", factor: 1.0 },
    3: { key: "weekday", label: "周三", factor: 1.0 },
    4: { key: "weekday", label: "周四", factor: 1.0 },
    5: { key: "friday", label: "周五", factor: 1.15 },
    6: { key: "weekend", label: "周六", factor: 1.3 }
  };

  // The range spread around the baseline. Deliberately wide: this is a model,
  // not a measurement, and a narrow band would overstate what it knows.
  const LOW_SPREAD = 0.75;
  const HIGH_SPREAD = 1.55;
  const MIN_SPAN = 3;

  // Ceilings. Rating, badge, service peak and weekend all multiply, and stacked
  // they ran a Changchun hotpot branch to 103 minutes -- long enough to swallow
  // half a day plan and to make the planner route around every popular venue.
  // An hour is already a serious wait for a meal in this city; anything past
  // that is the model extrapolating, not a queue anyone would stand in.
  const MAX_BY_CATEGORY = { food: 75, attraction: 60 };

  function clampMinutes(value) {
    const minutes = Number(value);
    if (!Number.isFinite(minutes)) return 0;
    const wrapped = ((Math.round(minutes) % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
    return wrapped;
  }

  function subCategory(place) {
    const type = String(place?.type || "");
    const parts = type.split(" · ");
    return (parts.length > 1 ? parts[parts.length - 1] : "").trim();
  }

  function baselineFor(place) {
    // The 23 curated venues carry a hand-judged range; trust it over the model.
    if (place?.source === "本地整理") {
      const low = Number(place.queueMin);
      const high = Number(place.queueMax);
      if (Number.isFinite(low) && Number.isFinite(high) && high >= low) {
        return (low + high) / 2;
      }
    }

    const kind = subCategory(place);
    let base = BASE_FALLBACK[place?.category] || BASE_FALLBACK.attraction;
    for (const entry of BASE_BY_KIND) {
      if (entry[0].some((key) => kind.includes(key))) {
        base = entry[1];
        break;
      }
    }

    const rating = Number(place?.rating);
    if (Number.isFinite(rating) && rating > 0) {
      for (const [threshold, factor] of RATING_FACTOR) {
        if (rating >= threshold) {
          base *= factor;
          break;
        }
      }
    }
    if (place?.badge) base *= BADGE_FACTOR;
    return base;
  }

  function periodFor(place, atMinutes) {
    const table = place?.category === "food" ? FOOD_PERIODS : SIGHT_PERIODS;
    const minutes = clampMinutes(atMinutes);
    return table.find((slot) => minutes >= slot.from && minutes < slot.to) ||
      table[table.length - 1];
  }

  function dayFor(weekday) {
    return WEEKDAY_FACTOR[weekday] || WEEKDAY_FACTOR[1];
  }

  /**
   * Estimate the wait at a place when a visit lands at `atMinutes`.
   *
   * @param {object} place      a venue from the library
   * @param {number} atMinutes  minutes past midnight of the arrival
   * @param {object} [options]  { weekday: 0-6 } where 0 is Sunday
   * @returns {{min:number,max:number,average:number,period:object,day:object,
   *            confidence:string,clock:string}}
   */
  function estimate(place, atMinutes, options = {}) {
    if (!place) {
      return { min: 0, max: 0, average: 0, period: null, day: null, confidence: "推算", clock: "" };
    }

    const minutes = clampMinutes(atMinutes);
    const period = periodFor(place, minutes);
    const day = dayFor(options.weekday);
    const kind = place.category === "food" ? "food" : "attraction";
    const base = baselineFor(place) * period.factor * day.factor;

    const ceiling = MAX_BY_CATEGORY[kind] || MAX_BY_CATEGORY.attraction;
    const min = Math.min(ceiling, Math.max(0, Math.round(base * LOW_SPREAD)));
    const max = Math.min(
      ceiling,
      Math.max(min + MIN_SPAN, Math.round(base * HIGH_SPREAD))
    );
    const clock = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60
    ).padStart(2, "0")}`;

    return {
      min,
      max,
      average: Math.round((min + max) / 2),
      period,
      day,
      kind,
      clock,
      confidence: "推算"
    };
  }

  /**
   * One-line reason a reader can check, e.g. "周五 12:10 · 餐厅午市高峰".
   * Kept separate from rendering so the caller can translate the pieces.
   */
  function basisParts(result) {
    if (!result || !result.period) return null;
    const kind = result.kind === "food" ? "餐厅" : "景点";
    return {
      weekday: result.day.label,
      clock: result.clock,
      kind,
      period: result.period.label
    };
  }

  return {
    estimate,
    basisParts,
    baselineFor,
    periodFor,
    dayFor,
    FOOD_PERIODS,
    SIGHT_PERIODS,
    WEEKDAY_FACTOR,
    BASE_BY_KIND
  };
});

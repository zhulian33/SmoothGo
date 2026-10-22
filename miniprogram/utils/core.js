/**
 * Everything between the place library and the four pages.
 *
 * The scoring and the queue model are *not* here -- those are web/planner.js
 * and web/queue-model.js, copied in verbatim by docs/build_miniprogram.py.
 * This file is only the glue the web app keeps inside app.js: the haversine
 * fallback for travel time, the sentence parser, and the shape each page needs
 * for rendering.
 *
 * Two things that differ from the web build on purpose:
 *
 *   - travelBetween() always uses the straight-line estimate. The web app asks
 *     Amap for the real driving leg after planning; here there is no HTTP at
 *     all, so the estimate is all there is. Every surface that shows one says
 *     so rather than implying it is live.
 *   - The queue model is always asked for a number. Same covenant as the web
 *     app: it is a model, never an observation, and the UI prints its basis.
 */

const PLANNER = require("./planner.js");
const QUEUE_MODEL = require("./queue-model.js");
const store = require("./store.js");
const { t } = require("./i18n.js");

const PLACES = store.PLACES;

/* ---------- geometry ---------- */

function distanceKm(from, to) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const travelCache = new Map();

function pairKey(from, to) {
  return from.id < to.id ? `${from.id}|${to.id}` : `${to.id}|${from.id}`;
}

/**
 * Straight line x 1.35 detour factor at 26 km/h, floored at 8 minutes for
 * walking in and ceiling at 90 so one bad pair cannot dominate a day. Same
 * constants and same reasoning as web/app.js.
 */
function travelBetween(from, to) {
  if (!from || !to) return 15;
  if (from.id === to.id) return 0;
  if (!Number.isFinite(from.lat) || !Number.isFinite(to.lat)) return 15;
  const key = pairKey(from, to);
  const cached = travelCache.get(key);
  if (cached !== undefined) return cached;
  const minutes = Math.max(8, Math.min(90, Math.round(((distanceKm(from, to) * 1.35) / 26) * 60)));
  travelCache.set(key, minutes);
  return minutes;
}

/* ---------- time ---------- */

function timeLabel(minutes) {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(
    normalized % 60
  ).padStart(2, "0")}`;
}

/** Accepts "09:30" and anything ending in "HH:MM" (a saved date-prefixed value). */
function parseTime(value) {
  const match = String(value || "").match(/(\d{1,2})[：:](\d{2})/);
  if (!match) return NaN;
  const hours = Math.min(23, Number(match[1]));
  const minutes = Math.min(59, Number(match[2]));
  return hours * 60 + minutes;
}

function durationLabel(minutes) {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (!hours) return t("{v0} 分钟", { v0: rest });
  return t("{v0} 小时 {v1} 分", { v0: hours, v1: rest });
}

function currentWeekday() {
  return new Date().getDay();
}

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/* ---------- queue model surface ---------- */

function queueEstimate(place, atMinutes, weekday) {
  if (!place) return null;
  const at = Number.isFinite(atMinutes) ? atMinutes : currentMinutes();
  const day = Number.isFinite(weekday) ? weekday : currentWeekday();
  return QUEUE_MODEL.estimate(place, at, { weekday: day });
}

function queueText(place, atMinutes, weekday) {
  const result = queueEstimate(place, atMinutes, weekday);
  if (!result) return `${place.queueMin ?? 0}–${place.queueMax ?? 0}`;
  return `${result.min}–${result.max}`;
}

/** "周五 12:10 · 餐厅午市高峰" -- the reason, so the number can be argued with. */
function queueBasisText(place, atMinutes, weekday) {
  const result = queueEstimate(place, atMinutes, weekday);
  if (!result) return "";
  const parts = QUEUE_MODEL.basisParts(result);
  if (!parts) return "";
  return `${t(parts.weekday)} ${parts.clock} · ${t(parts.period)}`;
}

function queueFor(place, atMinutes) {
  return queueEstimate(place, atMinutes).average;
}

/* ---------- planning ---------- */

function preferences() {
  const { state } = store;
  return {
    interests: [...state.interests],
    budget: PLANNER.parseBudget(state.budget),
    people: state.people,
  };
}

/**
 * Build the render model for one day. WXML cannot do this arithmetic, and the
 * alternative -- shipping raw minutes into the template and formatting there --
 * is not possible without WXS.
 */
function dayModel(day, startMinutes) {
  const stops = (day.route || []).filter(Boolean);
  const summary = PLANNER.summarize(stops, startMinutes, travelBetween, { queueFor });

  return {
    stops: summary.stops.map((stop, index) => ({
      index: index + 1,
      id: stop.id,
      name: stop.name,
      type: stop.type,
      category: stop.category,
      badge: stop.badge || "",
      interest: (stop.interests || []).slice(0, 2).join(" · "),
      arrival: stop.arrivalLabel,
      travelLabel: index === 0 ? "" : t("{v0} 分钟", { v0: travelBetween(stops[index - 1], stop) }),
      queueRange: queueText(stop, stop.arrival),
      queueBasis: queueBasisText(stop, stop.arrival),
      queueAverage: stop.queueAverage,
      visitLabel: t("{v0} 分钟", { v0: stop.visit || 60 }),
      avgLabel: `¥${stop.avg ?? 0}`,
    })),
    totals: {
      duration: durationLabel(summary.totalDuration),
      travel: durationLabel(summary.totalTravel),
      queue: durationLabel(summary.queueMinutes),
      budget: `¥${summary.budget}`,
    },
  };
}

function planCurrentDay(startMinutes) {
  const day = store.currentDay();
  return day ? dayModel(day, startMinutes) : null;
}

function generateItinerary() {
  const { state } = store;
  const plans = PLANNER.chooseMultiDayRoute(PLACES, preferences(), {
    days: Math.max(1, Math.min(21, Number(state.days) || 1)),
    limit: 3,
    startMinutes: (parseTime(state.startTime) || 570),
    travelBetween,
    queueFor,
  });
  store.setItinerary(plans);
  return plans.length;
}

function replan() {
  const route = store.currentRoute();
  if (route.length < 2) {
    wx.showToast({ title: t("至少需要两个地点才能重排"), icon: "none" });
    return false;
  }
  const result = PLANNER.chooseReplan(PLACES, route, preferences(), {
    startMinutes: parseTime(store.state.startTime) || 570,
    travelBetween,
    queueFor,
  });
  if (!result) {
    wx.showToast({ title: t("当前路线已经是较优的排队组合"), icon: "none" });
    return false;
  }

  store.patch({
    lastReplan: {
      from: result.from.name,
      to: result.to.name,
      queueSaved: Math.round(result.queueSaved || 0),
      durationSaved: Math.round(result.durationSaved || 0),
    },
  });

  const days = store.state.itinerary.slice();
  const at = store.state.selectedDay;
  const reasons = { ...days[at].reasons, [result.to.id]: result.reason };
  days[at] = { route: result.route.map(store.resolve).filter(Boolean), reasons };
  store.state.itinerary = days;
  store.save();

  wx.showToast({
    title: t("已重排：{v0} 换成 {v1}，省下约 {v2} 分钟", {
      v0: result.from.name,
      v1: result.to.name,
      v2: Math.round(result.queueSaved || result.durationSaved || 0),
    }),
    icon: "none",
    duration: 2400,
  });
  return true;
}

/* ---------- sentence parser ---------- */

/**
 * Port of web/app.js extractKeywords(). It reads budget, start clock, trip
 * length, interests and party out of one Chinese sentence and returns what it
 * recognised, so the input never silently changes nothing.
 */
function extractPreferences(text) {
  const source = String(text || "");
  const found = [];

  let budget = null;
  const budgetMatch =
    source.match(/(?:预算|大概|大约)\s*(\d{2,5})/) || source.match(/(\d{2,5})\s*(?:元|块)/);
  if (budgetMatch) {
    budget = `¥${budgetMatch[1]}`;
    found.push(t("预算 {v0}", { v0: budgetMatch[1] }));
  }

  let startTime = null;
  const timeMatch = source.match(/(上午|下午|晚上)?\s*(\d{1,2})[：:](\d{2})/);
  if (timeMatch) {
    startTime = `${String(timeMatch[2]).padStart(2, "0")}:${timeMatch[3]}`;
    found.push(t("时间 {v0}", { v0: startTime }));
  }

  const chineseDays = { 一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7 };
  let days = 0;
  const daysMatch = source.match(/(\d{1,2})\s*(?:天|日)/);
  if (daysMatch) days = Number(daysMatch[1]);
  else if (/三周|3\s*周/.test(source)) days = 21;
  else if (/两周|2\s*周|几周/.test(source)) days = 14;
  else if (/一周|1\s*周/.test(source)) days = 7;
  else {
    const chineseMatch = source.match(/([一两二三四五六七])\s*(?:天|日)/);
    if (chineseMatch) days = chineseDays[chineseMatch[1]] || 0;
  }
  if (days) {
    days = Math.min(21, days);
    found.push(days === 1 ? t("1 天") : t("{v0} 天", { v0: days }));
  }

  // Match on the Chinese source, then translate the hits for display. Matching
  // on t(item) would find nothing the moment the UI is switched to English.
  const interests = detectRawInterests(source);
  if (interests.length) found.push(...interests.map((item) => t(item)));

  let people = null;
  if (/爸妈|父母|家人|家庭/.test(source)) people = t("家庭");
  else if (/一个人|独自/.test(source)) people = t("1 位成人");
  else if (/情侣|两个人|两人/.test(source)) people = t("2 位成人");

  return {
    budget,
    startTime,
    days,
    people,
    // Chinese goes back into state, never the translation: the planner scores
    // against place.interests, which is Chinese data in both languages.
    interests,
    found: [...new Set(found)],
  };
}

/**
 * Interest chips are matched against place.interests, which is Chinese data and
 * is never translated. So the raw matcher has to run on Chinese no matter what
 * language the UI is in -- otherwise switching to English silently disables
 * every filter.
 */
const RAW_INTERESTS = ["自然", "历史", "美食", "东北菜", "雪景", "电影",
  "亲子", "拍照", "摄影", "轻松", "休闲"];

function detectRawInterests(source) {
  const hit = RAW_INTERESTS.filter((item) => source.includes(item));
  if (source.includes("东北菜")) hit.push("美食");
  if (source.includes("雪景")) hit.push("自然");
  if (source.includes("拍照")) hit.push("摄影");
  return [...new Set(hit)];
}

/* ---------- library stats ---------- */

function stats() {
  const total = PLACES.length;
  const hotspots = PLACES.filter((place) => (place.queueMax || 0) >= 20).length;
  const landmarks = PLACES.filter((place) => place.featured).length;
  const free = PLACES.filter((place) => !place.avg).length;
  return [
    { key: "地点库", value: total },
    { key: "排队热点", value: hotspots },
    { key: "地标", value: landmarks },
    { key: "免费开放", value: free },
  ];
}

module.exports = {
  PLACES,
  distanceKm,
  travelBetween,
  timeLabel,
  parseTime,
  durationLabel,
  currentMinutes,
  currentWeekday,
  queueEstimate,
  queueText,
  queueBasisText,
  preferences,
  dayModel,
  planCurrentDay,
  generateItinerary,
  replan,
  extractPreferences,
  stats,
};

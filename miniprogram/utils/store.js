/**
 * Shared state for the mini program.
 *
 * The plan has to survive leaving the tab and reopening the app, and all four
 * pages read it, so it lives here rather than in any one page. Only *ids* go
 * into storage: they are re-resolved against data/places.js on load, so a
 * rebuilt place library is never shadowed by a month-old snapshot in storage.
 */

const PLACES = require("../data/places.js");

const STORAGE_KEY = "smoothgo_state";
const BY_ID = new Map(PLACES.map((place) => [place.id, place]));

const DEFAULTS = {
  // Same sentence the web demo puts in its input box, because it exercises
  // every extractor at once: budget, party, two interests.
  sentence: "我想带爸妈去长春玩一天，预算 500，喜欢东北菜和历史，不想太累。",
  startTime: "09:30",
  budget: "¥500",
  people: "2 位成人",
  days: 1,
  interests: [],
};

const state = {
  ...DEFAULTS,
  itinerary: [], // [{ route: [place], reasons: {} }]
  selectedDay: 0,
  lastReplan: null,
};

const listeners = [];

function emit() {
  listeners.slice().forEach((fn) => {
    try {
      fn(state);
    } catch (error) {
      // One broken listener must not stop the rest from re-rendering.
    }
  });
}

function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const at = listeners.indexOf(fn);
    if (at !== -1) listeners.splice(at, 1);
  };
}

function patch(changes) {
  Object.assign(state, changes);
  save();
}

function currentDay() {
  return state.itinerary[state.selectedDay] || null;
}

function currentRoute() {
  const day = currentDay();
  return day ? day.route : [];
}

function setItinerary(days) {
  state.itinerary = days.map((day) => ({
    route: day.route.map(resolve).filter(Boolean),
    reasons: { ...(day.reasons || {}) },
  }));
  state.selectedDay = 0;
  state.lastReplan = null;
  emit();
  save();
}

function resolve(id) {
  return BY_ID.get(id) || null;
}

function selectDay(index) {
  if (index < 0 || index >= state.itinerary.length) return;
  state.selectedDay = index;
  state.lastReplan = null;
  emit();
  save();
}

function save() {
  try {
    wx.setStorageSync(STORAGE_KEY, {
      ...DEFAULTS,
      sentence: state.sentence,
      startTime: state.startTime,
      budget: state.budget,
      people: state.people,
      days: state.days,
      interests: state.interests,
      selectedDay: state.selectedDay,
      itinerary: state.itinerary.map((day) => ({
        route: day.route.map((place) => place.id),
        reasons: day.reasons,
      })),
    });
  } catch (error) {
    // A full quota should degrade to "no persistence", never to "app is dead".
  }
}

function load() {
  let saved = null;
  try {
    saved = wx.getStorageSync(STORAGE_KEY);
  } catch (error) {
    return;
  }
  if (!saved) return;

  Object.assign(state, {
    sentence: saved.sentence ?? state.sentence,
    startTime: saved.startTime ?? state.startTime,
    budget: saved.budget ?? state.budget,
    people: saved.people ?? state.people,
    days: Number(saved.days) || state.days,
    interests: Array.isArray(saved.interests) ? saved.interests : [],
  });

  if (Array.isArray(saved.itinerary) && saved.itinerary.length) {
    state.itinerary = saved.itinerary
      .map((day) => ({
        route: (day.route || []).map(resolve).filter(Boolean),
        reasons: day.reasons || {},
      }))
      .filter((day) => day.route.length);
    state.selectedDay = Math.min(
      Number(saved.selectedDay) || 0,
      Math.max(0, state.itinerary.length - 1)
    );
  }
}

module.exports = {
  state,
  subscribe,
  patch,
  save,
  load,
  setItinerary,
  selectDay,
  currentDay,
  currentRoute,
  resolve,
  PLACES,
};

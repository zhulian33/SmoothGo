const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

// Stored as Chinese keys, translated only when shown. The planner matches these
// against place.interests, which is Chinese data in both languages.
const PEOPLE_KEYS = ["1 位成人", "2 位成人", "家庭"];
const DAY_RANGE = [1, 2, 3, 4, 5, 7, 10, 14, 21];

Page({
  data: {
    brand: "SMOOTHGO",
    langLabel: "EN",
    title: "",
    sub: "",
    placeholder: "",
    extractLabel: "",
    generateLabel: "",
    sentence: "",
    extractStatus: "",
    extractVisible: false,
    startTime: "",
    dayLabel: "",
    dayRange: DAY_RANGE.map(String),
    peopleRange: [],
    peopleLabel: "",
    budget: "",
    labels: {},
    stats: [],
    note: "",
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    const state = store.state;
    const peopleIndex = Math.max(0, PEOPLE_KEYS.indexOf(state.people));

    this.setData({
      langLabel: i18n.getLang() === "zh" ? "EN" : "中",
      title: t("四时俱好"),
      sub: t("是长春。"),
      placeholder: t("用一句话描述你的行程"),
      extractLabel: t("提取关键词"),
      generateLabel: t("生成行程"),
      sentence: state.sentence,
      startTime: state.startTime,
      dayLabel: state.days === 1 ? t("1 天") : t("{v0} 天", { v0: state.days }),
      peopleRange: PEOPLE_KEYS.map((key) => t(key)),
      peopleLabel: t(PEOPLE_KEYS[peopleIndex] || PEOPLE_KEYS[1]),
      budget: state.budget,
      labels: {
        start: t("出发时间"),
        days: t("天数"),
        people: t("出行人数"),
        budget: t("预算"),
      },
      stats: core.stats().map((row) => ({ ...row, label: t(row.key) })),
      note: t("演示数据：等待时长为模型推算，不是实时数据"),
    });

    wx.setNavigationBarTitle({ title: t("SmoothGo 畅游通") });
  },

  onSentence(event) {
    const value = event.detail.value;
    // Update memory only. Writing storage on every keystroke is 140 synchronous
    // writes for one sentence, and the save on blur covers the case that
    // matters (leaving the page with text still in the box).
    store.state.sentence = value;
    this.setData({ sentence: value, extractVisible: false });
  },

  onSentenceBlur(event) {
    store.patch({ sentence: event.detail.value });
  },

  onExtract() {
    const result = core.extractPreferences(store.state.sentence);
    const changes = {};
    if (result.budget) changes.budget = result.budget;
    if (result.startTime) changes.startTime = result.startTime;
    if (result.days) changes.days = Math.min(21, result.days);
    if (result.people) changes.people = result.people;
    changes.interests = result.interests;
    store.patch(changes);

    this.setData({
      extractStatus: result.found.length
        ? t("已提取：{v0}", { v0: result.found.join(" / ") })
        : t("没有识别到关键词，可以手动填写"),
      extractVisible: true,
    });
    this.refresh();
  },

  onStart(event) {
    store.patch({ startTime: event.detail.value });
    this.setData({ startTime: event.detail.value });
  },

  onDays(event) {
    const days = DAY_RANGE[Number(event.detail.value)] || 1;
    store.patch({ days });
    this.setData({ dayLabel: days === 1 ? t("1 天") : t("{v0} 天", { v0: days }) });
  },

  onPeople(event) {
    const people = PEOPLE_KEYS[Number(event.detail.value)] || PEOPLE_KEYS[1];
    store.patch({ people });
    this.setData({ peopleLabel: t(people) });
  },

  onBudget(event) {
    const budget = event.detail.value || store.state.budget;
    store.patch({ budget });
    this.setData({ budget });
  },

  onLang() {
    i18n.toggleLang();
    this.refresh();
    wx.showToast({
      title: i18n.getLang() === "en" ? t("已切换到英文") : t("已切换到中文"),
      icon: "none",
    });
  },

  onGenerate() {
    // Planning a single day against the full library takes ~25 ms, so a loading
    // spinner would only flicker. Switch straight away and let the toast land
    // on the route page.
    const days = core.generateItinerary();
    wx.switchTab({
      url: "/pages/route/route",
      success: () => {
        wx.showToast({
          title: days > 1 ? t("已生成 {v0} 天路线（演示）", { v0: days })
            : t("已按你的条件生成路线（演示）"),
          icon: "none",
          duration: 2200,
        });
      },
    });
  },
});

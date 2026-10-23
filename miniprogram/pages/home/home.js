const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

// Stored as Chinese keys, translated only when shown. The planner matches these
// against place.interests, which is Chinese data in both languages.
const PEOPLE_KEYS = ["1 位成人", "2 位成人", "家庭"];
const DAY_RANGE = [1, 2, 3, 4, 5, 7, 10, 14, 21];

// Changchun's People's Square, the same centre the web build and the map page
// use, so an empty map opens somewhere inside the library rather than at 0,0.
const CENTRE = { latitude: 43.883, longitude: 125.324 };

Page({
  data: {
    brandSub: "",
    cityLabel: "",
    langLabel: "",
    todayLabel: "",
    title: "",
    sub: "",
    lede: "",

    plannerTitle: "",
    plannerHint: "",
    placeholder: "",
    sentence: "",
    extractLabel: "",
    extractStatus: "",
    generateLabel: "",
    labels: {},
    startTime: "",
    budget: "",
    dayLabel: "",
    dayIndex: 0,
    dayRange: DAY_RANGE.map(String),
    location: "",
    peopleLabel: "",
    peopleIndex: 1,
    peopleRange: [],

    mapLabel: "",
    mapLive: "",
    mapEmptyLabel: "",
    hasRoute: false,
    latitude: CENTRE.latitude,
    longitude: CENTRE.longitude,
    scale: 11,
    markers: [],
    polyline: [],
    previewTitle: "",
    previewSummary: "",
    routeLinkLabel: "",

    signals: [],
    todayKicker: "",
    todayHeading: "",
    todayStops: [],
    emptyTitle: "",
    emptyBody: "",
    footnote: "",
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    const state = store.state;
    const day = store.currentDay();
    const route = store.currentRoute();
    const map = core.routeMapModel();
    const model = day
      ? core.dayModel(day, core.parseTime(state.startTime) || 570)
      : null;
    const hotspots = core.stats().find((row) => row.key === "排队热点");

    this.setData({
      brandSub: t("畅游通"),
      cityLabel: t("长春"),
      langLabel: i18n.getLang() === "zh" ? "EN" : "中",
      todayLabel: t("长春 · 今天"),
      title: t("四时俱好"),
      sub: t("是长春。"),
      lede: t(
        "自己填条件，或者直接说一段话。SmoothGo 会把地点、天气、车程、排队和购票连成一天到三周的顺路行程。"
      ),

      plannerTitle: t("一句话规划"),
      plannerHint: t("也可以自己编辑下面条件"),
      placeholder: t("用一句话描述你的行程"),
      sentence: state.sentence,
      extractLabel: t("提取关键词"),
      generateLabel: t("生成路线"),
      labels: {
        start: t("出发时间"),
        budget: t("每日预算"),
        days: t("天数"),
        location: t("地点"),
        people: t("出行人数"),
      },
      startTime: state.startTime,
      budget: state.budget,
      dayLabel: state.days === 1 ? t("1 天") : t("{v0} 天", { v0: state.days }),
      dayIndex: Math.max(0, DAY_RANGE.indexOf(Number(state.days))),
      location: state.location || t("长春市朝阳区"),
      peopleRange: PEOPLE_KEYS.map((key) => t(key)),
      peopleLabel: t(state.people || PEOPLE_KEYS[1]),
      peopleIndex: Math.max(0, PEOPLE_KEYS.indexOf(state.people)),

      mapLabel: t("地图预览 · {v0} 个地点", {
        v0: map.count || core.PLACES.length,
      }),
      mapLive: t("高德底图"),
      mapEmptyLabel: t("生成路线后这里会显示地图"),
      hasRoute: map.hasRoute,
      latitude: map.hasRoute ? map.latitude : CENTRE.latitude,
      longitude: map.hasRoute ? map.longitude : CENTRE.longitude,
      scale: map.hasRoute ? map.scale : 11,
      markers: map.markers,
      polyline: map.polyline,
      previewTitle: t(state.days > 1 ? "长春 {v0} 日路线" : "长春一日路线", {
        v0: state.days,
      }),
      previewSummary: model
        ? t("{v0} 个地点 · 约 {v1} · 总车程 {v2}", {
            v0: model.stops.length,
            v1: model.totals.duration,
            v2: model.totals.travel,
          })
        : t("还没有生成路线"),
      routeLinkLabel: t("查看完整路线 →"),

      // Two of the four read "—" on purpose. The web build says so out loud and
      // the mini program repeats it: a demo that invents a weather number is
      // claiming a data source it does not have.
      signals: [
        { key: "weather", label: t("天气"), value: "—", note: t("未接入数据源") },
        {
          key: "queue",
          label: t("排队"),
          value: t("{v0} 个", { v0: hotspots ? hotspots.value : 0 }),
          note: t("推算等候 · 非实时"),
        },
        { key: "transit", label: t("公交"), value: "—", note: t("未接入数据源") },
        {
          key: "saved",
          label: t("已保存"),
          value: t("{v0} 个", { v0: route.length }),
          note: t("路线中的地点"),
        },
      ],

      todayKicker: t("今日路线"),
      todayHeading: t("今天可以这样走"),
      todayStops: (model ? model.stops : []).slice(0, 8),
      emptyTitle: t("还没有今日路线"),
      emptyBody: t("填一句话或按「生成路线」，这里会列出今天的站点"),
      footnote: t("演示数据：等待时长为模型推算，不是实时数据"),
    });

    wx.setNavigationBarTitle({ title: t("SmoothGo 畅游通") });
  },

  onSentence(event) {
    const value = event.detail.value;
    // Update memory only. Writing storage on every keystroke is 140 synchronous
    // writes for one sentence, and the save on blur covers the case that
    // matters (leaving the page with text still in the box).
    store.state.sentence = value;
    this.setData({ sentence: value });
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
    });
    this.refresh();
  },

  onStartTime(event) {
    store.patch({ startTime: event.detail.value });
    this.setData({ startTime: event.detail.value });
  },

  onBudget(event) {
    const budget = event.detail.value || store.state.budget;
    store.patch({ budget });
    this.setData({ budget });
  },

  onDays(event) {
    const days = DAY_RANGE[Number(event.detail.value)] || 1;
    store.patch({ days });
    this.refresh();
  },

  onLocation(event) {
    const location = event.detail.value || this.data.location;
    store.patch({ location });
    this.setData({ location });
  },

  onPeople(event) {
    const people = PEOPLE_KEYS[Number(event.detail.value)] || PEOPLE_KEYS[1];
    store.patch({ people });
    this.refresh();
  },

  onLang() {
    i18n.toggleLang();
    this.refresh();
    wx.showToast({
      title: i18n.getLang() === "en" ? t("已切换到英文") : t("已切换到中文"),
      icon: "none",
    });
  },

  onOpenRoute() {
    wx.switchTab({ url: "/pages/route/route" });
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
          title:
            days > 1
              ? t("已生成 {v0} 天路线（演示）", { v0: days })
              : t("已按你的条件生成路线（演示）"),
          icon: "none",
          duration: 2200,
        });
      },
    });
  },
});

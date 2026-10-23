const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

const CENTRE = { latitude: 43.883, longitude: 125.324 };

Page({
  data: {
    kicker: "",
    title: "",
    subtitle: "",
    summary: [],
    navLabel: "",
    replanLabel: "",
    addLabel: "",
    removeLabel: "",
    queueLabel: "",
    minuteLabel: "",

    showDays: false,
    days: [],
    banner: "",

    hasRoute: false,
    hasPlan: false,
    latitude: CENTRE.latitude,
    longitude: CENTRE.longitude,
    scale: 11,
    markers: [],
    polyline: [],
    mapEmptyLabel: "",

    sheetTitle: "",
    sheetNote: "",
    stops: [],
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
    const map = core.routeMapModel();
    const model = day
      ? core.dayModel(day, core.parseTime(state.startTime) || 570)
      : null;
    const dayCount = (state.itinerary || []).length;

    this.setData({
      kicker: t("路线规划"),
      title:
        dayCount > 1
          ? t("长春 {v0} 日路线", { v0: dayCount })
          : t("长春一日路线"),
      subtitle: model
        ? t("{v0} 个地点 · {v1} · {v2} 开始", {
            v0: model.stops.length,
            v1: t("今天"),
            v2: state.startTime,
          })
        : t("还没有地点，先去地图添加。"),
      summary: model
        ? [
            { key: "stops", value: model.stops.length, label: t("个地点") },
            { key: "total", value: model.totals.duration, label: t("总时长") },
            { key: "travel", value: model.totals.travel, label: t("总车程") },
            { key: "budget", value: model.totals.budget, label: t("当日人均 · 估") },
          ]
        : [],
      navLabel: t("开始导航"),
      replanLabel: t("智能重排"),
      addLabel: t("＋ 添加地点"),
      removeLabel: t("移除"),
      queueLabel: t("推算等候"),
      minuteLabel: t("分钟"),

      showDays: dayCount > 1,
      days: (state.itinerary || []).map((_, index) => ({
        index,
        label: t("第 {v0} 天", { v0: index + 1 }),
        active: index === state.selectedDay,
      })),
      banner: state.lastReplan
        ? t("已重排：{v0} 换成 {v1}，省下约 {v2} 分钟", {
            v0: state.lastReplan.from,
            v1: state.lastReplan.to,
            v2: state.lastReplan.queueSaved || state.lastReplan.durationSaved || 0,
          })
        : "",

      hasRoute: map.hasRoute,
      hasPlan: Boolean(model),
      latitude: map.hasRoute ? map.latitude : CENTRE.latitude,
      longitude: map.hasRoute ? map.longitude : CENTRE.longitude,
      scale: map.hasRoute ? map.scale : 11,
      markers: map.markers,
      polyline: map.polyline,
      mapEmptyLabel: t("还没有行程"),

      sheetTitle: t("最优连接"),
      sheetNote: t("驾车优先 · 按路程估算"),
      stops: model ? model.stops : [],
      emptyBody: t("还没有地点，先去地图添加。"),
      footnote: t("排队为模型推算并附依据；车程按直线距离估算，非实时路况。"),
    });

    wx.setNavigationBarTitle({ title: t("路线") });
  },

  onDay(event) {
    const index = Number(event.currentTarget.dataset.index);
    store.patch({ selectedDay: index });
    this.refresh();
  },

  onReplan() {
    core.replan();
    this.refresh();
  },

  onNavigate() {
    const route = store.currentRoute();
    if (!route.length) {
      wx.showToast({ title: t("还没有地点，先去地图添加。"), icon: "none" });
      return;
    }
    // The web build hands this to Amap's own navigation. Here it opens the
    // system map at the first stop, which is the closest honest equivalent.
    const first = route[0];
    wx.openLocation({
      latitude: first.lat,
      longitude: first.lng,
      name: first.name,
      address: first.address || "",
      scale: 15,
    });
  },

  onAddPlace() {
    wx.switchTab({ url: "/pages/map/map" });
  },

  onRemove(event) {
    const id = event.currentTarget.dataset.id;
    const days = store.state.itinerary.slice();
    const at = store.state.selectedDay;
    if (!days[at]) return;
    days[at] = {
      route: days[at].route.filter((place) => place.id !== id),
      reasons: { ...(days[at].reasons || {}) },
    };
    store.state.itinerary = days;
    store.save();
    this.refresh();
  },
});

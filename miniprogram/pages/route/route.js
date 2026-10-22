const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

Page({
  data: {
    title: "",
    hasPlan: false,
    days: [],
    showDays: false,
    stops: [],
    tiles: [],
    replanLabel: "",
    mapLabel: "",
    replanNote: "",
    emptyTitle: "",
    emptyBody: "",
    emptyCta: "",
    labels: {},
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    wx.setNavigationBarTitle({ title: t("路线") });

    const shared = {
      title: t("当日路线"),
      replanLabel: t("智能重排"),
      mapLabel: t("在地图查看"),
      labels: {
        arrives: t("预计到达"),
        visit: t("停留"),
        queue: t("排队"),
      },
      emptyTitle: t("还没有行程"),
      emptyBody: t("先去首页生成一条路线"),
      emptyCta: t("去生成"),
    };

    const startMinutes = core.parseTime(store.state.startTime) || 570;
    const model = core.planCurrentDay(startMinutes);

    if (!model || !model.stops.length) {
      this.setData({ ...shared, hasPlan: false, stops: [] });
      return;
    }

    const days = store.state.itinerary.map((day, index) => ({
      index,
      label: t("第 {v0} 天", { v0: index + 1 }),
      active: index === store.state.selectedDay,
    }));

    const last = store.state.lastReplan;
    this.setData({
      ...shared,
      hasPlan: true,
      days,
      showDays: days.length > 1,
      stops: model.stops,
      tiles: [
        { key: "duration", label: t("总时长"), value: model.totals.duration },
        { key: "travel", label: t("路上"), value: model.totals.travel },
        { key: "queue", label: t("排队"), value: model.totals.queue },
        { key: "budget", label: t("花费"), value: model.totals.budget },
      ],
      replanNote: last
        ? t("已重排：{v0} 换成 {v1}，省下约 {v2} 分钟", {
            v0: last.from,
            v1: last.to,
            v2: last.queueSaved || last.durationSaved || 0,
          })
        : "",
    });
  },

  onDay(event) {
    store.selectDay(Number(event.currentTarget.dataset.index));
    this.refresh();
  },

  onReplan() {
    if (core.replan()) this.refresh();
  },

  onMap() {
    wx.switchTab({ url: "/pages/map/map" });
  },

  onEmpty() {
    wx.switchTab({ url: "/pages/home/home" });
  },
});

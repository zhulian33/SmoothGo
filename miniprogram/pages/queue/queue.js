const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");
const QUEUE_MODEL = require("../../utils/queue-model.js");

const { t } = i18n;

Page({
  data: {
    title: "",
    stamp: "",
    items: [],
    labels: {},
    tagLabel: "",
    refreshLabel: "",
    footnote: "",
    sourceNote: "",
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    wx.setNavigationBarTitle({ title: t("排队") });

    const now = core.currentMinutes();
    const plan = core.planCurrentDay(core.parseTime(store.state.startTime) || 570);

    // With a plan, the estimates belong to each stop's arrival slot -- that is
    // the interesting claim ("your lunch queue is 49 minutes"). Without one,
    // fall back to the hottest landmarks right now so the tab is never blank.
    let rows;
    let sourceNote;
    if (plan && plan.stops.length) {
      rows = plan.stops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        type: stop.type,
        range: stop.queueRange,
        basis: stop.queueBasis,
        arrival: stop.arrival,
        average: stop.queueAverage,
      }));
      sourceNote = t("来自当日路线");
    } else {
      rows = core.PLACES
        .filter((place) => place.featured)
        .map((place) => {
          const estimate = core.queueEstimate(place, now);
          return {
            id: place.id,
            name: place.name,
            type: place.type,
            range: `${estimate.min}–${estimate.max}`,
            basis: core.queueBasisText(place, now),
            arrival: core.timeLabel(now),
            average: estimate.average,
          };
        })
        .sort((a, b) => b.average - a.average)
        .slice(0, 8);
      sourceNote = t("现在");
    }

    const day = QUEUE_MODEL.dayFor(new Date().getDay());
    this.setData({
      title: t("排队估算"),
      stamp: `${t(day.label)} ${core.timeLabel(now)}`,
      items: rows,
      sourceNote,
      labels: { wait: t("参考等候"), basis: t("依据") },
      tagLabel: t("推算"),
      refreshLabel: t("按当前时间刷新"),
      footnote: t("推算，非实时排队数据"),
    });
  },

  onRefresh() {
    this.refresh();
    wx.showToast({ title: core.timeLabel(core.currentMinutes()), icon: "none" });
  },
});

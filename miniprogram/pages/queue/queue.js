/**
 * The queue tab, laid out the way the web build's queue view is.
 *
 * Same order as web/index.html #view-queue: a view head with the refresh
 * button, then the card list -- head line, the metrics line, the big range,
 * the basis -- then the transit-source notice at the bottom.
 *
 * What had to change:
 *   - The web cards offer "排队管家" (a demo submit) and a ticket link through
 *     the server's redirect. Both need an HTTP call, so the actions here are
 *     the two that work offline: put it on today's route, and navigate.
 *   - The rows follow today's plan when there is one, because "your lunch
 *     queue is 49 minutes" is the claim worth making. With no plan it falls
 *     back to the busiest library hotspots so the tab is never blank.
 */

const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");
const QUEUE_MODEL = require("../../utils/queue-model.js");

const { t } = i18n;

/** The web build's placeMetrics(), for the line under each card head. */
function metrics(place) {
  const rating = typeof place.rating === "number" ? String(place.rating) : t("暂无评分");
  const avg = typeof place.avg === "number" ? `¥${place.avg}` : t("人均待接入");
  const hours = place.hours || t("营业时间待确认");
  return { rating, avg, hours };
}

Page({
  data: {
    kicker: "",
    title: "",
    subtitle: "",
    stamp: "",
    sourceNote: "",
    countLabel: "",
    items: [],
    hasItems: false,
    labels: {},
    refreshLabel: "",
    emptyLabel: "",
    notice: "",
    footnote: "",
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    wx.setNavigationBarTitle({ title: t("排队") });

    const now = core.currentMinutes();
    const plan = core.planCurrentDay(core.parseTime(store.state.startTime) || 570);
    const routeIds = store.currentRoute().map((place) => place.id);

    let rows;
    let sourceNote;
    if (plan && plan.stops.length) {
      rows = plan.stops.map((stop) => {
        const place = core.PLACES.find((item) => item.id === stop.id) || {};
        const m = metrics(place);
        return {
          id: stop.id,
          name: stop.name,
          type: stop.type,
          rating: m.rating,
          avg: m.avg,
          hours: m.hours,
          source: place.source || "",
          confidence: place.confidence || "",
          range: stop.queueRange,
          basis: stop.queueBasis,
          arrival: stop.arrival,
          inRoute: true,
          addLabel: t("已加入路线"),
        };
      });
      sourceNote = t("来自当日路线");
    } else {
      rows = core.PLACES
        .filter((place) => (place.queueMax || 0) >= 20)
        .map((place) => {
          const estimate = core.queueEstimate(place, now);
          const m = metrics(place);
          return {
            id: place.id,
            name: place.name,
            type: place.type,
            rating: m.rating,
            avg: m.avg,
            hours: m.hours,
            source: place.source || "",
            confidence: place.confidence || "",
            range: `${estimate.min}–${estimate.max}`,
            basis: core.queueBasisText(place, now),
            arrival: core.timeLabel(now),
            inRoute: routeIds.includes(place.id),
            addLabel: routeIds.includes(place.id) ? t("已加入路线") : t("加入路线"),
          };
        })
        .sort((a, b) => Number(b.range.split("–")[1] || 0) - Number(a.range.split("–")[1] || 0))
        .slice(0, 12);
      sourceNote = t("现在");
    }

    const day = QUEUE_MODEL.dayFor(new Date().getDay());
    this.setData({
      kicker: t("现在 · 排队"),
      title: t("哪些地方要等，等多久"),
      subtitle: t("排队信息来自演示数据，真实产品需场地授权或用户主动上报。"),
      stamp: `${t(day.label)} ${core.timeLabel(now)} · ${sourceNote}`,
      countLabel: t("共 {v0} 个地点", { v0: rows.length }),
      items: rows,
      hasItems: rows.length > 0,
      labels: {
        wait: t("推算等候"),
        minute: t("分钟"),
        confidence: t("置信度"),
        nav: t("导航"),
        modelled: t("推算，非实时排队数据"),
      },
      refreshLabel: t("刷新估算"),
      emptyLabel: t("还没有行程，先去首页生成一条路线"),
      notice: t("公交到站时间需要对接公交集团数据源，目前未接入；请以站牌或官方 App 为准。"),
      footnote: t("等候时长为模型推算，依据写在每张卡片上"),
    });
  },

  onRefresh() {
    this.refresh();
    wx.showToast({ title: core.timeLabel(core.currentMinutes()), icon: "none" });
  },

  onNavigate(event) {
    const place = core.PLACES.find((item) => item.id === event.currentTarget.dataset.id);
    if (!place) return;
    wx.openLocation({
      latitude: place.lat,
      longitude: place.lng,
      name: place.name,
      address: place.address || place.district || "",
      scale: 18,
    });
  },

  onAdd(event) {
    const id = event.currentTarget.dataset.id;
    const place = store.resolve(id);
    if (!place) return;

    const day = store.state.itinerary[store.state.selectedDay];
    if (!day) {
      wx.showToast({ title: t("先去首页生成一条路线"), icon: "none" });
      return;
    }
    if (day.route.some((item) => item.id === id)) {
      wx.showToast({ title: t("已经在路线里"), icon: "none" });
      return;
    }

    day.route.push(place);
    store.patch({});
    wx.showToast({ title: t("已加入路线"), icon: "none" });
    this.refresh();
  },
});

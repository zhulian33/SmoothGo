const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

// Where the map opens. Changchun's People's Square, which every venue in the
// library is measured against (place.distance comes from here).
const CENTRE = { latitude: 43.883, longitude: 125.324 };

function toPoint(place) {
  return { latitude: place.lat, longitude: place.lng };
}

Page({
  data: {
    modes: [],
    activeMode: "route",
    hasRoute: false,
    latitude: CENTRE.latitude,
    longitude: CENTRE.longitude,
    scale: 11,
    markers: [],
    polyline: [],
    points: [],
    selected: null,
    footnote: "",
    countLabel: "",
    emptyLabel: "",
  },

  onShow() {
    i18n.applyTabBar();
    this.refresh();
  },

  refresh() {
    wx.setNavigationBarTitle({ title: t("地图") });

    const modes = [
      { key: "route", label: t("行程路线") },
      { key: "landmark", label: t("地标") },
    ];
    const mode = this.data.activeMode;
    const share = {
      modes,
      footnote: t("坐标为 gcj02，与微信地图一致"),
      emptyLabel: t("还没有行程"),
    };

    if (mode === "route") {
      const route = store.currentRoute();
      if (!route.length) {
        this.setData({ ...share, hasRoute: false, markers: [], polyline: [], points: [], countLabel: "" });
        return;
      }
      this.setData({
        ...share,
        hasRoute: true,
        markers: route.map((place, index) => ({
          id: index,
          ...toPoint(place),
          title: place.name,
          width: 28,
          height: 28,
        })),
        polyline: [
          {
            points: route.map(toPoint),
            color: "#0B2A2399",
            width: 5,
            dottedLine: true,
          },
        ],
        points: route.map(toPoint),
        countLabel: t("共 {v0} 个地点", { v0: route.length }),
      });
      return;
    }

    const landmarks = core.PLACES.filter((place) => place.featured);
    this.setData({
      ...share,
      hasRoute: true,
      markers: landmarks.map((place, index) => ({
        id: index,
        ...toPoint(place),
        title: place.name,
        width: 24,
        height: 24,
      })),
      polyline: [],
      points: landmarks.map(toPoint),
      countLabel: t("共 {v0} 个地点", { v0: landmarks.length }),
    });
  },

  onMode(event) {
    this.setData({ activeMode: event.currentTarget.dataset.key, selected: null }, () => {
      this.refresh();
    });
  },

  onMarkerTap(event) {
    const index = Number(event.detail.markerId);
    const list = this.data.activeMode === "route"
      ? store.currentRoute()
      : core.PLACES.filter((place) => place.featured);
    const place = list[index];
    if (!place) return;

    this.setData({
      selected: {
        name: place.name,
        type: place.type,
        wait: core.queueText(place),
        basis: core.queueBasisText(place),
        modelled: t("推算，非实时排队数据"),
      },
    });
  },
});

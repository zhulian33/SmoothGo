/**
 * The map tab, laid out the way the web build's map view is.
 *
 * Same order as web/index.html #view-map: a view head, a search box with the
 * seven filter chips, a layer bar with counts, then the map and the place
 * list under it. The desktop build puts the list beside the map; on a phone
 * it has to go below.
 *
 * Two honest differences from the web build:
 *   - No POI search block and no transit layer. Both ask Amap over HTTP, and
 *     this mini program makes none. The transport layer's "real legs" are
 *     straight-line estimates here, so the layer is not offered rather than
 *     shown with a number that would be mistaken for a live one.
 *   - The satellite and traffic chips drive the <map> component's own flags,
 *     which need no key, so they stay.
 */

const store = require("../../utils/store.js");
const i18n = require("../../utils/i18n.js");
const core = require("../../utils/core.js");

const { t } = i18n;

// Where the map opens. Changchun's People's Square, which every venue in the
// library is measured against (place.distance comes from here).
const CENTRE = { latitude: 43.883, longitude: 125.324 };

// 574 markers is a slideshow, not a map. The list stays complete; the pins
// are the nearest slice of it.
const MAX_MARKERS = 80;

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "food", label: "餐厅" },
  { key: "attraction", label: "景点" },
  { key: "featured", label: "长春特色" },
  { key: "short", label: "排队少" },
  { key: "budget", label: "人均 ¥100 以下" },
  { key: "rating", label: "4.5 分以上" },
];

const LAYERS = [
  { key: "route", label: "行程路线" },
  { key: "landmark", label: "地标" },
  { key: "attraction", label: "景点" },
  { key: "food", label: "美食" },
];

const FILTER_COUNTS = {
  landmark: () => core.PLACES.filter((place) => place.featured).length,
  attraction: () => core.PLACES.filter((place) => place.category === "attraction").length,
  food: () => core.PLACES.filter((place) => place.category === "food").length,
  route: () => store.currentRoute().length,
};

function layerPlaces(layer) {
  if (layer === "route") return store.currentRoute();
  if (layer === "landmark") return core.PLACES.filter((place) => place.featured);
  if (layer === "attraction") return core.PLACES.filter((place) => place.category === "attraction");
  if (layer === "food") return core.PLACES.filter((place) => place.category === "food");
  return core.PLACES;
}

/** The web build's filter set, minus the transport layer. */
function applyFilter(places, filter, query) {
  let result = places.filter((place) => {
    if (filter === "food") return place.category === "food";
    if (filter === "attraction") return place.category === "attraction";
    if (filter === "featured") return place.featured === true;
    if (filter === "short") return (place.queueMax || 0) <= 20;
    if (filter === "budget") return typeof place.avg === "number" && place.avg <= 100;
    if (filter === "rating") return typeof place.rating === "number" && place.rating >= 4.5;
    return true;
  });

  const needle = String(query || "").trim().toLowerCase();
  if (needle) {
    result = result.filter((place) =>
      `${place.name}${place.type}${(place.interests || []).join("")}${place.district || ""}`
        .toLowerCase()
        .includes(needle)
    );
  }
  return result;
}

/**
 * Local specialties lead the list, then the rest by distance from People's
 * Square. Same ordering rule as web/app.js filteredPlaces().
 */
function sortPlaces(places) {
  const centre = { lat: CENTRE.latitude, lng: CENTRE.longitude };
  return places.slice().sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return core.distanceKm(a, centre) - core.distanceKm(b, centre);
  });
}

function metrics(place) {
  const rating = typeof place.rating === "number" ? t("高德 {v0}", { v0: place.rating }) : t("暂无评分");
  const avg = typeof place.avg === "number" ? t("人均约 ¥{v0}", { v0: place.avg }) : t("人均待接入");
  const hours = place.hours ? t("营业 {v0}", { v0: place.hours }) : t("营业时间待确认");
  return { rating, avg, hours };
}

function placeRow(place, routeIds, selectedId) {
  const m = metrics(place);
  const inRoute = routeIds.includes(place.id);
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    badge: place.featured ? place.badge || t("长春特色") : "",
    subtitle: place.district || place.address || place.type,
    rating: m.rating,
    avg: m.avg,
    hours: m.hours,
    distance: `${core.distanceKm(place, { lat: CENTRE.latitude, lng: CENTRE.longitude }).toFixed(1)} km`,
    wait: core.queueText(place),
    basis: core.queueBasisText(place),
    inRoute,
    addLabel: inRoute ? t("已加入路线") : t("加入路线"),
    selected: place.id === selectedId,
  };
}

function toPoint(place) {
  return { latitude: place.lat, longitude: place.lng };
}

Page({
  data: {
    kicker: "",
    title: "",
    subtitle: "",
    dataNote: "",
    searchValue: "",
    searchPlaceholder: "",
    filters: [],
    activeFilter: "all",
    layers: [],
    activeLayer: "route",
    countLabel: "",
    latitude: CENTRE.latitude,
    longitude: CENTRE.longitude,
    scale: 11,
    markers: [],
    polyline: [],
    points: [],
    satellite: false,
    traffic: false,
    hasPoints: false,
    places: [],
    hasPlaces: false,
    selected: null,
    listKicker: "",
    listTitle: "",
    baseLabel: "",
    satelliteLabel: "",
    trafficLabel: "",
    labels: {},
    emptyLabel: "",
    footnote: "",
  },

  onShow() {
    i18n.applyTabBar();

    // The route layer is the most useful one, but with no plan it is an empty
    // map. Fall back to the landmarks, which is what the web build shows you
    // before anything is planned.
    let layer = this.data.activeLayer || "route";
    if (layer === "route" && store.currentRoute().length === 0) layer = "landmark";
    this.setData({ activeLayer: layer }, () => this.refresh());
  },

  refresh() {
    wx.setNavigationBarTitle({ title: t("地图") });

    const layer = this.data.activeLayer || "route";
    const filter = this.data.activeFilter || "all";
    const query = this.data.searchValue || "";
    const routeIds = store.currentRoute().map((place) => place.id);
    const selectedId = this.data.selected ? this.data.selected.id : "";

    const scoped = layerPlaces(layer);
    const shown = sortPlaces(applyFilter(scoped, filter, query));

    // The route layer is the only one with legs to draw, and it is the one
    // that must come back shaped for a polyline even when the plan is empty.
    const isRoute = layer === "route";
    const pins = shown.slice(0, MAX_MARKERS);

    const selected = this.data.selected
      ? this.describe(this.data.selected.id)
      : null;

    this.setData({
      kicker: t("地图 · 全城"),
      title: t("长春的地点都在这一张图上"),
      subtitle: t("点地图标注或下方地点卡片，查看营业时间、参考等候和票务入口。"),
      dataNote: t("图片已省略 · 评分与营业时间来自地点库 · 人均与等候为估算"),
      searchPlaceholder: t("搜索长春的餐厅、景点"),
      filters: FILTERS.map((item) => ({ key: item.key, label: t(item.label) })),
      layers: LAYERS.map((item) => ({
        key: item.key,
        label: t(item.label),
        count: FILTER_COUNTS[item.key](),
      })),
      countLabel: t("长春 · {v0} 个地点", { v0: shown.length }),
      activeFilter: filter,
      activeLayer: layer,
      points: pins.map(toPoint),
      hasPoints: pins.length > 0,
      markers: pins.map((place, index) => ({
        id: index,
        ...toPoint(place),
        title: place.name,
        width: 28,
        height: 28,
      })),
      polyline: isRoute && shown.length > 1
        ? [{ points: shown.map(toPoint), color: "#111111CC", width: 5, dottedLine: true }]
        : [],
      scale: isRoute ? 12 : 11,
      places: shown.map((place) => placeRow(place, routeIds, selectedId)),
      hasPlaces: shown.length > 0,
      selected,
      listKicker: t("地点"),
      listTitle: t("地点列表"),
      baseLabel: t("底图"),
      satelliteLabel: t("卫星"),
      trafficLabel: t("实时路况"),
      labels: {
        nav: t("导航"),
        wait: t("推算等候"),
        modelled: t("推算，非实时排队数据"),
        minute: t("分钟"),
      },
      emptyLabel: t("没有符合条件的地点，换个筛选试试"),
      footnote: t("坐标为 gcj02，与微信地图一致"),
    });
  },

  /** The card under the map: everything the web build's selected card shows. */
  describe(id) {
    const place = core.PLACES.find((item) => item.id === id);
    if (!place) return null;
    const m = metrics(place);
    const routeIds = store.currentRoute().map((item) => item.id);
    const inRoute = routeIds.includes(place.id);
    return {
      id: place.id,
      name: place.name,
      type: place.type,
      subtitle: place.district || place.address || place.type,
      rating: m.rating,
      avg: m.avg,
      hours: m.hours,
      distance: `${core.distanceKm(place, { lat: CENTRE.latitude, lng: CENTRE.longitude }).toFixed(1)} km`,
      wait: core.queueText(place),
      basis: core.queueBasisText(place),
      modelled: t("推算，非实时排队数据"),
      inRoute,
      addLabel: inRoute ? t("已加入路线") : t("加入路线"),
    };
  },

  onSearch(event) {
    this.setData({ searchValue: event.detail.value || "" }, () => this.refresh());
  },

  onClearSearch() {
    this.setData({ searchValue: "" }, () => this.refresh());
  },

  onFilter(event) {
    this.setData({ activeFilter: event.currentTarget.dataset.key }, () => this.refresh());
  },

  onMode(event) {
    this.setData({ activeLayer: event.currentTarget.dataset.key }, () => this.refresh());
  },

  onSatellite() {
    this.setData({ satellite: !this.data.satellite });
  },

  onTraffic() {
    this.setData({ traffic: !this.data.traffic });
  },

  onMarkerTap(event) {
    const place = sortPlaces(
      applyFilter(layerPlaces(this.data.activeLayer), this.data.activeFilter, this.data.searchValue)
    )[Number(event.detail.markerId)];
    if (!place) return;
    this.setData({ selected: this.describe(place.id) }, () => this.refresh());
  },

  onSelectPlace(event) {
    const place = core.PLACES.find((item) => item.id === event.currentTarget.dataset.id);
    if (!place) return;
    this.setData({
      selected: this.describe(place.id),
      latitude: place.lat,
      longitude: place.lng,
      scale: 15,
    }, () => this.refresh());
  },

  onNavigate(event) {
    const id = event.currentTarget.dataset.id;
    const place = core.PLACES.find((item) => item.id === id);
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

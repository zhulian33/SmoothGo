const PLACES = [
  {
    id: "jingyuetan",
    name: "净月潭",
    type: "自然 · 半日",
    category: "attraction",
    rating: 4.7,
    avg: 60,
    distance: 21,
    lng: 125.449,
    lat: 43.786,
    queueMin: 18,
    queueMax: 25,
    hours: "08:00–17:00",
    ticket: "¥30",
    visit: 90,
    travel: 25,
    x: 18,
    y: 28,
    interests: ["自然", "摄影", "亲子"],
    source: "本地整理",
    confidence: "中",
    icon: "i-palace"
  },
  {
    id: "the-hill",
    name: "这有山",
    // An indoor hill-town you wander for an hour or two -- Amap types it 步行街
    // under 购物服务. It was filed as food here, which made the planner spend
    // the day's single meal slot on a shopping street instead of a restaurant.
    type: "商业 · 室内小镇",
    category: "attraction",
    rating: 4.6,
    avg: 60,
    distance: 3.1,
    lng: 125.291,
    lat: 43.857,
    queueMin: 25,
    queueMax: 35,
    hours: "10:00–22:00",
    ticket: "免费入内",
    visit: 75,
    travel: 16,
    x: 55,
    y: 47,
    interests: ["美食", "摄影", "城市"],
    source: "本地整理",
    confidence: "中",
    icon: "i-palace"
  },
  {
    id: "imperial",
    name: "伪满皇宫",
    type: "历史 · 室内",
    category: "attraction",
    rating: 4.7,avg: 30,
    distance: 5.4,
    lng: 125.350,
    lat: 43.901,
    queueMin: 30,
    queueMax: 45,
    hours: "08:30–17:20",
    ticket: "¥70",
    visit: 75,
    travel: 18,
    x: 67,
    y: 59,
    interests: ["历史", "摄影"],
    source: "本地整理",
    confidence: "中",
    icon: "i-palace"
  },
  {
    id: "film",
    name: "长影世纪城",
    type: "电影 · 亲子",
    category: "attraction",
    rating: 4.6,avg: 150,
    distance: 12,
    lng: 125.269,
    lat: 43.783,
    queueMin: 20,
    queueMax: 30,
    hours: "09:00–17:00",
    ticket: "¥180",
    visit: 120,
    travel: 30,
    x: 37,
    y: 33,
    interests: ["电影", "亲子", "摄影"],
    source: "本地整理",
    confidence: "中",
    icon: "i-route"
  },
  {
    id: "guilin",
    name: "桂林路",
    type: "街区 · 小吃",
    category: "food",
    rating: 4.5,avg: 45,
    distance: 4.2,
    lng: 125.310,
    lat: 43.842,
    queueMin: 10,
    queueMax: 18,
    hours: "全天",
    ticket: "无需门票",
    visit: 60,
    travel: 8,
    x: 48,
    y: 64,
    interests: ["美食", "夜生活"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "southlake",
    name: "南湖公园",
    type: "自然 · 休闲",
    category: "attraction",
    rating: 4.3,
    avg: 0,
    distance: 2.2,
    lng: 125.306,
    lat: 43.852,
    queueMin: 5,
    queueMax: 10,
    hours: "05:00–22:00",
    ticket: "免费",
    visit: 60,
    travel: 20,
    x: 30,
    y: 71,
    interests: ["自然", "休闲"],
    source: "本地整理",
    confidence: "中",
    icon: "i-palace"
  },
  {
    id: "culture-square",
    name: "文化广场",
    type: "城市 · 休闲",
    category: "attraction",
    rating: 4.4,
    avg: 0,
    distance: 2.8,
    lng: 125.323,
    lat: 43.882,
    queueMin: 3,
    queueMax: 8,
    hours: "全天",
    ticket: "免费",
    visit: 40,
    travel: 12,
    x: 42,
    y: 38,
    interests: ["休闲", "摄影"],
    source: "本地整理",
    confidence: "中",
    icon: "i-pin"
  },
  {
    id: "hongqi",
    name: "红旗街",
    type: "商圈 · 美食",
    category: "food",
    rating: 4.4,avg: 70,
    distance: 3.8,
    lng: 125.285,
    lat: 43.860,
    queueMin: 15,
    queueMax: 25,
    hours: "10:00–22:00",
    ticket: "无需门票",
    visit: 60,
    travel: 14,
    x: 30,
    y: 53,
    interests: ["美食", "购物"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "zoo",
    name: "长春动植物公园",
    type: "亲子 · 自然",
    category: "attraction",
    rating: 4.5,
    avg: 60,
    distance: 6.3,
    lng: 125.300,
    lat: 43.866,
    queueMin: 12,
    queueMax: 22,
    hours: "08:30–16:30",
    ticket: "¥60",
    visit: 100,
    travel: 22,
    x: 26,
    y: 23,
    interests: ["亲子", "自然"],
    source: "本地整理",
    confidence: "中",
    icon: "i-palace"
  },
  {
    id: "chongqing-road",
    name: "重庆路",
    type: "商圈 · 小吃",
    category: "food",
    rating: 4.4,avg: 45,
    distance: 3.5,
    lng: 125.332,
    lat: 43.886,
    queueMin: 18,
    queueMax: 28,
    hours: "10:00–22:00",
    ticket: "无需门票",
    visit: 60,
    travel: 13,
    x: 52,
    y: 35,
    interests: ["美食", "购物"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "changying-old",
    name: "长影旧址博物馆",
    type: "电影 · 历史",
    category: "attraction",
    rating: 4.6,avg: 30,
    distance: 4.9,
    lng: 125.285,
    lat: 43.845,
    queueMin: 8,
    queueMax: 15,
    hours: "09:00–17:00",
    ticket: "¥80",
    visit: 70,
    travel: 16,
    x: 44,
    y: 28,
    interests: ["电影", "历史"],
    source: "本地整理",
    confidence: "中",
    icon: "i-route"
  },
  {
    id: "people-square",
    name: "人民广场",
    type: "城市 · 休闲",
    category: "attraction",
    rating: 4.3,
    avg: 0,
    distance: 2.6,
    lng: 125.323,
    lat: 43.871,
    queueMin: 5,
    queueMax: 12,
    hours: "全天",
    ticket: "免费",
    visit: 40,
    travel: 10,
    x: 50,
    y: 58,
    interests: ["休闲", "摄影"],
    source: "本地整理",
    confidence: "中",
    icon: "i-pin"
  },
  {
    id: "louwailou",
    name: "楼外楼",
    type: "东北菜 · 本地推荐",
    category: "food",
    rating: 4.6,avg: 70,
    distance: 3.4,
    lng: 125.305,
    lat: 43.862,
    queueMin: 20,
    queueMax: 30,
    hours: "10:30–21:00",
    ticket: "订座",
    visit: 75,
    travel: 14,
    x: 41,
    y: 50,
    interests: ["美食", "历史", "摄影"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "yuanshengju",
    name: "元盛居",
    type: "火锅 · 本地推荐",
    category: "food",
    rating: 4.5,avg: 95,
    distance: 2.9,
    lng: 125.318,
    lat: 43.865,
    queueMin: 30,
    queueMax: 45,
    hours: "10:00–22:00",
    ticket: "订座",
    visit: 90,
    travel: 12,
    x: 45,
    y: 54,
    interests: ["美食", "聚餐"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "dasheke",
    name: "大食客·非遗吉菜",
    type: "吉菜 · 本地推荐",
    category: "food",
    rating: 4.6,avg: 70,
    distance: 3.8,
    lng: 125.300,
    lat: 43.850,
    queueMin: 20,
    queueMax: 35,
    hours: "10:30–21:30",
    ticket: "订座",
    visit: 80,
    travel: 15,
    x: 39,
    y: 43,
    interests: ["美食", "历史"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "donglu",
    name: "董鲁烤鸭（云琅店）",
    type: "烤鸭 · 聚餐",
    category: "food",
    rating: 4.6,avg: 70,
    distance: 4.4,
    lng: 125.310,
    lat: 43.860,
    queueMin: 25,
    queueMax: 40,
    hours: "10:30–21:30",
    ticket: "订座",
    visit: 85,
    travel: 16,
    x: 47,
    y: 39,
    interests: ["美食", "聚餐"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "qianfeng",
    name: "钱锋炭缸烧烤",
    type: "烧烤 · 夜宵",
    category: "food",
    rating: 4.5,avg: 95,
    distance: 5.2,
    lng: 125.320,
    lat: 43.830,
    queueMin: 20,
    queueMax: 35,
    hours: "16:00–02:00",
    ticket: "订座",
    visit: 75,
    travel: 18,
    x: 54,
    y: 60,
    interests: ["美食", "夜生活"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "tufengzheng",
    name: "土风筝牛腱面",
    type: "面馆 · 快餐",
    category: "food",
    rating: 4.5,
    avg: 35,
    distance: 3.6,
    lng: 125.330,
    lat: 43.850,
    queueMin: 8,
    queueMax: 15,
    hours: "10:00–20:30",
    ticket: "无需订座",
    visit: 45,
    travel: 12,
    x: 58,
    y: 45,
    interests: ["美食"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "haihua",
    name: "海华鱿鱼蒸饺",
    type: "蒸饺 · 本地小吃",
    category: "food",
    rating: 4.6,avg: 35,
    distance: 4.1,
    lng: 125.340,
    lat: 43.840,
    queueMin: 12,
    queueMax: 22,
    hours: "09:30–20:00",
    ticket: "无需订座",
    visit: 45,
    travel: 14,
    x: 62,
    y: 52,
    interests: ["美食"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "700cc",
    name: "700CC",
    type: "饮品 · 奶茶",
    category: "food",
    rating: 4.4,avg: 25,
    distance: 3.1,
    lng: 125.290,
    lat: 43.840,
    queueMin: 5,
    queueMax: 12,
    hours: "10:00–22:00",
    ticket: "无需订座",
    visit: 25,
    travel: 10,
    x: 35,
    y: 57,
    interests: ["美食", "休闲"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "maquez",
    name: "麻雀牌小龙虾",
    type: "小龙虾 · 夜宵",
    category: "food",
    rating: 4.5,avg: 95,
    distance: 5.5,
    lng: 125.350,
    lat: 43.830,
    queueMin: 20,
    queueMax: 35,
    hours: "16:30–01:00",
    ticket: "订座",
    visit: 75,
    travel: 20,
    x: 64,
    y: 61,
    interests: ["美食", "夜生活"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "jiumi",
    name: "久覔·绵绵冰·简餐",
    type: "甜品 · 简餐",
    category: "food",
    rating: 4.4,
    avg: 45,
    distance: 3.9,
    lng: 125.300,
    lat: 43.820,
    queueMin: 8,
    queueMax: 16,
    hours: "11:00–22:00",
    ticket: "无需订座",
    visit: 45,
    travel: 13,
    x: 43,
    y: 62,
    interests: ["美食", "休闲"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  },
  {
    id: "dache",
    name: "大车砂锅土豆粉",
    type: "砂锅 · 小吃",
    category: "food",
    rating: 4.4,avg: 35,
    distance: 4.6,
    lng: 125.320,
    lat: 43.810,
    queueMin: 10,
    queueMax: 20,
    hours: "10:00–21:00",
    ticket: "无需订座",
    visit: 45,
    travel: 15,
    x: 49,
    y: 68,
    interests: ["美食"],
    source: "本地整理",
    confidence: "中",
    icon: "i-food"
  }
];

// Real Changchun places harvested from the Amap POI API (see places.poi.js).
// Optional so the page still works if that file is missing.
// The hand-written entries carry the full demo data, so they win on a collision
// -- otherwise 净月潭 shows up twice, once rich and once hollow. Names are
// compared after stripping the 长春 prefix and official suffixes, because the
// two sources spell the same place differently (南湖 vs 南湖公园).
const placeNameKey = (name) => {
  const stripped = String(name)
    .replace(/^长春市?/, "")
    .replace(/(国家森林公园|国家级风景名胜区|风景名胜区|旅游景区|风景区|景区|公园)$/, "");
  return stripped.length >= 2 ? stripped : String(name);
};
// Amap names a chain branch 元盛居(亚泰大街店); the hand-written row is just
// 元盛居. Stripping the branch suffix lets the curated card borrow the photo and
// rating of whichever branch Amap returned first.
const chainKey = (name) =>
  placeNameKey(name)
    .replace(/[（(][^）)]*[）)]/g, "")
    .trim();
// Generic tail Amap appends to a street POI: 桂林路 -> 桂林路商业街.
const STREET_SUFFIX = /(商业街|步行街|商圈)$/;

if (typeof POI_GENERATED_PLACES !== "undefined") {
  const generatedByKey = new Map();
  const generatedByChain = new Map();
  POI_GENERATED_PLACES.forEach((place) => {
    const key = placeNameKey(place.name);
    if (!generatedByKey.has(key)) generatedByKey.set(key, place);
    const chain = chainKey(place.name);
    if (!generatedByChain.has(chain)) generatedByChain.set(chain, place);
  });
  // The hand-written rows predate the Amap harvest and carry invented demo
  // ratings with no photo. When Amap knows the same place, its real rating,
  // opening hours and photo win -- otherwise one card shows 点评 4.7 (made up)
  // next to another showing a real Amap score.
  PLACES.forEach((place) => {
    const amap =
      generatedByKey.get(placeNameKey(place.name)) ||
      generatedByChain.get(chainKey(place.name)) ||
      // Last resort for a curated row whose Amap name carries a long suffix:
      // 楼外楼 vs 楼外楼大刀肉传统火锅居(幸福街店). The length guard keeps a
      // two-character stub from latching onto an unrelated shop.
      (place.name.length >= 3
        ? POI_GENERATED_PLACES.find((row) => row.name.startsWith(place.name))
        : null);
    if (!amap) return;
    if (amap.photo && !place.photo) {
      place.photo = amap.photo;
      place.photos = amap.photos;
    } else if (amap.photos?.length && !place.photos?.length) {
      place.photos = amap.photos;
    }
    if (amap.rating) {
      place.rating = amap.rating;
      place.ratingSource = "高德";
    }
    if (amap.hours) place.hours = amap.hours;
  });
  const curatedNames = new Set(PLACES.map((place) => placeNameKey(place.name)));
  PLACES.push(
    ...POI_GENERATED_PLACES.filter((place) => {
      if (curatedNames.has(placeNameKey(place.name))) return false;
      // 桂林路 vs the harvested 桂林路商业街: one street, two cards. Strip the
      // generic street suffix and compare again so the curated row wins.
      const stripped = place.name.replace(STREET_SUFFIX, "");
      return stripped === place.name || !curatedNames.has(placeNameKey(stripped));
    })
  );
}

// Shopping streets are typed 地名地址信息 by Amap and get filtered out of the
// harvest, and the small snack shops sit below its search threshold, so those
// photos are collected by exact name in scripts/ and shipped as a small table.
if (typeof CURATED_PHOTOS !== "undefined") {
  PLACES.forEach((place) => {
    if (!place.photo && CURATED_PHOTOS[place.name]) {
      place.photo = CURATED_PHOTOS[place.name];
    }
  });
}

// The hand-written 23 are not automatically "specialties" -- 桂林路 and 重庆路
// are generic shopping streets and 700CC is a chain with branches nationwide.
// Only the ones below earn a badge; everything else stays unmarked so the
// badge keeps its meaning.
// Rank drives list order for specialties: lower is more iconic. Landmarks use
// 0-99, food 100+, matching featured_rank() in scripts/build_places.py so the
// hand-written and harvested entries interleave instead of forming two blocks.
const CURATED_BADGES = {
  净月潭: ["长春地标", 0],
  伪满皇宫: ["长春地标", 10],
  长影世纪城: ["长春地标", 20],
  长影旧址博物馆: ["长春地标", 30],
  南湖公园: ["长春地标", 40],
  长春动植物公园: ["长春地标", 146],
  元盛居: ["长春名吃", 100],
  大食客·非遗吉菜: ["长春名吃", 101],
  "董鲁烤鸭（云琅店）": ["长春名吃", 102],
  钱锋炭缸烧烤: ["长春名吃", 103],
  土风筝牛腱面: ["长春名吃", 104],
  海华鱿鱼蒸饺: ["长春名吃", 105]
};
PLACES.forEach((place) => {
  const curated = CURATED_BADGES[place.name];
  if (curated) {
    place.featured = true;
    place.badge = curated[0];
    place.rank = curated[1];
  } else if (typeof place.featured !== "boolean") {
    place.featured = false;
  }
});

const PLACE_DETAILS = {
  jingyuetan: {
    subtitle: "自然景点 · 《人世间》取景地 · 环潭约17km · 建议5h",
    description: "长春最适合慢走的一片森林与水域，适合把一上午留给步道、湖面和树影。",
    recommended: [],
    deal: "",
    ticketTypes: [{ name: "成人票", price: 30 }]
  },
  "the-hill": {
    subtitle: "室内文旅商业 · 美食/拍照 · 建议1.5h",
    description: "把餐饮、山体空间和城市拍照放在一起的室内街区，适合作为雨天的午餐停留点。",
    recommended: ["锅包肉", "烤冷面", "东北菜"],
    deal: "双人小吃组合 ¥98",
    ticketTypes: []
  },
  imperial: {
    subtitle: "历史景点 · 《人世间》缉熙楼取景地 · 建议2h",
    description: "末代皇帝溥仪在长春的宫廷旧址，建筑和展览都适合慢慢看。",
    recommended: [],
    deal: "",
    ticketTypes: [{ name: "成人票", price: 70 }]
  },
  film: {
    subtitle: "电影主题公园 · 亲子 · 建议4h",
    description: "以电影工业和特效体验为主的主题公园，适合带孩子或留出完整半天。",
    recommended: [],
    deal: "",
    ticketTypes: [{ name: "成人票", price: 180 }]
  },
  guilin: {
    subtitle: "美食街区 · 小吃 · 建议1.5h",
    description: "长春本地小吃和夜间烟火气比较集中的街区，适合边逛边吃。",
    recommended: ["烤冷面", "烤串", "冰糖葫芦"],
    deal: "小吃组合 ¥39",
    ticketTypes: []
  },
  southlake: {
    subtitle: "城市公园 · 《人世间》取景地 · 建议1h",
    description: "市区里适合散步和看落日的公园，也是《人世间》的取景地之一。",
    recommended: [],
    deal: "",
    ticketTypes: []
  },
  "culture-square": {
    subtitle: "城市广场 · 拍照 · 建议0.5h",
    description: "长春的城市公共空间，适合路过时停留拍照，不需要专门安排太久。",
    recommended: [],
    deal: "",
    ticketTypes: []
  },
  hongqi: {
    subtitle: "商圈美食 · 建议1.5h",
    description: "购物、餐饮和城市生活混在一起的商圈，适合作为路线中的补给点。",
    recommended: ["东北菜", "烤肉"],
    deal: "双人餐 ¥128",
    ticketTypes: []
  },
  zoo: {
    subtitle: "亲子自然 · 建议3h",
    description: "适合家庭游客的动植物公园，步行距离较长，建议留出完整半天。",
    recommended: [],
    deal: "",
    ticketTypes: [{ name: "成人票", price: 60 }]
  },
  "chongqing-road": {
    subtitle: "商圈小吃 · 建议1h",
    description: "市中心的老牌商圈，适合快速吃饭和补充物资。",
    recommended: ["小吃", "甜品"],
    deal: "小吃券 ¥49",
    ticketTypes: []
  },
  "changying-old": {
    subtitle: "电影历史 · 《人世间》人民电影院取景地 · 建议1.5h",
    description: "长影旧址博物馆保留了长春电影工业的记忆，也是《人世间》的取景地。",
    recommended: [],
    deal: "",
    ticketTypes: [{ name: "成人票", price: 80 }]
  },
  "people-square": {
    subtitle: "城市广场 · 建议0.5h",
    description: "适合在城市中心短暂停留、换乘和拍照的公共空间。",
    recommended: [],
    deal: "",
    ticketTypes: []
  },
  louwailou: {
    subtitle: "东北菜 · 本地推荐 · 建议1.5h",
    description: "适合想吃一顿正经东北菜的午餐点，建议提前看排队和订座。",
    recommended: ["锅包肉", "雪衣豆沙", "东北乱炖"],
    deal: "双人餐 ¥168",
    ticketTypes: []
  },
  yuanshengju: {
    subtitle: "火锅 · 本地推荐 · 建议1.5h",
    description: "长春本地人常去的火锅选择，适合晚餐或冷天的一顿热食。",
    recommended: ["手切羊肉", "麻酱", "糖蒜"],
    deal: "四人餐 ¥298",
    ticketTypes: []
  },
  dasheke: {
    subtitle: "非遗吉菜 · 本地推荐 · 建议1.5h",
    description: "来自长春美食合集的本地吉菜选择，适合想认真吃一顿东北菜的午餐或晚餐。",
    recommended: ["锅包肉", "吉菜", "东北菜"],
    deal: "双人吉菜套餐（演示）",
    ticketTypes: []
  },
  donglu: {
    subtitle: "烤鸭 · 聚餐 · 建议1.5h",
    description: "适合多人聚餐的烤鸭店，建议先看排队和订座情况。",
    recommended: ["烤鸭", "京味菜", "凉菜"],
    deal: "四人烤鸭套餐（演示）",
    ticketTypes: []
  },
  qianfeng: {
    subtitle: "炭缸烧烤 · 夜宵 · 建议1.5h",
    description: "适合晚上和朋友一起吃的烧烤，排队通常集中在晚餐后。",
    recommended: ["炭缸烧烤", "烤串", "东北烧烤"],
    deal: "双人烧烤套餐（演示）",
    ticketTypes: []
  },
  tufengzheng: {
    subtitle: "牛腱面 · 快餐 · 建议45分钟",
    description: "适合路线中快速解决一顿的面馆，排队短、停留时间也短。",
    recommended: ["牛腱面", "小菜"],
    deal: "单人面套餐（演示）",
    ticketTypes: []
  },
  haihua: {
    subtitle: "鱿鱼蒸饺 · 本地小吃 · 建议45分钟",
    description: "偏本地小吃的一顿，适合想尝试东北特色主食的人。",
    recommended: ["鱿鱼蒸饺", "蒸饺", "小菜"],
    deal: "双人小吃套餐（演示）",
    ticketTypes: []
  },
  "700cc": {
    subtitle: "饮品 · 奶茶 · 建议20分钟",
    description: "适合路线中补充饮品和休息，不需要专门安排一顿正餐。",
    recommended: ["奶茶", "果茶"],
    deal: "双杯饮品券（演示）",
    ticketTypes: []
  },
  maquez: {
    subtitle: "小龙虾 · 夜宵 · 建议1.5h",
    description: "适合晚餐或夜宵的小龙虾店，旺季排队时间可能更长。",
    recommended: ["小龙虾", "夜宵"],
    deal: "双人小龙虾套餐（演示）",
    ticketTypes: []
  },
  jiumi: {
    subtitle: "绵绵冰 · 简餐 · 建议45分钟",
    description: "适合下午休息的甜品和简餐点，适合放在两段景点之间。",
    recommended: ["绵绵冰", "简餐", "甜品"],
    deal: "双人甜品套餐（演示）",
    ticketTypes: []
  },
  dache: {
    subtitle: "砂锅土豆粉 · 小吃 · 建议45分钟",
    description: "适合快速吃一顿的砂锅小吃，适合作为路线中的轻量补给。",
    recommended: ["砂锅土豆粉", "砂锅"],
    deal: "单人砂锅套餐（演示）",
    ticketTypes: []
  }
};

PLACES.forEach((place) => Object.assign(place, PLACE_DETAILS[place.id] || {}));

// Static reference rows, not a live feed. They used to promise "2 分钟后到站"
// and "人民大街 南向北拥堵 · +8 分钟" -- numbers nothing in this app measures.
// Kept because the transport layer needs somewhere to put its markers, but the
// copy now describes the line rather than pretending to know its state.
// Real arrivals need a 公交/地铁 data agreement; the traffic layer toggle does
// use AMap's own live tile layer, so that one is genuine.
const TRANSPORT_STATUS = [
  {
    id: "bus-42",
    name: "42 路",
    type: "公交线路",
    detail: "开往净月潭方向 · 到站时间未接入",
    status: "未接入",
    lng: 125.315,
    lat: 43.855,
    x: 46,
    y: 44
  },
  {
    id: "metro-3",
    name: "轻轨 3 号线",
    type: "轨道交通",
    detail: "运营时间与班次以官方为准",
    status: "未接入",
    lng: 125.330,
    lat: 43.870,
    x: 58,
    y: 53
  },
  {
    id: "people-road",
    name: "人民大街",
    type: "主要道路",
    detail: "打开地图右上角路况图层查看实时拥堵",
    status: "见路况图层",
    lng: 125.323,
    lat: 43.860,
    x: 51,
    y: 58
  }
];

const CONFIG = window.SMOOTHGO_CONFIG || {};
const AMAP_KEY = String(CONFIG.amapKey || "").trim();
const AMAP_SECURITY = String(CONFIG.amapSecurityJsCode || "").trim();
const API_BASE = String(CONFIG.apiBaseUrl || "").replace(/\/$/, "");
const AUTH_MODE = CONFIG.authMode === "real" ? "real" : "demo";
const AUTH_TOKEN_KEY = "smoothgo_token";
const ACTIVE_QUEUE_KEY = "smoothgo_active_queue";
const DISMISSED_QUEUE_KEY = "smoothgo_dismissed_queue_id";
let amapReady = false;
let amapLoadStarted = false;
let amapLoadPromise = null;
const amapInstances = new WeakMap();
const amapBaseLayers = new WeakMap();
const geolocationRequested = new WeakSet();
const MAP_CLUSTER_THRESHOLD = 60;
const amapClusters = new WeakMap();
const PLANNER = window.SmoothGoPlanner;
let queueTimers = [];

const state = {
  view: "home",
  loggedIn: false,
  user: null,
  route: ["jingyuetan", "the-hill", "imperial"],
  itinerary: [
    { route: ["jingyuetan", "the-hill", "imperial"], reasons: {} }
  ],
  selectedDay: 0,
  selectedMapPlace: "the-hill",
  mapLayer: "all",
  mapFilter: "all",
  mapSearch: "",
  mapType: "standard",
  trafficVisible: false,
  interests: new Set(["自然", "历史"]),
  startTime: "09:30",
  budget: "¥300–500",
  people: "2 位成人",
  location: "长春市朝阳区",
  queuePlace: null,
  queueMinutes: 30,
  currentPosition: null,
  modalPlace: null,
  ticketPlace: null,
  ticketTypeIndex: 0,
  ticketQuantity: 1,
  routeReasons: {},
  lastReplan: null,
  queueRequests: [],
  queueQuota: { limit: 2, used: 0, remaining: 2 },
  activeQueue: null,
  pendingQueuePlace: null,
  poiResults: []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const placeById = (id) => PLACES.find((place) => place.id === id);
const dateLabelForOffset = (offset = 0, includeWeekday = true) => {
  const date = new Date();
  date.setDate(date.getDate() + Number(offset || 0));
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const base = `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  return includeWeekday ? `${base} · ${weekdays[date.getDay()]}` : base;
};
const todayLabel = dateLabelForOffset(0);

function icon(id) {
  return `<svg class="icon" aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function placeMetrics(place) {
  return {
    // It is Amap's own star rating, not a Dianping score -- say so rather than
    // letting the old 点评 label imply a source we never had.
    // 暂无评分, not 评分待接入: Amap simply has no score for these four (small
    // memorial halls, one sculpture). "待接入" would promise a source that does
    // not exist for them.
    rating: place.rating ? `高德 ${place.rating}` : "暂无评分",
    // avg is a band derived from the POI sub-category, so 约 is load-bearing.
    avg: typeof place.avg === "number" ? `人均约 ¥${place.avg}` : "人均待接入",
    hours: place.hours ? `营业 ${place.hours}` : "营业时间待确认",
    ticket: place.ticket || "票务待接入"
  };
}

function markerPopover(place) {
  const metrics = placeMetrics(place);
  return `<span class="marker-popover"><strong>${place.name}</strong><span>${place.subtitle || place.type}</span><em>${metrics.rating} · ${metrics.avg}<br />参考等候 ${queueText(place)} 分钟 · 非实时</em></span>`;
}

function formatMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = Math.round(total % 60);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function parseTime(value) {
  const match = String(value).match(/(\d{1,2})[：:](\d{2})/);
  if (!match) return 9 * 60 + 30;
  return Number(match[1]) * 60 + Number(match[2]);
}

function timeLabel(minutes) {
  const h = Math.floor((minutes % (24 * 60)) / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function queueText(place) {
  return `${place.queueMin}–${place.queueMax}`;
}

function navigationUrl(place) {
  if (!place) return "";
  const destination = `${place.lng},${place.lat},${encodeURIComponent(place.name)}`;
  const origin = state.currentPosition
    ? `from=${state.currentPosition[0]},${state.currentPosition[1]},${encodeURIComponent("当前位置")}&`
    : "";
  return (
    `https://uri.amap.com/navigation?${origin}to=${destination}` +
    "&mode=car&policy=1&src=SmoothGo&coordinate=gaode&callnative=1"
  );
}

function openNavigation(place) {
  if (!place) return;
  window.open(navigationUrl(place), "_blank", "noopener");
  showToast(`正在打开高德导航：${place.name}`);
}

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

// The old build carried a hand-tuned table keyed by slug ids
// (jingyuetan/the-hill/imperial/...). Those 7 ids belonged to the original 19
// hand-written rows and no longer exist now that the Amap harvest replaced the
// library, so every call silently fell through to a Manhattan distance over the
// 0-100 demo grid. Real coords are present, so measure them instead.
//
// Straight-line km understates city driving: roads detour (x1.35) and the urban
// average including signals is about 26 km/h. The 8 minute floor covers parking
// and the walk in; the 90 minute ceiling stops one bad pair from dominating a
// day's score.
const travelCache = new Map();

function travelBetween(from, to) {
  if (!from || !to) return 15;
  if (from.id === to.id) return 0;
  if (!Number.isFinite(from.lat) || !Number.isFinite(to.lat)) return 15;
  const key = from.id < to.id ? `${from.id}|${to.id}` : `${to.id}|${from.id}`;
  const cached = travelCache.get(key);
  if (cached !== undefined) return cached;
  const km = distanceKm(from, to);
  const minutes = Math.max(8, Math.min(90, Math.round(((km * 1.35) / 26) * 60)));
  travelCache.set(key, minutes);
  return minutes;
}

function transportOptions(from, to) {
  const drive = travelBetween(from, to);
  const bus = drive + 14 + (drive > 18 ? 4 : 0);
  const taxi = Math.max(12, Math.round(PLACES.find((p) => p.id === to.id)?.distance * 3.4 || drive * 0.8));
  return [
    { mode: "car", label: `驾车 ${drive} 分钟`, active: true },
    { mode: "bus", label: `公交 ${bus} 分钟`, active: false },
    { mode: "taxi", label: `打车 ¥${taxi}`, active: false }
  ];
}

function buildSchedule(route = state.route) {
  const summary = PLANNER.summarize(
    route.map(placeById).filter(Boolean),
    parseTime(state.startTime),
    travelBetween
  );
  return { ...summary, total: summary.totalDuration };
}

function routePath() {
  const points = [{ x: 36, y: 70 }, ...state.route.map(placeById).filter(Boolean).map((p) => ({ x: p.x, y: p.y }))];
  if (points.length < 2) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${(point.x / 100) * 600} ${(point.y / 100) * 400}`)
    .join(" ");
}

function mapBackground() {
  return `
    <svg class="map-svg" viewBox="0 0 600 400" role="img" aria-label="长春示意地图">
      <rect width="600" height="400" fill="#f2f2f2" />
      <g fill="#e7e7e7" stroke="#d4d4d4" stroke-width="0.7">
        <path d="M0 30h112v66H0zM138 18h102v55H138zM266 16h126v70H266zM416 23h184v64H416zM28 118h116v58H28zM172 105h104v78H172zM304 110h114v65H304zM448 114h152v72H448zM40 222h104v64H40zM174 210h108v76H174zM312 208h104v72H312zM446 220h154v66H446zM28 326h116v74H28zM174 320h108v80H174zM312 312h104v88H312zM446 326h154v74H446z" />
      </g>
      <g fill="none" stroke="#ffffff" stroke-width="9">
        <path d="M0 100h600M0 196h600M0 306h600M122 0v400M266 0v400M406 0v400M526 0v400" />
      </g>
      <g fill="none" stroke="#cfcfcf" stroke-width="1">
        <path d="M0 100h600M0 196h600M0 306h600M122 0v400M266 0v400M406 0v400M526 0v400" />
        <path d="M0 150h600M0 250h600M0 350h600M60 0v400M204 0v400M342 0v400M470 0v400" />
      </g>
      <path d="M0 342c67-22 127-20 187-2s130 20 194-2 112-19 219-2v64H0Z" fill="#e3e3e3" />
      <path d="M420 20c44 6 76 24 98 44s45 38 69 38v61c-36-6-66-21-93-43s-46-34-74-38Z" fill="#dde3dd" />
      <path d="M38 228c38-12 73-11 108-1v44c-35-10-70-10-108-1Z" fill="#dde3dd" />
      <path data-route-line d="" fill="none" stroke="#111" stroke-width="1.6" stroke-dasharray="6 5" />
      <text x="40" y="218" fill="#8b8b8b" font-size="8">南湖</text>
      <text x="474" y="52" fill="#8b8b8b" font-size="8">北湖</text>
      <text x="238" y="190" fill="#8b8b8b" font-size="8">人民大街</text>
    </svg>
  `;
}

function loadAmap() {
  if (!AMAP_KEY) return Promise.resolve(false);
  if (window.AMap) return Promise.resolve(true);
  if (amapLoadPromise) return amapLoadPromise;

  amapLoadStarted = true;
  if (AMAP_SECURITY) {
    window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY };
  }

  amapLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(AMAP_KEY)}&plugin=AMap.Geolocation,AMap.Driving,AMap.Transfer,AMap.Walking,AMap.Scale,AMap.PlaceSearch,AMap.MarkerCluster,AMap.TileLayer.Satellite,AMap.TileLayer.RoadNet,AMap.TileLayer.Traffic`;
    script.async = true;
    script.onload = () => resolve(Boolean(window.AMap));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return amapLoadPromise;
}

function addAmapCurrentLocation(map) {
  if (!state.currentPosition) return;
  const marker = new AMap.Marker({
    position: state.currentPosition,
    anchor: "center",
    zIndex: 200,
    content: '<div class="amap-you"><span class="amap-you-dot"></span>你在这里</div>'
  });
  map.add(marker);
}

function applyAmapBaseLayers(element, map) {
  let layers = amapBaseLayers.get(element);
  if (!layers) {
    layers = {
      satellite: null,
      roadnet: null,
      traffic: null,
      base: null,
      appliedType: null,
      appliedTraffic: null
    };
    amapBaseLayers.set(element, layers);
  }

  if (!layers.base) {
    layers.base =
      map.getLayers().find((layer) => {
        const tileUrl = layer.getOptions?.()?.tileUrl || "";
        return tileUrl.includes("webrd");
      }) || null;
  }

  const ensure = (name, factory) => {
    if (!layers[name]) {
      layers[name] = factory();
    }
    return layers[name];
  };

  if (
    layers.appliedType === state.mapType &&
    layers.appliedTraffic === state.trafficVisible
  ) {
    return;
  }

  const desired = [];
  if (state.mapType === "satellite" && AMap.TileLayer.Satellite) {
    desired.push(
      ensure("satellite", () => new AMap.TileLayer.Satellite({ zIndex: 1 }))
    );
    if (AMap.TileLayer.RoadNet) {
      desired.push(
        ensure("roadnet", () => new AMap.TileLayer.RoadNet({ zIndex: 2 }))
      );
    }
  } else if (layers.base) {
    desired.push(layers.base);
  }

  if (state.trafficVisible && AMap.TileLayer.Traffic) {
    desired.push(
      ensure(
        "traffic",
        () =>
          new AMap.TileLayer.Traffic({
            zIndex: 3,
            autoRefresh: true,
            interval: 180
          })
      )
    );
  } else {
    layers.traffic?.setMap(null);
  }

  desired.forEach((layer) => layer.show());
  map.setLayers(desired);
  map.resize();
  layers.appliedType = state.mapType;
  layers.appliedTraffic = state.trafficVisible;
}

function placeMarkerContent(place, mode) {
  const routeIndex = state.route.indexOf(place.id);
  const content = document.createElement("button");
  content.type = "button";
  if (mode === "map") {
    content.className = `amap-marker category ${place.category}${place.featured ? " featured" : ""} ${state.selectedMapPlace === place.id ? "selected" : ""}`;
    content.textContent = "";
  } else {
    content.className = `amap-marker ${routeIndex < 0 ? "minor" : ""} ${state.selectedMapPlace === place.id ? "selected" : ""}`;
    content.textContent = routeIndex >= 0 ? String(routeIndex + 1) : "";
  }
  content.setAttribute("aria-label", place.name);
  content.title = place.name;
  content.insertAdjacentHTML("beforeend", markerPopover(place));
  content.addEventListener("click", () => {
    selectMapPlace(place.id);
    if (mode === "map") openPlaceModal(place.id);
  });
  return { content, routeIndex };
}

function placeMarker(place, mode) {
  const { content, routeIndex } = placeMarkerContent(place, mode);
  return new AMap.Marker({
    position: [place.lng, place.lat],
    content,
    anchor: "center",
    zIndex: routeIndex >= 0 ? 120 : 100
  });
}

function destroyAmapCluster(element) {
  const cluster = amapClusters.get(element);
  if (!cluster) return;
  try {
    cluster.setMap(null);
  } catch (error) {
    console.warn("Amap cluster teardown failed.", error);
  }
  amapClusters.delete(element);
}

function createPlaceCluster(map, places) {
  return new AMap.MarkerCluster(
    map,
    places.map((place) => ({ lnglat: [place.lng, place.lat], place })),
    {
      gridSize: 60,
      maxZoom: 15,
      averageCenter: true,
      renderMarker: (context) => {
        const bucket = Array.isArray(context.data) ? context.data : [context.data];
        const place = bucket[0] && bucket[0].place;
        if (!place) return;
        const { content } = placeMarkerContent(place, "map");
        context.marker.setContent(content);
        context.marker.setAnchor("center");
        context.marker.setzIndex(110);
      },
      renderClusterMarker: (context) => {
        const count = context.count || 0;
        const bubble = document.createElement("div");
        bubble.className = `amap-cluster${count >= 30 ? " lg" : count >= 10 ? " md" : ""}`;
        bubble.textContent = String(count);
        context.marker.setContent(bubble);
        context.marker.setAnchor("center");
        context.marker.setzIndex(130);
        context.marker.on("click", () => {
          const position = context.marker.getPosition();
          if (position) {
            map.setZoomAndCenter(Math.min(19, map.getZoom() + 2), position);
          }
        });
      }
    }
  );
}

function renderAmap(element, mode = "map") {
  if (!window.AMap) {
    renderSchematicMap(element, mode);
    return;
  }

  try {
    renderMapTopOverlay(element, mode);
    let map = amapInstances.get(element);
    if (!map) {
      element
        .querySelectorAll(".map-svg, .map-marker, .map-you, .map-transport-marker")
        .forEach((node) => node.remove());
      element.classList.add("amap-active");
      const holder = document.createElement("div");
      holder.className = "amap-container";
      element.prepend(holder);
      map = new AMap.Map(holder, {
        zoom: 12,
        center: [125.3235, 43.8171],
        mapStyle: "amap://styles/grey",
        viewMode: "2D",
        showLabel: true
      });
      amapInstances.set(element, map);
    }

    destroyAmapCluster(element);
    map.clearMap();
    let markers = [];
    let fitBounds = null;
    if (mode === "map" && state.mapLayer === "transport") {
      markers = TRANSPORT_STATUS.map((status) => {
        const content = document.createElement("div");
        content.className = "amap-transport-marker";
        content.innerHTML = `<strong>${status.name}</strong><span>${status.detail}</span>`;
        return new AMap.Marker({
          position: [status.lng, status.lat],
          content,
          anchor: "center",
          zIndex: 140
        });
      });
    } else {
      const visiblePlaces =
        mode === "map"
          ? filteredPlaces()
          : state.route.map(placeById).filter(Boolean);
      // An empty route used to leave the home-page map blank, which looks broken
      // next to a 583-place library. Fall back to the featured set as a preview.
      const previewPlaces =
        mode === "home" && !visiblePlaces.length
          ? PLACES.filter((place) => place.featured).slice(0, 40)
          : visiblePlaces;
      const located = previewPlaces.filter((place) => place.lng && place.lat);
      const canCluster =
        mode === "map" &&
        typeof AMap.MarkerCluster === "function" &&
        located.length > MAP_CLUSTER_THRESHOLD;
      if (canCluster) {
        amapClusters.set(element, createPlaceCluster(map, located));
        const lngs = located.map((place) => place.lng);
        const lats = located.map((place) => place.lat);
        fitBounds = new AMap.Bounds(
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)]
        );
      } else {
        markers = previewPlaces.map((place) => placeMarker(place, mode));
      }
    }
    if (markers.length) map.add(markers);

    if (state.route.length > 1) {
      const path = state.route
        .map((id) => placeById(id))
        .filter((place) => place && place.lng && place.lat)
        .map((place) => [place.lng, place.lat]);
      const line = new AMap.Polyline({
        path,
        strokeColor: "#ffffff",
        strokeWeight: 3,
        strokeStyle: "dashed",
        lineJoin: "round",
        lineCap: "round"
      });
      map.add(line);
    }

    addAmapCurrentLocation(map);
    if (!state.currentPosition && !geolocationRequested.has(element)) {
      geolocationRequested.add(element);
      AMap.plugin("AMap.Geolocation", () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 8000,
          buttonPosition: "RB"
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition((status, result) => {
          if (status === "complete" && result.position) {
            state.currentPosition = [result.position.lng, result.position.lat];
            addAmapCurrentLocation(map);
            if (mode === "home") map.setCenter(result.position);
          }
        });
      });
    }

    applyAmapBaseLayers(element, map);
    // Fitting while the container is display:none yields a degenerate viewport
    // (Amap reads the size as 0 and zooms out to the whole country), and the map
    // never recovers on the next render. Only fit when the box has real pixels.
    if (!element.offsetParent) return;
    if (fitBounds) {
      map.setBounds(fitBounds, false, [60, 60, 60, 60]);
      if (map.getZoom() > 15) map.setZoom(15);
    } else if (markers.length) {
      map.setFitView(markers, false, [70, 70, 70, 70]);
    }
  } catch (error) {
    console.warn("Amap failed, using schematic map.", error);
    element.classList.remove("amap-active");
    renderSchematicMap(element, mode);
  }
}

function renderMap(element, mode = "map") {
  if (amapReady) {
    renderAmap(element, mode);
  } else {
    renderSchematicMap(element, mode);
  }
}

function renderMapTopOverlay(element, mode = "map") {
  if (!element) return;
  const liveCopy = state.trafficVisible
    ? amapReady
      ? "实时路况已开"
      : "路况需联网"
    : "路况图层";
  const label = element.querySelector(".map-label");
  const live = element.querySelector(".map-live");
  if (!label || !live) {
    element.insertAdjacentHTML(
      "beforeend",
      `<div class="map-top"><span class="map-label">${mapBaseLabel(mode)} · <strong>${mapCountForMode(
        mode
      )}</strong> 个地点</span><span class="map-live"><span class="live-dot"></span>${liveCopy}</span></div>`
    );
    return;
  }
  label.innerHTML = `${mapBaseLabel(mode)} · <strong>${mapCountForMode(mode)}</strong> 个地点`;
  live.innerHTML = `<span class="live-dot"></span>${liveCopy}`;
}

function renderSchematicMap(element, mode = "map") {
  if (!element) return;
  if (!element.querySelector(".map-svg")) {
    element.insertAdjacentHTML("afterbegin", mapBackground());
  }
  renderMapTopOverlay(element, mode);

  element.querySelectorAll(".map-marker, .map-you, .map-transport-marker").forEach((node) => node.remove());

  let markers = "";
  if (mode === "map" && state.mapLayer === "transport") {
    markers = TRANSPORT_STATUS.map(
      (status) => `
        <span class="map-transport-marker" style="left:${status.x}%;top:${status.y}%">
          <strong>${status.name}</strong>
          <span>${status.detail}</span>
        </span>
      `
    ).join("");
  } else {
    const visiblePlaces =
      mode === "map"
        ? filteredPlaces()
        : state.route.map(placeById).filter(Boolean);
    markers = visiblePlaces.map((place) => {
      const routeIndex = state.route.indexOf(place.id);
      const markerClass =
        mode === "map"
          ? `category ${place.category}`
          : routeIndex < 0
            ? "minor"
            : "";
      return `<button class="map-marker ${markerClass} ${state.selectedMapPlace === place.id ? "selected" : ""}" type="button" style="left:${place.x}%;top:${place.y}%" data-place="${place.id}" aria-label="${place.name}">
        ${mode === "map" ? "" : routeIndex >= 0 ? routeIndex + 1 : ""}
        <span class="marker-label">${place.name}</span>
        ${markerPopover(place)}
      </button>`;
    }).join("");
  }

  element.insertAdjacentHTML("beforeend", markers);
  element.insertAdjacentHTML(
    "beforeend",
    `<div class="map-you"><span class="map-you-dot"></span>你在这里</div>`
  );

  if (!element.querySelector(".map-legend")) {
    element.insertAdjacentHTML(
      "beforeend",
      `<div class="map-legend">● 你在这里 · ○ 地点 · — 推荐路线</div>`
    );
  }

  const path = element.querySelector("[data-route-line]");
  if (path) path.setAttribute("d", routePath());
}

function ensureItinerary() {
  if (!state.itinerary.length) {
    state.itinerary = [{ route: state.route.slice(), reasons: { ...state.routeReasons } }];
  }
  state.selectedDay = Math.min(
    Math.max(0, state.selectedDay),
    state.itinerary.length - 1
  );
}

function persistCurrentDay() {
  ensureItinerary();
  const day = state.itinerary[state.selectedDay];
  if (!day) return;
  day.route = state.route.slice();
  day.reasons = { ...state.routeReasons };
}

function selectDay(index) {
  ensureItinerary();
  const next = Number(index);
  if (!Number.isInteger(next) || next < 0 || next >= state.itinerary.length) return;
  if (next !== state.selectedDay) persistCurrentDay();
  state.selectedDay = next;
  state.route = state.itinerary[next].route.slice();
  state.routeReasons = { ...(state.itinerary[next].reasons || {}) };
  clearReplan();
  renderAll();
}

function totalItineraryStops() {
  ensureItinerary();
  return state.itinerary.reduce((total, day) => total + day.route.length, 0);
}

function parseTripDays(value) {
  const match = String(value || "").match(/\d{1,2}/);
  return Math.min(21, Math.max(1, match ? Number(match[0]) : 1));
}

function renderDayTabs() {
  ensureItinerary();
  const container = $("#dayTabs");
  if (!container) return;
  if (state.itinerary.length <= 1) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }
  container.hidden = false;
  const seen = new Set();
  container.innerHTML = state.itinerary
    .map((day, index) => {
      const reused = day.route.some((id) => seen.has(id));
      day.route.forEach((id) => seen.add(id));
      return `<button class="day-tab ${index === state.selectedDay ? "active" : ""} ${
        reused ? "reused" : ""
      }" type="button" data-day-index="${index}" aria-pressed="${
        index === state.selectedDay
      }">
        <strong>Day ${index + 1}</strong>
        <span>${dateLabelForOffset(index, false)} · ${day.route.length} 站${
          reused ? " · 复用" : ""
        }</span>
      </button>`;
    })
    .join("");
}

function renderHome() {
  const schedule = buildSchedule();
  const dateLabel = $("#todayLabel");
  if (dateLabel) dateLabel.textContent = `长春 · ${todayLabel}`;
  const mapCount = $("#homeMapCount");
  const savedCount = $("#savedSignalCount");
  const queueCount = $("#queueSignalCount");
  if (mapCount) mapCount.textContent = state.route.length;
  if (savedCount) savedCount.textContent = `${totalItineraryStops()} 个`;
  if (queueCount) {
    queueCount.textContent = `${PLACES.filter((place) => place.queueMax >= 20 && place.confidence !== "低").length} 个`;
  }
  const dayCopy =
    state.itinerary.length > 1
      ? `第 ${state.selectedDay + 1}/${state.itinerary.length} 天 · `
      : "";
  const summary = $("#homeRouteSummary");
  if (summary) {
    summary.textContent = `${dayCopy}${schedule.stops.length} 个地点 · 约 ${formatMinutes(schedule.total)} · 总车程 ${formatMinutes(schedule.totalTravel)}`;
  }
  const routeRow = $("#homeRouteRow");
  if (routeRow) {
    routeRow.innerHTML = schedule.stops.map((place) => {
      const metrics = placeMetrics(place);
      return `
    <div class="route-preview-stop">
      <time>${place.arrivalLabel}</time>
      <strong>${escapeHtml(place.name)}</strong>
      <span>${escapeHtml(place.subtitle || place.type)}<br />${metrics.rating} · ${metrics.hours}<br />${metrics.ticket} · ${queueText(place)} 分钟排队</span>
      ${state.routeReasons[place.id] ? `<em class="route-preview-reason">${escapeHtml(state.routeReasons[place.id])}</em>` : ""}
    </div>
  `;
    }).join("") + `<div class="route-preview-more"><button class="text-link" type="button" data-view="route">查看完整路线 →</button></div>`;
  }
  renderMap($("#homeMap"), "home");
}

function filteredPlaces() {
  if (state.mapLayer === "transport") return [];
  let result = PLACES.filter((place) => {
    if (state.mapLayer === "all") return true;
    return place.category === state.mapLayer;
  });
  result = result.filter((place) => {
    if (state.mapFilter === "food") return place.category === "food";
    if (state.mapFilter === "attraction") return place.category === "attraction";
    if (state.mapFilter === "short") return place.queueMax <= 20;
    if (state.mapFilter === "budget") return typeof place.avg === "number" && place.avg <= 100;
    if (state.mapFilter === "rating") return typeof place.rating === "number" && place.rating >= 4.5;
    if (state.mapFilter === "featured") return place.featured === true;
    return true;
  });
  const query = state.mapSearch.trim().toLowerCase();
  if (query) {
    result = result.filter((place) =>
      `${place.name}${place.type}${place.interests.join("")}`.toLowerCase().includes(query)
    );
  }
  // Local specialties lead the list, ordered by editorial rank (so 净月潭 and
  // 伪满皇宫 come first even though they sit far from downtown), then the rest by
  // distance. Without this the hand-written 23 sit at the top and push the
  // landmarks down the page.
  const distanceOf = (place) => (typeof place.distance === "number" ? place.distance : 999);
  const rankOf = (place) => (typeof place.rank === "number" ? place.rank : 99);
  return result.sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    if (a.featured && rankOf(a) !== rankOf(b)) return rankOf(a) - rankOf(b);
    return distanceOf(a) - distanceOf(b);
  });
}

function mapCountForMode(mode = "map") {
  if (mode === "map") return filteredPlaces().length;
  if (!state.route.length) return Math.min(40, PLACES.filter((place) => place.featured).length);
  return state.route.length;
}

function mapBaseLabel(mode = "map") {
  if (state.mapType === "satellite") return amapReady ? "卫星图" : "卫星示意图（需联网）";
  if (mode === "map") return "地图搜索结果";
  if (!state.route.length) return "长春特色预览";
  return `第 ${state.selectedDay + 1} 天路线`;
}

function renderPlaceList() {
  $("#allLayerCount").textContent = PLACES.length;
  $("#attractionLayerCount").textContent = PLACES.filter(
    (place) => place.category === "attraction"
  ).length;
  $("#foodLayerCount").textContent = PLACES.filter(
    (place) => place.category === "food"
  ).length;

  if (state.mapLayer === "transport") {
    const query = state.mapSearch.trim().toLowerCase();
    const transport = TRANSPORT_STATUS.filter((status) =>
      `${status.name}${status.type}${status.detail}`.toLowerCase().includes(query)
    );
    $("#mapCount").textContent = `交通 · ${transport.length} 条线路`;
    $("#placeList").innerHTML = transport.map(
      (status) => `
        <article class="place-card transport-card">
          <div class="place-card-head"><strong>${status.name}</strong><span>${status.type}</span></div>
          <div class="place-meta">${status.detail}</div>
          <div class="place-queue">${status.status}</div>
          <div class="place-actions"><button type="button" data-ride-code="${status.id}">乘车码</button></div>
        </article>
      `
    ).join("") || `<div class="notice compact">没有匹配的交通状态。</div>`;
    renderMap($("#mapViewMap"), "map");
    return;
  }

  const places = filteredPlaces();
  $("#mapCount").textContent = `长春 · ${places.length} 个地点`;
  $("#placeList").innerHTML = places.map((place) => {
    const inRoute = state.route.includes(place.id);
    const ratingText = place.rating ? `高德 ${place.rating}` : "暂无评分";
    const avgText = typeof place.avg === "number" ? `人均约 ¥${place.avg}` : "人均待接入";
    const hoursText = place.hours ? `营业 ${place.hours}` : "营业时间待确认";
    const tel = String(place.tel || "").trim();
    return `
      <article class="place-card ${state.selectedMapPlace === place.id ? "selected" : ""}" data-place-card="${place.id}">
        <div class="place-card-head"><strong>${escapeHtml(place.name)}</strong>${place.featured ? `<em class="featured-badge">${escapeHtml(place.badge || "长春特色")}</em>` : ""}<span>${escapeHtml(place.type)}</span></div>
        <div class="place-meta"><b>${escapeHtml(place.subtitle || place.type)}</b><br />${ratingText} · ${avgText} · ${place.distance} km<br />${hoursText}</div>
        ${tel ? `<div class="poi-tel">${icon("i-bell")} <a href="tel:${escapeHtml(tel)}">${escapeHtml(tel)}</a></div>` : ""}
        <div class="place-queue">${icon("i-clock")} 参考等候 ${queueText(place)} 分钟 · 非实时</div>
        <div class="place-actions">
          <button type="button" data-add="${place.id}" class="${inRoute ? "added" : ""}">${inRoute ? "已加入路线" : "加入路线"}</button>
          <button type="button" data-nav="${place.id}">导航</button>
          <a href="#" data-ticket="${place.id}">官方购票/订座 ↗</a>
        </div>
      </article>
    `;
  }).join("");
  renderMap($("#mapViewMap"), "map");
}

/* ---------- Amap POI search: real stores (name / category / address / phone) ---------- */

let poiSearcher = null;
let poiMarkers = [];

const poiCityValue = () => String($("#poiCity")?.value || "").trim() || "长春";

async function ensurePoiSearcher() {
  if (!AMAP_KEY) return null;
  const loaded = await loadAmap();
  if (!loaded || !window.AMap || !AMap.PlaceSearch) return null;
  if (!poiSearcher) {
    poiSearcher = new AMap.PlaceSearch({ pageSize: 20, pageIndex: 1, extensions: "all" });
  }
  return poiSearcher;
}

function poiCoords(poi) {
  const loc = poi && poi.location;
  if (!loc) return null;
  if (typeof loc === "string") {
    const parts = loc.split(",").map(Number);
    return parts.length === 2 && parts.every(Number.isFinite) ? parts : null;
  }
  const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
  const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
  return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
}

function clearPoiMarkers() {
  const map = amapInstances.get($("#mapViewMap"));
  if (map && poiMarkers.length) map.remove(poiMarkers);
  poiMarkers = [];
}

function drawPoiMarkers(pois) {
  const map = amapInstances.get($("#mapViewMap"));
  if (!map || !window.AMap) return;
  clearPoiMarkers();
  pois.forEach((poi) => {
    const coords = poiCoords(poi);
    if (!coords) return;
    const marker = new AMap.Marker({ position: coords, title: poi.name || "" });
    marker.on("click", () => {
      const lines = [`<strong>${escapeHtml(poi.name || "")}</strong>`];
      if (poi.address) lines.push(`<span>${escapeHtml(poi.address)}</span>`);
      if (poi.tel) lines.push(`<span>电话 ${escapeHtml(String(poi.tel))}</span>`);
      const info = new AMap.InfoWindow({
        content: `<div class="poi-window">${lines.join("")}</div>`,
        offset: new AMap.Pixel(0, -28)
      });
      info.open(map, coords);
    });
    poiMarkers.push(marker);
  });
  if (poiMarkers.length) {
    map.add(poiMarkers);
    map.setFitView(poiMarkers);
  }
}

function renderPoiResults(pois, note) {
  const list = $("#poiList");
  const status = $("#poiStatus");
  state.poiResults = pois || [];
  if (!list) return;
  if (status) {
    status.textContent =
      note || (pois.length ? `找到 ${pois.length} 个地点` : "没有找到结果，换个关键词试试。");
  }
  list.innerHTML = pois
    .map((poi, index) => {
      const name = escapeHtml(poi.name || "未命名");
      const type = escapeHtml(poi.type || "未分类");
      const address = escapeHtml(poi.address || "暂无地址");
      const area = escapeHtml([poi.cityname, poi.adname].filter(Boolean).join(" · "));
      const tel = String(poi.tel || "").trim();
      const telHtml = tel
        ? `<a href="tel:${escapeHtml(tel)}">${escapeHtml(tel)}</a>`
        : `<span class="poi-empty">暂无电话</span>`;
      return `
      <article class="poi-card">
        <div class="place-card-head"><strong>${name}</strong><span>${type}</span></div>
        <div class="place-meta">${area ? `<b>${area}</b><br />` : ""}${address}</div>
        <div class="poi-tel">${icon("i-bell")} ${telHtml}</div>
        <div class="place-actions">
          <button type="button" data-poi-focus="${index}">地图定位</button>
          <a href="#" data-poi-nav="${index}">导航 ↗</a>
        </div>
      </article>
    `;
    })
    .join("");
}

function poiNavUrl(poi) {
  const coords = poiCoords(poi);
  if (!coords) return "";
  const destination = `${coords[0]},${coords[1]},${encodeURIComponent(poi.name || "")}`;
  const origin = state.currentPosition
    ? `from=${state.currentPosition[0]},${state.currentPosition[1]},${encodeURIComponent("当前位置")}&`
    : "";
  return (
    `https://uri.amap.com/navigation?${origin}to=${destination}` +
    "&mode=car&policy=1&src=SmoothGo&coordinate=gaode&callnative=1"
  );
}

async function searchPoi({ nearby = false } = {}) {
  const status = $("#poiStatus");
  if (!status) return;
  const keyword = String($("#poiQuery")?.value || "").trim();
  if (!keyword) {
    status.textContent = "先输入关键词，例如 东北菜、咖啡、景点。";
    return;
  }

  const searcher = await ensurePoiSearcher();
  if (!searcher) {
    status.textContent = AMAP_KEY
      ? "高德 POI 插件加载失败，检查 config.js 的 Key 是否开通了 PlaceSearch 服务、域名是否在白名单内。"
      : "未配置高德 Key：把 web/config.example.js 复制为 config.js，填入 JS API Key 后重试。";
    return;
  }

  if (nearby && !state.currentPosition) {
    status.textContent = "还没有定位信息，请先允许浏览器定位，或改用城市搜索。";
    return;
  }

  status.textContent = "搜索中…";
  clearPoiMarkers();

  const finish = (searchStatus, result) => {
    if (searchStatus !== "complete" && searchStatus !== "no_data") {
      status.textContent = `搜索失败：${(result && result.info) || searchStatus}`;
      return;
    }
    const pois = (result && result.poiList && result.poiList.pois) || [];
    renderPoiResults(pois);
    drawPoiMarkers(pois);
  };

  if (nearby) {
    searcher.searchNearBy(keyword, state.currentPosition, 3000, finish);
  } else {
    searcher.setCity(poiCityValue());
    searcher.search(keyword, finish);
  }
}

function focusPoi(index) {
  const poi = state.poiResults?.[index];
  if (!poi) return;
  const coords = poiCoords(poi);
  const map = amapInstances.get($("#mapViewMap"));
  if (!coords || !map) return;
  map.setZoomAndCenter(17, coords);
  showView("map");
  showToast(`已定位：${poi.name || ""}`);
}

function renderRoute() {
  const schedule = buildSchedule();
  ensureItinerary();
  const dayCount = state.itinerary.length;
  $("#routeTitle").textContent =
    dayCount > 1 ? `长春 ${dayCount} 日路线` : "长春一日路线";
  const dateCopy =
    dayCount > 1
      ? `第 ${state.selectedDay + 1} 天 · ${dateLabelForOffset(state.selectedDay)}`
      : todayLabel;
  $("#routeSubtitle").textContent = `${schedule.stops.length} 个地点 · ${dateCopy} · ${state.startTime} 开始`;
  $("#routeSummary").innerHTML = `
    <div><strong>${schedule.stops.length}</strong><span>个地点</span></div>
    <div><strong>${formatMinutes(schedule.total)}</strong><span>总时长</span></div>
    <div><strong>${formatMinutes(schedule.totalTravel)}</strong><span>总车程</span></div>
    <div><strong>¥${schedule.budget}</strong><span>当日人均 · 估</span></div>
    ${dayCount > 1 ? `<div><strong>${dayCount}</strong><span>天总行程</span></div>` : ""}
  `;
  $("#replanButton").disabled = schedule.stops.length < 2;
  $("#routeNavButton").disabled = !schedule.stops.length;
  renderDayTabs();

  if (!schedule.stops.length) {
    $("#routeList").innerHTML = `<div class="notice compact">还没有地点，先去地图添加。</div>`;
  } else {
    let html = "";
    schedule.stops.forEach((place, index) => {
      const metrics = placeMetrics(place);
      html += `
        <article class="route-stop">
          <div class="route-time">${place.arrivalLabel}</div>
          <div>
            <h3>${place.name}</h3>
            <div class="route-stop-meta">
              ${escapeHtml(place.subtitle || place.type)}<br />
              <b>${metrics.rating}</b> · ${metrics.avg} · ${metrics.hours}<br />
              ${metrics.ticket} · ${queueText(place)} 分钟排队<br />
              <a href="#" data-ticket="${place.id}">官方购票/订座 ↗</a>
              <button class="route-stop-nav" type="button" data-nav="${place.id}">导航</button>
              ${state.routeReasons[place.id] ? `<span class="route-stop-reason">${escapeHtml(state.routeReasons[place.id])}</span>` : ""}
            </div>
            <button class="route-stop-remove" type="button" data-remove="${place.id}">移除</button>
          </div>
          <div class="route-stop-queue">${queueText(place)}<br />分钟</div>
        </article>
      `;
      if (index < schedule.stops.length - 1) {
        const options = transportOptions(place, schedule.stops[index + 1]);
        html += `
          <div class="route-connect">
            ${options.map((option) => `<span class="mode-chip ${option.active ? "active" : ""}">${icon(option.mode === "car" ? "i-car" : option.mode === "bus" ? "i-bus" : "i-taxi")} ${option.label}</span>`).join("")}
          </div>
        `;
      }
    });
    $("#routeList").innerHTML = html;
  }

  // These three rows used to be hardcoded strings ("14:20", "42 路 · 2 min",
  // "人民大街 · +8 min") that never changed and reflected nothing real. Live bus
  // arrival and road conditions need a feed we do not have, so show the panel as
  // an explicit placeholder instead of numbers that look authoritative.
  const liveOverlay = $("#routeLiveOverlay");
  if (liveOverlay) {
    const hasTraffic = Boolean(state.trafficVisible);
    liveOverlay.innerHTML = `
      <div class="map-live-title"><strong>实时信息</strong><span class="live-tag">未接入</span></div>
      <div class="map-live-row muted"><span>实时公交</span><strong>未接入</strong></div>
      <div class="map-live-row muted"><span>轻轨</span><strong>未接入</strong></div>
      <div class="map-live-row muted"><span>路况</span><strong>${
        hasTraffic ? "图层已开启 · 无实时数据" : "未接入"
      }</strong></div>
    `;
  }
  renderReplanBanner();
  renderMap($("#routeMap"), "route");
}

function renderReplanBanner() {
  const banner = $("#replanBanner");
  if (!banner) return;
  const replan = state.lastReplan;
  if (!replan) {
    banner.hidden = true;
    banner.innerHTML = "";
    return;
  }
  banner.hidden = false;
  banner.innerHTML = `
    <span class="replan-badge">已重排</span>
    <div class="replan-copy">
      <strong>${escapeHtml(replan.from.name)} → ${escapeHtml(replan.to.name)}</strong>
      <p>${escapeHtml(replan.reason)}</p>
    </div>
    <button class="replan-undo" type="button" data-undo-replan>撤销重排</button>
  `;
}

function renderQueue() {
  const places = PLACES.filter((place) => place.queueMax >= 10)
    .sort((a, b) => b.queueMax - a.queueMax)
    .slice(0, 12);
  $("#queueList").innerHTML = places.map((place) => {
    const metrics = placeMetrics(place);
    return `
    <article class="queue-card">
      <div class="queue-card-head"><strong>${escapeHtml(place.name)}</strong><span>${escapeHtml(place.type)}</span></div>
      <div class="queue-card-data"><b>${metrics.rating}</b> · ${metrics.avg} · ${metrics.hours}<br />${place.source} · 置信度 ${place.confidence}</div>
      <div class="queue-range">${queueText(place)} <small>分钟参考等候</small></div>
      <div class="queue-actions">
        <button class="button outline" type="button" data-queue="${place.id}">排队管家</button>
        <a class="text-link" href="#" data-ticket="${place.id}">官方购票/订座 ↗</a>
      </div>
    </article>
  `;
  }).join("");
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `请求失败 (${response.status})`);
  }
  return data;
}

function maskPhone(phone) {
  const value = String(phone || "");
  if (value.length < 7) return value;
  return `${value.slice(0, 3)}****${value.slice(-4)}`;
}

function updateAuthCopy() {
  if (AUTH_MODE !== "real") return;
  const kicker = $("#loginKicker");
  const desc = $("#loginDesc");
  if (kicker) kicker.textContent = "手机号账号登录";
  if (desc) desc.textContent = "使用手机号和密码登录；首次可注册，也可以切换到验证码登录。";
}

function updateAuthUI() {
  const guest = $("#guestBadge");
  const login = $("#loginButton");
  if (state.loggedIn) {
    guest.textContent = state.user?.phone ? maskPhone(state.user.phone) : "已登录";
    guest.classList.add("logged-in");
    login.textContent = "我的";
  } else {
    guest.textContent = "游客预览";
    guest.classList.remove("logged-in");
    login.textContent = "登录";
  }
  updateMembershipUI();
}

let searchHistory = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

function formatHistoryTime(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value) => String(value).padStart(2, "0");
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay ? `今天 ${clock}` : `${date.getMonth() + 1} 月 ${date.getDate()} 日 ${clock}`;
}

async function loadSearchHistory() {
  if (AUTH_MODE !== "real") return;
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) return;
  try {
    const data = await apiFetch("/api/searches");
    searchHistory = data.searches || [];
  } catch (error) {
    searchHistory = [];
  }
  renderSearchHistory();
}

async function saveSearch(query, keywords, route, days = null) {
  if (AUTH_MODE !== "real") return null;
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) return null;
  try {
    await apiFetch("/api/searches", {
      method: "POST",
      body: JSON.stringify({
        query,
        keywords,
        route,
        days: days || state.itinerary.map((day) => day.route)
      })
    });
    await loadSearchHistory();
  } catch (error) {
    // History is a convenience; never block the route result on it.
    console.warn("[SmoothGo] 搜索记录保存失败", error);
  }
  return null;
}

function queueQuotaCopy() {
  const quota = state.queueQuota || { limit: 2, used: 0, remaining: 2 };
  return {
    remaining: Math.max(0, Number(quota.remaining) || 0),
    limit: Math.max(1, Number(quota.limit) || 2),
    used: Math.max(0, Number(quota.used) || 0)
  };
}

function formatWaitCn(totalMinutes) {
  const minutes = Math.max(0, Math.ceil(Number(totalMinutes) || 0));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours} 小时 ${rest} 分`;
  if (hours) return `${hours} 小时`;
  return `${rest} 分钟`;
}

function queueSnapshot(request, nowMs = Date.now()) {
  if (!request) return null;
  const initialWait = Math.max(1, Number(request.minutes) || 30);
  const createdAtMs = (Number(request.createdAt) || Math.floor(nowMs / 1000)) * 1000;
  const isFood = request.category === "food";
  // No queue feed is connected, so this never counts down. The wait length is the
  // value the user picked in the sheet, shown once and labelled as an estimate.
  return {
    request,
    isFood,
    remainingMinutes: initialWait,
    waitText: formatWaitCn(initialWait),
    positionText: "队列位置未接入",
    status: "演示请求",
    updatedText: `提交于 ${formatHistoryTime(Math.floor(createdAtMs / 1000))}`
  };
}

function setActiveQueue(request) {
  state.activeQueue = request || null;
  if (request) {
    localStorage.setItem(ACTIVE_QUEUE_KEY, JSON.stringify(request));
  } else {
    localStorage.removeItem(ACTIVE_QUEUE_KEY);
  }
  renderActiveQueue();
}

function restoreLocalQueue() {
  if (state.activeQueue) return;
  try {
    const request = JSON.parse(localStorage.getItem(ACTIVE_QUEUE_KEY) || "null");
    if (request && queueSnapshot(request)?.remainingMinutes > 0) {
      state.activeQueue = request;
    }
  } catch (error) {
    localStorage.removeItem(ACTIVE_QUEUE_KEY);
  }
}

function renderActiveQueue() {
  const pin = $("#queuePin");
  const card = $("#activeQueueCard");
  if (!pin || !card) return;
  const snapshot = queueSnapshot(state.activeQueue);
  if (!snapshot) {
    pin.hidden = true;
    pin.innerHTML = "";
    card.hidden = true;
    card.innerHTML = "";
    return;
  }

  pin.hidden = false;
  pin.innerHTML = `
    <div class="queue-pin-place"><span class="live-dot"></span><strong>${escapeHtml(
      snapshot.request.placeName
    )}</strong></div>
    <div class="queue-pin-metric"><span>${snapshot.status}</span><strong>${snapshot.positionText}</strong></div>
    <div class="queue-pin-wait"><span>预计等待</span><strong>${snapshot.waitText}</strong></div>
    <button class="queue-pin-open" type="button" data-view="queue">查看详情</button>
    <button class="queue-pin-close" type="button" data-queue-dismiss aria-label="收起置顶排队信息">×</button>
  `;

  card.hidden = false;
  card.innerHTML = `
    <div class="active-queue-identity">
      <span>${snapshot.isFood ? "餐馆排队参考" : "景区排队参考"} · ${
        snapshot.request.requestId
      }</span>
      <strong>${escapeHtml(snapshot.request.placeName)}</strong>
    </div>
    <div class="active-queue-stat"><span>当前位置</span><strong>${snapshot.positionText}</strong></div>
    <div class="active-queue-stat"><span>预计等待</span><strong>${snapshot.waitText}</strong></div>
    <div class="active-queue-stat"><span>提交时间</span><strong>${snapshot.updatedText}</strong></div>
    <div class="active-queue-state"><strong>${snapshot.status}</strong><span>演示请求不会产生真实排队、订座或支付，也不会到号</span></div>
  `;
}

function dismissActiveQueue() {
  if (state.activeQueue?.id) {
    localStorage.setItem(DISMISSED_QUEUE_KEY, String(state.activeQueue.id));
  }
  state.activeQueue = null;
  localStorage.removeItem(ACTIVE_QUEUE_KEY);
  renderActiveQueue();
  showToast("已收起置顶排队信息");
}

function updateMembershipUI() {
  const quota = queueQuotaCopy();
  const heading = $("#membershipQuota");
  const detail = $("#membershipUsage");
  if (heading) heading.textContent = `本月剩余 ${quota.remaining} / ${quota.limit} 次`;
  if (detail) {
    detail.textContent = quota.remaining
      ? `已使用 ${quota.used} 次演示请求；提交记录会保存在当前账号下，不产生真实订单。`
      : "本月演示额度已用完。正式会员、支付和额度重置尚未接入。";
  }
  const lastRequest = state.queueRequests?.[0];
  const lastNode = $("#membershipLastRequest");
  if (lastNode) {
    lastNode.hidden = !lastRequest;
    if (lastRequest) {
      lastNode.textContent =
        `最近请求：${lastRequest.placeName} · ${lastRequest.minutes} 分钟 · ` +
        `${lastRequest.requestId} · ${formatHistoryTime(lastRequest.createdAt)}`;
    }
  }
}

async function loadQueueState() {
  if (AUTH_MODE !== "real" || !localStorage.getItem(AUTH_TOKEN_KEY)) {
    state.queueRequests = [];
    state.queueQuota = { limit: 2, used: 0, remaining: 2 };
    restoreLocalQueue();
    renderActiveQueue();
    updateMembershipUI();
    return;
  }
  try {
    const data = await apiFetch("/api/queue-requests");
    state.queueRequests = data.requests || [];
    if (data.quota) state.queueQuota = data.quota;
    const dismissedId = localStorage.getItem(DISMISSED_QUEUE_KEY);
    const active = (data.requests || []).find(
      (request) => String(request.id) !== dismissedId
    );
    if (active && queueSnapshot(active)?.remainingMinutes > 0) {
      state.activeQueue = active;
      localStorage.setItem(ACTIVE_QUEUE_KEY, JSON.stringify(active));
    } else {
      state.activeQueue = null;
      localStorage.removeItem(ACTIVE_QUEUE_KEY);
    }
  } catch (error) {
    state.queueRequests = [];
    restoreLocalQueue();
  }
  renderActiveQueue();
  updateMembershipUI();
}

function resumePendingQueue() {
  if (!state.pendingQueuePlace) return;
  const placeId = state.pendingQueuePlace;
  state.pendingQueuePlace = null;
  openQueueModal(placeId);
  showToast("已登录，可以继续提交排队管家请求");
}

async function saveQueueRequest(place) {
  if (AUTH_MODE === "real") {
    if (!state.loggedIn) {
      state.pendingQueuePlace = place.id;
      closeModal("queueModal");
      updateAuthPanel();
      openModal("loginModal");
      showToast("登录后可保存排队管家请求");
      return null;
    }
    const data = await apiFetch("/api/queue-requests", {
      method: "POST",
      body: JSON.stringify({
        placeId: place.id,
        placeName: place.name,
        minutes: state.queueMinutes,
        category: place.category
      })
    });
    state.queueQuota = data.quota;
    state.queueRequests = [data.request, ...state.queueRequests].slice(0, 20);
    updateMembershipUI();
    return data.request;
  }

  const createdAt = Math.floor(Date.now() / 1000);
  return {
    id: `demo-${Date.now()}`,
    requestId: `SG-DEMO-${Date.now().toString(36).slice(-6).toUpperCase()}`,
    placeId: place.id,
    placeName: place.name,
    minutes: state.queueMinutes,
    price: state.queueMinutes === 60 ? 18 : state.queueMinutes === 90 ? 26 : 10,
    status: "submitted",
    category: place.category,
    createdAt
  };
}

function renderSearchHistory() {
  const block = $("#historyBlock");
  const list = $("#historyList");
  if (!block || !list) return;
  block.hidden = !state.loggedIn;
  if (!state.loggedIn) return;
  if (!searchHistory.length) {
    list.innerHTML = '<p class="history-empty">还没有搜索记录，生成一条路线就会出现在这里。</p>';
    return;
  }
  list.innerHTML = searchHistory
    .map((item) => {
      const chips = (values, className) =>
        (values || [])
          .map((value) => `<span class="${className}">${escapeHtml(value)}</span>`)
          .join("");
      const keywords = chips(item.keywords, "history-chip");
      const route = chips(
        (item.route || []).map((placeId) => {
          const place = placeById(placeId);
          return place ? place.name : placeId;
        }),
        "history-chip"
      );
      const days =
        item.days?.length > 1
          ? `<span class="history-chip">${item.days.length} 天</span>`
          : "";
      const meta =
        keywords || route || days
          ? `<div class="history-meta">${days}${keywords}${route}</div>`
          : "";
      return `<button class="history-item" type="button" data-history-id="${escapeHtml(item.id)}" title="恢复这条路线">
          <div class="history-item-head">
            <strong class="history-query">${escapeHtml(item.query || "")}</strong>
            <span class="history-time">${formatHistoryTime(item.createdAt)}</span>
          </div>
          ${meta}
        </button>`;
    })
    .join("");
}

function restoreSearchHistory(id) {
  const item = searchHistory.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  const route = (item.route || []).filter((placeId) => placeById(placeId));
  const savedDays = (item.days || [])
    .map((day) => day.filter((placeId) => placeById(placeId)))
    .filter((day) => day.length);
  if (!route.length && !savedDays.length) {
    showToast("这条记录没有可恢复的路线");
    return;
  }
  const days = savedDays.length ? savedDays : [route];
  state.itinerary = days.map((ids) => ({ route: ids.slice(0, 5), reasons: {} }));
  state.selectedDay = 0;
  state.route = state.itinerary[0].route.slice();
  state.routeReasons = {};
  state.interests = new Set(item.keywords || []);
  $("#daysInput").value = `${state.itinerary.length} 天`;
  clearReplan();
  showView("route");
  showToast(`已恢复「${item.query || "历史路线"}」`);
}

async function restoreSession() {
  if (AUTH_MODE !== "real") return;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return;
  try {
    const data = await apiFetch("/api/me");
    state.loggedIn = true;
    state.user = data.user;
    updateAuthUI();
    await loadSearchHistory();
    await loadQueueState();
  } catch (error) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    state.activeQueue = null;
    localStorage.removeItem(ACTIVE_QUEUE_KEY);
    renderActiveQueue();
  }
}

function renderAll() {
  renderHome();
  renderPlaceList();
  renderRoute();
  renderQueue();
  renderActiveQueue();
  renderMapModeControls();
  updateAuthUI();
}

function renderMapModeControls() {
  $$("#mapModes [data-maptype]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.maptype === state.mapType);
  });
  const traffic = $("#mapModes [data-traffic-toggle]");
  if (traffic) traffic.classList.toggle("active", state.trafficVisible);
}

function setMapType(type) {
  state.mapType = type === "satellite" ? "satellite" : "standard";
  renderAll();
  showToast(
    state.mapType === "satellite"
      ? amapReady
        ? "已切换高德卫星图"
        : "高德卫星图层尚未加载，当前显示示意底图"
      : "已切换标准地图"
  );
}

function toggleTrafficLayer() {
  state.trafficVisible = !state.trafficVisible;
  renderAll();
  showToast(
    state.trafficVisible
      ? amapReady
        ? "已叠加高德实时路况"
        : "高德图层尚未加载，当前只记录路况开关"
      : "已关闭实时路况"
  );
}

function showView(view) {
  state.view = view;
  $$(".view").forEach((item) => item.classList.toggle("active", item.id === `view-${view}`));
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  if (window.location.hash !== `#${view}`) {
    history.replaceState(null, "", `#${view}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderAll();
  resizeVisibleMaps();
}

function resizeVisibleMaps() {
  requestAnimationFrame(() => {
    $$(".view.active .map-card").forEach((element) => {
      const map = amapInstances.get(element);
      if (!map) return;
      map.resize();
      map.setFitView();
      const zoom = map.getZoom();
      map.setZoom(zoom + 0.01);
      setTimeout(() => map.setZoom(zoom), 80);
    });
  });
}

function toggleRoute(id) {
  if (state.route.includes(id)) {
    state.route = state.route.filter((item) => item !== id);
    delete state.routeReasons[id];
    showToast(`已从路线移除 ${placeById(id).name}`);
  } else {
    if (state.route.length >= 5) {
      showToast("演示版最多选 5 个地点");
      return;
    }
    state.route = [...state.route, id];
    showToast(`已加入路线：${placeById(id).name}`);
  }
  clearReplan();
  persistCurrentDay();
  renderAll();
}

function selectMapPlace(id) {
  state.selectedMapPlace = id;
  renderPlaceList();
  renderMap($("#homeMap"), "home");
  renderMap($("#routeMap"), "route");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = $(".modal-backdrop.open") ? "hidden" : "";
}

function openLegalModal() {
  openModal("legalModal");
}

function openQueueModal(id) {
  state.queuePlace = id || "the-hill";
  const place = placeById(state.queuePlace);
  $("#queueModalText").textContent = `为 ${place.name} 选择等待时长。提交后会显示模拟接单流程，不会创建真实订单。`;
  $("#queueSuccess").hidden = true;
  $("#queueRequestId").textContent = "SG-DEMO";
  const quota = queueQuotaCopy();
  $("#queueQuota").textContent = state.loggedIn
    ? `本月剩余 ${quota.remaining} / ${quota.limit} 次排队管家额度`
    : "游客演示模式 · 登录后可保存请求和额度";
  const exhausted = AUTH_MODE === "real" && state.loggedIn && quota.remaining <= 0;
  $("#queueSubmitButton").disabled = exhausted;
  $("#queueSubmitButton").textContent = exhausted ? "本月额度已用完" : "提交演示请求";
  queueTimers.forEach(clearTimeout);
  queueTimers = [];
  const steps = $$("#queueTimeline li");
  steps.forEach((step, index) => step.classList.toggle("done", index === 0));
  steps.forEach((step) => step.classList.remove("active"));
  $("#queueOptions").innerHTML = `
    <button class="queue-option ${state.queueMinutes === 30 ? "selected" : ""}" type="button" data-minutes="30"><strong>30 分钟</strong><span>¥10</span></button>
    <button class="queue-option ${state.queueMinutes === 60 ? "selected" : ""}" type="button" data-minutes="60"><strong>60 分钟</strong><span>¥18</span></button>
    <button class="queue-option ${state.queueMinutes === 90 ? "selected" : ""}" type="button" data-minutes="90"><strong>90 分钟</strong><span>¥26</span></button>
  `;
  openModal("queueModal");
}

function externalSearchUrl(kind, name) {
  const query = encodeURIComponent(name);
  if (kind === "dianping") {
    return `https://www.dianping.com/search/keyword/0/0_${query}`;
  }
  if (kind === "meituan") {
    return `https://www.meituan.com/s/${query}/`;
  }
  return `https://www.douyin.com/search/${query}`;
}

function openPlaceModal(id) {
  const place = placeById(id);
  if (!place) return;
  state.modalPlace = id;

  $("#placeDetailType").textContent =
    place.category === "food" ? "美食 · 本地推荐" : "景点 · 地点详情";
  $("#placeDetailTitle").textContent = place.name;
  $("#placeDetailSubtitle").textContent = place.subtitle || place.type;
  const heroPhoto = place.photo || place.photos?.[0];
  $("#placeDetailVisual").innerHTML = heroPhoto
    ? `<img class="place-photo" src="${escapeHtml(heroPhoto)}" alt="${escapeHtml(place.name)}" loading="lazy" referrerpolicy="no-referrer" />`
    : `${icon(place.icon)}<span>${escapeHtml(place.name)}</span>`;
  const ratingText = place.rating ? `${place.rating} 高德` : "暂无";
  const descText = place.description || [place.district, place.address].filter(Boolean).join(" ");
  // Say only what is actually on the card -- four memorials have a photo but no
  // Amap score, so the blanket "图片与评分来自高德" was wrong for them.
  const photoNote = [
    heroPhoto ? "图片来自高德 POI" : "暂无实景图",
    place.rating ? "评分来自高德" : "无评分来源"
  ].join(" · ");
  const avgNote = typeof place.avg === "number" ? " · 人均为品类估算" : "";
  $("#placeDetailDesc").innerHTML = `${escapeHtml(descText)}<br /><span class="detail-source">${photoNote}${avgNote}</span>`;
  $("#placeDetailStats").innerHTML = [
    ["评分", ratingText],
    ["人均", typeof place.avg === "number" ? `约 ¥${place.avg}` : "待接入"],
    ["排队", `参考 ${queueText(place)} 分钟`],
    ["营业", place.hours || "待确认"],
    ...(place.tel ? [["电话", place.tel]] : [])
  ]
    .map(
      ([label, value]) =>
        `<span class="detail-stat"><b>${label}</b> ${value}</span>`
    )
    .join("");

  const dishesSection = $("#placeDishesSection");
  dishesSection.hidden = !place.recommended?.length;
  $("#placeDishes").innerHTML = (place.recommended || [])
    .map((dish) => `<span class="detail-tag">${dish}</span>`)
    .join("");

  const dealSection = $("#placeDealSection");
  dealSection.hidden = !place.deal;
  $("#placeDeal").textContent = place.deal || "";

  $("#placeDianping").href = externalSearchUrl("dianping", place.name);
  $("#placeMeituan").href = externalSearchUrl("meituan", place.name);
  $("#placeDouyin").href = externalSearchUrl("douyin", place.name);

  const ticketButton = $("#placeTicketButton");
  // "免费预约" promised something the app cannot do -- it opens a demo ticket
  // sheet, and plenty of these attractions do charge. Name the panel, not an
  // outcome. The sheet itself says 演示订单不会真实出票.
  ticketButton.textContent = place.category === "food" ? "订座" : "门票";
  ticketButton.dataset.place = place.id;

  const addButton = $("#placeAddButton");
  addButton.textContent = state.route.includes(place.id)
    ? "已加入路线"
    : "加入路线";
  addButton.dataset.place = place.id;

  $("#placeNavButton").dataset.place = place.id;

  openModal("placeModal");
}

function renderTicketOptions() {
  const place = placeById(state.ticketPlace);
  if (!place) return;
  const types = place.ticketTypes?.length
    ? place.ticketTypes
    : [{ name: place.category === "food" ? "订座" : "免费预约", price: 0 }];
  const selected = types[state.ticketTypeIndex] || types[0];
  $("#ticketTitle").textContent = `${place.name} · ${
    place.category === "food" ? "订座" : "门票"
  }`;
  $("#ticketDesc").textContent =
    place.category === "food"
      ? "演示订座请求，不会真实锁定座位。"
      : "演示订单不会真实出票，也不会产生支付。";
  $("#ticketOptions").innerHTML = types
    .map(
      (type, index) => `
        <button class="ticket-option ${index === state.ticketTypeIndex ? "selected" : ""}" type="button" data-ticket-type="${index}">
          <span>${type.name}</span>
          <strong>${type.price ? `¥${type.price}` : "免费"}</strong>
        </button>
      `
    )
    .join("");
  $("#ticketQuantity").textContent = String(state.ticketQuantity);
  $("#ticketTotal").textContent = `¥${selected.price * state.ticketQuantity}`;
}

function openTicketModal(id) {
  state.ticketPlace = id;
  state.ticketTypeIndex = 0;
  state.ticketQuantity = 1;
  renderTicketOptions();
  openModal("ticketModal");
}

function openRideModal(id) {
  const status = TRANSPORT_STATUS.find((item) => item.id === id);
  if (!status) return;
  $("#rideTitle").textContent = `${status.name} 乘车码`;
  $("#rideDesc").textContent = `${status.detail}。演示环境不会真实扣费。`;
  const seed = [...status.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  $("#rideQr").innerHTML = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const finder =
      (row < 3 && col < 3) ||
      (row < 3 && col > 5) ||
      (row > 5 && col < 3);
    const dark = finder || (index * 7 + seed) % 7 < 3;
    return `<span class="${dark ? "dark" : ""}"></span>`;
  }).join("");
  openModal("rideModal");
}

function extractKeywords() {
  const text = $("#nlpInput").value;
  const found = [];
  const budgetMatch =
    text.match(/(?:预算|大概|大约)\s*(\d{2,5})/) ||
    text.match(/(\d{2,5})\s*(?:元|块)/);
  if (budgetMatch) {
    state.budget = `¥${budgetMatch[1]}`;
    $("#budgetInput").value = `¥${budgetMatch[1]}`;
    found.push(`预算 ${budgetMatch[1]}`);
  }
  const timeMatch = text.match(/(上午|下午|晚上)?\s*(\d{1,2})[：:](\d{2})/);
  if (timeMatch) {
    state.startTime = `${String(timeMatch[2]).padStart(2, "0")}:${timeMatch[3]}`;
    $("#timeInput").value = `${todayLabel} · ${state.startTime}`;
    found.push(`时间 ${state.startTime}`);
  }
  const daysMatch = text.match(/(\d{1,2})\s*(?:天|日)/);
  const chineseDays = { 一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7 };
  let detectedDays = 0;
  if (daysMatch) detectedDays = Number(daysMatch[1]);
  else if (/三周|3\s*周/.test(text)) detectedDays = 21;
  else if (/两周|2\s*周|几周/.test(text)) detectedDays = 14;
  else if (/一周|1\s*周/.test(text)) detectedDays = 7;
  else {
    const chineseMatch = text.match(/([一两二三四五六七])\s*(?:天|日)/);
    if (chineseMatch) detectedDays = chineseDays[chineseMatch[1]] || 0;
  }
  if (detectedDays) {
    detectedDays = Math.min(21, detectedDays);
    $("#daysInput").value = `${detectedDays} 天`;
    found.push(`${detectedDays} 天`);
  }
  const knownInterests = ["自然", "历史", "美食", "东北菜", "雪景", "电影", "亲子", "拍照", "摄影", "轻松", "休闲"];
  const detected = knownInterests.filter((item) => text.includes(item));
  if (text.includes("东北菜")) detected.push("美食");
  if (text.includes("雪景")) detected.push("自然");
  if (text.includes("拍照")) detected.push("摄影");
  if (detected.length) {
    state.interests = new Set(detected);
    found.push(...detected);
  }
  if (/爸妈|父母|家人|家庭/.test(text)) {
    state.people = "家庭";
    $("#peopleInput").value = "家庭";
    found.push("家庭");
  } else if (/一个人|独自/.test(text)) {
    state.people = "1 位成人";
    $("#peopleInput").value = "1 位成人";
    found.push("独自");
  } else if (/情侣|两个人|两人/.test(text)) {
    state.people = "2 位成人";
    $("#peopleInput").value = "2 位成人";
    found.push("2 位成人");
  }
  $("#extractStatus").textContent = found.length
    ? `已提取：${[...new Set(found)].join(" / ")}`
    : "没有识别到关键词，可以手动填写";
  showToast(found.length ? `已提取 ${found.length} 个关键词` : "没有识别到关键词");
}

function currentPreferences() {
  return {
    interests: [...state.interests],
    budget: PLANNER.parseBudget(state.budget),
    people: state.people,
    location: state.location
  };
}

function clearReplan() {
  state.lastReplan = null;
}

function generateRoute() {
  state.startTime = parseTime($("#timeInput").value) ? timeLabel(parseTime($("#timeInput").value)) : "09:30";
  state.budget = $("#budgetInput").value;
  state.people = $("#peopleInput").value;
  state.location = $("#locationInput").value;
  const requestedDays = parseTripDays($("#daysInput").value);
  const plans = PLANNER.chooseMultiDayRoute(PLACES, currentPreferences(), {
    days: requestedDays,
    limit: 3,
    startMinutes: parseTime(state.startTime),
    travelBetween
  });
  state.itinerary = plans.map((plan) => ({
    route: plan.route.slice(),
    reasons: { ...plan.reasons }
  }));
  state.selectedDay = 0;
  state.route = state.itinerary[0].route.slice();
  state.routeReasons = { ...state.itinerary[0].reasons };
  clearReplan();
  showView("route");
  renderAll();
  showToast(
    requestedDays > 1
      ? `已生成 ${requestedDays} 天路线（演示）`
      : "已按你的条件生成路线（演示）"
  );
  if (state.loggedIn) {
    const query = $("#nlpInput").value.trim();
    saveSearch(
      query || "手动条件生成",
      [...state.interests],
      state.route.slice(),
      state.itinerary.map((day) => day.route.slice())
    );
  }
}

function replanRoute() {
  if (state.route.length < 2) {
    showToast("至少需要两个地点才能重排");
    return;
  }
  const result = PLANNER.chooseReplan(PLACES, state.route, currentPreferences(), {
    startMinutes: parseTime(state.startTime),
    travelBetween
  });
  if (!result) {
    showToast("当前路线已经是较优的排队组合");
    return;
  }

  state.lastReplan = {
    from: { id: result.from.id, name: result.from.name },
    to: { id: result.to.id, name: result.to.name },
    reason: result.reason,
    queueSaved: result.queueSaved,
    durationSaved: result.durationSaved,
    previousRoute: state.route.slice(),
    previousReasons: { ...state.routeReasons }
  };
  state.route = result.route.slice();
  state.routeReasons[result.to.id] = result.reason;
  persistCurrentDay();
  showView("route");
  renderAll();
  showToast(`已重排：预计少排 ${result.queueSaved} 分钟`);
}

function undoReplan() {
  if (!state.lastReplan) return;
  state.route = state.lastReplan.previousRoute.slice();
  state.routeReasons = { ...state.lastReplan.previousReasons };
  clearReplan();
  persistCurrentDay();
  renderAll();
  showToast("已恢复重排前的路线");
}

function setMapLayer(layer, filter = "all") {
  state.mapLayer = layer;
  state.mapFilter = filter;
  $$("#mapLayers .layer-chip").forEach((chip) =>
    chip.classList.toggle("active", chip.dataset.layer === layer)
  );
  $$("#mapFilters .chip").forEach((chip) =>
    chip.classList.toggle("active", chip.dataset.filter === filter)
  );
  renderPlaceList();
}

function updateMapFilter(filter) {
  if (filter === "food" || filter === "attraction") {
    setMapLayer(filter, filter);
    return;
  }
  state.mapFilter = filter;
  $$("#mapFilters .chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.filter === filter));
  renderPlaceList();
}

function refreshQueues() {
  PLACES.forEach((place) => {
    const delta = Math.floor(Math.random() * 7) - 3;
    place.queueMin = Math.max(3, place.queueMin + delta);
    place.queueMax = Math.max(place.queueMin + 3, place.queueMax + delta);
  });
  renderAll();
  showToast("已刷新排队估算（演示数据）");
}

document.addEventListener("click", (event) => {
  const legal = event.target.closest("[data-legal]");
  if (legal) {
    event.preventDefault();
    openLegalModal();
    return;
  }

  const dismissQueue = event.target.closest("[data-queue-dismiss]");
  if (dismissQueue) {
    dismissActiveQueue();
    return;
  }

  const viewTarget = event.target.closest("[data-view]");
  if (viewTarget) {
    event.preventDefault();
    showView(viewTarget.dataset.view);
    return;
  }

  const marker = event.target.closest(".map-marker");
  if (marker) {
    selectMapPlace(marker.dataset.place);
    if (marker.closest("#mapViewMap")) openPlaceModal(marker.dataset.place);
    return;
  }

  const ticket = event.target.closest("[data-ticket]");
  if (ticket) {
    event.preventDefault();
    showToast("演示：正式版会打开官方购票/订座页面");
    return;
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    toggleRoute(remove.dataset.remove);
    return;
  }

  const undo = event.target.closest("[data-undo-replan]");
  if (undo) {
    undoReplan();
    return;
  }

  const history = event.target.closest("[data-history-id]");
  if (history) {
    restoreSearchHistory(history.dataset.historyId);
    return;
  }

  const queue = event.target.closest("[data-queue]");
  if (queue) {
    openQueueModal(queue.dataset.queue);
    return;
  }

  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.stopPropagation();
    openNavigation(placeById(nav.dataset.nav));
    return;
  }

  const ride = event.target.closest("[data-ride-code]");
  if (ride) {
    openRideModal(ride.dataset.rideCode);
    return;
  }

  const add = event.target.closest("[data-add]");
  if (add) {
    event.stopPropagation();
    toggleRoute(add.dataset.add);
    return;
  }

  const placeCard = event.target.closest("[data-place-card]");
  if (placeCard) {
    selectMapPlace(placeCard.dataset.placeCard);
    openPlaceModal(placeCard.dataset.placeCard);
  }
});

$("#mapFilters").addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (chip) updateMapFilter(chip.dataset.filter);
});

$("#mapLayers").addEventListener("click", (event) => {
  const layer = event.target.closest(".layer-chip");
  if (layer) setMapLayer(layer.dataset.layer);
});

$("#mapModes").addEventListener("click", (event) => {
  const type = event.target.closest("[data-maptype]");
  if (type) {
    setMapType(type.dataset.maptype);
    return;
  }
  if (event.target.closest("[data-traffic-toggle]")) toggleTrafficLayer();
});

$("#dayTabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-day-index]");
  if (tab) selectDay(Number(tab.dataset.dayIndex));
});

$("#mapSearch").addEventListener("input", (event) => {
  state.mapSearch = event.target.value;
  renderPlaceList();
});

$("#poiSearchButton").addEventListener("click", () => searchPoi({ nearby: false }));
$("#poiNearbyButton").addEventListener("click", () => searchPoi({ nearby: true }));
$("#poiQuery").addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchPoi({ nearby: false });
});
$("#poiList").addEventListener("click", (event) => {
  const focus = event.target.closest("[data-poi-focus]");
  if (focus) {
    focusPoi(Number(focus.dataset.poiFocus));
    return;
  }
  const nav = event.target.closest("[data-poi-nav]");
  if (nav) {
    event.preventDefault();
    const poi = state.poiResults?.[Number(nav.dataset.poiNav)];
    const url = poiNavUrl(poi);
    if (url) window.open(url, "_blank", "noopener");
    else showToast("这个地点没有坐标，无法导航。");
  }
});

$("#extractButton").addEventListener("click", extractKeywords);
$("#generateButton").addEventListener("click", generateRoute);
$("#replanButton").addEventListener("click", replanRoute);
$("#routeNavButton").addEventListener("click", () => {
  const firstStop = buildSchedule().stops[0];
  if (firstStop) openNavigation(firstStop);
});
$("#refreshQueueButton").addEventListener("click", refreshQueues);
$("#cityButton").addEventListener("click", () => showToast("城市切换：当前为长春演示"));
$("#langButton").addEventListener("click", () => showToast("英文版将在后续版本开放"));

$("#loginButton").addEventListener("click", () => {
  updateAuthPanel();
  openModal("loginModal");
});

function updateAuthPanel() {
  const form = $("#authForm");
  const signedIn = $("#authSignedIn");
  if (!form || !signedIn) return;
  form.hidden = state.loggedIn;
  signedIn.hidden = !state.loggedIn;
  if (state.loggedIn) {
    $("#signedInPhone").textContent = state.user?.phone
      ? maskPhone(state.user.phone)
      : "已登录";
  }
}

$("#logoutButton").addEventListener("click", async () => {
  try {
    await apiFetch("/api/auth/logout", { method: "POST", body: "{}" });
  } catch (error) {
    // Drop the local session even if the server call fails.
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  state.loggedIn = false;
  state.user = null;
  searchHistory = [];
  state.queueRequests = [];
  state.queueQuota = { limit: 2, used: 0, remaining: 2 };
  state.activeQueue = null;
  state.pendingQueuePlace = null;
  localStorage.removeItem(ACTIVE_QUEUE_KEY);
  localStorage.removeItem(DISMISSED_QUEUE_KEY);
  updateAuthUI();
  renderSearchHistory();
  closeModal("loginModal");
  showToast("已退出登录");
});

$("#refreshHistoryButton").addEventListener("click", async () => {
  await loadSearchHistory();
  showToast(
    searchHistory.length
      ? `已加载 ${searchHistory.length} 条搜索记录`
      : "还没有搜索记录"
  );
});

$("#loginModalClose").addEventListener("click", () => closeModal("loginModal"));
$("#loginModal").addEventListener("click", (event) => {
  if (event.target.id === "loginModal") closeModal("loginModal");
});

$("#sendCodeButton").addEventListener("click", async () => {
  const phone = $("#phoneInput").value.trim();
  if (phone.length < 6) {
    showToast("请输入手机号");
    return;
  }
  if (AUTH_MODE === "real") {
    try {
      $("#sendCodeButton").disabled = true;
      const data = await apiFetch("/api/auth/send-code", {
        method: "POST",
        body: JSON.stringify({ phone })
      });
      if (data.devCode) $("#codeInput").value = data.devCode;
      showToast(data.devCode ? `演示验证码：${data.devCode}` : "验证码已发送，请查看短信");
    } catch (error) {
      showToast(error.message);
    } finally {
      $("#sendCodeButton").disabled = false;
    }
  } else {
    $("#codeInput").value = "123456";
    showToast("验证码已发送（演示验证码 123456）");
  }
});

// "password" uses phone + password; "code" keeps the original SMS flow.
let authMode = "password";
// Within password mode: "login" or "register".
let authAction = "login";

function setAuthMode(mode) {
  authMode = mode === "code" ? "code" : "password";
  $$(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === authMode);
  });
  $("#passwordField").hidden = authMode !== "password";
  $("#codeRow").hidden = authMode !== "code";
  $("#authSwitch").hidden = authMode !== "password";
}

function setAuthAction(action) {
  authAction = action === "register" ? "register" : "login";
  const isRegister = authAction === "register";
  $("#doLoginButton").textContent = isRegister ? "注册并登录" : "登录";
  $("#authSwitchHint").textContent = isRegister ? "已有账号？" : "还没有账号？";
  $("#authSwitchButton").textContent = isRegister ? "去登录" : "去注册";
  $("#passwordInput").autocomplete = isRegister ? "new-password" : "current-password";
}

$$(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

$("#authSwitchButton").addEventListener("click", () => {
  setAuthAction(authAction === "register" ? "login" : "register");
});

$("#doLoginButton").addEventListener("click", async () => {
  const phone = $("#phoneInput").value.trim();
  if (phone.length < 6) {
    showToast("请输入手机号");
    return;
  }

  if (authMode === "password") {
    const password = $("#passwordInput").value;
    if (password.length < 6) {
      showToast("密码至少 6 位");
      return;
    }
    if (AUTH_MODE !== "real") {
      state.loggedIn = true;
      state.user = { phone };
      updateAuthUI();
      closeModal("loginModal");
      showToast("演示登录成功");
      return;
    }
    const endpoint = authAction === "register" ? "/api/auth/register" : "/api/auth/login";
    try {
      $("#doLoginButton").disabled = true;
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ phone, password })
      });
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      state.loggedIn = true;
      state.user = data.user;
      updateAuthUI();
      closeModal("loginModal");
      showToast(authAction === "register" ? "注册成功，已自动登录" : "登录成功");
      loadSearchHistory();
      loadQueueState().then(resumePendingQueue);
    } catch (error) {
      showToast(error.message);
    } finally {
      $("#doLoginButton").disabled = false;
    }
    return;
  }

  const code = $("#codeInput").value.trim();
  if (code.length < 4) {
    showToast("请输入验证码");
    return;
  }
  if (AUTH_MODE === "real") {
    try {
      $("#doLoginButton").disabled = true;
      const data = await apiFetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code })
      });
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      state.loggedIn = true;
      state.user = data.user;
      updateAuthUI();
      closeModal("loginModal");
      showToast("登录成功");
      loadSearchHistory();
      loadQueueState().then(resumePendingQueue);
    } catch (error) {
      showToast(error.message);
    } finally {
      $("#doLoginButton").disabled = false;
    }
  } else {
    state.loggedIn = true;
    state.user = { phone };
    updateAuthUI();
    closeModal("loginModal");
    showToast("演示登录成功");
  }
});

$("#queueModalClose").addEventListener("click", () => closeModal("queueModal"));
$("#queueModal").addEventListener("click", (event) => {
  if (event.target.id === "queueModal") closeModal("queueModal");
});

$("#queueOptions").addEventListener("click", (event) => {
  const option = event.target.closest(".queue-option");
  if (!option) return;
  state.queueMinutes = Number(option.dataset.minutes);
  $$("#queueOptions .queue-option").forEach((item) => item.classList.remove("selected"));
  option.classList.add("selected");
});

$("#queueSubmitButton").addEventListener("click", async () => {
  const place = placeById(state.queuePlace);
  if (!place) return;
  $("#queueSubmitButton").disabled = true;
  $("#queueSubmitButton").textContent = "提交中…";
  let request;
  try {
    request = await saveQueueRequest(place);
  } catch (error) {
    showToast(error.message);
    $("#queueSubmitButton").disabled = false;
    $("#queueSubmitButton").textContent = "提交演示请求";
    return;
  }
  if (!request) return;
  setActiveQueue(request);
  closeModal("queueModal");
  showToast(
    AUTH_MODE === "real" && state.loggedIn
      ? `${place.name} 已约排 · 置顶信息会持续更新`
      : `${place.name} 已模拟约排 · 置顶信息会持续更新`
  );
});

$("#placeModalClose").addEventListener("click", () => closeModal("placeModal"));
$("#placeModal").addEventListener("click", (event) => {
  if (event.target.id === "placeModal") closeModal("placeModal");
});

$("#placeTicketButton").addEventListener("click", () => {
  if (state.modalPlace) openTicketModal(state.modalPlace);
});

$("#placeNavButton").addEventListener("click", () => {
  if (state.modalPlace) openNavigation(placeById(state.modalPlace));
});

$("#placeAddButton").addEventListener("click", () => {
  if (!state.modalPlace) return;
  toggleRoute(state.modalPlace);
  $("#placeAddButton").textContent = state.route.includes(state.modalPlace)
    ? "已加入路线"
    : "加入路线";
});

$("#ticketModalClose").addEventListener("click", () => closeModal("ticketModal"));
$("#ticketModal").addEventListener("click", (event) => {
  if (event.target.id === "ticketModal") closeModal("ticketModal");
});

$("#ticketOptions").addEventListener("click", (event) => {
  const option = event.target.closest("[data-ticket-type]");
  if (!option) return;
  state.ticketTypeIndex = Number(option.dataset.ticketType);
  renderTicketOptions();
});

$("#ticketMinus").addEventListener("click", () => {
  state.ticketQuantity = Math.max(1, state.ticketQuantity - 1);
  renderTicketOptions();
});

$("#ticketPlus").addEventListener("click", () => {
  state.ticketQuantity = Math.min(9, state.ticketQuantity + 1);
  renderTicketOptions();
});

$("#ticketSubmitButton").addEventListener("click", () => {
  const place = placeById(state.ticketPlace);
  if (!place) return;
  closeModal("ticketModal");
  closeModal("placeModal");
  showToast(`${place.name}：演示订单已提交，未产生真实支付`);
});

$("#rideModalClose").addEventListener("click", () => closeModal("rideModal"));
$("#rideModal").addEventListener("click", (event) => {
  if (event.target.id === "rideModal") closeModal("rideModal");
});

$("#membershipButton").addEventListener("click", () => {
  showToast("会员权益为演示内容：多日路线、更多排队预测次数");
});

$("#legalModalClose").addEventListener("click", () => closeModal("legalModal"));
$("#legalConfirmButton").addEventListener("click", () => closeModal("legalModal"));
$("#legalModal").addEventListener("click", (event) => {
  if (event.target.id === "legalModal") closeModal("legalModal");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal("loginModal");
    closeModal("queueModal");
    closeModal("placeModal");
    closeModal("ticketModal");
    closeModal("rideModal");
    closeModal("legalModal");
  }
});

$("#timeInput").value = `${todayLabel} · ${state.startTime}`;
restoreLocalQueue();
renderActiveQueue();
updateAuthCopy();
const initialView = window.location.hash.replace("#", "");
if (["home", "map", "route", "queue"].includes(initialView) && initialView !== "home") {
  showView(initialView);
} else {
  renderAll();
}
window.addEventListener("hashchange", () => {
  const view = window.location.hash.replace("#", "");
  if (["home", "map", "route", "queue"].includes(view) && view !== state.view) {
    showView(view);
  }
});
restoreSession();
loadAmap().then((loaded) => {
  if (loaded) {
    amapReady = true;
    renderAll();
  }
});

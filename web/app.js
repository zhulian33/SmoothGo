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
    type: "火锅 · 本地推荐",
    category: "food",
    rating: 4.6,avg: 70,
    distance: 3.4,
    lng: 125.305,
    lat: 43.862,
    queueMin: 20,
    queueMax: 30,
    hours: "10:30–21:00",
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
    // Same reasoning for contact details: all 23 curated rows were written with
    // no tel, so the booking sheet could offer no number even though Amap has one
    // for most of them (净月潭 0431-84518000, 伪满皇宫 0431-82866611). Let Amap
    // fill the gap instead of leaving the panel empty.
    if (amap.tel && !place.tel) place.tel = amap.tel;
    if (amap.website && !place.website) place.website = amap.website;
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
  },
  "the-hill": {
    subtitle: "室内文旅商业 · 美食/拍照 · 建议1.5h",
    description: "把餐饮、山体空间和城市拍照放在一起的室内街区，适合作为雨天的午餐停留点。",
  },
  imperial: {
    subtitle: "历史景点 · 《人世间》缉熙楼取景地 · 建议2h",
    description: "末代皇帝溥仪在长春的宫廷旧址，建筑和展览都适合慢慢看。",
  },
  film: {
    subtitle: "电影主题公园 · 亲子 · 建议4h",
    description: "以电影工业和特效体验为主的主题公园，适合带孩子或留出完整半天。",
  },
  guilin: {
    subtitle: "美食街区 · 小吃 · 建议1.5h",
    description: "长春本地小吃和夜间烟火气比较集中的街区，适合边逛边吃。",
  },
  southlake: {
    subtitle: "城市公园 · 《人世间》取景地 · 建议1h",
    description: "市区里适合散步和看落日的公园，也是《人世间》的取景地之一。",
  },
  "culture-square": {
    subtitle: "城市广场 · 拍照 · 建议0.5h",
    description: "长春的城市公共空间，适合路过时停留拍照，不需要专门安排太久。",
  },
  hongqi: {
    subtitle: "商圈美食 · 建议1.5h",
    description: "购物、餐饮和城市生活混在一起的商圈，适合作为路线中的补给点。",
  },
  zoo: {
    subtitle: "亲子自然 · 建议3h",
    description: "适合家庭游客的动植物公园，步行距离较长，建议留出完整半天。",
  },
  "chongqing-road": {
    subtitle: "商圈小吃 · 建议1h",
    description: "市中心的老牌商圈，适合快速吃饭和补充物资。",
  },
  "changying-old": {
    subtitle: "电影历史 · 《人世间》人民电影院取景地 · 建议1.5h",
    description: "长影旧址博物馆保留了长春电影工业的记忆，也是《人世间》的取景地。",
  },
  "people-square": {
    subtitle: "城市广场 · 建议0.5h",
    description: "适合在城市中心短暂停留、换乘和拍照的公共空间。",
  },
  louwailou: {
    subtitle: "火锅 · 大刀肉 · 本地推荐 · 建议1.5h",
    description: "长春人吃大刀肉的老去处，铜锅涮肉，适合冷天的一顿正餐，建议提前看排队和订座。",
  },
  yuanshengju: {
    subtitle: "火锅 · 本地推荐 · 建议1.5h",
    description: "长春本地人常去的火锅选择，适合晚餐或冷天的一顿热食。",
  },
  dasheke: {
    subtitle: "非遗吉菜 · 本地推荐 · 建议1.5h",
    description: "来自长春美食合集的本地吉菜选择，适合想认真吃一顿东北菜的午餐或晚餐。",
  },
  donglu: {
    subtitle: "烤鸭 · 聚餐 · 建议1.5h",
    description: "适合多人聚餐的烤鸭店，建议先看排队和订座情况。",
  },
  qianfeng: {
    subtitle: "炭缸烧烤 · 夜宵 · 建议1.5h",
    description: "适合晚上和朋友一起吃的烧烤，排队通常集中在晚餐后。",
  },
  tufengzheng: {
    subtitle: "牛腱面 · 快餐 · 建议45分钟",
    description: "适合路线中快速解决一顿的面馆，排队短、停留时间也短。",
  },
  haihua: {
    subtitle: "鱿鱼蒸饺 · 本地小吃 · 建议45分钟",
    description: "偏本地小吃的一顿，适合想尝试东北特色主食的人。",
  },
  "700cc": {
    subtitle: "饮品 · 奶茶 · 建议20分钟",
    description: "适合路线中补充饮品和休息，不需要专门安排一顿正餐。",
  },
  maquez: {
    subtitle: "小龙虾 · 夜宵 · 建议1.5h",
    description: "适合晚餐或夜宵的小龙虾店，旺季排队时间可能更长。",
  },
  jiumi: {
    subtitle: "绵绵冰 · 简餐 · 建议45分钟",
    description: "适合下午休息的甜品和简餐点，适合放在两段景点之间。",
  },
  dache: {
    subtitle: "砂锅土豆粉 · 小吃 · 建议45分钟",
    description: "适合快速吃一顿的砂锅小吃，适合作为路线中的轻量补给。",
  }
};

PLACES.forEach((place) => Object.assign(place, PLACE_DETAILS[place.id] || {}));

// The transport layer used to show three made-up rows -- "42 路 · 2 分钟后到站",
// "人民大街 南向北拥堵 · +8 分钟" -- describing a feed this app never had. It now
// shows the legs of the current plan, with times Amap actually returned. Live
// bus arrival still needs a 公交 data agreement we do not have; the traffic
// tile layer is genuine because it is Amap's own.
let transportRefreshing = false;

function transportLegs(stops = state.route.map(placeById).filter(Boolean)) {
  const legs = [];
  for (let index = 0; index < stops.length - 1; index += 1) {
    const from = stops[index];
    const to = stops[index + 1];
    if (!from || !to) continue;
    const fact = routeFact(from, to);
    const km = fact?.drive?.km ?? fact?.bus?.km ?? null;
    const real = fact?.source === "amap";
    const parts = [];
    if (fact?.drive?.minutes) parts.push(`驾车 ${fact.drive.minutes} 分钟`);
    if (fact?.bus?.minutes) parts.push(`公交 ${fact.bus.minutes} 分钟`);
    // 23 km on foot is a true number and a useless one, so only surface walking
    // when it is an option anybody would take.
    if (fact?.walk?.minutes && fact.walk.minutes <= 30) parts.push(`步行 ${fact.walk.minutes} 分钟`);
    if (Number.isFinite(km)) parts.push(`${km.toFixed(1)} 公里`);
    legs.push({
      id: `${from.id}~${to.id}`,
      toId: to.id,
      name: `${from.name} → ${to.name}`,
      type: real ? "高德路线" : "直线估算",
      detail: real ? parts.join(" · ") : "高德未返回该段路线，暂按直线距离估算",
      status: real ? "已接入" : "估算",
      lng:
        Number.isFinite(from.lng) && Number.isFinite(to.lng) ? (from.lng + to.lng) / 2 : null,
      lat:
        Number.isFinite(from.lat) && Number.isFinite(to.lat) ? (from.lat + to.lat) / 2 : null,
      x: Number.isFinite(from.x) && Number.isFinite(to.x) ? (from.x + to.x) / 2 : null,
      y: Number.isFinite(from.y) && Number.isFinite(to.y) ? (from.y + to.y) / 2 : null
    });
  }
  return legs;
}

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
  bookingPlace: null,
  gallery: [],
  galleryIndex: 0,
  routeReasons: {},
  lastReplan: null,
  queueRequests: [],
  queueQuota: { limit: 2, used: 0, remaining: 2 },
  activeQueue: null,
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
    hours: place.hours ? `营业 ${place.hours}` : "营业时间待确认"
    // No ticket field on purpose. The old card printed ¥30 / ¥70 / ¥180 that were
    // typed in by hand, which looks like a fare table and is not one. Anything
    // about price now comes from the booking channels the user actually opens.
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

/* ---------- Real routing ----------
 *
 * travelBetween() below is a straight-line estimate: haversine x 1.35 detour
 * factor at 26 km/h. It is honest about being an estimate and it is all the
 * planner can use, because planning runs synchronously and hundreds of times.
 *
 * The display layer can do better. AMap.Driving / Transfer / Walking are
 * already loaded with the map, so once a plan exists we ask for the real
 * leg and cache it. Rendering reads routeFacts first and falls back to the
 * estimate, and every rendered number says which one it is.
 */
const ROUTE_PLUGINS = { drive: "Driving", bus: "Transfer", walk: "Walking" };
const routeFacts = new Map();
const routePending = new Set();
const routeStats = { planned: 0, failed: 0 };
let routeRefreshing = false;

function pairKey(from, to) {
  return from.id < to.id ? `${from.id}|${to.id}` : `${to.id}|${from.id}`;
}

function routeFact(from, to) {
  return from && to ? routeFacts.get(pairKey(from, to)) || null : null;
}

function planOnce(mode, from, to) {
  return new Promise((resolve) => {
    const Plugin = window.AMap?.[ROUTE_PLUGINS[mode]];
    if (!Plugin || !window.AMap?.LngLat) return resolve(null);
    if (!Number.isFinite(from?.lng) || !Number.isFinite(from?.lat)) return resolve(null);
    if (!Number.isFinite(to?.lng) || !Number.isFinite(to?.lat)) return resolve(null);

    let settled = false;
    const finish = (value) => {
      if (!settled) {
        settled = true;
        resolve(value);
      }
    };
    // A hanging callback must not pin the panel on "loading" forever.
    const timer = setTimeout(() => finish(null), 8000);
    const stopTimer = () => clearTimeout(timer);

    try {
      const options =
        mode === "bus"
          ? { city: "长春市", policy: window.AMap.TransferPolicy?.LEAST_TIME }
          : mode === "drive"
            ? { policy: window.AMap.DrivingPolicy?.LEAST_TIME }
            : {};
      const planner = new Plugin(options);
      planner.search(new window.AMap.LngLat(from.lng, from.lat), new window.AMap.LngLat(to.lng, to.lat), (status, result) => {
        stopTimer();
        if (status !== "complete" || !result) return finish(null);
        // Driving/Walking return routes[]; Transfer returns plans[].
        const first = (result.routes || result.plans || [])[0];
        if (!first) return finish(null);
        const meters = Number(first.distance);
        const seconds = Number(first.time);
        if (!Number.isFinite(meters) || !Number.isFinite(seconds)) return finish(null);
        finish({ km: meters / 1000, minutes: Math.max(1, Math.round(seconds / 60)) });
      });
    } catch {
      stopTimer();
      finish(null);
    }
  });
}

// Serial on purpose: the routing service rate-limits, and a day has 2-3 legs.
async function ensureRouteFacts(stops) {
  if (!window.AMap || !Array.isArray(stops)) return false;
  let changed = false;
  for (let index = 0; index < stops.length - 1; index += 1) {
    const from = stops[index];
    const to = stops[index + 1];
    if (!from || !to || from.id === to.id) continue;
    const key = pairKey(from, to);
    if (routeFacts.has(key) || routePending.has(key)) continue;
    routePending.add(key);
    const [drive, bus, walk] = await Promise.all([
      planOnce("drive", from, to),
      planOnce("bus", from, to),
      planOnce("walk", from, to)
    ]);
    routePending.delete(key);
    const usable = drive || bus || walk;
    routeFacts.set(key, { drive, bus, walk, source: usable ? "amap" : "none" });
    if (usable) routeStats.planned += 1;
    else routeStats.failed += 1;
    changed = true;
  }
  return changed;
}

function travelBetween(from, to) {
  if (!from || !to) return 15;
  if (from.id === to.id) return 0;
  if (!Number.isFinite(from.lat) || !Number.isFinite(to.lat)) return 15;
  const key = pairKey(from, to);
  // A real Amap leg wins over the cached estimate.
  const fact = routeFacts.get(key);
  if (fact?.drive?.minutes) return fact.drive.minutes;
  const cached = travelCache.get(key);
  if (cached !== undefined) return cached;
  const km = distanceKm(from, to);
  const minutes = Math.max(8, Math.min(90, Math.round(((km * 1.35) / 26) * 60)));
  travelCache.set(key, minutes);
  return minutes;
}

function transportOptions(from, to) {
  const fact = routeFact(from, to);
  const fallbackDrive = travelBetween(from, to);
  const km = fact?.drive?.km || fact?.bus?.km || distanceKm(from, to);
  const distLabel = Number.isFinite(km) ? `${km.toFixed(1)} 公里` : "距离待接入";

  if (fact?.source === "amap") {
    const drive = fact.drive?.minutes || null;
    const bus = fact.bus?.minutes || null;
    const rows = [];
    if (drive) rows.push({ mode: "car", label: `驾车 ${drive} 分钟`, active: !bus });
    if (bus) rows.push({ mode: "bus", label: `公交 ${bus} 分钟`, active: !drive });
    if (!drive && !bus) rows.push({ mode: "car", label: `驾车约 ${fallbackDrive} 分钟`, active: true });
    rows.push({ mode: "taxi", label: `打车 ${distLabel}`, active: false });
    return rows;
  }

  return [
    { mode: "car", label: `驾车约 ${fallbackDrive} 分钟`, active: true },
    { mode: "bus", label: "公交未接入", active: false },
    { mode: "taxi", label: `打车 ${distLabel}`, active: false }
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
      markers = transportLegs()
        .filter((leg) => Number.isFinite(leg.lng) && Number.isFinite(leg.lat))
        .map((leg) => {
          const content = document.createElement("div");
          content.className = "amap-transport-marker";
          content.innerHTML = `<strong>${escapeHtml(leg.name)}</strong><span>${escapeHtml(leg.detail)}</span>`;
          return new AMap.Marker({
            position: [leg.lng, leg.lat],
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
    markers = transportLegs()
      .filter((leg) => Number.isFinite(leg.x) && Number.isFinite(leg.y))
      .map(
        (leg) => `
        <span class="map-transport-marker" style="left:${leg.x}%;top:${leg.y}%">
          <strong>${escapeHtml(leg.name)}</strong>
          <span>${escapeHtml(leg.detail)}</span>
        </span>
      `
      )
      .join("");
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
      <span>${escapeHtml(place.subtitle || place.type)}<br />${metrics.rating} · ${metrics.hours}<br />参考等候 ${queueText(place)} 分钟 · 非实时</span>
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
    const stops = state.route.map(placeById).filter(Boolean);
    // Real legs arrive asynchronously; repaint once they do.
    if (stops.length > 1 && !transportRefreshing) {
      transportRefreshing = true;
      ensureRouteFacts(stops)
        .then((changed) => {
          transportRefreshing = false;
          if (changed && state.mapLayer === "transport") renderPlaceList();
        })
        .catch(() => {
          transportRefreshing = false;
        });
    }
    const query = state.mapSearch.trim().toLowerCase();
    const transport = transportLegs(stops).filter((leg) =>
      `${leg.name}${leg.detail}`.toLowerCase().includes(query)
    );
    $("#mapCount").textContent = `交通 · ${transport.length} 段真实路段`;
    const transitCard = `
      <article class="place-card transit-card">
        <div class="place-card-head"><strong>乘车码</strong><span>地铁 · 公交</span></div>
        <div class="place-meta">长春轨道交通支持微信 / 支付宝 / 云闪付 / 长春E出行，2 元起步。码由这些平台生成，我们不代扣。</div>
        <div class="place-actions"><button type="button" data-transit="open">打开乘车码</button></div>
      </article>`;
    $("#placeList").innerHTML = transitCard + (
      transport
        .map(
          (leg) => `
        <article class="place-card transport-card">
          <div class="place-card-head"><strong>${escapeHtml(leg.name)}</strong><span>${leg.type}</span></div>
          <div class="place-meta">${escapeHtml(leg.detail)}</div>
          <div class="place-queue">${leg.status}</div>
          <div class="place-actions"><button type="button" data-nav="${leg.toId}">导航</button></div>
        </article>
      `
        )
        .join("") ||
      `<div class="notice compact">交通图层显示的是当前行程相邻站点之间的真实路段，先去地图把地点加进路线。</div>`
    );
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
          <a href="#" data-ticket="${place.id}">购票/订座渠道 ↗</a>
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
              参考等候 ${queueText(place)} 分钟 · 非实时<br />
              <a href="#" data-ticket="${place.id}">购票/订座渠道 ↗</a>
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

  // This panel used to print hardcoded strings ("14:20", "42 路 · 2 min",
  // "人民大街 · +8 min") that never changed and reflected nothing real. It now
  // reports where the leg times actually came from. Live bus arrival still has
  // no feed, so that row stays an explicit placeholder.
  const liveOverlay = $("#routeLiveOverlay");
  if (liveOverlay) {
    const legs = [];
    for (let index = 0; index < schedule.stops.length - 1; index += 1) {
      legs.push(routeFact(schedule.stops[index], schedule.stops[index + 1]));
    }
    const real = legs.filter((fact) => fact?.source === "amap").length;
    const pending = legs.filter((fact) => !fact).length;
    const tag = real ? "高德" : pending ? "规划中" : "估算";
    const legLabel = real
      ? `${real}/${legs.length} 段真实`
      : pending
        ? "正在向高德请求…"
        : "按直线距离估算";
    liveOverlay.innerHTML = `
      <div class="map-live-title"><strong>路线数据</strong><span class="live-tag">${tag}</span></div>
      <div class="map-live-row${real ? "" : " muted"}"><span>驾车 · 公交</span><strong>${legLabel}</strong></div>
      <div class="map-live-row muted"><span>实时到站</span><strong>未接入</strong></div>
      <div class="map-live-row"><span>乘车码</span><button type="button" class="live-action" data-transit="open">打开</button></div>
      <div class="map-live-row muted"><span>路况图层</span><strong>${
        state.trafficVisible ? "已开启" : "未开启"
      }</strong></div>
    `;
  }
  renderReplanBanner();
  renderMap($("#routeMap"), "route");

  // Fetch the real legs once the panel is on screen, then repaint with them.
  if (schedule.stops.length > 1 && !routeRefreshing) {
    routeRefreshing = true;
    ensureRouteFacts(schedule.stops)
      .then((changed) => {
        routeRefreshing = false;
        if (changed && schedule.stops.length > 1) renderRoute();
      })
      .catch(() => {
        routeRefreshing = false;
      });
  }
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
        <a class="text-link" href="#" data-ticket="${place.id}">购票/订座渠道 ↗</a>
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
  const bar = $("#activeQueueCard");
  if (!pin || !bar) return;
  const snapshot = queueSnapshot(state.activeQueue);
  if (!snapshot) {
    pin.hidden = true;
    pin.innerHTML = "";
    bar.hidden = true;
    bar.innerHTML = "";
    return;
  }

  // On the queue page the bar below carries the whole story, so the sticky strip
  // under the header would just repeat it two centimetres higher.
  pin.hidden = state.view === "queue";
  pin.innerHTML = `
    <div class="queue-pin-place"><span class="live-dot"></span><strong>${escapeHtml(
      snapshot.request.placeName
    )}</strong></div>
    <div class="queue-pin-metric"><span>${snapshot.status}</span><strong>${snapshot.positionText}</strong></div>
    <div class="queue-pin-wait"><span>预计等待</span><strong>${snapshot.waitText}</strong></div>
    <button class="queue-pin-open" type="button" data-view="queue">查看详情</button>
    <button class="queue-pin-close" type="button" data-queue-dismiss aria-label="收起置顶排队信息">×</button>
  `;

  bar.hidden = false;
  const guestNote = snapshot.request.guest
    ? "游客演示 · 这条记录只存在这台浏览器，登录后会保存到账号；"
    : "";
  bar.innerHTML = `
    <div class="queue-topbar-identity">
      <span class="queue-topbar-kicker"><span class="live-dot"></span>${
        snapshot.isFood ? "餐馆排队参考" : "景区排队参考"
      } · ${escapeHtml(String(snapshot.request.requestId || "SG-DEMO"))}</span>
      <strong>${escapeHtml(snapshot.request.placeName)}</strong>
    </div>
    <div class="queue-topbar-metric"><span>预计等待</span><strong>${snapshot.waitText}</strong></div>
    <div class="queue-topbar-metric is-position"><span>队伍位置</span><strong>未接入</strong></div>
    <div class="queue-topbar-metric"><span>提交时间</span><strong>${snapshot.updatedText.replace(
      "提交于 ",
      ""
    )}</strong></div>
    <div class="queue-topbar-actions">
      <button class="queue-topbar-link" type="button" data-open-place="${escapeHtml(
        snapshot.request.placeId || ""
      )}">查看地点</button>
      <button class="queue-topbar-close" type="button" data-queue-dismiss>收起</button>
    </div>
    <p class="queue-topbar-note">${guestNote}等待时长是你提交时选的参考值，队伍位置未接入任何实时数据；不会真实排队、订座或支付。</p>
  `;
}

function dismissActiveQueue() {
  if (state.activeQueue?.id) {
    localStorage.setItem(DISMISSED_QUEUE_KEY, String(state.activeQueue.id));
  }
  state.activeQueue = null;
  localStorage.removeItem(ACTIVE_QUEUE_KEY);
  renderActiveQueue();
  showToast("已收起这条排队信息");
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
      // A guest request made before logging in is still the newest thing the
      // user submitted; do not wipe the bar just because the account has no
      // record of it yet.
      state.activeQueue = null;
      restoreLocalQueue();
      if (!state.activeQueue) localStorage.removeItem(ACTIVE_QUEUE_KEY);
    }
  } catch (error) {
    state.queueRequests = [];
    restoreLocalQueue();
  }
  renderActiveQueue();
  updateMembershipUI();
}

async function saveQueueRequest(place) {
  if (AUTH_MODE === "real" && state.loggedIn) {
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

  // Guests used to be bounced into the login sheet before anything happened, so
  // the queue page never showed the bar this feature is about. The request is a
  // label and a number the user already picked -- nothing is booked, charged or
  // sent anywhere -- so there is nothing to protect behind a login wall. It is
  // kept in localStorage and marked guest; logging in is what gets it saved.
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
    guest: !state.loggedIn,
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
  $("#queueModalText").textContent = `为 ${place.name} 选择等待时长。提交后排队页最顶上会多出一栏，写着地点和这段时长，不会创建真实订单。`;
  const quota = queueQuotaCopy();
  $("#queueQuota").textContent = state.loggedIn
    ? `本月剩余 ${quota.remaining} / ${quota.limit} 次排队管家额度`
    : "游客演示模式 · 登录后可保存请求和额度";
  const exhausted = AUTH_MODE === "real" && state.loggedIn && quota.remaining <= 0;
  $("#queueSubmitButton").disabled = exhausted;
  $("#queueSubmitButton").textContent = exhausted ? "本月额度已用完" : "提交演示请求";
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

// 乘车码：我们不能生成，也不该生成。码由支付平台下发并扣款，第三方既拿不到
// 密钥也画不出可用的码——上一版的假二维码就是拿线路名做模运算拼出来的。这里
// 只做"把手机交给能出码的 App"：支付宝乘车码有公开 scheme，可以直接唤起；
// 微信和云闪付没有对外 scheme，给步骤比给一个点了没反应的按钮诚实。
const TRANSIT_APPS = [
  {
    key: "alipay",
    name: "支付宝乘车码",
    note: "直接唤起支付宝的乘车码页，进站前点开",
    action: "打开支付宝",
    scheme: "alipays://platformapi/startapp?appId=200011235",
    steps: "支付宝 → 首页「出行」→ 乘车码"
  },
  {
    key: "wechat",
    name: "微信乘车码",
    note: "微信没有对外开放的乘车码 scheme，只能进 App 再点两下",
    action: "打开微信",
    scheme: "weixin://",
    steps: "微信 → 我 → 服务 → 出行服务 → 乘车码"
  },
  {
    key: "unionpay",
    name: "云闪付",
    note: "云闪付首页 → 乘车码，同样支持长春轨道交通",
    action: "复制名称",
    copy: "云闪付 乘车码"
  },
  {
    key: "echuxing",
    name: "长春E出行 / 长春市民卡",
    note: "长春轨道交通官方 App，地铁公交一码通行；市民卡 App 扫码 9 折",
    action: "复制名称",
    copy: "长春E出行"
  }
];

function renderTransitOptions() {
  $("#transitOptions").innerHTML = TRANSIT_APPS.map(
    (app) => `
      <div class="transit-option">
        <span><strong>${escapeHtml(app.name)}</strong><em>${escapeHtml(app.note)}</em></span>
        ${
          app.scheme
            ? `<button type="button" class="transit-go" data-scheme="${escapeHtml(
                app.scheme
              )}" data-steps="${escapeHtml(app.steps)}">${escapeHtml(app.action)}</button>`
            : `<button type="button" class="transit-go" data-copy="${escapeHtml(
                app.copy
              )}">${escapeHtml(app.action)}</button>`
        }
      </div>`
  ).join("");
}

function openTransitModal() {
  renderTransitOptions();
  openModal("transitModal");
}


// Amap hands back up to three photos per POI and the sheet used to show exactly
// one of them at 190x128. 97% of the library has at least one and most have
// three, so a gallery costs no new request and invents nothing.
function galleryFor(place) {
  const seen = new Set();
  const shots = [];
  [place.photo, ...(place.photos || [])].forEach((url) => {
    if (!url || typeof url !== "string" || seen.has(url)) return;
    seen.add(url);
    shots.push(url);
  });
  return shots.slice(0, 5);
}

function renderGallery(place) {
  const shots = state.gallery;
  const host = $("#placeGallery");
  if (!shots.length) {
    host.innerHTML = `<div class="gallery-empty">${icon(place.icon)}<span>暂无实景图</span></div>`;
    return;
  }
  const index = Math.max(0, Math.min(state.galleryIndex, shots.length - 1));
  state.galleryIndex = index;
  const many = shots.length > 1;
  host.innerHTML = `
    <figure class="gallery-main">
      <img class="place-photo" src="${escapeHtml(shots[index])}" alt="${escapeHtml(place.name)}" loading="lazy" referrerpolicy="no-referrer" />
      ${
        many
          ? `<span class="gallery-count">${index + 1} / ${shots.length}</span>
             <button class="gallery-arrow prev" type="button" data-shot="${index - 1}" aria-label="上一张">‹</button>
             <button class="gallery-arrow next" type="button" data-shot="${index + 1}" aria-label="下一张">›</button>`
          : ""
      }
    </figure>
    ${
      many
        ? `<div class="gallery-thumbs">${shots
            .map(
              (url, shotIndex) => `
          <button class="gallery-thumb ${shotIndex === index ? "is-active" : ""}" type="button" data-shot="${shotIndex}" aria-label="第 ${shotIndex + 1} 张">
            <img src="${escapeHtml(url)}" alt="" referrerpolicy="no-referrer" />
          </button>`
            )
            .join("")}</div>`
        : ""
    }
  `;
}

// Dish names come from web/place-menus.js, keyed by brand so all 24 老昌春饼
// branches share one menu. Amap has no dish data and 点评/美团 block logged-out
// visitors, so an unlisted shop gets an honest empty state instead of a
// plausible-looking list. No prices anywhere: we have no price source.
// 桂林路 / 红旗街 / 重庆路 是街区不是店：它们本来就没有"一份菜单"，用
// "这家店未收录"去说一条街是错的。
function isStreetFood(place) {
  return (
    /(路|街|巷|市场|广场)$/.test(place.name) ||
    /街区|商圈|夜市|市场/.test(place.type || "")
  );
}

function menuFor(place) {
  if (place.category !== "food") return null;
  const table = typeof BRAND_MENUS !== "undefined" ? BRAND_MENUS : {};
  const chain = chainKey(place.name);
  let entry = table[chain] || table[place.name];
  if (!entry) {
    // 华莱士·全鸡汉堡 / 金川烤肉·非遗地标店 / 大食客·非遗吉菜: the brand name is
    // a prefix of Amap's full shop name. Longest match wins so 老昌 doesn't
    // swallow 老昌食品.
    const hit = Object.keys(table)
      .filter((key) => chain.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];
    if (hit) entry = table[hit];
  }
  if (entry?.dishes?.length) {
    return {
      label: "菜单 · 招牌菜",
      source: "编辑部整理 · 非门店价目表",
      note: entry.note || "",
      dishes: entry.dishes,
      place
    };
  }
  return {
    label: "菜单",
    source: isStreetFood(place) ? "街区 · 按摊位" : "未收录",
    note: "",
    dishes: [],
    place
  };
}

function renderMenu(place) {
  const menu = menuFor(place);
  $("#placeMenuSection").hidden = !menu;
  if (!menu) return;
  $("#placeMenuLabel").textContent = menu.label;
  $("#placeMenuSource").textContent = menu.source;
  const list = $("#placeMenu");
  if (menu.dishes.length) {
    list.className = "detail-menu";
    list.innerHTML = menu.dishes
      .map(
        ([name, note]) =>
          `<li><span class="dish-name">${escapeHtml(name)}</span>${
            note ? `<span class="dish-note">${escapeHtml(note)}</span>` : ""
          }</li>`
      )
      .join("");
  } else if (isStreetFood(place)) {
    list.className = "detail-menu is-empty";
    list.innerHTML = `<li class="dish-empty">
      <span>${escapeHtml(place.name)}是一条街区，没有统一菜单——吃什么取决于你进哪家店。</span>
      <button type="button" data-copy="${escapeHtml(place.name)}">复制名称去点评搜</button>
    </li>`;
  } else {
    list.className = "detail-menu is-empty";
    list.innerHTML = `<li class="dish-empty">
      <span>这家店的菜单还没有收录。高德只提供店名、地址和照片，不提供菜品；点评与美团的网页版会把未登录访客拦在门外。</span>
      <button type="button" data-copy="${escapeHtml(place.name)}">复制店名去点评搜</button>
    </li>`;
  }
  $("#placeMenuNote").hidden = !menu.note;
  $("#placeMenuNote").textContent = menu.note;
}

function openPlaceModal(id) {
  const place = placeById(id);
  if (!place) return;
  state.modalPlace = id;

  $("#placeDetailType").textContent =
    place.category === "food" ? "美食 · 本地推荐" : "景点 · 地点详情";
  $("#placeDetailTitle").textContent = place.name;
  $("#placeDetailSubtitle").textContent = place.subtitle || place.type;
  state.gallery = galleryFor(place);
  state.galleryIndex = 0;
  renderGallery(place);
  const heroPhoto = state.gallery[0];
  const ratingText = place.rating ? `${place.rating} 高德` : "暂无";
  const descText = place.description || [place.district, place.address].filter(Boolean).join(" ");
  // Say only what is actually on the card -- four memorials have a photo but no
  // Amap score, so the blanket "图片与评分来自高德" was wrong for them.
  const photoNote = [
    heroPhoto
      ? state.gallery.length > 1
        ? `${state.gallery.length} 张图 · 来自高德 POI`
        : "图片来自高德 POI"
      : "暂无实景图",
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

  renderMenu(place);

  $("#placeDianping").href = externalSearchUrl("dianping", place.name);
  $("#placeMeituan").href = externalSearchUrl("meituan", place.name);
  $("#placeDouyin").href = externalSearchUrl("douyin", place.name);

  const ticketButton = $("#placeTicketButton");
  // It no longer opens a fake order sheet: it lists the places that actually
  // sell the ticket, so the label can finally say 购票 rather than promise an
  // outcome. The ↗ marks it as leaving the app.
  ticketButton.textContent = place.category === "food" ? "订座 ↗" : "购票 ↗";
  ticketButton.dataset.place = place.id;

  const addButton = $("#placeAddButton");
  addButton.textContent = state.route.includes(place.id)
    ? "已加入路线"
    : "加入路线";
  addButton.dataset.place = place.id;

  $("#placeNavButton").dataset.place = place.id;

  openModal("placeModal");
}

// Outbound booking links, not an order. The app has no ticketing API and no
// payment licence, so the honest thing it can do is hand the user over to
// whoever does sell the ticket. Every place came from Amap, so its Amap page
// always exists and always carries the official phone; everything else is a
// search URL rather than a deep link we could not guarantee resolves.
// 美团 / 点评的网页搜索页对未登录访客不可用：实测会跳 mlogin.dianping.com
// 登录墙或 verify.meituan.com 风控页。把它们当可用链接列出来是假的，所以这
// 两个只给关键词，让用户在已登录的本机 App 里搜。
const OTA_APP_ONLY = new Set(["meituan", "dianping"]);

// Set once /api/booking/channels answers. Until then links point straight at
// the destination, which is what the standalone build has to do anyway.
let bookingServerOk = false;

function bookingQuery(place) {
  const tel = place.tel ? String(place.tel).replace(/[^0-9+\-(),;]/g, "").slice(0, 32) : "";
  return {
    place: place.id || "",
    name: place.name || "",
    lng: Number.isFinite(place.lng) ? String(place.lng) : "",
    lat: Number.isFinite(place.lat) ? String(place.lat) : "",
    tel
  };
}

function amapPoiUrl(place) {
  if (!Number.isFinite(place.lng) || !Number.isFinite(place.lat)) return null;
  return (
    `https://uri.amap.com/marker?position=${place.lng},${place.lat}` +
    `&name=${encodeURIComponent(place.name)}&src=SmoothGo&coordinate=gaode&callnative=1`
  );
}

// Mirrors server/app.py:booking_channels_for so the static build behaves the
// same when no API is running.
function localBookingChannels(place) {
  const name = place.name || "";
  const tel = bookingQuery(place).tel;
  const amap = amapPoiUrl(place);
  const channels = [
    {
      key: "official_miniprogram",
      label: "官方小程序",
      note: "未收录链接 —— 复制名称，到微信搜索官方小程序",
      available: false,
      url: null,
      kind: "search",
      searchHint: name
    },
    {
      key: "official_site",
      label: "官方网站",
      note: place.website ? "该机构在高德登记的官网地址" : "未收录官方站点",
      available: Boolean(place.website),
      url: place.website
        ? /^https?:/i.test(String(place.website).trim())
          ? String(place.website).trim()
          : `https://${String(place.website).trim()}`
        : null,
      kind: place.website ? "link" : "none"
    },
    {
      key: "phone",
      label: tel ? `电话 ${tel}` : "场馆电话",
      note: tel ? "订票、订座与开放时间以对方答复为准" : "该地点暂无登记电话",
      available: Boolean(tel),
      url: tel ? `tel:${tel}` : null,
      kind: tel ? "tel" : "none"
    },
    {
      key: "amap",
      label: "高德 POI 详情页",
      note: "完整档案：电话、公告与商家入口",
      available: Boolean(amap),
      url: amap,
      kind: amap ? "link" : "none"
    },
    {
      key: "meituan",
      label: "美团",
      note: `在本机美团 App 内搜索「${name}」`,
      available: false,
      url: externalSearchUrl("meituan", name),
      kind: "search",
      searchHint: name
    },
    {
      key: "dianping",
      label: "大众点评",
      note: `在本机大众点评 App 内搜索「${name}」`,
      available: false,
      url: externalSearchUrl("dianping", name),
      kind: "search",
      searchHint: name
    },
    {
      key: "douyin",
      label: "抖音",
      note: `搜索「${name}」查看团购`,
      available: Boolean(name),
      url: externalSearchUrl("douyin", name),
      kind: "link"
    }
  ];
  return channels;
}

function bookingChannelHref(place, channel) {
  if (!channel.url) return null;
  // Route through our own /api/go so a dead link can be fixed server-side.
  // It never takes a URL from the caller, so ?url= cannot turn it into an
  // open redirect.
  if (bookingServerOk && channel.available && !OTA_APP_ONLY.has(channel.key)) {
    const params = new URLSearchParams({ ...bookingQuery(place), ch: channel.key });
    return `${API_BASE}/api/go?${params.toString()}`;
  }
  return channel.url;
}

function renderBookingRows(place, channels) {
  $("#bookingOptions").innerHTML = channels
    .map((channel) => {
      const label = escapeHtml(channel.label);
      const note = escapeHtml(channel.note);
      if (channel.kind === "search") {
        return `<button class="booking-channel search" type="button" data-copy="${escapeHtml(
          channel.searchHint || place.name
        )}">
          <span><strong>${label}</strong><em>${note}</em></span>
          <b>复制</b>
        </button>`;
      }
      if (!channel.available || !channel.url) {
        return `<div class="booking-channel missing">
          <span><strong>${label}</strong><em>${note}</em></span>
          <b>未收录</b>
        </div>`;
      }
      const href = bookingChannelHref(place, channel);
      const external = /^https?:/i.test(href);
      return `<a class="booking-channel" href="${escapeHtml(href)}"${
        external ? ' target="_blank" rel="noreferrer noopener"' : ""
      }>
          <span><strong>${label}</strong><em>${note}</em></span>
          <b>↗</b>
        </a>`;
    })
    .join("");
}

async function renderBookingChannels() {
  const place = placeById(state.bookingPlace);
  if (!place) return;
  const isFood = place.category === "food";
  $("#ticketTitle").textContent = `${place.name} · ${isFood ? "订座渠道" : "购票渠道"}`;
  $("#ticketDesc").textContent = `SmoothGo 不出票、不收款。以下为第三方渠道，${
    isFood ? "是否成功订座" : "票价、库存与开放时间"
  }以对方页面为准。`;
  // Paint local rows first so the panel is never empty while the API answers.
  renderBookingRows(place, localBookingChannels(place));
  $("#bookingFootnote").textContent =
    "多数景区只在其官方微信公众号 / 小程序售票或分时预约；官方小程序链接需由景区自己提供，收录后可直跳。" +
    "滑雪场多数雪季也是先预约后到场。";

  try {
    const params = new URLSearchParams(bookingQuery(place));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${API_BASE}/api/booking/channels?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    if (Array.isArray(data.channels) && data.channels.length) {
      bookingServerOk = true;
      renderBookingRows(place, data.channels);
    }
  } catch {
    // No API (static file, offline, or file://) -- local rows stay.
    bookingServerOk = false;
  }
}

function openBookingModal(id) {
  state.bookingPlace = id;
  renderBookingChannels();
  openModal("ticketModal");
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

  const openPlace = event.target.closest("[data-open-place]");
  if (openPlace) {
    if (openPlace.dataset.openPlace) openPlaceModal(openPlace.dataset.openPlace);
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
    openBookingModal(ticket.dataset.ticket);
    return;
  }

  const shot = event.target.closest("[data-shot]");
  if (shot) {
    const total = state.gallery.length;
    if (!total) return;
    const wanted = Number(shot.dataset.shot);
    // Wrap around: the arrows on the first and last photo should keep working.
    state.galleryIndex = ((wanted % total) + total) % total;
    const place = placeById(state.modalPlace);
    if (place) renderGallery(place);
    return;
  }

  const transit = event.target.closest("[data-transit]");
  if (transit) {
    openTransitModal();
    return;
  }

  const scheme = event.target.closest("[data-scheme]");
  if (scheme) {
    // No App installed means the browser silently does nothing, so fall back to
    // the manual path instead of leaving the user on a dead end.
    const steps = scheme.dataset.steps || "";
    window.location.href = scheme.dataset.scheme;
    window.setTimeout(() => {
      if (!document.hidden) showToast(`没唤起？${steps}`);
    }, 1400);
    return;
  }

  const copy = event.target.closest("[data-copy]");
  if (copy) {
    event.preventDefault();
    const text = copy.dataset.copy || "";
    const done = () => showToast(`已复制「${text}」，到 App 里粘贴搜索`);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      const field = document.createElement("textarea");
      field.value = text;
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard blocked -- the toast still tells them what to search */
      }
      field.remove();
      done();
    }
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
      loadQueueState();
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
      loadQueueState();
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
  // Nothing counts down any more, so the old "置顶信息会持续更新" was a promise
  // with nothing behind it. Say where the bar is, not that it moves.
  showToast(
    request.guest
      ? `${place.name} 已生成演示排队 · 排队页顶部可以看到`
      : `${place.name} 已约排 · 排队页顶部可以看到`
  );
});

$("#placeModalClose").addEventListener("click", () => closeModal("placeModal"));
$("#placeModal").addEventListener("click", (event) => {
  if (event.target.id === "placeModal") closeModal("placeModal");
});

$("#placeTicketButton").addEventListener("click", () => {
  if (state.modalPlace) openBookingModal(state.modalPlace);
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

$("#transitModalClose").addEventListener("click", () => closeModal("transitModal"));
$("#transitModal").addEventListener("click", (event) => {
  if (event.target.id === "transitModal") closeModal("transitModal");
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
    closeModal("transitModal");
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

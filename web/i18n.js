/**
 * SmoothGo bilingual layer.
 *
 * The Chinese string is the key. `t()` looks it up only when the UI is in
 * English, so every comparison that relies on a Chinese value (categories,
 * `confidence !== "低"`, place names) keeps working in both languages — the
 * data never moves, only what is printed. Missing entries fall back to the
 * Chinese original, so the dictionary can grow without breaking anything.
 */
(function (global) {
  var LANG_KEY = "smoothgo_lang";
  var HAN = /[一-龥]/;
  var listeners = [];
  var current = "zh";

  try {
    var saved = global.localStorage && global.localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "zh") current = saved;
  } catch (error) {
    /* private mode: stay on Chinese */
  }

  /* ------------------------------------------------------------------ *
   * UI strings. Key = the Chinese literal as it appears in the source.  *
   * `{v0}`, `{v1}` … are interpolation slots filled by t().            *
   * ------------------------------------------------------------------ */
  var EN = {
    /* --- transport / travel facts --- */
    "高德路线": "Amap route",
    "直线估算": "Straight-line estimate",
    "高德未返回该段路线，暂按直线距离估算":
      "Amap returned no route for this leg, so it is estimated from straight-line distance",
    "驾车": "Driving",
    "驾车约": "About",
    "公交": "Transit",
    "步行": "Walking",
    "打车": "Taxi",
    "分钟": "min",
    "公里": "km",
    "小时": "h",
    "驾车 {v0} 分钟": "Driving {v0} min",
    "公交 {v0} 分钟": "Transit {v0} min",
    "步行 {v0} 分钟": "Walking {v0} min",
    "{v0} 公里": "{v0} km",
    "驾车约 {v0} 分钟": "About {v0} min driving",
    "打车 {v0}": "Taxi {v0}",
    "规划中 · {v0}": "Planning · {v0}",
    "已接入": "Connected",
    "估算": "estimate",
    "高德": "Amap",
    "规划中": "Planning",
    "正在向高德请求…": "Requesting from Amap…",
    "按直线距离估算": "Estimated from straight-line distance",
    "{v0}/{v1} 段真实": "{v0}/{v1} real legs",
    "已开启": "On",
    "未开启": "Off",
    "待接入": "Not connected",
    "距离待接入": "Distance not connected",
    "公交未接入": "Transit not connected",
    "暂无评分": "No rating yet",
    "人均待接入": "Spend not connected",
    "营业时间待确认": "Opening hours unconfirmed",
    "当前位置": "My location",
    "长春市": "Changchun",
    "长春": "Changchun",
    "长春市朝阳区": "Chaoyang District, Changchun",
    "长春示意地图": "Changchun schematic map",
    "实时路况已开": "Live traffic on",
    "路况需联网": "Traffic needs a network connection",
    "路况图层": "Traffic layer",
    " · 复用": " · reused",
    "已切换高德卫星图": "Switched to Amap satellite",
    "高德卫星图层尚未加载，当前显示示意底图":
      "The Amap satellite layer has not loaded, so the schematic base map is shown",
    "已切换标准地图": "Switched to the standard map",
    "已叠加高德实时路况": "Amap live traffic overlay on",
    "高德图层尚未加载，当前只记录路况开关":
      "The Amap layer has not loaded, so only the traffic switch is recorded",
    "已关闭实时路况": "Live traffic off",
    "高德 {v0}": "Amap {v0}",
    "人均约 ¥{v0}": "About ¥{v0} per person",
    "营业 {v0}": "Open {v0}",
    "正在打开高德导航：{v0}": "Opening Amap navigation: {v0}",

    /* --- weekdays and dates --- */
    "周日": "Sunday",
    "周一": "Monday",
    "周二": "Tuesday",
    "周三": "Wednesday",
    "周四": "Thursday",
    "周五": "Friday",
    "周六": "Saturday",
    "{v0} 月 {v1} 日": "{v0}/{v1}",
    "今天 {v0}": "Today {v0}",
    "{v0} 月 {v1} 日 {v2}": "{v0}/{v1} {v2}",
    "{v0} 小时 {v1} 分": "{v0} h {v1} min",
    "{v0} 小时": "{v0} h",
    "{v0} 分钟": "{v0} min",
    "第 {v0} 张": "Photo {v0}",

    /* --- place list and cards --- */
    "长春特色预览": "Changchun highlights",
    "长春特色": "Changchun highlight",
    "已加入路线": "Added to route",
    "加入路线": "Add to route",
    "已从路线移除 {v0}": "Removed {v0} from the route",
    "已加入路线：{v0}": "Added to route: {v0}",
    "演示版最多选": "The demo allows at most",
    "演示版最多选5个地点": "The demo allows at most 5 places",
    "没有找到结果，换个关键词试试。": "No results. Try another keyword.",
    "找到": "Found",
    "找到 {v0} 个地点": "Found {v0} places",
    "未命名": "Unnamed",
    "未分类": "Uncategorised",
    "暂无地址": "No address on file",
    "暂无电话": "No phone on file",
    "电话 {v0}": "Phone {v0}",
    "已定位：{v0}": "Located: {v0}",
    "搜索中": "Searching",
    "搜索中…": "Searching…",
    "搜索失败：{v0}": "Search failed: {v0}",
    "先输入关键词，例如": "Type a keyword first, for example",
    "高德门店搜索": "Amap store search",

    /* --- map --- */
    "{v0} · <strong>{v1}</strong> 个地点": "{v0} · <strong>{v1}</strong> places",
    "你在这里": "You are here",
    "● 你在这里 · ○ 地点 · — 推荐路线":
      "● You are here · ○ Places · — Suggested route",
    "长春 · {v0}": "Changchun · {v0}",
    "{v0} 个": "{v0}",
    "第 {v0}/{v1} 天 · ": "Day {v0}/{v1} · ",
    "{v0}{v1} 个地点 · 约 {v2} · 总车程 {v3}":
      "{v0}{v1} places · about {v2} · {v3} travelling",
    '<div class="route-preview-more"><button class="text-link" type="button" data-view="route">查看完整路线 →</button></div>':
      '<div class="route-preview-more"><button class="text-link" type="button" data-view="route">See the full route →</button></div>',
    "第 {v0} 天路线": "Day {v0} route",
    "交通 · {v0} 段真实路段": "Transport · {v0} real legs",
    "交通图层显示的是当前行程相邻站点之间的真实路段，先去地图把地点加进路线。":
      "This layer shows the real legs between consecutive stops of the current trip. Add places to the route on the map first.",
    "长春 · {v0} 个地点": "Changchun · {v0} places",

    /* --- route --- */
    "长春一日路线": "One day in Changchun",
    "长春 {v0} 日路线": "Changchun in {v0} days",
    "第 {v0} 天 · {v1}": "Day {v0} · {v1}",
    "{v0} 个地点 · {v1} · {v2} 开始": "{v0} places · {v1} · starts {v2}",
    "<strong>{v0}</strong><span>天总行程</span>":
      "<strong>{v0}</strong><span>days in total</span>",
    "还没有地点，先去地图添加。": "No places yet — add some on the map.",
    "最优连接": "Best order",
    "驾车优先": "Driving first",

    /* --- planning / keywords --- */
    "已提取：{v0}": "Detected: {v0}",
    "已提取 {v0} 个关键词": "Detected {v0} keywords",
    "没有识别到关键词，可以手动填写": "No keywords detected — you can fill the form in by hand",
    "没有识别到关键词": "No keywords detected",
    "已按你的条件生成路线（演示）": "Route generated from your conditions (demo)",
    "已生成 {v0} 天路线（演示）": "Generated a {v0}-day route (demo)",
    "手动条件生成": "Generated from the manual form",
    "至少需要两个地点才能重排": "At least two places are needed to replan",
    "当前路线已经是较优的排队组合": "This route is already a good queue combination",
    "已重排：预计少排 {v0} 分钟": "Replanned: about {v0} min less queueing",
    "已恢复重排前的路线": "Restored the route from before replanning",
    "已刷新排队估算（演示数据）": "Queue estimates refreshed (demo data)",
    "预算 {v0}": "Budget {v0}",
    "时间 {v0}": "Start {v0}",
    "{v0} 天": "{v0} days",
    "这个地点没有坐标，无法导航。": "This place has no coordinates, so navigation is unavailable.",

    /* --- planner form values (shown as chips and select text) --- */
    "自然": "Nature",
    "历史": "History",
    "美食": "Food",
    "东北菜": "Northeastern Chinese",
    "雪景": "Snow scenery",
    "电影": "Film",
    "亲子": "Family",
    "拍照": "Photo spots",
    "摄影": "Photography",
    "轻松": "Easy",
    "休闲": "Leisure",
    "家庭": "Family",
    "独自": "Solo",
    "1 位成人": "1 adult",
    "2 位成人": "2 adults",
    "咖啡": "Coffee",
    "景点": "Attractions",

    /* --- auth --- */
    "手机号账号登录": "Sign in with a phone number",
    "使用手机号和密码登录；首次可注册，也可以切换到验证码登录。":
      "Sign in with your phone number and password. The first visit can create an account, or switch to login by code.",
    "已登录": "Signed in",
    "我的": "Me",
    "游客预览": "Guest preview",
    "游客演示模式": "Guest demo mode",
    "登录": "Sign in",
    "去登录": "Sign in",
    "去注册": "Create account",
    "注册并登录": "Create account and sign in",
    "已有账号？": "Already have an account?",
    "还没有账号？": "No account yet?",
    "请输入手机号": "Enter your phone number",
    "请输入验证码": "Enter the code",
    "验证码已发送，请查看短信": "Code sent — check your messages",
    "验证码已发送（演示验证码 {v0} 后六位）": "Code sent (demo code ends {v0})",
    "演示验证码": "Demo code",
    "密码至少": "Password must be at least",
    "密码至少6位": "Password must be at least 6 characters",
    "演示登录成功": "Demo sign-in successful",
    "注册成功，已自动登录": "Account created and signed in",
    "登录成功": "Signed in",
    "已退出登录": "Signed out",
    "提交中…": "Submitting…",
    "请求失败 ({v0})": "Request failed ({v0})",

    /* --- queue --- */
    "队列位置未接入": "Queue position not connected",
    "演示请求": "Demo request",
    "收起置顶排队信息": "Collapse the pinned queue bar",
    "游客演示": "Guest demo",
    "餐馆排队参考": "Restaurant queue reference",
    "景区排队参考": "Attraction queue reference",
    "提交于": "Submitted",
    "提交于 {v0}": "Submitted {v0}",
    "提交于 ": "Submitted ",
    "已收起这条排队信息": "Queue bar collapsed",
    "本月剩余 {v0} / {v1} 次": "{v0} / {v1} left this month",
    "本月剩余 {v0} / {v1} 次排队管家额度": "{v0} / {v1} queue-assist credits left this month",
    "已使用 {v0} 次演示请求；提交记录会保存在当前账号下，不产生真实订单。":
      "{v0} demo requests used. They are saved under this account and create no real order.",
    "本月演示额度已用完。正式会员、支付和额度重置尚未接入。":
      "This month's demo quota is used up. Paid membership, payments and quota reset are not connected.",
    "本月额度已用完": "Monthly quota used up",
    "提交演示请求": "Submit demo request",
    "最近请求：{v0} · {v1} 分钟 · ": "Latest request: {v0} · {v1} min · ",
    "置顶信息会持续更新": "The pinned bar keeps updating",
    "会员权益为演示内容：多日路线、更多排队预测次数":
      "Membership perks are demo content: multi-day routes and more queue predictions",
    "刷新估算": "Refresh estimates",

    /* --- history --- */
    "恢复这条路线": "Restore this route",
    "这条记录没有可恢复的路线": "This record has no route to restore",
    "历史路线": "Saved route",
    "已恢复「{v0}」": 'Restored "{v0}"',
    "{v0} 天": "{v0} days",
    '<span class="history-chip">{v0} 天</span>':
      '<span class="history-chip">{v0} days</span>',
    "还没有搜索记录": "No search history yet",
    "已加载 {v0} 条搜索记录": "Loaded {v0} search records",
    "刷新": "Refresh",

    /* --- detail sheet --- */
    "一份菜单": "A menu",
    "这家店未收录": "This shop is not covered",
    "菜单": "Menu",
    "菜单 · 招牌菜": "Menu · signature dishes",
    "编辑部整理": "Compiled by SmoothGo",
    "编辑部整理 · 非门店价目表": "Compiled by SmoothGo · not the shop's price list",
    "街区 · 按摊位": "Street · stall by stall",
    "未收录": "Not covered",
    "暂无": "None",
    "图片与评分来自高德": "Photos and rating from Amap",
    "图片来自高德": "Photos from Amap",
    "暂无实景图": "No photo available",
    "评分来自高德": "Rating from Amap",
    "无评分来源": "No rating source",
    " · 人均为品类估算": " · spend is a category estimate",
    "评分": "Rating",
    "人均": "Spend",
    "排队": "Queue",
    "营业": "Open",
    "待确认": "Unconfirmed",
    "电话": "Phone",
    "上一张": "Previous",
    "下一张": "Next",
    "美食 · 本地推荐": "Food · local pick",
    "景点 · 地点详情": "Attraction · place details",
    "{v0} 高德": "{v0} on Amap",
    "约 ¥{v0}": "About ¥{v0}",
    "参考 {v0} 分钟": "About {v0} min",
    "{v0} 张图 · 来自高德 POI": "{v0} photos · from Amap POI",

    /* --- booking handoff --- */
    "订座": "Book a table",
    "购票": "Buy tickets",
    "订座 ↗": "Book a table ↗",
    "购票 ↗": "Buy tickets ↗",
    "官方小程序": "Official mini program",
    "未收录链接 —— 复制名称，到微信搜索官方小程序":
      "No link on file — copy the name and search for the official mini program in WeChat",
    "官方网站": "Official site",
    "该机构在高德登记的官网地址": "The official site registered for this venue on Amap",
    "未收录官方站点": "No official site on file",
    "场馆电话": "Venue phone",
    "订票、订座与开放时间以对方答复为准":
      "Tickets, reservations and opening hours are whatever the venue tells you",
    "该地点暂无登记电话": "No phone number registered for this place",
    "高德详情页": "Amap page",
    "完整档案：电话、公告与商家入口":
      "Full record: phone, notices and merchant links",
    "美团": "Meituan",
    "大众点评": "Dianping",
    "抖音": "Douyin",
    "订座渠道": "Reservation channels",
    "购票渠道": "Ticket channels",
    "是否成功订座": "whether the reservation succeeded",
    "票价、库存与开放时间": "fares, availability and opening hours",
    "多数景区只在其官方微信公众号":
      "Most scenic areas sell tickets or timed-entry slots only through their own WeChat account or mini program",
    "滑雪场多数雪季也是先预约后到场。":
      "Ski resorts also require a booking before you turn up during most of the season.",
    "在本机美团 App 内搜索「{v0}」": 'Search for "{v0}" in the Meituan app',
    "在本机大众点评 App 内搜索「{v0}」": 'Search for "{v0}" in the Dianping app',
    "搜索「{v0}」查看团购": 'Search "{v0}" for deals',

    /* --- transit codes --- */
    "把手机交给能出码的": "Hand the phone to an app that can show the code",
    "支付宝乘车码": "Alipay transit code",
    "直接唤起支付宝的乘车码页，进站前点开":
      "Opens the Alipay transit-code page directly — open it before you reach the gate",
    "打开支付宝": "Open Alipay",
    "微信乘车码": "WeChat transit code",
    "微信没有对外开放的乘车码":
      "WeChat has no public transit-code scheme, so you have to tap through the app",
    "打开微信": "Open WeChat",
    "云闪付": "UnionPay",
    "云闪付": "UnionPay app",
    "云闪付乘车码": "UnionPay transit code",
    "复制名称": "Copy name",
    "长春出行": "Changchun E-Travel",
    "长春轨道交通官方":
      "The official Changchun rail transit app — one code for metro and bus; the Citizen Card app gives 10% off",
    "没唤起？": "Nothing opened? ",
    "已复制「{v0}」，到 App 里粘贴搜索":
      'Copied "{v0}" — paste it into the app to search',

    /* --- toasts and misc --- */
    "城市切换：当前为长春演示": "City switch: the demo only covers Changchun",
    "英文版将在后续版本开放": "English is now available — the switch is in the header",
    "已恢复「{v0}」": 'Restored "{v0}"',
    "已提取": "Detected",
    "搜索记录会自动保存在这个账号下。":
      "Search history is saved under this account automatically.",

    /* --- login dialog --- */
    "登录后保存路线": "Sign in to save routes",
    "当前是课程演示版本，不会发送真实短信，也不会上传真实手机号。":
      "This is a course demo. No real SMS is sent and no real phone number is uploaded.",
    "密码登录": "Password",
    "验证码登录": "Login code",
    "手机号": "Phone",
    "密码": "Password",
    "验证码": "Code",
    "发送验证码": "Send code",
    "继续即表示同意演示版": "Continuing means you accept the demo",
    "服务条款与隐私说明": "Terms and privacy",
    "已登录：": "Signed in as ",
    "退出登录": "Sign out",
    "查看会员权益": "See membership perks",
    "演示会员": "Demo membership",
    "本月剩余": "left this month",
    "基础路线规划免费；排队管家请求只保存演示记录，不产生真实订单。":
      "Basic route planning is free; queue-assist requests only save a demo record and create no real order.",

    /* --- queue dialog --- */
    "排队管家": "Queue assist",
    "在允许的场地，帮你省下等待": "Skip the wait where venues allow it",
    "选择等待时长": "Pick how long you are willing to wait",
    "演示会员每月": "Demo membership includes",
    "只对明确允许的餐厅或非严格排队场地提供；景区第一阶段只做信息监测。":
      "Offered only at restaurants that explicitly allow it or where queueing is informal; scenic areas are information-only in phase one.",
    "分钟": "min",

    /* --- transit dialog --- */
    "地铁与公交怎么刷": "How to tap in on metro and bus",
    "乘车码 · 长春": "Transit codes · Changchun",
    "票价": "Fares",
    "刷卡": "Cards",
    "刷码": "QR codes",
    "我知道了": "Got it",
    "导航": "Navigate",

    /* --- legal sheet --- */
    "演示版说明": "About this demo",
    "隐私、条款与数据边界": "Privacy, terms and data boundaries",
    "演示数据": "Demo data",
    "账号与隐私": "Accounts and privacy",
    "排队管家": "Queue assist",
    "票务、乘车码与地图": "Tickets, transit codes and maps",
    "正式上线前": "Before a real launch",

    /* --- home --- */
    "主页": "Home",
    "地图": "Map",
    "路线": "Route",
    "四时俱好": "Any season is a good season",
    "是长春。": "It is Changchun.",
    "一句话规划": "Plan in one sentence",
    "也可以自己编辑下面条件": "Or edit the conditions below yourself",
    "提取关键词": "Extract keywords",
    "时间": "Start time",
    "每日预算": "Daily budget",
    "天数": "Days",
    "地点": "Area",
    "人群": "Party",
    "生成路线": "Generate route",
    "支持自然语言": "Natural language supported",
    "地图预览 ·": "Map preview ·",
    "个地点": "places",
    "高德底图": "Amap base map",
    "查看完整路线": "See the full route",
    "天气": "Weather",
    "未接入数据源": "No data source connected",
    "参考等候": "Reference wait",
    "已保存": "Saved",
    "路线中的地点": "Places on the route",
    "今日路线": "Today's route",
    "今天可以这样走": "Here is how today could go",
    "我的记录": "My records",
    "最近的搜索": "Recent searches",
    "地图找地点": "Find places on the map",
    "从地图开始，选你想去的地方": "Start from the map and pick where you want to go",
    "点地图标注或左侧地点卡片，查看实景图、营业时间、参考等候和票务入口。":
      "Click a map pin or a card on the left for photos, opening hours, a reference wait and ticket links.",
    "图片": "Photos",
    "全部": "All",
    "餐厅": "Restaurants",
    "排队少": "Short queues",
    "人均以下": "Under per person",
    "分以上": "and above",
    "交通": "Transport",
    "行程路段": "Legs of this trip",
    "底图": "Base map",
    "标准": "Standard",
    "卫星": "Satellite",
    "实时路况": "Live traffic",
    "真实门店数据": "Real store data",
    "搜索附近好店": "Search for places nearby",
    "来自高德": "From Amap",
    "搜索": "Search",
    "搜附近": "Within",
    "路线规划": "Route planning",
    "开始导航": "Start navigation",
    "智能重排": "Replan smartly",
    "添加地点": "Add places",
    "现在 · 排队": "Queues · now",
    "哪些地方要等，等多久": "Where you wait, and for how long",
    "排队信息来自演示数据，真实产品需场地授权或用户主动上报。":
      "Queue data here is demo data; a real product needs venue authorisation or user reports.",
    "公交到站时间需要对接公交集团数据源，目前未接入；请以站牌或官方为准。":
      "Bus arrival times need a feed from the bus operator and are not connected — trust the stop display or the official app.",
    "天气地图排队": "Weather · map · route · queues · tickets",
    "手机号登录": "Phone sign-in",

    /* --- entries recovered from the template pass --- */
    "分钟 · 非实时": "min · not live",
    "乘车码": "Transit code",
    "未接入": "Not connected",
    "预计等待": "Expected wait",
    '<span class="marker-popover"><strong>{v0}</strong><span>{v1}</span><em>{v2} · {v3}<br />参考等候 {v4} 分钟 · 非实时</em></span>':
      '<span class="marker-popover"><strong>{v0}</strong><span>{v1}</span><em>{v2} · {v3}<br />Reference wait {v4} min · not live</em></span>',
    "南湖": "South Lake",
    "北湖": "North Lake",
    "人民大街": "Renmin Street",
    '<div class="map-you"><span class="map-you-dot"></span>你在这里</div>':
      '<div class="map-you"><span class="map-you-dot"></span>You are here</div>',
    '<div class="map-legend">● 你在这里 · ○ 地点 · — 推荐路线</div>':
      '<div class="map-legend">● You are here · ○ Places · — Suggested route</div>',
    "站": "Stop",
    "卫星图": "Satellite view",
    "卫星示意图（需联网）": "Schematic satellite view (needs a connection)",
    "地图搜索结果": "Map search results",
    "地铁 · 公交": "Metro · bus",
    "长春轨道交通支持微信": "Changchun rail accepts WeChat",
    "支付宝": "Alipay",
    "长春E出行，2 元起步。码由这些平台生成，我们不代扣":
      "Changchun E-Travel, from ¥2. Those platforms issue the code and take the fare, not us",
    "打开乘车码": "Open transit code",
    '<div class="notice compact">交通图层显示的是当前行程相邻站点之间的真实路段，先去地图把地点加进路线。</div>':
      '<div class="notice compact">This layer shows the real legs between consecutive stops of the current trip. Add places to the route on the map first.</div>',
    '<span>电话 {v0}</span>': "<span>Phone {v0}</span>",
    '<span class="poi-empty">暂无电话</span>': '<span class="poi-empty">No phone on file</span>',
    "地图定位": "Locate on map",
    "先输入关键词，例如 东北菜、咖啡、景点。":
      "Type a keyword first, for example Northeastern, coffee or attractions.",
    "高德 POI 插件加载失败，检查 config.js 的 Key 是否开通了 PlaceSearch 服务、域名是否在白名单内。":
      "The Amap POI plugin failed to load. Check that the key in config.js has the PlaceSearch service enabled and that this domain is on its whitelist.",
    "未配置高德 Key：把 web/config.example.js 复制为 config.js，填入 JS API Key 后重试。":
      "No Amap key configured: copy web/config.example.js to config.js, fill in the JS API key and try again.",
    "还没有定位信息，请先允许浏览器定位，或改用城市搜索。":
      "No location yet. Allow the browser to locate you, or search by city instead.",
    "总时长": "Total time",
    "总车程": "Total travel",
    "当日人均 · 估": "Spend today · est.",
    '<div><strong>{v0}</strong><span>天总行程</span></div>':
      '<div><strong>{v0}</strong><span>days in total</span></div>',
    '<div class="notice compact">还没有地点，先去地图添加。</div>':
      '<div class="notice compact">No places yet — add some on the map.</div>',
    "移除": "Remove",
    "路线数据": "Route data",
    "驾车 · 公交": "Driving · transit",
    "实时到站": "Live arrivals",
    "打开": "Open",
    "已重排": "Replanned",
    "撤销重排": "Undo replan",
    "置信度": "Confidence",
    "分钟参考等候": "min reference wait",
    "[SmoothGo] 搜索记录保存失败": "[SmoothGo] Could not save the search record",
    "查看详情": "See details",
    "游客演示 · 这条记录只存在这台浏览器，登录后会保存到账号；":
      "Guest demo · this record lives in this browser only; sign in to save it to your account.",
    "队伍位置": "Position in queue",
    "提交时间": "Submitted at",
    "查看地点": "See the place",
    "收起": "Collapse",
    "等待时长是你提交时选的参考值，队伍位置未接入任何实时数据；不会真实排队、订座或支付":
      "The wait is the reference value you picked. Queue position is not connected to any live data, and nothing is queued, booked or paid for real.",
    "演示版最多选 5 个地点": "The demo allows at most 5 places",
    "为 {v0} 选择等待时长。提交后排队页最顶上会多出一栏，写着地点和这段时长，不会创建真实订单。":
      "Pick how long you will wait for {v0}. After you submit, a bar appears at the top of the queue page with the place and that duration. No real order is created.",
    "游客演示模式 · 登录后可保存请求和额度":
      "Guest demo mode · sign in to keep requests and quota",
    "支付宝 → 首页「出行」→ 乘车码": "Alipay → Home → Travel → Transit code",
    "微信没有对外开放的乘车码 scheme，只能进 App 再点两下":
      "WeChat has no public transit-code scheme, so open the app and tap twice",
    "微信 → 我 → 服务 → 出行服务 → 乘车码":
      "WeChat → Me → Services → Travel → Transit code",
    "云闪付首页 → 乘车码，同样支持长春轨道交通":
      "UnionPay home → transit code, also accepted on Changchun rail",
    "云闪付 乘车码": "UnionPay transit code",
    "长春E出行 / 长春市民卡": "Changchun E-Travel / Changchun Citizen Card",
    "长春轨道交通官方 App，地铁公交一码通行；市民卡 App 扫码 9 折":
      "The official Changchun rail app — one code for metro and bus; the Citizen Card app gives 10% off",
    "长春E出行": "Changchun E-Travel",
    '<div class="gallery-empty">{v0}<span>暂无实景图</span></div>':
      '<div class="gallery-empty">{v0}<span>No photo available</span></div>',
    "第": "Photo ",
    "张": "",
    "是一条街区，没有统一菜单": "This is a street, so there is no single menu",
    "吃什么取决于你进哪家店": "what you eat depends on which stall you walk into",
    "复制名称去点评搜": "Copy the name and search it on Dianping",
    "这家店的菜单还没有收录。高德只提供店名、地址和照片，不提供菜品；点评与美团的网页版会把未登录访客拦在门外":
      "This shop's menu is not covered yet. Amap gives a name, an address and photos, never dishes; the Dianping and Meituan websites turn away visitors who are not signed in.",
    "复制店名去点评搜": "Copy the shop name and search it on Dianping",
    "图片来自高德 POI": "Photos from Amap POI",
    "高德 POI 详情页": "Amap POI page",
    "复制": "Copy",
    "不出票、不收款。以下为第三方渠道":
      "sells no ticket and takes no money. These are third-party channels",
    "以对方页面为准": "as their own page states",
    "多数景区只在其官方微信公众号 / 小程序售票或分时预约；官方小程序链接需由景区自己提供，收录后可直跳。":
      "Most scenic areas sell tickets or timed-entry slots only through their own WeChat account or mini program. The link has to come from the venue itself; once we have it, the button opens it directly.",
    "没唤起？{v0}": "Nothing opened? {v0}",
    "演示验证码：{v0}": "Demo code: {v0}",
    "验证码已发送（演示验证码 123456）": "Code sent (demo code 123456)",
    "密码至少 6 位": "Password must be at least 6 characters",
    "{v0} 已生成演示排队 · 排队页顶部可以看到":
      "{v0}: demo queue created · see the top of the queue page",
    "{v0} 已约排 · 排队页顶部可以看到":
      "{v0}: queued · see the top of the queue page",
    "还有什么": "Anything else",
    "参考等候 {v0} 分钟 · 非实时": "reference wait {v0} min · not live",
    "推荐路线": "Suggested route",
    "地点标记": "Places",
    "天": "days",
    "天总行程": "day total",
    "还没有搜索记录，生成一条路线就会出现在这里。":
      "No searches yet — generate a route and it will show up here.",

    /* --- queue confidence: shown through tv(), never compared ------ */
    "低": "Low",
    "中": "Medium",
    "高": "High",

    /* --- Amap POI categories: shown through tv() ------------------- */
    "中餐厅": "Chinese restaurant",
    "火锅店": "Hotpot",
    "冷饮店": "Drinks & ice cream",
    "快餐厅": "Fast food",
    "特色/地方风味餐厅": "Local speciality",
    "剧场": "Theatre",
    "风景名胜": "Scenic area",
    "咖啡厅": "Cafe",
    "糕饼店": "Bakery",
    "纪念馆": "Memorial hall",
    "酒吧": "Bar",
    "韩国料理": "Korean",
    "清真菜馆": "Halal",
    "日本料理": "Japanese",
    "休闲餐饮场所": "Casual dining",
    "体育休闲服务场所": "Sports & leisure",
    "四川菜(川菜)": "Sichuan",
    "外国餐厅": "International",
    "动物园": "Zoo",
    "植物园": "Botanical garden",
    "甜品店": "Dessert",
    "海鲜酒楼": "Seafood",
    "寺庙道观": "Temple",
    "娱乐场所": "Entertainment",
    "公司": "Company",
    "麦当劳": "McDonald's",
    "综合酒楼": "Restaurant",
    "肯德基": "KFC",
    "综合体育馆": "Sports centre",
    "海滩": "Beach",
    "游戏厅": "Arcade",
    "培训机构": "Training centre",
    "美术馆": "Art museum",
    "购物中心": "Shopping centre",
    "展览馆": "Exhibition hall",
    "湖南菜(湘菜)": "Hunan",
    "必胜客": "Pizza Hut",
    "牛扒店(扒房)": "Steakhouse",
    "广东菜(粤菜)": "Cantonese",

    /* --- vocabulary used by the hand-written place cards ----------- */
    "快餐": "Fast food",
    "蒸饺": "Steamed dumplings",
    "本地小吃": "Local snack",
    "饮品": "Drinks",
    "奶茶": "Milk tea",
    "简餐": "Light meal",
    "砂锅": "Clay pot"
  };

  /* ------------------------------------------------------------------ *
   * Whole-sentence entries for the static markup in index.html.        *
   * ------------------------------------------------------------------ */
  var EN_MARKUP = {
    "SmoothGo 畅游通": "SmoothGo",
    "畅游通": "",
    "查看完整路线 →": "See the full route →",
    "长春地标": "Changchun landmark",
    "长春名吃": "Changchun classic",
    "每天": "Daily",
    "周一-周五": "Mon–Fri",
    "周一至周五": "Mon–Fri",
    "周六-周日": "Sat–Sun",
    "周末": "Weekends",
    "全天": "All day",
    "全天营业": "all day",
    "本地整理": "Compiled locally",
    "高德 POI": "Amap POI",
    "中": "medium",
    "高": "high",
    "大众点评 ↗": "Dianping ↗",
    "美团 ↗": "Meituan ↗",
    "抖音 ↗": "Douyin ↗",
    /* POI type segments (display only) */
    "景点": "Attraction",
    "度假村": "Resort",
    "旅游景点": "Scenic spot",
    "国家级景点": "National scenic area",
    "步行街": "Pedestrian street",
    "城市广场": "City square",
    "室内文旅商业": "Indoor cultural mall",
    "商业": "Retail",
    "室内小镇": "Indoor town",
    "半日": "Half day",
    "一日": "Full day",
    "室内": "Indoor",
    "室外": "Outdoor",
    "街区": "Street",
    "小吃": "Street food",
    "商圈": "Shopping district",
    "购物": "Shopping",
    "夜生活": "Nightlife",
    "城市": "City",
    "火锅": "Hotpot",
    "本地推荐": "Local pick",
    "烤鸭": "Roast duck",
    "聚餐": "Group meal",
    "吉菜": "Jilin cuisine",
    "夜宵": "Late night",
    "烧烤": "Barbecue",
    "小龙虾": "Crayfish",
    "公园": "Park",
    "博物馆": "Museum",
    "寺庙": "Temple",
    "咖啡": "Coffee",
    "甜品": "Dessert",
    "面馆": "Noodle shop",
    "饺子": "Dumplings",
    "长春 · 今天": "Changchun · today",
    "自己填条件，或者直接说一段话。SmoothGo 会把地点、天气、车程、排队和购票连成一天到三周的顺路行程。":
      "Fill in the conditions, or just describe your trip in one sentence. SmoothGo ties places, weather, travel time, queues and tickets into a route that runs from a single day to three weeks.",
    "支持自然语言 · 游客也可先预览":
      "Natural language supported · guests can preview first",
    "3 个地点 · 约 7 小时 · 总车程 57 分钟":
      "3 places · about 7 hours · 57 minutes travelling",
    "2 个": "2",
    "3 个": "3",
    "参考等候 · 非实时": "Reference wait · not live",
    "路线中的地点": "Places on the route",
    "地图预览 ·": "Map preview ·",
    "个地点": "places",
    "图片 / 评分 / 营业时间来自高德 · 人均与等候为估算":
      "Photos / rating / opening hours from Amap · spend and waits are estimates",
    "人均 ¥100 以下": "Under ¥100 per person",
    "4.5 分以上": "Rated 4.5 and above",
    "来自高德 POI · 店名 / 分类 / 地址 / 电话":
      "From Amap POI · name / category / address / phone",
    "搜附近 3 公里": "Search within 3 km",
    "3 个地点 · 今天 · 09:30 开始": "3 places · today · starts 09:30",
    "＋ 添加地点": "＋ Add places",
    "驾车优先 · 按路程估算": "Driving first · estimated from distance",
    "现在 · 排队": "Queues · now",
    "演示数据 · 不产生真实订单 ·": "Demo data · no real orders ·",
    "隐私与条款": "Privacy and terms",
    "天气 / 地图 / 路线 / 排队 / 票务":
      "Weather / map / route / queues / tickets",
    "手机号登录 · 演示": "Phone sign-in · demo",
    "FREE · 演示会员": "FREE · demo membership",
    "本月剩余 2 / 2 次": "2 / 2 left this month",
    "查看会员权益 →": "See membership perks →",
    "排队管家 · 演示": "Queue assist · demo",
    "30 分钟": "30 min",
    "60 分钟": "60 min",
    "90 分钟": "90 min",
    "演示会员每月 2 次排队管家额度":
      "Demo membership includes 2 queue-assist requests a month",
    "地点详情": "Place details",
    "购票渠道 · 外链": "Ticket channels · outbound links",
    "购票渠道": "Ticket channels",
    "SmoothGo 不出票、不收款。": "SmoothGo sells no tickets and takes no money.",
    "乘车码 · 长春": "Transit codes · Changchun",
    "地铁与公交怎么刷": "How to tap in on metro and bus",
    "长春轨道交通全线网支持微信、支付宝、云闪付乘车码，也支持「长春E出行」「长春市民卡」扫码过闸。乘车码由这些平台生成并扣费。":
      "Every Changchun rail line accepts the WeChat, Alipay and UnionPay transit codes, as well as the Changchun E-Travel and Changchun Citizen Card apps. Those platforms generate the code and take the fare.",
    "2 元起步（7 公里内），按里程递增":
      "From ¥2 for the first 7 km, then by distance",
    "全国交通联合卡可直接过闸；长春轨道交通一卡通有折扣":
      "Any China T-Union card taps through directly; the Changchun rail card gets a discount",
    "进出站都在闸机上方感应区扫": "Scan at the reader above the gate, in and out",
    "SmoothGo 不生成乘车码、不代扣票款，也不参与票务清算。到站时间与车厢拥挤度需接入运营方数据，当前未接入。":
      "SmoothGo generates no code, takes no fare and clears no payment. Arrival times and carriage crowding need an operator feed and are not connected.",
    "演示版说明": "About this demo",
    "隐私、条款与数据边界": "Privacy, terms and data boundaries",
    "演示数据": "Demo data",
    "地点、地址、坐标、营业时间、评分和图片来自高德开放平台 POI 数据，会随平台更新而变化；人均消费按品类估算，":
      "Places, addresses, coordinates, opening hours, ratings and photos come from the Amap open platform and change as it updates; spend per person is estimated from the category, so it is ",
    "选择等待时长。提交后排队页最顶上会多出一栏，写着地点和这段时长。":
      "Pick how long you are willing to wait. After you submit, a bar appears at the top of the queue page with the place and that duration.",
    "购票 / 订座": "ticket / booking",
    "地点、地址、坐标、营业时间、评分和图片来自高德开放平台":
      "Places, addresses, coordinates, opening hours, ratings and photos come from the Amap open platform",
    "，会随平台更新而变化；人均消费按品类估算，":
      " and change as it updates; spend per person is estimated from the category, so it is ",
    "非真实账单": "not a real bill",
    "。天气、公交到站、实时路况、排队人数、票务与会员支付":
      ". Weather, bus arrivals, live traffic, queue length, ticketing and membership payments ",
    "尚未接入任何数据源": "are not connected to any data source",
    "，页面中的相关数值只用于课程演示。":
      ", so the numbers on screen exist for the course demo only.",
    "账号与隐私": "Accounts and privacy",
    "本地演示可创建手机号和密码。真实部署应使用 HTTPS，并以隐私政策说明保存目的、保存期限、删除方式和用户权利。":
      "The local demo can create a phone number and a password. A real deployment needs HTTPS and a privacy policy stating the purpose, retention period, deletion method and user rights.",
    "当前只模拟请求和状态时间线，不会派单、收款或承诺优先入场。正式服务只应在明确允许的餐厅或非严格排队场地开放，景区第一阶段仅提供信息。":
      "This only simulates a request and its timeline — nothing is dispatched, charged or promised as priority entry. A real service should open only at restaurants that allow it or where queueing is informal; scenic areas stay information-only in phase one.",
    "票务、乘车码与地图": "Tickets, transit codes and maps",
    "「购票 / 订座」按钮只把用户送到真正售票的地方——景区电话、高德 POI 详情页、美团、点评、抖音——本应用":
      "The ticket / booking button only sends you to whoever actually sells the ticket — the venue phone, the Amap POI page, Meituan, Dianping, Douyin. This app ",
    "不出票、不收款、不采集支付信息": "sells no ticket, takes no money and collects no payment data",
    "，票价与库存以对方页面为准。乘车码同理：码由支付宝、微信、云闪付或长春E出行生成，本应用只负责唤起对应 App，":
      "; fares and availability are whatever their page says. Transit codes work the same way: Alipay, WeChat, UnionPay or Changchun E-Travel generate the code and this app only opens the app, ",
    "不生成乘车码、不代扣票款": "generating no code and taking no fare",
    "。地图和路线能力接入高德后，仍需遵守其服务条款与配额限制。":
      ". Map and routing ride on Amap and remain subject to its terms and quota.",
    "菜单": "Menu",
    "招牌菜由编辑部按品牌整理（": "Signature dishes are compiled by brand in-house (",
    "），没有价格、没有套餐，也不是门店官方价目表；高德不提供菜品数据，未收录的店会明确标注。":
      "): no prices, no set meals, and not the shop's own price list. Amap has no dish data, and shops we have not covered say so.",
    "正式上线前": "Before a real launch",
    "还需要合作协议、隐私政策、数据删除机制、客服与应急流程、支付退款规则，以及排队协助人员的实名、培训、保险和交接规范。":
      "It still needs venue agreements, a privacy policy, a deletion mechanism, support and incident procedures, refund rules, and real-name checks, training, insurance and handover rules for queue staff.",
    "我知道了": "Got it",
    "我想带爸妈去长春玩一天，预算 500，喜欢东北菜和历史，不想太累。":
      "One day in Changchun with my parents, budget 500, we like Northeastern food and history, nothing too tiring.",
    "我想带爸妈去长春玩一天，预算500，喜欢东北菜和历史，不想太累。":
      "One day in Changchun with my parents, budget 500, we like Northeastern food and history, nothing too tiring.",
    "今天 · 09:30": "Today · 09:30",
    "1 天": "1 day",
    "用一句话描述你的行程": "Describe your trip in one sentence",
    "规划天数，支持 1 到 21 天": "Trip length, 1 to 21 days",
    "长春实时地图预览": "Live Changchun map preview",
    "地图找地点": "Find places on the map",
    "搜索长春的餐厅、景点": "Search restaurants and attractions in Changchun",
    "地图图层": "Map layers",
    "地点列表": "Place list",
    "长春地图": "Changchun map",
    "高德门店搜索": "Amap store search",
    "关键词，如 东北菜 / 咖啡 / 景点":
      "Keyword, e.g. Northeastern / coffee / attractions",
    "搜索城市": "Search city",
    "路线规划": "Route planning",
    "路线地图": "Route map",
    "排队": "Queues",
    "关闭": "Close",
    "至少 6 位": "At least 6 characters",
    "6 位验证码": "6-digit code",
    "SmoothGo 主页": "SmoothGo home",
    "主导航": "Main navigation",
    "公交到站时间需要对接公交集团数据源，目前未接入；请以站牌或官方 App 为准。":
      "Bus arrival times need the transit operator's feed, which is not connected yet. Trust the stop sign or the official app."
  };

  function fill(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(vars, name)
        ? String(vars[name])
        : match;
    });
  }

  function lookup(zh) {
    if (EN[zh] !== undefined) return EN[zh];
    if (EN_MARKUP[zh] !== undefined) return EN_MARKUP[zh];
    return zh;
  }

  function t(zh, vars) {
    if (current !== "en") return fill(zh, vars);
    return fill(lookup(zh), vars);
  }

  /* Translate a vocabulary word that is also a data value
     (categories, city names, badges). Never used in comparisons. */
  function tv(zh) {
    if (current !== "en") return zh;
    return lookup(zh);
  }

  /* Opening hours arrive as Chinese data strings ("每天 10:00-22:00",
     "周二至周日 09:00-17:00"). Swap the recurring words and the day
     names so the readable part stays readable. */
  var DAY_SHORT = {
    周一: "Mon",
    周二: "Tue",
    周三: "Wed",
    周四: "Thu",
    周五: "Fri",
    周六: "Sat",
    周日: "Sun",
    周天: "Sun"
  };

  /* Longer keys first so "全天营业" wins over "全天". */
  var HOURS_WORDS = [
    ["全天关闭", "closed all day"],
    ["全天营业", "all day"],
    ["法定节假日", "public holidays"],
    ["全天", "all day"],
    ["每天", "daily"],
    ["周末", "weekends"],
    ["工作日", "weekdays"],
    ["夏季", "summer"],
    ["冬季", "winter"],
    ["不定期", "irregular"],
    ["关闭", "closed"],
    ["休息", "closed"],
    ["不营业", "closed"],
    ["不", "closed"]
  ];

  function shortDay(name) {
    return DAY_SHORT[name] || name;
  }

  function th(text) {
    if (current !== "en") return text;
    var value = String(text == null ? "" : text);
    /* "周一至周日" / "周一-周日" / "周一~周日" -> "Mon–Sun" */
    value = value.replace(
      /(周[一二三四五六日天])\s*[至\-~]\s*(周[一二三四五六日天])/g,
      function (match, from, to) {
        return shortDay(from) + "–" + shortDay(to);
      }
    );
    /* any day name that is left over */
    value = value.replace(/周[一二三四五六日天]/g, shortDay);
    /* the recurring words */
    HOURS_WORDS.forEach(function (pair) {
      value = value.split(pair[0]).join(pair[1]);
    });
    /* "周一至周三,周五" -> "Mon–Wed, Fri" */
    value = value.replace(/,(\S)/g, ", $1");
    return value;
  }

  function translateNodeText(zh) {
    if (current !== "en") return zh;
    var trimmed = String(zh).trim();
    if (EN_MARKUP[trimmed] !== undefined) return EN_MARKUP[trimmed];
    if (EN[trimmed] !== undefined) return EN[trimmed];
    return zh;
  }

  function getLang() {
    return current;
  }

  function onLangChange(fn) {
    listeners.push(fn);
  }

  /* --- static markup: remember the Chinese, swap to English --------- */
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];

  /* Two memories per node: the Chinese source and the English we wrote.
     Without the second one we cannot tell "our translation, safe to put
     back" from "English the app just generated", so a switch back to
     Chinese would clobber freshly rendered dynamic copy. */
  function collectText(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (!node.nodeValue) continue;
      if (node.__smoothgoZh === undefined) {
        if (!HAN.test(node.nodeValue)) continue;
        node.__smoothgoZh = node.nodeValue;
      } else if (HAN.test(node.nodeValue)) {
        if (node.nodeValue !== node.__smoothgoZh) node.__smoothgoZh = node.nodeValue;
      } else if (node.nodeValue !== node.__smoothgoEn) {
        continue;
      }
      nodes.push(node);
    }
    return nodes;
  }

  function collectAttrs(root) {
    var list = [];
    var elements = root.querySelectorAll
      ? root.querySelectorAll("[" + ATTRS.join("],[") + "]")
      : [];
    Array.prototype.forEach.call(elements, function (el) {
      ATTRS.forEach(function (name) {
        var value = el.getAttribute(name);
        if (!value) return;
        if (!el.__smoothgoZhAttr) {
          el.__smoothgoZhAttr = {};
          el.__smoothgoEnAttr = {};
        }
        if (el.__smoothgoZhAttr[name] === undefined) {
          if (!HAN.test(value)) return;
          el.__smoothgoZhAttr[name] = value;
        } else if (HAN.test(value)) {
          if (value !== el.__smoothgoZhAttr[name]) el.__smoothgoZhAttr[name] = value;
        } else if (value !== el.__smoothgoEnAttr[name]) {
          return;
        }
        list.push({ el: el, name: name });
      });
    });
    return list;
  }

  function applyStatic(root) {
    var scope = root || document.body;
    if (!scope) return;
    collectText(scope).forEach(function (node) {
      if (current === "en") {
        node.__smoothgoEn = translateNodeText(node.__smoothgoZh);
        node.nodeValue = node.__smoothgoEn;
      } else {
        node.nodeValue = node.__smoothgoZh;
      }
    });
    collectAttrs(scope).forEach(function (entry) {
      var source = entry.el.__smoothgoZhAttr[entry.name];
      if (current === "en") {
        entry.el.__smoothgoEnAttr[entry.name] = translateNodeText(source);
        entry.el.setAttribute(entry.name, entry.el.__smoothgoEnAttr[entry.name]);
      } else {
        entry.el.setAttribute(entry.name, source);
      }
    });
    var html = document.documentElement;
    if (html) html.setAttribute("lang", current === "en" ? "en" : "zh-CN");
  }

  function setLang(next) {
    var lang = next === "en" ? "en" : "zh";
    if (lang === current) return current;
    current = lang;
    try {
      if (global.localStorage) global.localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      /* ignore: the switch still works for this page view */
    }
    listeners.forEach(function (fn) {
      try {
        fn(lang);
      } catch (error) {
        /* one broken listener must not stop the others */
      }
    });
    return current;
  }

  global.SmoothGoI18n = {
    t: t,
    tv: tv,
    th: th,
    getLang: getLang,
    setLang: setLang,
    applyStatic: applyStatic,
    onLangChange: onLangChange,
    EN: EN,
    EN_MARKUP: EN_MARKUP
  };
})(window);

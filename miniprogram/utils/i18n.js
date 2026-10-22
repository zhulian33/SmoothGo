/**
 * Thin bilingual layer for the mini program.
 *
 * Same shape as web/i18n.js and the same rule: **the Chinese string is the
 * key**. `t()` only translates when the UI is in English, and a missing entry
 * falls back to the Chinese original rather than rendering `undefined`. That
 * means the dictionary can grow lazily -- a new label simply stays Chinese
 * until somebody translates it, instead of breaking the page.
 *
 * The place data never moves through this layer at all. Category names and
 * place names stay Chinese in both languages, exactly as the web app does.
 */

const STORAGE_KEY = "smoothgo_lang";

let current = "zh";

const EN = {
  /* shell */
  行程: "Plan",
  路线: "Route",
  地图: "Map",
  排队: "Queues",
  "SmoothGo 畅游通": "SmoothGo",

  /* home */
  四时俱好: "Any season is a good season",
  "是长春。": "It is Changchun.",
  "用一句话描述你的行程": "Describe your day in one sentence",
  提取关键词: "Extract keywords",
  生成行程: "Plan my day",
  "已提取：{v0}": "Picked up: {v0}",
  "没有识别到关键词，可以手动填写": "No keywords found — fill the form by hand",
  "预算 {v0}": "Budget {v0}",
  "时间 {v0}": "Start {v0}",
  "1 天": "1 day",
  "{v0} 天": "{v0} days",
  出发时间: "Start",
  预算: "Budget",
  出行人数: "Travellers",
  天数: "Days",
  地点库: "Place library",
  排队热点: "Queue hotspots",
  地标: "Landmarks",
  免费开放: "Free entry",
  "演示数据：等待时长为模型推算，不是实时数据":
    "Demo data: waits are modelled, not observed live",
  "已切换到英文": "Switched to English",
  "已切换到中文": "Switched to Chinese",

  /* interests */
  自然: "Nature",
  历史: "History",
  美食: "Food",
  东北菜: "Dongbei food",
  雪景: "Snow",
  电影: "Film",
  亲子: "Family",
  拍照: "Photos",
  摄影: "Photography",
  轻松: "Relaxed",
  休闲: "Leisure",

  /* travellers */
  家庭: "Family group",
  "1 位成人": "1 adult",
  "2 位成人": "2 adults",
  独自: "Solo",

  /* route */
  当日路线: "Today's route",
  "第 {v0} 天": "Day {v0}",
  总时长: "Total",
  路上: "Travel",
  花费: "Spend",
  预计到达: "Arrives",
  停留: "Visit",
  "{v0} 小时 {v1} 分": "{v0} h {v1} min",
  "{v0} 分钟": "{v0} min",
  智能重排: "Replan smartly",
  在地图查看: "Show on map",
  还没有行程: "No plan yet",
  "先去首页生成一条路线": "Generate one on the Plan tab",
  去生成: "Plan a day",
  "至少需要两个地点才能重排": "A replan needs at least two stops",
  当前路线已经是较优的排队组合: "This route is already the best available",
  "已按你的条件生成路线（演示）": "Route generated for your preferences (demo)",
  "已生成 {v0} 天路线（演示）": "{v0}-day route generated (demo)",
  "已重排：{v0} 换成 {v1}，省下约 {v2} 分钟":
    "Replanned: swapped {v0} for {v1}, saving about {v2} min",

  /* map */
  行程路线: "Route",
  全部地点: "All places",
  "共 {v0} 个地点": "{v0} places",
  "坐标为 gcj02，与微信地图一致": "gcj02 coordinates, matching WeChat Maps",

  /* queue */
  排队估算: "Queue estimates",
  参考等候: "Est. wait",
  依据: "Basis",
  现在: "Now",
  推算: "Modelled",
  "推算，非实时排队数据": "Modelled, not live queue data",
  来自当日路线: "from today's route",
  "按当前时间刷新": "Refresh for now",

  /* queue model — periods, so the basis line reads in English too */
  餐厅: "Restaurant",
  景点: "Attraction",
  非正餐时段: "between services",
  午市前: "pre-lunch",
  午市高峰: "lunch peak",
  午市回落: "post-lunch",
  下午平峰: "afternoon lull",
  晚市前: "pre-dinner",
  晚市高峰: "dinner peak",
  晚市回落: "post-dinner",
  夜宵时段: "late night",
  未开园: "before opening",
  开园: "opening",
  上午高峰: "morning peak",
  午间回落: "midday lull",
  午后高峰: "afternoon peak",
  临近闭园: "near closing",
  闭园后: "after closing",
  周一: "Monday",
  周二: "Tuesday",
  周三: "Wednesday",
  周四: "Thursday",
  周五: "Friday",
  周六: "Saturday",
  周日: "Sunday",
};

const TAB_KEYS = ["行程", "路线", "地图", "排队"];

function loadLang() {
  current = wx.getStorageSync(STORAGE_KEY) === "en" ? "en" : "zh";
  return current;
}

function getLang() {
  return current;
}

function setLang(lang) {
  current = lang === "en" ? "en" : "zh";
  wx.setStorageSync(STORAGE_KEY, current);
  applyTabBar();
  return current;
}

function toggleLang() {
  return setLang(current === "zh" ? "en" : "zh");
}

function t(key, vars) {
  const fallback = Object.prototype.hasOwnProperty.call(EN, key) ? EN[key] : null;
  let text = current === "en" && fallback ? fallback : key;
  if (vars) {
    Object.keys(vars).forEach((name) => {
      text = text.split(`{${name}}`).join(vars[name]);
    });
  }
  return text;
}

/**
 * The tab bar is declared statically in app.json, so its labels have to be
 * pushed at runtime. Silently ignored on base libraries without setTabBarItem
 * (or before the tab bar exists), which is why this must not throw.
 */
function applyTabBar() {
  if (typeof wx.setTabBarItem !== "function") return;
  TAB_KEYS.forEach((key, index) => {
    try {
      wx.setTabBarItem({ index, text: t(key) });
    } catch (error) {
      // A hidden or unready tab bar is not worth failing a page load over.
    }
  });
}

module.exports = {
  getLang,
  loadLang,
  setLang,
  toggleLang,
  t,
  applyTabBar,
  EN,
};

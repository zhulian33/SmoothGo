/*
 * SmoothGo public browser configuration - TEMPLATE.
 *
 * Copy this file to config.js and fill in your own key:
 *
 *   cp web/config.example.js web/config.js
 *
 * config.js is gitignored so the key you develop with stays on your machine.
 * The deployed site carries its own key, baked in at build time; see
 * .github/workflows/pages.yml. Repository secrets take priority when set.
 *
 * 1. Apply for an Amap Web JS API key:
 *    https://console.amap.com/dev/key/app
 * 2. Add your approved domain to the key's whitelist.
 * 3. Fill the values below. The JS key is public, but restrict it by domain.
 *
 * For real phone registration, run server/app.py and set authMode to "real".
 * apiBaseUrl can stay empty when the web page and API are served from the same origin.
 */
window.SMOOTHGO_CONFIG = {
  amapKey: "",
  amapSecurityJsCode: "",
  apiBaseUrl: "",
  authMode: "demo"
};

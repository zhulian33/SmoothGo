/*
 * SmoothGo public browser configuration - TEMPLATE.
 *
 * Copy this file to config.js and fill in your own key:
 *
 *   cp web/config.example.js web/config.js
 *
 * config.js is gitignored so real keys never enter the repository.
 * GitHub Actions regenerates it from repository secrets on deploy.
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

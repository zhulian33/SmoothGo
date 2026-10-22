const i18n = require("./utils/i18n.js");
const store = require("./utils/store.js");

App({
  onLaunch() {
    i18n.loadLang();
    store.load();
    // Static in app.json, so the labels have to be pushed once the language is
    // known. Also covers a launch straight into a non-default tab.
    i18n.applyTabBar();
  },

  onShow() {
    i18n.applyTabBar();
  },
});

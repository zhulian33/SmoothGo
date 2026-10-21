/*
 * Boots the real page in jsdom so the UI tests run against web/index.html as
 * it ships, instead of a hand-maintained copy that can silently drift.
 *
 * Two things are deliberately stubbed:
 *   - config.js is gitignored and carries a real Amap key. The harness sets
 *     SMOOTHGO_CONFIG with an empty key, so loadAmap() returns before it can
 *     append a script tag. Nothing here touches the network.
 *   - fetch is replaced with a failing stub. The page only fetches for login
 *     and booking channels, and those paths are asserted on their own terms.
 *
 * The scripts run as real <script> elements, not window.eval(). eval puts a
 * top-level `const` in a throwaway scope: places.poi.js declares
 * POI_GENERATED_PLACES that way, so evaluating it left app.js seeing
 * `typeof POI_GENERATED_PLACES === "undefined"` and merging nothing -- a page
 * that booted clean but held a fraction of its data.
 */
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const WEB = path.join(__dirname, "..", "web");

/* Must match the order in web/index.html: app.js reads globals the earlier
   files install. config.js is skipped on purpose. */
const SCRIPTS = [
  "i18n.js",
  "planner.js",
  "queue-model.js",
  "places.poi.js",
  "place-photos.js",
  "place-menus.js",
  "app.js"
];

function boot({ storage = {} } = {}) {
  /* Drop every <script src>: the harness injects the same files by hand, and
     jsdom would otherwise try to fetch them over the network. */
  const html = fs
    .readFileSync(path.join(WEB, "index.html"), "utf8")
    .replace(/<script src="[^"]*"><\/script>\s*/g, "");

  const errors = [];
  const warnings = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error));
  virtualConsole.on("error", (...args) => errors.push(new Error(args.join(" "))));
  virtualConsole.on("warn", (...args) => warnings.push(args.join(" ")));

  const dom = new JSDOM(html, {
    url: "https://smoothgo.test/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole
  });
  const { window } = dom;

  /* jsdom implements neither of these, and the page calls both. */
  window.scrollTo = () => {};
  window.SMOOTHGO_CONFIG = {
    amapKey: "",
    amapSecurityJsCode: "",
    apiBaseUrl: "",
    authMode: "demo"
  };
  window.fetch = async () => ({
    ok: false,
    status: 0,
    json: async () => ({})
  });

  Object.entries(storage).forEach(([key, value]) => {
    window.localStorage.setItem(key, value);
  });

  const document = window.document;
  const run = (code, name) => {
    const before = errors.length;
    const script = document.createElement("script");
    script.textContent = code;
    document.head.appendChild(script);
    if (errors.length > before) {
      const last = errors[errors.length - 1];
      throw new Error(`${name} threw while running: ${last.message || last}`);
    }
  };

  SCRIPTS.forEach((name) => {
    run(fs.readFileSync(path.join(WEB, name), "utf8"), name);
  });

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const text = (selector) => {
    const node = $(selector);
    return node ? node.textContent.trim() : null;
  };
  const click = (target) => {
    const node = typeof target === "string" ? $(target) : target;
    if (!node) throw new Error(`click target missing: ${target}`);
    node.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    return node;
  };
  const type = (selector, value) => {
    const node = $(selector);
    if (!node) throw new Error(`input missing: ${selector}`);
    node.value = value;
    node.dispatchEvent(new window.Event("input", { bubbles: true }));
    node.dispatchEvent(new window.Event("change", { bubbles: true }));
    return node;
  };

  return { dom, window, document, $, $$, text, click, type, errors, warnings };
}

module.exports = { boot, SCRIPTS };

const browserAPI = "undefined" == typeof browser ? chrome : browser;
fetch(browserAPI.runtime.getURL("changelog.json")).then(e => e.json()).then(e => {
  const t = Object.keys(e),
    n = t[t.length - 1];
  document.getElementById("version-badge").textContent = `v${n}`
}), document.addEventListener("DOMContentLoaded", async function() {
  const e = document.getElementById("theme-activated-section"),
    t = document.getElementById("theme-unlock-section"),
    n = document.getElementById("theme-toggle"),
    o = document.getElementById("theme-environment-select"),
    s = document.getElementById("url-rewrite-toggle"),
    l = document.getElementById("dev-mode-option"),
    a = document.getElementById("url-rewrite-option"),
    r = document.getElementById("settings-notification"),
    c = document.getElementById("bblox-try-launcher"),
    d = document.getElementById("bblox-buy-license"),
    i = document.getElementById("bblox-license-key-input"),
    y = document.getElementById("bblox-license-error"),
    m = document.getElementById("bblox-license-activate"),
    b = n?.closest(".switch"),
    u = b?.querySelector("span:first-of-type"),
    p = b?.querySelector("span:last-of-type"),
    g = s?.closest(".switch"),
    h = g?.querySelector("span:first-of-type"),
    E = g?.querySelector("span:last-of-type");

  function k() {
    r && (r.style.display = "block", r.style.opacity = "0", r.style.transition = "opacity 0.3s ease-in-out",
      setTimeout(() => {
        r.style.opacity = "1"
      }, 10))
  }

  function w(e) {
    n.checked = e, u && (u.style.backgroundColor = e ? "#4BB543" : "#ccc"), p && (p.style.transform = e ?
      "translateX(16px)" : "translateX(0)"), l && (l.style.display = e ? "block" : "none"), a && (a.style
      .display = e ? "block" : "none")
  }
  if (c?.addEventListener("click", () => browserAPI.tabs.create({
      url: "https://www.overwolf.com/app/allory_dante-betterblox?utm_source=app&utm_medium=owaa&utm_campaign=GaLW9ln"
    })), d?.addEventListener("click", () => browserAPI.tabs.create({
      url: "https://betterblox.tebex.io/category/3147944"
    })), m?.addEventListener("click", async () => {
      const n = (i?.value || "").trim().toUpperCase();
      n ? (y && (y.style.display = "none"), await browserAPI.runtime.sendMessage({
        type: "SET_LICENSE",
        licenseKey: n
      }) ? (await browserAPI.storage.local.set({
        themeEnabled: !0
      }), e && (e.style.display = "block"), t && (t.style.display = "none"), w(!0), k()) : y && (y
        .textContent = "Invalid or inactive license. Check the key format and try again.", y.style
        .display = "block")) : y && (y.textContent = "Please enter your license key.", y.style.display =
        "block")
    }), n?.addEventListener("change", function() {
      w(this.checked), browserAPI.storage.local.set({
        themeEnabled: this.checked
      }), k()
    }), o?.addEventListener("change", function() {
      const e = this.value;
      browserAPI.storage.local.set({
        themeEnvironment: e
      }), browserAPI.storage.local.set({
        devModeEnabled: "dev" === e
      }), k()
    }), s?.addEventListener("change", function() {
      this.checked ? (h.style.backgroundColor = "#4BB543", E.style.transform = "translateX(16px)") : (h.style
        .backgroundColor = "#ccc", E.style.transform = "translateX(0)"), browserAPI.storage.local.set({
        disableUrlRewrites: this.checked
      }), k()
    }), !await browserAPI.runtime.sendMessage({
      type: "GET_LICENSE"
    }).catch(() => !1)) return e && (e.style.display = "none"), void(t && (t.style.display = "block"));
  e && (e.style.display = "block"), t && (t.style.display = "none");
  const v = await new Promise(e => {
      browserAPI.storage.local.get(["themeEnabled", "themeEnvironment", "devModeEnabled", "disableUrlRewrites"],
        e)
    }),
    I = void 0 !== v?.themeEnabled && v.themeEnabled;
  w(I), I ? (u && (u.style.backgroundColor = "#4BB543"), p && (p.style.transform = "translateX(16px)"), l && (l
    .style.display = "block"), a && (a.style.display = "block")) : (u && (u.style.backgroundColor = "#ccc"),
    p && (p.style.transform = "translateX(0)"), l && (l.style.display = "none"), a && (a.style.display = "none")
    );
  let f = v?.themeEnvironment;
  f || (f = !0 === v?.devModeEnabled ? "dev" : "production"), o && (o.value = f);
  const B = void 0 !== v?.disableUrlRewrites && v.disableUrlRewrites;
  s && (s.checked = B), B && h && (h.style.backgroundColor = "#4BB543"), B && E && (E.style.transform =
    "translateX(16px)"), !B && h && (h.style.backgroundColor = "#ccc"), !B && E && (E.style.transform =
    "translateX(0)")
});
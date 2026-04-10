(() => {
  "use strict";
  var t, e, n, a, r, s, i = {
      81: (t, e, n) => {
        n.d(e, {
          a: () => zt
        });
        var a = n(105);

        function r(t) {
          return chrome.runtime.getURL(`icons/svg/${t}.svg`)
        }

        function s(t) {
          return chrome.runtime.getURL(`icons/png/${t}.png`)
        }

        function i(t, e, n) {
          const a = t.querySelector(".button-text");
          a && a.remove();
          const r = document.createElement("span");
          r.className = "button-text " + (n ? "tw-text-[#0095ff] dark:tw-text-[#0095ff]" : ""), r.textContent = n ?
            "Disable Online Notification" : "Notify when Online", t.appendChild(r), n ? (e.style.filter =
              "invert(46%) sepia(99%) saturate(1426%) hue-rotate(197deg) brightness(99%) contrast(96%)", e
              .className = "") : (e.style.filter = "", e.className = "dark:tw-brightness-0 dark:tw-invert")
        }

        function o(t, e, n) {
          const a = t.querySelector(".button-text");
          a && a.remove();
          const r = document.createElement("span");
          r.className = "button-text " + (n ? "tw-text-[#0095ff] dark:tw-text-[#0095ff]" : ""), r.textContent = n ?
            "Disable Join Notifications" : "Game Join Notifications", t.appendChild(r), n ? (e.style.filter =
              "invert(46%) sepia(99%) saturate(1426%) hue-rotate(197deg) brightness(99%) contrast(96%)", e
              .className = "") : (e.style.filter = "", e.className = "dark:tw-brightness-0 dark:tw-invert")
        }
        async function l(t) {
          const e = function(t) {
            try {
              return t.parentElement.parentElement.parentElement.querySelector("a").href.split("/")[4]
            } catch (t) {
              return console.error("GameHistory: Error getting user ID from element"), null
            }
          }(t);
          if (!e) return;
          if (!await a.n.getSettings("game-history", !0)) return;
          const n = (await a.n.get("betterblox_presence_tracker_v2", {}))[e];
          if (!n?.gameHistory) return;
          const r = t.querySelector(".game-history-container");
          r && r.remove();
          const s = document.createElement("div");
          if (s.className = "game-history-container", s.style.cssText = "min-width: 320px; width: 100%;", 2 === n
            .presenceType && n.gameHistory.currentGame) {
            const t = Date.now() - (n.gameHistory.gameStartTime || Date.now()),
              e = document.createElement("div");
            e.className =
              "tw-px-3 tw-py-2.5 tw-mb-2 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-border-l-2 tw-border-blue-500 tw-rounded",
              e.innerHTML =
              `\n      <a href="https://www.roblox.com/games/${n.gameHistory.currentGame}" target="_blank" rel="noopener" class="tw-block">\n        <div class="tw-flex tw-items-center tw-justify-between">\n          <div class="tw-flex-1 tw-min-w-0">\n            <div class="tw-text-sm tw-font-semibold tw-text-blue-700 dark:tw-text-blue-300 tw-truncate">${n.gameHistory.currentGameName}</div>\n            <div class="tw-text-xs tw-text-blue-600 dark:tw-text-blue-400 tw-mt-0.5">Currently playing</div>\n          </div>\n          <div class="tw-text-sm tw-font-medium tw-text-blue-600 dark:tw-text-blue-400 tw-ml-2">${d(t)}</div>\n        </div>\n      </a>\n    `,
              s.appendChild(e)
          }
          const i = Object.entries(n.gameHistory.games).filter(([t]) => t !== n.gameHistory.currentGame
          ?.toString()).map(([t, e]) => ({
            placeId: t,
            ...e,
            lastPlayed: e.lastPlayed || 0
          }));
          if (i.length > 0) {
            const t = document.createElement("div");
            t.className = "tw-px-3 tw-py-2 tw-border-b tw-border-gray-200 dark:tw-border-gray-700", t.innerHTML =
              `\n      <div class="tw-flex tw-flex-col tw-gap-2">\n        <div class="tw-text-sm tw-font-semibold tw-text-gray-700 dark:tw-text-gray-200">Game History</div>\n        <div class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap" id="sort-buttons-${e}">\n          <button type="button" data-sort="totalTime" class="sort-btn active tw-px-2 tw-py-1 tw-text-xs tw-rounded hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-text-gray-700 dark:tw-text-gray-300 tw-font-medium tw-transition-colors tw-whitespace-nowrap" title="Total Time">\n            Total\n          </button>\n          <button type="button" data-sort="lastPlayed" class="sort-btn tw-px-2 tw-py-1 tw-text-xs tw-rounded hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-400 tw-transition-colors tw-whitespace-nowrap" title="Last Played">\n            Recent\n          </button>\n          <button type="button" data-sort="dailyTime" class="sort-btn tw-px-2 tw-py-1 tw-text-xs tw-rounded hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-400 tw-transition-colors tw-whitespace-nowrap" title="Today">\n            Today\n          </button>\n          <button type="button" data-sort="name" class="sort-btn tw-px-2 tw-py-1 tw-text-xs tw-rounded hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-400 tw-transition-colors tw-whitespace-nowrap" title="Name">\n            A-Z\n          </button>\n        </div>\n      </div>\n    `;
            const n = document.createElement("div");
            n.id = `games-list-${e}`, n.className = "tw-max-h-64 tw-overflow-y-auto", c(n, i, "totalTime");
            const a = t.querySelectorAll(`#sort-buttons-${e} .sort-btn`);
            a.forEach(t => {
              t.addEventListener("click", t => {
                t.stopPropagation(), t.preventDefault();
                const e = t.currentTarget.dataset.sort;
                a.forEach(t => {
                  t.classList.remove("active", "tw-text-gray-700", "dark:tw-text-gray-300",
                    "tw-font-medium"), t.classList.add("tw-text-gray-600", "dark:tw-text-gray-400")
                }), t.currentTarget.classList.add("active", "tw-text-gray-700", "dark:tw-text-gray-300",
                  "tw-font-medium"), t.currentTarget.classList.remove("tw-text-gray-600",
                  "dark:tw-text-gray-400"), c(n, i, e)
              })
            }), s.appendChild(t), s.appendChild(n)
          }
          t.appendChild(s),
            function(t, e) {
              let n = t.closest(".friend-tile-dropdown");
              if (n || (n = t.closest("ul")?.parentElement), !n) return;
              const a = () => {
                  let t = e.parentElement;
                  for (; t && t !== document.body;) {
                    if (t.classList.contains("MuiPaper-root") || "menu" === t.getAttribute("role") ||
                      "absolute" === t.style.position || "fixed" === t.style.position) return t;
                    t = t.parentElement
                  }
                  return null
                },
                r = () => {
                  const t = a();
                  if (t) {
                    t.style.minWidth || (t.style.minWidth = "320px");
                    const e = t.querySelector("ul") || t;
                    e && !e.style.minWidth && (e.style.minWidth = "320px")
                  }
                },
                s = () => {
                  const t = (() => {
                      const t = [".avatar-card", ".friend-tile", '[class*="friend"]', 'a[href*="/users/"]'];
                      for (const e of t) {
                        const t = n.querySelector(e);
                        if (t) return t
                      }
                      return n.querySelector("a") || n
                    })(),
                    s = a();
                  if (r(), !t || !s) return;
                  const i = t => {
                    t.stopPropagation(), t.preventDefault()
                  };
                  e.addEventListener("mouseenter", i), e.addEventListener("mouseleave", t => {
                    const e = t.relatedTarget;
                    e && (s.contains(e) || n.contains(e)) && i(t)
                  }), s.addEventListener("mouseenter", i), s.addEventListener("mouseleave", t => {
                    const a = t.relatedTarget;
                    a && (e.contains(a) || n.contains(a)) && i(t)
                  }), (() => {
                    if (n.querySelector(".betterblox-hover-bridge")) return;
                    const e = document.createElement("div");
                    e.className = "betterblox-hover-bridge", e.style.cssText =
                      "position: absolute; pointer-events: auto; z-index: 1000;";
                    const a = t.getBoundingClientRect(),
                      r = s.getBoundingClientRect();
                    e.style.width = `${Math.max(a.width,r.width)}px`, e.style.height = "10px", e.style.top =
                      `${a.bottom}px`, e.style.left = `${Math.min(a.left,r.left)}px`, n.style.position =
                      "relative", n.appendChild(e)
                  })()
                };
              s(), r(), setTimeout(() => {
                s(), r()
              }, 100), setTimeout(() => {
                s(), r()
              }, 500), new MutationObserver(() => {
                s(), r()
              }).observe(n, {
                childList: !0,
                subtree: !0,
                attributes: !0,
                attributeFilter: ["style", "class"]
              })
            }(t, s)
        }

        function c(t, e, n, a) {
          let r = [...e];
          switch (n) {
            case "lastPlayed":
              r.sort((t, e) => (e.lastPlayed || 0) - (t.lastPlayed || 0));
              break;
            case "dailyTime":
              r.sort((t, e) => (e.dailyTime || 0) - (t.dailyTime || 0));
              break;
            case "name":
              r.sort((t, e) => {
                const n = (t.name || "Unknown Game").toLowerCase(),
                  a = (e.name || "Unknown Game").toLowerCase();
                return n.localeCompare(a)
              });
              break;
            default:
              r.sort((t, e) => (e.totalTime || 0) - (t.totalTime || 0))
          }
          r = r.slice(0, 8), 0 !== r.length ? t.innerHTML = r.map((t, e) => {
              const n = e === r.length - 1,
                a = t.sessions && t.sessions.length > 0 ? t.sessions.sort((t, e) => (e.timestamp || 0) - (t
                  .timestamp || 0))[0] : null;
              return `\n        <div class="tw-px-3 tw-py-2 ${n?"":"tw-border-b tw-border-gray-100 dark:tw-border-gray-800"} hover:tw-bg-gray-50 dark:hover:tw-bg-gray-800/50 tw-transition-colors">\n          <a href="https://www.roblox.com/games/${t.placeId}" target="_blank" rel="noopener" class="tw-block">\n            <div class="tw-flex tw-items-start tw-justify-between tw-gap-2">\n              <div class="tw-flex-1 tw-min-w-0">\n                <div class="tw-text-sm tw-font-medium tw-text-gray-800 dark:tw-text-gray-200 tw-truncate tw-mb-0.5">${t.name}</div>\n                <div class="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">\n                  ${t.lastPlayed?`<span>${function(t){const e=(new Date).getTime()-t,n=Math.floor(e/6e4),a=Math.floor(e/36e5),r=Math.floor(e/864e5);return n<60?`${n} minute${1!==n?"s":""} ago`:a<24?`${a} hour${1!==a?"s":""} ago`:`${r} day${1!==r?"s":""} ago`}(t.lastPlayed)}</span>`:""}\n                  ${t.dailyTime>0?`<span class="tw-text-blue-600 dark:tw-text-blue-400">${d(t.dailyTime)} today</span>`:""}\n                </div>\n                ${a?`\n                  <div class="tw-mt-1 tw-text-xs tw-text-gray-400 dark:tw-text-gray-500">\n                    Last session: ${new Date(a.timestamp).toLocaleDateString()} at ${new Date(a.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} (${d(a.duration)})\n                  </div>\n                `:""}\n              </div>\n              <div class="tw-flex tw-flex-col tw-items-end tw-gap-0.5 tw-flex-shrink-0">\n                <div class="tw-text-sm tw-font-semibold tw-text-gray-700 dark:tw-text-gray-300">${d(t.totalTime)}</div>\n                <div class="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500">total</div>\n              </div>\n            </div>\n          </a>\n        </div>\n      `
            }).join("") : t.innerHTML =
            '<div class="tw-px-3 tw-py-4 tw-text-center tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">No games found</div>'
        }

        function d(t) {
          if (!t || t < 0) return "0m";
          const e = Math.floor(t / 6e4),
            n = Math.floor(e / 60);
          if (n > 0) {
            const t = e % 60;
            return `${n}h${t>0?` ${t}m`:""}`
          }
          return `${e}m`
        }
        const u = {
          pages: ["home"],
          selectors: [{
            selector: '.friend-tile-dropdown:not([data-betterblox-processed="true"])',
            handler: (t, e) => {
              (async function(t) {
                const e = function(t) {
                  try {
                    return t.parentElement.parentElement.parentElement.querySelector("a").href.split(
                      "/")[4]
                  } catch (t) {
                    return console.error("OnlineNotify: Error getting user ID from element"), null
                  }
                }(t);
                if (!e) return;
                if (!await a.n.getSettings("friends-online-notify", !0)) return;
                const n = t.querySelector("ul");
                n && function(t, e) {
                  const n = document.createElement("li"),
                    s = function() {
                      const t = document.createElement("button");
                      return t.className = "friend-tile-dropdown-button", t
                    }(),
                    o = function() {
                      const t = document.createElement("div");
                      return t.style.display = "flex", t.style.alignItems = "center", t.style.gap =
                        "5px", t
                    }(),
                    l = function() {
                      const t = document.createElement("img");
                      return t.src = r("user-online"), t.style.width = "26px", t.style.height =
                        "26px", t.className = "dark:tw-brightness-0 dark:tw-invert", t
                    }();
                  (async function(t) {
                    return (await a.n.get("notifyOnline", [])).includes(t)
                  })(e).then(t => {
                    i(o, l, t)
                  }), s.addEventListener("click", async () => {
                    const t = await async function(t) {
                      const e = await a.n.get("notifyOnline", []);
                      let n;
                      return n = e.includes(t) ? e.filter(e => e !== t) : [...e, t], await a
                        .n.set("notifyOnline", n), n.includes(t)
                    }(e);
                    i(o, l, t)
                  }), o.appendChild(l), s.appendChild(o), n.appendChild(s), t.appendChild(n)
                }(n, e)
              })(t), async function(t) {
                const e = function(t) {
                  try {
                    return t.parentElement.parentElement.parentElement.querySelector("a").href.split(
                      "/")[4]
                  } catch (t) {
                    return console.error("Autojoin: Error getting user ID from element"), null
                  }
                }(t);
                if (!e) return;
                if (!await a.n.getSettings("auto-join", !0)) return;
                const n = t.querySelector("ul");
                n && function(t, e) {
                  const n = document.createElement("li"),
                    s = function() {
                      const t = document.createElement("button");
                      return t.className = "friend-tile-dropdown-button", t
                    }(),
                    i = function() {
                      const t = document.createElement("div");
                      return t.style.display = "flex", t.style.alignItems = "center", t.style.gap =
                        "5px", t
                    }(),
                    l = function() {
                      const t = document.createElement("img");
                      return t.src = r("play"), t.style.width = "20px", t.style.height = "20px", t
                        .className = "dark:tw-brightness-0 dark:tw-invert", t
                    }();
                  (async function(t) {
                    return (await a.n.get("autoJoin", [])).includes(t)
                  })(e).then(t => {
                    o(i, l, t)
                  }), s.addEventListener("click", async () => {
                    const t = await async function(t) {
                      const e = await a.n.get("autoJoin", []);
                      let n;
                      return n = e.includes(t) ? e.filter(e => e !== t) : [...e, t], await a.n
                        .set("autoJoin", n), n.includes(t)
                    }(e);
                    o(i, l, t)
                  }), i.appendChild(l), s.appendChild(i), n.appendChild(s), t.appendChild(n)
                }(n, e)
              }(t), l(t)
            }
          }],
          settings: {
            friends: [{
              type: "toggle",
              id: "friends-presence",
              title: "Friends Presence",
              description: "Show friends last online",
              defaultValue: !0,
              isBeta: !1
            }, {
              type: "toggle",
              id: "more-presence-details",
              title: "More Presence details",
              description: "For offline friends, show last game and session length after the time (e.g. “playing …”). When off, only the time ago is shown.",
              defaultValue: !1,
              isBeta: !1
            }, {
              type: "toggle",
              id: "friends-online-notify",
              title: "Friends Online Notify",
              description: "Get notified when your friends come online",
              defaultValue: !0,
              isBeta: !1
            }, {
              type: "toggle",
              id: "auto-join",
              title: "Friend Game Join Notify",
              description: "Get notified when your friends join a game",
              defaultValue: !0,
              isBeta: !1
            }, {
              type: "toggle",
              id: "game-history",
              title: "Game History",
              description: "Show your friends top games",
              defaultValue: !0,
              isBeta: !1
            }, {
              type: "toggle",
              id: "unfriend-notification",
              title: "Unfriend Notification",
              description: "Get notified when a friend unfriends you",
              defaultValue: !0,
              isBeta: !1
            }, {
              type: "toggle",
              id: "session-notification",
              title: "New Session Notifications",
              description: "Get notified when a new login session is detected on your account",
              defaultValue: !1,
              isBeta: !1
            }]
          }
        };
        new class {
          constructor() {
            this.listeners = new Map, document.addEventListener("BETTERBLOX_XHR_RESPONSE", t => {
              if (!t.detail) return;
              const {
                url: e,
                data: n,
                status: a,
                contentType: r,
                isJson: s
              } = t.detail;
              this.notify(e, {
                url: e,
                data: n,
                status: a,
                contentType: r,
                isJson: s
              })
            }, !1)
          }
          subscribe(t, e) {
            this.listeners.has(t) || this.listeners.set(t, new Set), this.listeners.get(t).add(e)
          }
          unsubscribe(t, e) {
            this.listeners.has(t) && this.listeners.get(t).delete(e)
          }
          notify(t, e) {
            this.listeners.forEach((n, a) => {
              t.match(new RegExp(a)) && n.forEach(t => t(e))
            })
          }
        };
        var w = n(938),
          g = n(922);
        class h {
          constructor(t, e) {
            this.container = t, this.paginationManager = e, this.globeInstance = null, this.isGlobeInteracting = !
              1, this.hasUserInteracted = !1, this.autoRotateTimer = null, this.prevCoords = {
                lat: 0,
                lng: 0
              }, this.particleData = [], this.particleTimer = null, this.emissionTimers = new Map, this
              .particleCounters = new Map, this.ARC_REL_LEN = .4, this.FLIGHT_TIME = 1e3, this.NUM_RINGS = 3, this
              .RINGS_MAX_R = 5, this.RING_PROPAGATION_SPEED = 5, this.CONE_HEIGHT = .24, this.PARTICLE_COUNT =
              150, this.CONE_BASE_RADIUS = 2.1, this.PARTICLE_SPEED = .005, this.MOVEMENT_RANDOMNESS = .2, this
              .EMISSION_RATE = 16, this.init()
          }
          init() {
            this.createGlobeContainer(), this.addGlobeStyles(), this.initializeGlobe()
          }
          createGlobeContainer() {
            this.container.innerHTML =
              '\n      <div id="globe-viewer" class="tw-relative tw-w-full tw-h-96 tw-bg-gradient-to-b tw-from-slate-900/40 tw-to-slate-800/60 tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-shadow-2xl globe-container" style="min-height: 400px; max-height: 500px;">\n        \x3c!-- Info Labels --\x3e\n        <div class="tw-absolute tw-top-4 tw-left-4 tw-z-10 tw-bg-white/90 dark:tw-bg-gray-800/90 tw-backdrop-blur-sm tw-rounded-lg tw-p-3 tw-shadow-lg tw-border tw-border-gray-300/50 dark:tw-border-gray-600/50 tw-min-w-[200px]">\n          <div class="tw-text-xs tw-font-semibold tw-text-gray-600 dark:tw-text-gray-300 tw-uppercase tw-tracking-wide tw-mb-2">Globe Statistics</div>\n          <div class="tw-space-y-1 tw-text-sm">\n            <div class="tw-flex tw-justify-between tw-items-center">\n              <span class="tw-text-gray-700 dark:tw-text-gray-200">Total Regions:</span>\n              <span class="tw-font-medium tw-text-blue-600 dark:tw-text-blue-400" id="total-regions">0</span>\n            </div>\n            <div class="tw-flex tw-justify-between tw-items-center">\n              <span class="tw-text-gray-700 dark:tw-text-gray-200">Selected:</span>\n              <span class="tw-font-medium tw-text-purple-600 dark:tw-text-purple-400" id="selected-count">0</span>\n            </div>\n            <div class="tw-flex tw-justify-between tw-items-center">\n              <span class="tw-text-gray-700 dark:tw-text-gray-200">Datacenters:</span>\n              <span class="tw-font-medium tw-text-gray-600 dark:tw-text-gray-300" id="total-datacenters">0</span>\n            </div>\n          </div>\n        </div>\n        \n        <div id="globe-container" class="tw-w-full tw-h-full"></div>\n        \n        \x3c!-- Loading indicator --\x3e\n        <div id="globe-loading" class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-300/20 dark:tw-bg-gray-700/20 tw-backdrop-blur-sm tw-rounded-lg">\n          <div class="tw-flex tw-flex-col tw-items-center tw-gap-2">\n            <div class="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-blue-600 dark:tw-border-blue-400"></div>\n            <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">Loading globe...</div>\n          </div>\n        </div>\n        \n        \x3c!-- No data indicator --\x3e\n        <div id="globe-no-data" class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-hidden">\n          <div class="tw-text-center">\n            <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-2">No server regions available</div>\n            <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">Server data is still loading...</div>\n          </div>\n        </div>\n      </div>\n    ',
              this.globeContainer = this.container.querySelector("#globe-container"), this.loadingIndicator = this
              .container.querySelector("#globe-loading"), this.noDataIndicator = this.container.querySelector(
                "#globe-no-data")
          }
          initializeGlobe() {
            if (this.globeContainer && !this.globeInstance) {
              console.log("Initializing globe..."), this.showLoading();
              try {
                this.globeInstance = new w.A(this.globeContainer).globeImageUrl(
                    "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg").backgroundColor(
                    "rgba(0,0,0,0)").backgroundImageUrl(
                    "//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png").showAtmosphere(!0)
                  .atmosphereColor("rgba(59, 130, 246, 0.3)").atmosphereAltitude(.1).pointColor(() =>
                    "rgba(59, 130, 246, 0.8)").pointRadius(.5).pointAltitude(.01).onPointClick(t => {
                    t.hasServers && this.toggleRegionSelection(t.region)
                  }).pointLabel(t => {
                    const e = (t.organizations || []).map(t => t.toLowerCase().includes("roblox") ? "Roblox" : t
                        .toLowerCase().includes("amazon") || t.toLowerCase().includes("aws") ? "Amazon" : t),
                      n = [...new Set(e)];
                    if (t.hasServers)
                    return `\n              <div class="tw-bg-white dark:tw-bg-gray-800 tw-p-2 tw-rounded-lg tw-shadow-lg tw-border tw-border-gray-300 dark:tw-border-gray-600">\n                <div class="tw-font-semibold tw-text-sm tw-text-gray-900 dark:tw-text-white">${t.region}</div>\n                <div class="tw-text-xs tw-text-gray-600 dark:tw-text-gray-300">${t.city}, ${t.country}</div>\n                <div class="tw-text-xs tw-mt-1">\n                  <span class="tw-inline-block tw-bg-blue-100 dark:tw-bg-blue-900 tw-text-blue-800 dark:tw-text-blue-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">${t.count} servers</span>\n                  ${t.avgPing?`<span class="tw-inline-block tw-ml-1 tw-px-2 tw-py-1 tw-rounded tw-text-xs ${t.avgPing<100?"tw-bg-green-100 dark:tw-bg-green-900 tw-text-green-800 dark:tw-text-green-200":t.avgPing<150?"tw-bg-yellow-100 dark:tw-bg-yellow-900 tw-text-yellow-800 dark:tw-text-yellow-200":"tw-bg-red-100 dark:tw-bg-red-900 tw-text-red-800 dark:tw-text-red-200"}">${t.avgPing}ms</span>`:""}\n                </div>\n                ${n.length>0?`\n                <div class="tw-text-xs tw-mt-1">\n                  <span class="tw-text-gray-600 dark:tw-text-gray-300">Provider:</span>\n                  ${n.map(t=>`<span class="tw-inline-block tw-ml-1 tw-px-2 tw-py-1 tw-rounded tw-text-xs ${"Roblox"===t?"tw-bg-blue-100 dark:tw-bg-blue-900 tw-text-blue-800 dark:tw-text-blue-200":"tw-bg-orange-100 dark:tw-bg-orange-900 tw-text-orange-800 dark:tw-text-orange-200"}">${t}</span>`).join("")}\n                </div>\n                `:""}\n              </div>\n            `;
                    {
                      const e = t.datacenterCount || 1;
                      return `\n              <div class="tw-bg-white dark:tw-bg-gray-800 tw-p-2 tw-rounded-lg tw-shadow-lg tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-max-w-xs">\n                <div class="tw-font-semibold tw-text-sm tw-text-gray-900 dark:tw-text-white">${t.city}, ${t.country}</div>\n                <div class="tw-text-xs tw-mt-1">\n                  <span class="tw-inline-block tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-800 dark:tw-text-gray-200 tw-px-2 tw-py-1 tw-rounded tw-text-xs">No servers</span>\n                  <span class="tw-inline-block tw-ml-1 tw-bg-gray-200 dark:tw-bg-gray-600 tw-text-gray-700 dark:tw-text-gray-300 tw-px-2 tw-py-1 tw-rounded tw-text-xs">${e} datacenter${e>1?"s":""}</span>\n                </div>\n                ${n.length>0?`\n                <div class="tw-text-xs tw-mt-1">\n                  <span class="tw-text-gray-600 dark:tw-text-gray-300">Provider:</span>\n                  ${n.map(t=>`<span class="tw-inline-block tw-ml-1 tw-px-2 tw-py-1 tw-rounded tw-text-xs ${"Roblox"===t?"tw-bg-blue-100 dark:tw-bg-blue-900 tw-text-blue-800 dark:tw-text-blue-200":"tw-bg-orange-100 dark:tw-bg-orange-900 tw-text-orange-800 dark:tw-text-orange-200"}">${t}</span>`).join("")}\n                </div>\n                `:""}\n                <div class="tw-text-xs tw-mt-1 tw-text-gray-500 dark:tw-text-gray-400">Datacenters available but no active servers</div>\n              </div>\n            `
                    }
                  }).arcColor(() => "darkOrange").arcDashLength(this.ARC_REL_LEN).arcDashGap(2).arcDashInitialGap(
                    1).arcDashAnimateTime(this.FLIGHT_TIME).arcsTransitionDuration(0).ringColor(() => t =>
                    `rgba(255,100,50,${1-t})`).ringMaxRadius(this.RINGS_MAX_R).ringPropagationSpeed(this
                    .RING_PROPAGATION_SPEED).ringRepeatPeriod(this.FLIGHT_TIME * this.ARC_REL_LEN / this
                    .NUM_RINGS).onGlobeClick(t => {
                    t.lat && t.lng && this.emitArc(t)
                  }).enablePointerInteraction(!0).width(this.globeContainer.clientWidth).height(this
                    .globeContainer.clientHeight), this.startAutoRotation(), this.setupInteractionHandlers(), this
                  .updateGlobeVisualization(), this.updateParticleStreams(), setTimeout(() => {
                    this.globeInstance && (this.globeInstance.width(this.globeContainer.clientWidth), this
                      .globeInstance.height(this.globeContainer.clientHeight))
                  }, 50), this.waitForGlobeReady(), console.log("Globe initialization completed")
              } catch (t) {
                console.error("Error initializing globe:", t), this.showError("Failed to initialize globe")
              }
            }
          }
          startAutoRotation() {
            if (!this.globeInstance || this.hasUserInteracted) return;
            const t = () => {
              if (!this.isGlobeInteracting && !this.hasUserInteracted && this.globeInstance) {
                const t = this.globeInstance.controls();
                t.autoRotate = !0, t.autoRotateSpeed = .5, t.update()
              }
            };
            this.autoRotateTimer = setTimeout(() => {
              this.globeInstance && !this.hasUserInteracted && t()
            }, 1e3)
          }
          setupInteractionHandlers() {
            if (!this.globeInstance || !this.globeContainer) return;
            const t = this.globeInstance.controls();
            t.addEventListener("start", () => {
              this.isGlobeInteracting = !0, t.autoRotate = !1, this.hasUserInteracted || (this
                .hasUserInteracted = !0, console.log(
                  "User interaction detected - auto-rotation disabled permanently"), this.autoRotateTimer &&
                (clearTimeout(this.autoRotateTimer), this.autoRotateTimer = null))
            }), t.addEventListener("end", () => {
              this.isGlobeInteracting = !1
            })
          }
          emitArc({
            lat: t,
            lng: e
          }) {
            if (!this.globeInstance) return;
            const {
              lat: n,
              lng: a
            } = this.prevCoords;
            setTimeout(() => {
              this.prevCoords = {
                lat: t,
                lng: e
              }
            }, this.FLIGHT_TIME);
            const r = {
              startLat: n,
              startLng: a,
              endLat: t,
              endLng: e
            };
            this.globeInstance.arcsData([...this.globeInstance.arcsData(), r]), setTimeout(() => {
              this.globeInstance && this.globeInstance.arcsData(this.globeInstance.arcsData().filter(t =>
                t !== r))
            }, 2 * this.FLIGHT_TIME);
            const s = {
              lat: n,
              lng: a
            };
            this.globeInstance.ringsData([...this.globeInstance.ringsData(), s]), setTimeout(() => {
              this.globeInstance && this.globeInstance.ringsData(this.globeInstance.ringsData().filter(t =>
                t !== s))
            }, this.FLIGHT_TIME * this.ARC_REL_LEN), setTimeout(() => {
              if (this.globeInstance) {
                const n = {
                  lat: t,
                  lng: e
                };
                this.globeInstance.ringsData([...this.globeInstance.ringsData(), n]), setTimeout(() => {
                  this.globeInstance && this.globeInstance.ringsData(this.globeInstance.ringsData()
                    .filter(t => t !== n))
                }, this.FLIGHT_TIME * this.ARC_REL_LEN)
              }
            }, this.FLIGHT_TIME)
          }
          getGlobePoints() {
            const t = this.getAvailableRegions(),
              e = this.paginationManager.mainClass.datacenters || {},
              n = t.map(t => {
                const n = this.getRegionCoordinates(t.name, t.city, t.country),
                  a = new Set;
                return e && Object.keys(e).length > 0 && Object.values(e).forEach(e => {
                  e.location && e.location.city === t.city && e.location.country === t.country && e
                    .organization && a.add(e.organization)
                }), {
                  lat: n.lat,
                  lng: n.lng,
                  region: t.name,
                  city: t.city,
                  country: t.country,
                  count: t.count,
                  avgPing: t.avgPing,
                  selected: this.paginationManager.filterSettings.datacenters.has(`${t.city}, ${t.country}`),
                  hasServers: !0,
                  type: "region",
                  organizations: Array.from(a)
                }
              }),
              a = new Map;
            return e && Object.keys(e).length > 0 && Object.entries(e).forEach(([e, n]) => {
              if (n.location && n.location.latLong) {
                let [r, s] = n.location.latLong;
                r = parseFloat(r), s = parseFloat(s);
                const i = `${r.toFixed(4)},${s.toFixed(4)}`,
                  o = n.location.datacenter || `${n.location.country} ${n.location.city}`;
                if (!t.some(t => t.name === o || t.city === n.location.city && t.country === n.location
                    .country)) {
                  a.has(i) || a.set(i, {
                    lat: r,
                    lng: s,
                    city: n.location.city,
                    country: n.location.country,
                    datacenters: [],
                    organizations: new Set
                  });
                  const t = a.get(i);
                  t.datacenters.push({
                    id: e,
                    name: o,
                    organization: n.organization
                  }), t.organizations.add(n.organization)
                }
              }
            }), [...n, ...Array.from(a.values()).map(t => {
              const e = t.datacenters[0],
                n = t.datacenters.length;
              return {
                lat: t.lat,
                lng: t.lng,
                region: e.name,
                city: t.city,
                country: t.country,
                count: 0,
                avgPing: null,
                selected: !1,
                hasServers: !1,
                type: "datacenter",
                datacenterCount: n,
                datacenters: t.datacenters,
                organizations: Array.from(t.organizations)
              }
            })]
          }
          getAvailableRegions() {
            const t = this.paginationManager.mainClass.serverList || [],
              e = new Map;
            return t.forEach(t => {
              if (t.datacenter?.location) {
                const n = `${t.datacenter.location.city}, ${t.datacenter.location.country}`;
                e.has(n) || e.set(n, {
                  name: t.datacenter.location.datacenter || n,
                  city: t.datacenter.location.city,
                  country: t.datacenter.location.country,
                  count: 0,
                  pings: []
                });
                const a = e.get(n);
                a.count++, t.ping && a.pings.push(t.ping)
              }
            }), Array.from(e.values()).map(t => ({
              ...t,
              avgPing: t.pings.length > 0 ? Math.round(t.pings.reduce((t, e) => t + e, 0) / t.pings
                .length) : null
            }))
          }
          getRegionCoordinates(t, e, n) {
            const a = this.paginationManager.mainClass.datacenters || {};
            if (Object.keys(a).length > 0)
              for (const [t, r] of Object.entries(a))
                if (r.location && r.location.latLong && r.location.city === e && r.location.country === n) {
                  const [t, e] = r.location.latLong;
                  return {
                    lat: t,
                    lng: e
                  }
                } const r = {
                Dublin: {
                  lat: 53.3498,
                  lng: -6.2603
                },
                London: {
                  lat: 51.5074,
                  lng: -.1278
                },
                Paris: {
                  lat: 48.8566,
                  lng: 2.3522
                },
                Amsterdam: {
                  lat: 52.3676,
                  lng: 4.9041
                },
                "Frankfurt am Main": {
                  lat: 50.1109,
                  lng: 8.6821
                },
                Mumbai: {
                  lat: 19.076,
                  lng: 72.8777
                },
                Tokyo: {
                  lat: 35.6762,
                  lng: 139.6503
                },
                Singapore: {
                  lat: 1.3521,
                  lng: 103.8198
                },
                "São Paulo": {
                  lat: -23.5505,
                  lng: -46.6333
                },
                Miami: {
                  lat: 25.7617,
                  lng: -80.1918
                },
                Chicago: {
                  lat: 41.8781,
                  lng: -87.6298
                },
                Columbus: {
                  lat: 39.9612,
                  lng: -82.9988
                },
                Dallas: {
                  lat: 32.7767,
                  lng: -96.797
                },
                Ashburn: {
                  lat: 39.0437,
                  lng: -77.4875
                },
                "Los Angeles": {
                  lat: 34.0522,
                  lng: -118.2437
                },
                "New York City": {
                  lat: 40.7128,
                  lng: -74.006
                },
                Seattle: {
                  lat: 47.6062,
                  lng: -122.3321
                },
                Reston: {
                  lat: 38.9587,
                  lng: -77.3411
                },
                Sydney: {
                  lat: -33.8688,
                  lng: 151.2093
                },
                Boardman: {
                  lat: 45.8399,
                  lng: -119.7006
                },
                "San Jose": {
                  lat: 37.3382,
                  lng: -121.8863
                }
              },
              s = {
                "US East": {
                  lat: 39.0458,
                  lng: -76.6413
                },
                "US West": {
                  lat: 37.7749,
                  lng: -122.4194
                },
                "US Central": {
                  lat: 39.0997,
                  lng: -94.5786
                },
                "US South": {
                  lat: 29.7604,
                  lng: -95.3698
                },
                "Europe West": {
                  lat: 52.3676,
                  lng: 4.9041
                },
                "Europe Central": {
                  lat: 50.1109,
                  lng: 8.6821
                },
                "Europe North": {
                  lat: 59.3293,
                  lng: 18.0686
                },
                "Asia East": {
                  lat: 35.6762,
                  lng: 139.6503
                },
                "Asia Southeast": {
                  lat: 1.3521,
                  lng: 103.8198
                },
                "Asia South": {
                  lat: 19.076,
                  lng: 72.8777
                },
                Australia: {
                  lat: -33.8688,
                  lng: 151.2093
                },
                Brazil: {
                  lat: -23.5505,
                  lng: -46.6333
                },
                Canada: {
                  lat: 43.6532,
                  lng: -79.3832
                }
              };
            return s[t] ? s[t] : r[e] ? r[e] : {
              US: {
                lat: 39.8283,
                lng: -98.5795
              },
              GB: {
                lat: 54.3781,
                lng: -2.436
              },
              DE: {
                lat: 51.1657,
                lng: 10.4515
              },
              FR: {
                lat: 46.6034,
                lng: 1.8883
              },
              JP: {
                lat: 36.2048,
                lng: 138.2529
              },
              AU: {
                lat: -25.2744,
                lng: 133.7751
              },
              BR: {
                lat: -14.235,
                lng: -51.9253
              },
              CA: {
                lat: 56.1304,
                lng: -106.3468
              },
              SG: {
                lat: 1.3521,
                lng: 103.8198
              },
              IN: {
                lat: 20.5937,
                lng: 78.9629
              },
              IE: {
                lat: 53.1424,
                lng: -7.6921
              },
              NL: {
                lat: 52.1326,
                lng: 5.2913
              }
            } [n] || {
              lat: 0,
              lng: 0
            }
          }
          updateGlobeVisualization() {
            if (!this.globeInstance) return;
            const t = this.getGlobePoints(),
              e = this.getAvailableRegions(),
              n = this.paginationManager.mainClass.datacenters || {};
            this.updateStats(e, n), this.globeInstance.pointColor(t => t.hasServers ? t.selected ?
              "rgba(34, 197, 94, 0.9)" : "rgba(59, 130, 246, 0.8)" :
              `rgba(239, 68, 68, ${.6+Math.min(t.datacenterCount||1,10)/10*.3})`).pointRadius(t => {
              if (t.hasServers) return t.selected ? .8 : .6;
              {
                const e = t.datacenterCount || 1;
                return Math.min(.3 + .05 * (e - 1), .6)
              }
            }).pointAltitude(t => {
              if (t.hasServers) return .01;
              {
                const e = t.datacenterCount || 1;
                return .005 + .001 * Math.min(e - 1, 5)
              }
            }).pointsData(t).customLayerData(this.particleData).customThreeObject(t => {
              const e = new g.Gu$(.075, 8, 8),
                n = new g.V9B({
                  color: 10025880,
                  transparent: !0,
                  opacity: .8
                });
              return new g.eaF(e, n)
            }).customThreeObjectUpdate((t, e) => {
              const n = this.globeInstance.getCoords(e.lat, e.lng, e.alt);
              t.position.set(n.x, n.y, n.z)
            })
          }
          updateStats(t, e) {
            const n = t.length,
              a = this.paginationManager.filterSettings.datacenters.size,
              r = Object.keys(e).length;
            this.container.querySelector("#total-regions").textContent = n, this.container.querySelector(
                "#selected-count").textContent = a, this.container.querySelector("#total-datacenters")
              .textContent = r
          }
          toggleRegionSelection(t) {
            const e = this.getAvailableRegions().find(e => e.name === t);
            if (e) {
              const t = `${e.city}, ${e.country}`,
                n = this.paginationManager.filterSettings.datacenters.has(t);
              this.paginationManager.setDatacenterFilter(t, !n);
              const a = document.querySelector("#region-filter-indicator");
              a && (this.paginationManager.filterSettings.datacenters.size > 0 ? (a.classList.remove(
                "tw-bg-gray-400"), a.classList.add("tw-bg-blue-500")) : (a.classList.remove("tw-bg-blue-500"),
                a.classList.add("tw-bg-gray-400"))), this.updateGlobeVisualization()
            }
          }
          updateParticleStreams() {
            if (!this.globeInstance) return;
            const t = this.getAvailableRegions().filter(t => this.paginationManager.filterSettings.datacenters
                .has(`${t.city}, ${t.country}`) && t.count > 0),
              e = t.map(t => t.name);
            this.emissionTimers.forEach((t, n) => {
                e.includes(n) || (clearInterval(t), this.emissionTimers.delete(n), this.particleCounters.delete(
                  n))
              }), this.particleData = this.particleData.filter(t => e.includes(t.region)), this.globeInstance &&
              this.globeInstance.customLayerData([...this.particleData]), t.forEach(t => {
                this.emissionTimers.has(t.name) || (this.particleCounters.set(t.name, 0), this
                  .startRegionEmission(t))
              }), t.length > 0 && !this.particleTimer ? (console.log("Starting particle animation for", t.length,
                "regions"), this.startParticleAnimation()) : 0 === t.length && this.particleTimer && (console.log(
                "Stopping particle animation - no active regions"), this.stopParticleAnimation())
          }
          startRegionEmission(t) {
            const e = this.getRegionCoordinates(t.name, t.city, t.country);
            console.log(`Starting emission for ${t.name} at`, e);
            const n = 1e3 / this.EMISSION_RATE,
              a = setInterval(() => {
                if (!this.paginationManager.filterSettings.datacenters.has(`${t.city}, ${t.country}`))
                return clearInterval(a), this.emissionTimers.delete(t.name), void this.particleCounters
                  .delete(t.name);
                const n = this.particleCounters.get(t.name) || 0;
                n >= this.PARTICLE_COUNT && this.particleCounters.set(t.name, 0);
                const r = this.createRandomParticle(t, e, n);
                this.particleData.push(r), this.particleCounters.set(t.name, n + 1), this.globeInstance && this
                  .globeInstance.customLayerData([...this.particleData])
              }, n);
            this.emissionTimers.set(t.name, a)
          }
          createRandomParticle(t, e, n) {
            const a = Math.random() * this.CONE_HEIGHT,
              r = a / this.CONE_HEIGHT * this.CONE_BASE_RADIUS,
              s = 2 * Math.random() * Math.PI,
              i = Math.sqrt(Math.random()) * r,
              o = Math.cos(s) * i,
              l = Math.sin(s) * i,
              c = e.lat + o,
              d = e.lng + l,
              u = a,
              w = 2 * Math.random() * Math.PI,
              g = this.PARTICLE_SPEED * (.5 + 1 * Math.random()),
              h = g * (.3 + .7 * Math.random());
            return {
              lat: c,
              lng: d,
              alt: u,
              region: t.name,
              particleId: n,
              centerLat: e.lat,
              centerLng: e.lng,
              movementAngle: w,
              movementSpeed: g,
              verticalSpeed: h,
              phase: 2 * Math.random() * Math.PI,
              currentHeight: a,
              maxRadius: r,
              streamOffset: 2 * Math.random() * Math.PI,
              wobbleIntensity: .05 + .15 * Math.random(),
              spiralTightness: .5 + 1 * Math.random(),
              randomDirection: 2 * Math.random() * Math.PI,
              chaosFactor: .5 * Math.random()
            }
          }
          startParticleAnimation() {
            this.particleTimer || (console.log("Starting particle animation"), this.particleTimer = setInterval(
            () => {
                if (this.globeInstance) {
                  const t = Date.now() / 1e3;
                  this.particleData = this.particleData.filter(e => {
                    const n = .05;
                    e.currentHeight += e.verticalSpeed * n;
                    const a = Math.sin(2 * t + e.phase) * e.wobbleIntensity,
                      r = .1 * Math.sin(t * e.spiralTightness + e.streamOffset),
                      s = (Math.random() - .5) * this.MOVEMENT_RANDOMNESS * .05,
                      i = .1 * Math.sin(t * e.chaosFactor + e.randomDirection);
                    e.movementAngle += (a + r + s + i) * n, e.currentHeight, this.CONE_HEIGHT, this
                      .CONE_BASE_RADIUS;
                    const o = Math.cos(e.movementAngle) * e.movementSpeed * n,
                      l = Math.sin(e.movementAngle) * e.movementSpeed * n,
                      c = (Math.random() - .5) * this.MOVEMENT_RANDOMNESS * n * .1,
                      d = (Math.random() - .5) * this.MOVEMENT_RANDOMNESS * n * .1,
                      u = Math.sin(1.5 * t + e.randomDirection) * this.MOVEMENT_RANDOMNESS * n * .05,
                      w = Math.cos(1.5 * t + e.randomDirection) * this.MOVEMENT_RANDOMNESS * n * .05;
                    e.lat += o + c + u, e.lng += l + d + w, e.alt = e.currentHeight;
                    const g = Math.sqrt(Math.pow(e.lat - e.centerLat, 2) + Math.pow(e.lng - e.centerLng,
                      2));
                    return !(e.currentHeight > this.CONE_HEIGHT || e.alt > this.CONE_HEIGHT || g > 1.5 *
                      this.CONE_BASE_RADIUS)
                  }), this.globeInstance && this.globeInstance.customLayerData([...this.particleData])
                }
              }, 100))
          }
          stopParticleAnimation() {
            this.particleTimer && (console.log("Stopping particle animation"), clearInterval(this.particleTimer),
              this.particleTimer = null)
          }
          showError(t) {
            this.loadingIndicator.style.display = "none", this.noDataIndicator.style.display = "flex", this
              .noDataIndicator.innerHTML =
              `\n      <div class="tw-text-center">\n        <div class="tw-text-sm tw-text-red-600 dark:tw-text-red-400 tw-mb-2">${t}</div>\n        <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">Please try refreshing the page</div>\n      </div>\n    `
          }
          destroy() {
            this.stopParticleAnimation(), this.emissionTimers.forEach(t => clearInterval(t)), this.emissionTimers
              .clear(), this.particleCounters.clear(), this.autoRotateTimer && (clearTimeout(this
                .autoRotateTimer), this.autoRotateTimer = null), this.globeInstance && (this.globeInstance
                .arcsData([]), this.globeInstance.ringsData([]), this.globeInstance.pointsData([]), this
                .globeInstance.customLayerData([]), this.globeContainer && (this.globeContainer.innerHTML = ""),
                this.globeInstance = null), this.particleData = [], this.isGlobeInteracting = !1
          }
          refresh() {
            this.globeInstance ? (this.updateGlobeVisualization(), this.updateParticleStreams()) : this
              .initializeGlobe()
          }
          waitForGlobeReady() {
            setTimeout(() => {
              console.log("Hiding loading indicator"), this.hideLoading()
            }, 1e3)
          }
          showLoading() {
            if (this.loadingIndicator) this.loadingIndicator.style.display = "flex";
            else {
              const t = document.createElement("div");
              t.id = "globe-loading", t.className =
                "tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-300/20 dark:tw-bg-gray-700/20 tw-backdrop-blur-sm tw-rounded-lg",
                t.innerHTML =
                '\n        <div class="tw-flex tw-flex-col tw-items-center tw-gap-2">\n          <div class="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-blue-600 dark:tw-border-blue-400"></div>\n          <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">Loading globe...</div>\n        </div>\n      ',
                this.container.appendChild(t), this.loadingIndicator = t
            }
            this.noDataIndicator && (this.noDataIndicator.style.display = "none")
          }
          hideLoading() {
            console.log("hideLoading called, loadingIndicator:", this.loadingIndicator), this.loadingIndicator ? (
              this.loadingIndicator.remove(), this.loadingIndicator = null, console.log(
                "Loading indicator removed")) : console.log("No loading indicator found")
          }
          addGlobeStyles() {
            if (document.getElementById("globe-viewer-styles")) return;
            const t = document.createElement("style");
            t.id = "globe-viewer-styles", t.textContent =
              "\n      .globe-container {\n        position: relative;\n        background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%);\n        box-shadow: \n          inset 0 0 50px rgba(59, 130, 246, 0.1),\n          0 0 30px rgba(59, 130, 246, 0.2),\n          0 0 60px rgba(59, 130, 246, 0.1);\n        border: 1px solid rgba(59, 130, 246, 0.3);\n        backdrop-filter: blur(10px);\n      }\n\n      .globe-container::before {\n        content: '';\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        background: \n          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),\n          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),\n          radial-gradient(circle at 40% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);\n        pointer-events: none;\n        border-radius: inherit;\n      }\n\n      @keyframes globeGlow {\n        0%, 100% { \n          box-shadow: \n            inset 0 0 50px rgba(59, 130, 246, 0.1),\n            0 0 30px rgba(59, 130, 246, 0.2),\n            0 0 60px rgba(59, 130, 246, 0.1);\n        }\n        50% { \n          box-shadow: \n            inset 0 0 60px rgba(59, 130, 246, 0.15),\n            0 0 40px rgba(59, 130, 246, 0.25),\n            0 0 80px rgba(59, 130, 246, 0.15);\n        }\n      }\n\n      .globe-container {\n        animation: globeGlow 4s ease-in-out infinite;\n      }\n    ",
              document.head.appendChild(t)
          }
        }
        class m {
          constructor(t) {
            this.mainClass = t, this.globeViewer = null, this.resetToDefaults(), this.setupLoadMoreButton()
          }
          resetToDefaults() {
            this.currentPage = 1, this.itemsPerPage = 8, this.elementList = [], this.filterSettings = {
                datacenters: new Set
              }, this.sortOrder = "Desc", this.isBestConnection = !1, this.ageSort = null, this.oldVersionSort =
              null, this.isShuffled2 = !1, this._previousSortOrder = null
          }
          reset() {
            this.elementList = [];
            const t = document.querySelector("#betterblox-server-list");
            t && (t.innerHTML = ""), this.resetToDefaults(), this.handleServerListRefresh()
          }
          setupLoadMoreButton() {
            document.addEventListener("click", t => {
              "load-more-servers" === t.target.id && this.loadMoreServers()
            })
          }
          async loadMoreServers() {
            this.currentPage++, await this.handleServerListRefresh(), this.updateLoadMoreButton()
          }
          updateLoadMoreButton() {
            const t = document.querySelector("#load-more-servers");
            if (!t) return;
            const e = this.getFilteredServerList().length;
            this.currentPage * this.itemsPerPage < e ? t.classList.remove("tw-hidden") : t.classList.add(
              "tw-hidden")
          }
          async handleServerListRefresh() {
            const t = this.getFilteredServerList(),
              e = document.querySelector("#betterblox-server-list");
            if (!e) return void console.error("Server list container not found");
            const n = this.currentPage * this.itemsPerPage,
              a = t.slice(0, n);
            this.elementList.length, this.elementList = this.elementList.filter(t => {
              if (!t || !t.id) return !1;
              const n = a.some(e => e.id === t.id);
              if (!n) {
                const n = e.querySelector(`[betterblox-server-id="${t.id}"]`);
                n && n.remove()
              }
              return n
            });
            for (const n of a) {
              if (!n || !n.id) continue;
              const a = this.elementList.findIndex(t => t && t.id === n.id);
              if (-1 === a) this.elementList.push(n), await this.mainClass.createServerCard(n, t);
              else {
                const r = this.elementList[a];
                if (this.hasServerChanged(r, n)) {
                  const r = e.querySelector(`[betterblox-server-id="${n.id}"]`);
                  r && (r.remove(), await this.mainClass.createServerCard(n, t)), this.elementList[a] = n
                }
              }
            }
            this.sortElementsToMatchList(e, a), this.updateLoadMoreButton()
          }
          hasServerChanged(t, e) {
            return t.playing !== e.playing || t.ping !== e.ping || t.playerTokens.join(",") !== e.playerTokens
              .join(",") || t.placeVersion !== e.placeVersion || t.isOutdated !== e.isOutdated || t
              .joinDataPending !== e.joinDataPending || t.joinDataFailed !== e.joinDataFailed || t
              .joinFailedStuckInQueue !== e.joinFailedStuckInQueue || t.datacenterId !== e.datacenterId || t
              .ip !== e.ip || t.distance !== e.distance || t.isClosest !== e.isClosest || t.queuePosition !== e
              .queuePosition || t.serverAge !== e.serverAge || t.botPercentage !== e.botPercentage
          }
          sortElementsToMatchList(t, e) {
            const n = Array.from(t.children);
            n.sort((t, n) => e.findIndex(e => e.id === t.getAttribute("betterblox-server-id")) - e.findIndex(t =>
              t.id === n.getAttribute("betterblox-server-id"))), n.forEach(e => t.appendChild(e))
          }
          getCurrentPageItems() {
            const t = (this.currentPage - 1) * this.itemsPerPage,
              e = t + this.itemsPerPage;
            return this.serverList.slice(t, e)
          }
          nextPage() {
            const t = Math.ceil(this.serverList.length / this.itemsPerPage);
            return this.currentPage < t && (this.currentPage++, !0)
          }
          previousPage() {
            return this.currentPage > 1 && (this.currentPage--, !0)
          }
          getTotalPages() {
            return Math.ceil(this.serverList.length / this.itemsPerPage)
          }
          setSortOrder(t) {
            this.sortOrder = t, this.filterSettings.datacenters.clear(), this.isBestConnection = !1, this
              .ageSort = null, this.oldVersionSort = null, this.isShuffled2 = !1, this.currentPage = 1;
            const e = document.querySelector("#region-filter-indicator");
            e && (e.classList.remove("tw-bg-blue-500"), e.classList.add("tw-bg-gray-400")), this.mainClass
              .refreshServerListWithSortOrder(t)
          }
          setDatacenterFilter(t, e) {
            e ? this.filterSettings.datacenters.add(t) : this.filterSettings.datacenters.delete(t), this
              .currentPage = 1, this.handleServerListRefresh(), this.globeViewer && this.globeViewer.refresh()
          }
          clearDatacenterFilters() {
            this.filterSettings.datacenters.clear(), this.currentPage = 1, this.handleServerListRefresh(), this
              .globeViewer && this.globeViewer.refresh()
          }
          setAgeSort(t) {
            this.ageSort === t ? this.ageSort = null : (this.ageSort = t, this.isBestConnection = !1), this
              .currentPage = 1, this.handleServerListRefresh()
          }
          setOldVersionSort() {
            this.oldVersionSort = !this.oldVersionSort || null, this.currentPage = 1, this
              .handleServerListRefresh()
          }
          toggleShuffle2() {
            this.isShuffled2 = !this.isShuffled2, this.currentPage = 1, this.handleServerListRefresh()
          }
          async toggleBestConnection() {
            if (this.isBestConnection = !this.isBestConnection, this.isBestConnection) {
              this.ageSort = null;
              const t = await this.mainClass.calculateServerDistances();
              this.mainClass.serverList = t
            }
            this.currentPage = 1, this.handleServerListRefresh()
          }
          getFilteredServerList() {
            let t = [...this.mainClass.serverList];
            this.filterSettings.datacenters.size > 0 && (t = t.filter(t => {
              const e = `${t.datacenter?.location?.city}, ${t.datacenter?.location?.country}`;
              return this.filterSettings.datacenters.has(e)
            }));
            const e = (t, e) => this.mainClass.compareJoinDataPriority(t, e);
            if (this.isShuffled2) {
              const e = t => {
                  for (let e = t.length - 1; e > 0; e--) {
                    const n = Math.floor(Math.random() * (e + 1));
                    [t[e], t[n]] = [t[n], t[e]]
                  }
                },
                n = [
                  [],
                  [],
                  []
                ];
              t.forEach(t => {
                n[this.mainClass.joinDataPriority(t)].push(t)
              }), n.forEach(e), t = n.flat()
            } else this.isBestConnection ? t.sort((t, n) => {
              const a = e(t, n);
              return 0 !== a ? a : (t.distance ?? 1 / 0) - (n.distance ?? 1 / 0)
            }) : t.sort((t, n) => {
              const a = e(t, n);
              return 0 !== a ? a : "Asc" === this.sortOrder ? t.playing - n.playing : n.playing - t.playing
            });
            if (this.ageSort && t.sort((t, n) => {
                const a = e(t, n);
                if (0 !== a) return a;
                const r = t => {
                    if (t.firstSeen) return new Date(t.firstSeen).getTime();
                    if (!t.serverAge) return Date.now();
                    const e = t.serverAge.match(/(\d+)([mhd])/);
                    if (!e) return Date.now();
                    const n = parseInt(e[1]);
                    let a = 0;
                    switch (e[2]) {
                      case "m":
                        a = 60 * n * 1e3;
                        break;
                      case "h":
                        a = 60 * n * 60 * 1e3;
                        break;
                      case "d":
                        a = 24 * n * 60 * 60 * 1e3;
                        break;
                      default:
                        return Date.now()
                    }
                    return Date.now() - a
                  },
                  s = r(t),
                  i = r(n);
                return "Newest" === this.ageSort ? i - s : "Oldest" === this.ageSort ? s - i : void 0
              }), this.oldVersionSort) {
              const e = this.mainClass.getLatestPlaceVersion();
              t = t.filter(t => void 0 !== t.isOutdated ? !0 === t.isOutdated : null !== e && null !== t
                .placeVersion && parseInt(t.placeVersion) < e)
            }
            return t
          }
          setGlobeViewer(t) {
            this.globeViewer = t
          }
        }

        function p(t, e) {
          if (!t || !e || t.length !== e.length) return 1 / 0;
          let n = 0;
          for (let a = 0; a < t.length; a++) t[a] !== e[a] && n++;
          return n
        }
        const b = new class {
            constructor() {
              this.serverList = [], this.gameId = null, this.datacenters = null, this.paginationManager = null,
                this.cachedServers = new Map, this.serverBotAnalysis = new Map, this.serverAvatars = new Map, this
                .crawlLimit = this.loadCrawlLimit(), this.status = {
                  isCrawling: !1,
                  isLoadingCache: !1,
                  serversLoaded: 0,
                  totalServers: 0,
                  datacentersCount: 0,
                  lastUpdated: null,
                  processingProgress: 0,
                  currentPage: 0,
                  totalPages: 0,
                  hasMorePages: !1,
                  error: null,
                  crawlLimit: this.crawlLimit
                }, this.crawlerState = {
                  isActive: !1,
                  nextPageCursor: null,
                  currentCursor: null,
                  emptyResponseCount: 0,
                  pendingRequests: new Set
                }, this.cacheLoadingController = null, this.crawlGeneration = 0, this._joinDataActivityCount = 0,
                this._joinDataQueue = [], this._joinDataInflight = 0, this._joinDataMaxConcurrent = 4, this
                ._pendingBulkServers = [], this._bulkDebounceTimer = null, this._enrichmentRefreshTimer = null,
                this._joinQueueRetryIds = new Set, this._joinQueueRetryTimer = null, this
                ._joinQueueRetryIntervalMs = 8e3, this._maxJoinQueuePolls = 45, this._joinQueueMaxNonZeroStreak =
                4, this._joinDataActiveIds = new Set, this.joinGameTaskId = this._newJoinGameTaskId()
            }
            _newJoinGameTaskId() {
              return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() :
                `jg_${Date.now()}_${Math.random().toString(36).slice(2,14)}`
            }
            async _registerJoinGameTaskWithBackground() {
              try {
                await chrome.runtime.sendMessage({
                  type: "SET_JOIN_GAME_TASK_ID",
                  taskId: this.joinGameTaskId
                })
              } catch (t) {
                console.warn("[BBloxUI] SET_JOIN_GAME_TASK_ID failed:", t)
              }
            }
            async addServerContainer(t) {
              this.datacenters = await this.getDatacenters(), this.gameId = this.getGameId(), this
                .paginationManager || (this.paginationManager = new m(this)), this.createBetterBLOXContainer(t
                  .parentElement), this.updateStatus({
                  datacentersCount: this.datacenters ? Object.keys(this.datacenters).length : 0
                }), await this._registerJoinGameTaskWithBackground(), this.refreshServerList()
            }
            createBetterBLOXContainer(t) {
              const e = document.querySelector("#betterblox-server-filter");
              if (e) return this.containerElement = e, this.containerUpdateStats = e.updateStats, e;
              const n = function(t) {
                  const e = () => {
                      const e = t.mainClass.datacenters,
                        n = t.mainClass.serverList;
                      if (!e) return [];
                      const a = new Map;
                      return Object.values(e).forEach(t => {
                        const e = `${t.location.city}, ${t.location.country}`;
                        a.has(e) || a.set(e, {
                          city: t.location.city,
                          country: t.location.country,
                          region: t.location.region,
                          serverCount: 0,
                          datacenterIds: new Set
                        }), a.get(e).datacenterIds.add(t.id)
                      }), n.forEach(t => {
                        if (t.datacenter?.location) {
                          const e = `${t.datacenter.location.city}, ${t.datacenter.location.country}`,
                            n = a.get(e);
                          n && n.serverCount++
                        }
                      }), Array.from(a.values()).filter(t => t.serverCount > 0).sort((t, e) => t.region !== e
                        .region ? t.region.localeCompare(e.region) : t.city.localeCompare(e.city))
                    },
                    n = e => e.map(e =>
                      `\n        <button \n          class="tw-w-full tw-text-left tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-flex-col datacenter-button ${t.filterSettings.datacenters.has(`${e.city}, ${e.country}`)?"tw-bg-blue-200 dark:tw-bg-blue-800 hover:tw-bg-blue-300 dark:hover:tw-bg-blue-700":"hover:tw-bg-gray-100 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600"}"\n          data-location="${e.city}, ${e.country}"\n        >\n          <div class="tw-flex tw-items-center tw-gap-2 tw-justify-between">\n            <span class="tw-font-medium">${e.city}, ${e.country}</span>\n            <div class="tw-flex tw-items-center tw-gap-2">\n              <span class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">\n                ${e.serverCount} servers\n              </span>\n            </div>\n          </div>\n          <div class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">\n            <span>${e.region}</span>\n          </div>\n        </button>\n      `
                      ).join(""),
                    a = (n(e()),
                      `\n    <div id="betterblox-server-filter" class="tw-w-full tw-min-w-0 tw-max-w-full tw-mx-auto tw-box-border tw-px-4 sm:tw-px-6 tw-flex tw-flex-col">\n      <div class="tw-container-header tw-flex tw-w-full tw-min-w-0 tw-flex-col tw-gap-2">\n        \x3c!-- Title + first filter row on one line --\x3e\n        <div class="tw-flex tw-w-full tw-min-w-0 tw-flex-wrap tw-items-center tw-justify-between tw-gap-x-3 tw-gap-y-2">\n          <h2 class="container-header-text tw-m-0 tw-flex tw-shrink-0 tw-items-center tw-justify-start tw-gap-2 tw-text-left">\n        <img src="${s("logo32")}" alt="BetterBLOX Logo" class="tw-w-4 tw-h-4 tw-shrink-0" />\n          BetterBLOX Servers\n          </h2>\n          <div class="tw-flex tw-min-w-0 tw-flex-1 tw-flex-row tw-flex-wrap tw-gap-2 tw-justify-end">\n            <button type="button" id="sort-toggle" class="tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span id="sort-text">Descending</span>\n            </button>\n            \n            <div class="tw-relative">\n              <button id="region-filter-button" class="tw-relative tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n                <span>Region</span>\n                <span id="region-filter-indicator" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></span>\n                <span id="selected-regions-count" class="tw-absolute tw--top-2 tw--right-2 tw-h-5 tw-w-5 tw-text-xs tw-bg-blue-500 tw-text-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-hidden">\n                  0\n                </span>\n              </button>\n              <div id="region-filter-dropdown" class="tw-hidden tw-absolute tw-z-10 tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-w-[800px] tw-p-2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-max-h-[600px]">\n                \x3c!-- View Toggle Buttons --\x3e\n                <div class="tw-flex tw-gap-2 tw-mb-3 tw-px-2">\n                  <button id="globe-view-toggle" class="tw-flex-1 tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-lg hover:tw-bg-blue-600 tw-transition-colors">\n                    Globe View\n                  </button>\n                  <button id="list-view-toggle" class="tw-flex-1 tw-px-4 tw-py-2 tw-bg-gray-200 dark:tw-bg-gray-700 tw-text-gray-700 dark:tw-text-gray-300 tw-rounded-lg hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-transition-colors">\n                    List View\n                  </button>\n                </div>\n                \n                \x3c!-- Globe View Container --\x3e\n                <div id="region-globe-container" class="tw-mb-3">\n                  <div id="globe-viewer-wrapper"></div>\n                </div>\n                \n                \x3c!-- List View Container --\x3e\n                <div id="region-list-container" class="tw-hidden">\n                  <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-flex tw-justify-between tw-items-center tw-border-b tw-mb-2 tw-pb-2 tw-border-gray-200 dark:tw-border-gray-700 tw-px-4">\n                    <span id="region-stats">Loading regions...</span>\n                    <span id="region-connection-stats"></span>\n                  </div>\n                  <button class="tw-w-full tw-text-left tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 tw-rounded-lg tw-mb-1">\n                    All Regions\n                  </button>\n                  <div class="tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-my-1"></div>\n                  <div class="tw-overflow-y-auto tw-max-h-72">\n                    <div id="datacenter-list" class="tw-space-y-1">\n                      <div class="tw-animate-pulse tw-flex tw-flex-col tw-gap-2 tw-px-4">\n                        <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n                        <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n                        <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <button type="button" id="best-connection" class="tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span>Best Connection</span>\n              <span id="best-connection-indicator" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></span>\n            </button>\n\n            <button type="button" id="refresh-servers" class="tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span>Refresh</span>\n              <span id="refresh-spinner" class="tw-hidden">\n                <svg class="tw-animate-spin tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                  <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n                  <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                </svg>\n              </span>\n            </button>\n            <button type="button" id="reset-filters" class="tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span>Reset</span>\n            </button>\n          </div>\n        </div>\n\n        <div class="btn-more tw-flex tw-w-full tw-flex-row tw-flex-wrap tw-gap-2 tw-justify-end">\n          \x3c!-- Second row --\x3e\n            <div class="tw-relative">\n              <button id="age-filter-button" class="tw-relative tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n                <span>Server Age</span>\n                <span id="age-filter-indicator" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></span>\n              </button>\n              <div id="age-filter-dropdown" class="tw-hidden tw-absolute tw-z-10 tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-w-48 tw-p-2 tw-left-1/2 tw-transform tw--translate-x-1/2">\n                <button class="tw-w-full tw-text-left tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 tw-rounded-lg tw-mb-1 tw-age-option" data-age="Oldest">\n                  Oldest\n                </button>\n                <div class="tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-my-1"></div>\n                <button class="tw-w-full tw-text-left tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 tw-rounded-lg tw-age-option" data-age="Newest">\n                  Newest\n                </button>\n              </div>\n            </div>\n            \n            <button type="button" id="old-version-filter" class="tw-hidden tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span>Old Version</span>\n              <span id="old-version-indicator" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></span>\n            </button>\n            \n            <button type="button" id="shuffle-servers-2" class="tw-border-none hover:tw-underline tw-bg-[#ffffff] dark:tw-bg-[#121215] tw-flex tw-items-center tw-gap-1">\n              <span>Shuffle</span>\n            </button>\n        </div>\n      </div>\n      \x3c!-- <button class="tw-btn-secondary-md btn-more" style="margin-bottom:10px;">Join Fastest Server</button>\n      <button class="tw-btn-secondary-md btn-more" style="margin-bottom:10px;">Join Fullest Server</button> --\x3e\n      \x3c!-- Status Card --\x3e\n      <div id="betterblox-status-card" class="tw-container tw-mx-auto tw-my-4 tw-w-full tw-max-w-6xl tw-bg-white dark:tw-bg-[#393b3d] tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-rounded-lg tw-p-3">\n        <div class="tw-flex tw-items-center tw-justify-between">\n          <div class="tw-flex tw-items-center tw-gap-3">\n            <div id="crawler-status-indicator" class="tw-flex tw-items-center tw-gap-2">\n              <div id="status-dot" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-yellow-500 tw-animate-pulse"></div>\n              <span id="status-text" class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-300">Loading...</span>\n            </div>\n            <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">\n              <span id="servers-loaded-count">0</span>/<span id="total-servers-count">0</span> servers • <span id="datacenters-count">0</span> datacenters\n              <span id="page-info" class="tw-ml-2 tw-hidden">Page <span id="current-page">0</span></span>\n              <span id="crawl-limit-info" class="tw-ml-2">Limit: <span id="crawl-limit-count" class="tw-cursor-pointer hover:tw-text-blue-500 dark:hover:tw-text-blue-400 tw-underline" title="Click to edit">1000</span></span>\n            </div>\n          </div>\n          <div class="tw-flex tw-items-center tw-gap-2">\n            <button id="stop-crawler-btn" class="tw-hidden tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-bg-red-500 tw-text-white tw-rounded-md hover:tw-bg-red-600 active:tw-bg-red-700 tw-transition-colors tw-shadow-sm tw-border-0 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-opacity-50">\n              Stop\n            </button>\n            <button id="skip-cache-btn" class="tw-hidden tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-bg-orange-500 tw-text-white tw-rounded-md hover:tw-bg-orange-600 active:tw-bg-orange-700 tw-transition-colors tw-shadow-sm tw-border-0 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-orange-500 focus:tw-ring-opacity-50">\n              Skip Cache\n            </button>\n            <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">\n              <div class="tw-w-16 tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-full tw-h-1.5">\n                <div id="progress-bar" class="tw-h-1.5 tw-rounded-full tw-bg-blue-500 tw-transition-all tw-duration-300" style="width: 0%"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class="tw-container tw-w-full tw-min-w-0 tw-max-w-full">\n        \x3c!-- Server List Container --\x3e\n        <div id="list-view-container" class="tw-w-full tw-min-w-0">\n          <div class="tw-my-2 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-flex tw-flex-wrap tw-gap-x-3 tw-gap-y-1 tw-justify-between tw-items-center tw-border-t tw-pt-2 tw-border-gray-200 dark:tw-border-gray-700">\n            <span id="server-stats" class="tw-min-w-0 tw-flex-1">Loading servers...</span>\n            <span id="datacenter-stats"></span>\n          </div>\n          <div id="betterblox-server-list" class="tw-grid sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-2 tw-place-items-center">\n          </div>\n          <button type="button" id="load-more-servers" class="tw-mt-4 tw-box-border tw-block tw-w-full tw-max-w-full tw-rounded-lg tw-border tw-border-solid tw-border-gray-300 tw-bg-white tw-py-1.5 tw-text-center tw-text-sm tw-font-medium tw-text-gray-700 tw-outline-none tw-transition-colors hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-1 dark:tw-border-gray-700 dark:tw-bg-[#393b3d] dark:tw-text-gray-200 dark:hover:tw-bg-[#434547] dark:focus:tw-ring-offset-[#121215] tw-hidden">\n            Load More\n          </button>\n        </div>\n      </div>\n    </div>\n  `
                      ),
                    r = document.createRange().createContextualFragment(a);
                  let i = "globe",
                    o = null;
                  const l = r.querySelector("#region-filter-indicator"),
                    c = r.querySelector("#globe-view-toggle"),
                    d = r.querySelector("#list-view-toggle"),
                    u = r.querySelector("#region-globe-container"),
                    w = r.querySelector("#region-list-container"),
                    g = r.querySelector("#globe-viewer-wrapper"),
                    m = r.querySelector("#region-filter-button"),
                    p = r.querySelector("#region-filter-dropdown"),
                    b = a => {
                      if (i = a, "globe" === i) c.classList.remove("tw-bg-gray-200", "dark:tw-bg-gray-700",
                          "tw-text-gray-700", "dark:tw-text-gray-300"), c.classList.add("tw-bg-blue-500",
                          "tw-text-white"), d.classList.remove("tw-bg-blue-500", "tw-text-white"), d.classList
                        .add("tw-bg-gray-200", "dark:tw-bg-gray-700", "tw-text-gray-700",
                        "dark:tw-text-gray-300"), u.classList.remove("tw-hidden"), w.classList.add("tw-hidden"),
                        o ? o.refresh() : (o = new h(g, t), t.setGlobeViewer(o));
                      else {
                        d.classList.remove("tw-bg-gray-200", "dark:tw-bg-gray-700", "tw-text-gray-700",
                            "dark:tw-text-gray-300"), d.classList.add("tw-bg-blue-500", "tw-text-white"), c
                          .classList.remove("tw-bg-blue-500", "tw-text-white"), c.classList.add("tw-bg-gray-200",
                            "dark:tw-bg-gray-700", "tw-text-gray-700", "dark:tw-text-gray-300"), u.classList.add(
                            "tw-hidden"), w.classList.remove("tw-hidden");
                        const t = p.querySelector("#datacenter-list");
                        t && (t.innerHTML = n(e()))
                      }
                    };
                  c && c.addEventListener("click", () => b("globe")), d && d.addEventListener("click", () => b(
                    "list")), m && m.addEventListener("click", async t => {
                    if (t.stopPropagation(), p.classList.toggle("tw-hidden"), !p.classList.contains(
                        "tw-hidden")) {
                      b("globe");
                      const t = p.querySelector("#datacenter-list");
                      t && (t.innerHTML =
                        '\n            <div class="tw-animate-pulse tw-flex tw-flex-col tw-gap-2 tw-px-4">\n              <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n              <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n              <div class="tw-h-12 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded"></div>\n            </div>\n          ',
                        await new Promise(t => setTimeout(t, 100)), t.innerHTML = n(e()))
                    }
                  }), document.addEventListener("click", t => {
                    !p || m?.contains(t.target) || p.contains(t.target) || p.classList.add("tw-hidden")
                  });
                  const f = r.querySelector("#sort-toggle"),
                    y = r.querySelector("#sort-text");
                  f && f.addEventListener("click", async () => {
                    const e = "Desc" === t.sortOrder ? "Asc" : "Desc";
                    y.textContent = "Desc" === e ? "Descending" : "Ascending", t.setSortOrder(e)
                  });
                  const v = r.querySelector("#refresh-servers"),
                    x = r.querySelector("#refresh-spinner");
                  v && v.addEventListener("click", async () => {
                    x.classList.remove("tw-hidden"), v.disabled = !0;
                    try {
                      await t.mainClass.refreshServerList()
                    } catch (t) {
                      console.error("Error refreshing server list:", t)
                    } finally {
                      x.classList.add("tw-hidden"), v.disabled = !1
                    }
                  });
                  const k = r.querySelector("#stop-crawler-btn");
                  k && k.addEventListener("click", async () => {
                    await t.mainClass.stopCrawler(!0), t.mainClass.updateStatus({
                      isCrawling: !1,
                      error: "Crawling stopped by user"
                    })
                  });
                  const S = r.querySelector("#skip-cache-btn");
                  S && S.addEventListener("click", () => {
                    t.mainClass.skipCacheLoading(), t.mainClass.updateStatus({
                      error: null
                    })
                  });
                  const L = r.querySelector("#crawl-limit-count");
                  L && L.addEventListener("click", () => {
                    const e = t.mainClass.crawlLimit,
                      n = prompt(`Enter new crawl limit (current: ${e}):`, e);
                    if (null !== n) {
                      const e = parseInt(n);
                      !isNaN(e) && e > 0 && e <= 1e4 ? (t.mainClass.crawlLimit = e, t.mainClass.status
                          .crawlLimit = e, t.mainClass.saveCrawlLimit(e), t.mainClass.updateStatusCard()) :
                        alert("Please enter a valid number between 1 and 10000")
                    }
                  });
                  const C = r.querySelector("#best-connection"),
                    E = r.querySelector("#best-connection-indicator");
                  C && C.addEventListener("click", async () => {
                    C.disabled = !0;
                    const e = C.querySelector("span").textContent;
                    C.querySelector("span").textContent = "Calculating...";
                    try {
                      await t.toggleBestConnection(), t.isBestConnection ? (E.classList.remove(
                        "tw-bg-gray-400"), E.classList.add("tw-bg-green-500")) : (E.classList.remove(
                        "tw-bg-green-500"), E.classList.add("tw-bg-gray-400")), F()
                    } catch (t) {} finally {
                      C.disabled = !1, C.querySelector("span").textContent = e
                    }
                  });
                  const T = r.querySelector("#age-filter-button"),
                    I = r.querySelector("#age-filter-dropdown"),
                    M = r.querySelector("#age-filter-indicator");
                  T && T.addEventListener("click", e => {
                    e.stopPropagation(), I.classList.toggle("tw-hidden"), I.classList.contains("tw-hidden") ||
                      I.querySelectorAll(".age-option").forEach(e => {
                        e.classList.remove("tw-bg-blue-200", "dark:tw-bg-blue-800", "tw-bg-blue-300",
                          "dark:tw-bg-blue-700", "hover:tw-bg-gray-100", "dark:tw-bg-gray-700",
                          "dark:hover:tw-bg-gray-600"), e.dataset.age === t.ageSort ? e.classList.add(
                          "tw-bg-blue-200", "dark:tw-bg-blue-800") : e.classList.add(
                          "hover:tw-bg-gray-100", "dark:tw-bg-gray-700", "dark:hover:tw-bg-gray-600")
                      })
                  }), document.addEventListener("click", t => {
                    !I || T?.contains(t.target) || I.contains(t.target) || I.classList.add("tw-hidden")
                  });
                  const A = e => {
                    e.preventDefault(), e.stopPropagation();
                    const n = e.target.closest(".age-option");
                    if (!n) return;
                    const a = n.dataset.age;
                    let r;
                    r = t.ageSort === a ? null : a, t.setAgeSort(a);
                    const s = I.querySelectorAll(".age-option");
                    s.forEach(t => {
                        t.classList.remove("tw-bg-blue-200", "dark:tw-bg-blue-800", "tw-bg-blue-300",
                          "dark:tw-bg-blue-700", "hover:tw-bg-gray-100", "dark:tw-bg-gray-700",
                          "dark:hover:tw-bg-gray-600")
                      }), r && n.classList.add("tw-bg-blue-200", "dark:tw-bg-blue-800"), s.forEach(t => {
                        t.classList.contains("tw-bg-blue-200") || t.classList.add("hover:tw-bg-gray-100",
                          "dark:tw-bg-gray-700", "dark:hover:tw-bg-gray-600")
                      }), M && (r ? (M.classList.remove("tw-bg-gray-400"), M.classList.add("tw-bg-teal-500")) :
                        (M.classList.remove("tw-bg-teal-500"), M.classList.add("tw-bg-gray-400"))), F(), I
                      .classList.add("tw-hidden")
                  };
                  I.querySelectorAll(".age-option").forEach(t => {
                    t.addEventListener("click", A)
                  });
                  const D = r.querySelector("#shuffle-servers-2");
                  D && D.addEventListener("click", () => {
                    t.toggleShuffle2()
                  });
                  const P = r.querySelector("#old-version-filter"),
                    $ = r.querySelector("#old-version-indicator");
                  P && P.addEventListener("click", () => {
                    t.setOldVersionSort(), t.oldVersionSort ? ($.classList.remove("tw-bg-gray-400"), $
                      .classList.add("tw-bg-orange-500")) : ($.classList.remove("tw-bg-orange-500"), $
                      .classList.add("tw-bg-gray-400"))
                  });
                  const R = r.querySelector("#server-stats"),
                    _ = r.querySelector("#datacenter-stats"),
                    N = () => {
                      const a = e(),
                        s = t.mainClass.serverList.length,
                        i = t.elementList.length,
                        o = a.length,
                        l = t.mainClass.getJoinDataBreakdown();
                      let c =
                        `Showing ${i} of ${s} servers · Resolved ${l.successful} · In pool ${l.inPool} · Failed ${l.failed}`;
                      l.unknown > 0 && (c += ` · No region ${l.unknown}`), R.textContent = c, _.textContent =
                        `${o} locations`;
                      const d = t.mainClass.hasOldVersionServers(),
                        u = document.querySelector("#old-version-filter");
                      if (u)
                        if (d) u.classList.remove("tw-hidden");
                        else if (u.classList.add("tw-hidden"), t.oldVersionSort) {
                        t.oldVersionSort = null;
                        const e = r.querySelector("#old-version-indicator");
                        e && (e.classList.remove("tw-bg-orange-500"), e.classList.add("tw-bg-gray-400"))
                      }
                      const w = document.querySelector("#region-stats"),
                        g = document.querySelector("#region-connection-stats");
                      if (w && (w.textContent = `${o} locations available`), g && (g.innerHTML = ""), p && !p
                        .classList.contains("tw-hidden")) {
                        const t = p.querySelector("#datacenter-list");
                        t && (t.innerHTML = n(e()))
                      }
                    },
                    j = t.handleServerListRefresh;
                  t.handleServerListRefresh = async function() {
                    await j.call(this), N(), t.mainClass.updateStatusCard()
                  };
                  const O = t.mainClass.createServerCard;
                  t.mainClass.createServerCard = async function(t) {
                    await O.call(this, t), N()
                  }, N();
                  const B = r.querySelector("#region-filter-dropdown button");
                  B && B.addEventListener("click", e => {
                    e.preventDefault(), e.stopPropagation(), r.querySelectorAll(".datacenter-button").forEach(
                      t => {
                        t.classList.remove("tw-bg-blue-200", "dark:tw-bg-blue-800", "hover:bg-blue-300",
                          "dark:hover:tw-bg-blue-700")
                      }), t.clearDatacenterFilters(), H(), l && (l.classList.remove("tw-bg-blue-500"), l
                      .classList.add("tw-bg-gray-400"))
                  });
                  const q = r.querySelector("#datacenter-list");
                  q && q.addEventListener("click", e => {
                    e.preventDefault(), e.stopPropagation();
                    const n = e.target.closest(".datacenter-button");
                    if (!n) return;
                    const a = n.dataset.location,
                      r = !n.classList.contains("tw-bg-blue-200");
                    r ? n.classList.add("tw-bg-blue-200", "dark:tw-bg-blue-800", "hover:tw-bg-blue-300",
                        "dark:hover:tw-bg-blue-700") : n.classList.remove("tw-bg-blue-200",
                        "dark:tw-bg-blue-800", "hover:tw-bg-blue-300", "dark:hover:tw-bg-blue-700"), t
                      .setDatacenterFilter(a, r), H(), l && (t.filterSettings.datacenters.size > 0 ? (l
                        .classList.remove("tw-bg-gray-400"), l.classList.add("tw-bg-blue-500")) : (l
                        .classList.remove("tw-bg-blue-500"), l.classList.add("tw-bg-gray-400")))
                  });
                  const H = () => {
                      const e = r.querySelector("#selected-regions-count");
                      if (!e) return;
                      const n = t.filterSettings.datacenters.size;
                      n > 0 ? (e.textContent = n, e.classList.remove("tw-hidden")) : e.classList.add("tw-hidden")
                    },
                    G = () => {
                      const e = r.querySelector("#region-filter-indicator");
                      e && (t.filterSettings.datacenters.size > 0 ? (e.classList.remove("tw-bg-gray-400"), e
                        .classList.add("tw-bg-blue-500")) : (e.classList.remove("tw-bg-blue-500"), e.classList
                        .add("tw-bg-gray-400")))
                    },
                    F = () => {
                      M && (t.ageSort ? (M.classList.remove("tw-bg-gray-400"), M.classList.add(
                        "tw-bg-teal-500")) : (M.classList.remove("tw-bg-teal-500"), M.classList.add(
                          "tw-bg-gray-400"))), E && (t.isBestConnection ? (E.classList.remove("tw-bg-gray-400"),
                        E.classList.add("tw-bg-green-500")) : (E.classList.remove("tw-bg-green-500"), E
                        .classList.add("tw-bg-gray-400")))
                    };
                  H(), N(), G(), F(), t.mainClass.updateStatusCard();
                  const V = r.querySelector("#reset-filters");
                  return V && V.addEventListener("click", () => {
                    t.reset(), r.querySelectorAll(".datacenter-button").forEach(t => {
                      t.classList.remove("tw-bg-blue-200", "dark:tw-bg-blue-800", "hover:bg-blue-300",
                        "dark:hover:tw-bg-blue-700")
                    }), f && y && (y.textContent = "Descending"), M && (M.classList.remove(
                      "tw-bg-teal-500"), M.classList.add("tw-bg-gray-400")), I.querySelectorAll(
                      ".age-option").forEach(t => {
                      t.classList.remove("tw-bg-blue-200", "dark:tw-bg-blue-800", "tw-bg-blue-300",
                        "dark:tw-bg-blue-700", "hover:tw-bg-gray-100", "dark:tw-bg-gray-700",
                        "dark:hover:tw-bg-gray-600"), t.classList.add("hover:tw-bg-gray-100",
                        "dark:tw-bg-gray-700", "dark:hover:tw-bg-gray-600")
                    }), t.ageSort = null, t.oldVersionSort = null, $ && ($.classList.remove(
                      "tw-bg-orange-500"), $.classList.add("tw-bg-gray-400")), [l, E].forEach(t => {
                      t && (t.classList.remove("tw-bg-blue-500", "tw-bg-green-500", "tw-bg-teal-500",
                        "tw-bg-purple-500", "tw-bg-orange-500"), t.classList.add("tw-bg-gray-400"))
                    });
                    const e = r.querySelector("#selected-regions-count");
                    e && e.classList.add("tw-hidden"), p && p.classList.add("tw-hidden")
                  }), r.cleanup = () => {
                    o && (o.destroy(), o = null)
                  }, r.updateStats = N, r.updateFilterIndicators = G, r.updateRegionCount = H, r
                }(this.paginationManager),
                a = t.querySelector("#rbx-public-running-games");
              t.insertBefore(n, a);
              const r = t.querySelector("#betterblox-server-filter");
              return this.containerElement = r, this.containerUpdateStats = r.updateStats, r
            }
            async createServerCard(t, e = null) {
              if (!t) return void console.error("Server not found");
              if (document.querySelector(`[betterblox-server-id="${t.id}"]`)) return void console.error(
                "Server card already exists");
              let n = this.serverAvatars.get(t.id);
              !n && t.playerTokens && t.playerTokens.length > 0 && (n = await this.getServerAvatars(t
                .playerTokens), n && this.serverAvatars.set(t.id, n));
              const a = await this.getClientLocation();
              let r = t.botPercentage || null;
              null === r && this.serverBotAnalysis.has(t.id) && (r = this.serverBotAnalysis.get(t.id)
                .botPercentage, t.botPercentage = r);
              const s = function(t, e, n, a, r, s, i, o, l = null, c = null, d = !1, u = null, w = null, g = !1,
                  h = null, m = null, p = null, b = null, f = !1, y = !1, v = !1) {
                  const x = n - 5,
                    k = Math.round(n / a * 100),
                    S = h ? Math.round(h / 60 * 100) : null,
                    L = t => t * (Math.PI / 180),
                    C = (() => {
                      if (!c || !p || !b) return null;
                      const t = [];
                      if (Object.values(p).forEach(e => {
                          if (e.location?.latLong) {
                            const [n, a] = e.location.latLong, r = ((t, e, n, a) => {
                              const r = L(n - t),
                                s = L(a - e),
                                i = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(L(t)) * Math.cos(L(n)) *
                                Math.sin(s / 2) * Math.sin(s / 2);
                              return 2 * Math.atan2(Math.sqrt(i), Math.sqrt(1 - i)) * 6371
                            })(b.latitude, b.longitude, n, a);
                            t.push(r)
                          }
                        }), 0 === t.length) return null;
                      const e = Math.max(...t);
                      return Math.round(100 - c / e * 100)
                    })(),
                    E = null != u && Number(u) > 0 ? Number(u) : 0,
                    T = y ? "tw-border-amber-500/80 dark:tw-border-amber-500/70" : f ?
                    "tw-border-blue-400/70 dark:tw-border-blue-500/60" :
                    "tw-border-gray-300 dark:tw-border-gray-700",
                    I = y ?
                    `<div class="tw-flex tw-flex-col tw-gap-0.5">\n         <p class="tw-font-semibold tw-text-amber-700 dark:tw-text-amber-400">Region unavailable</p>\n         <p class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">${v?"Join queue did not clear (gave up after several tries)":"Could not load server details"}</p>\n       </div>` :
                    f ?
                    `<div class="tw-flex tw-flex-col tw-gap-0.5 tw-text-gray-600 dark:tw-text-gray-300" aria-live="polite">\n           <div class="tw-flex tw-items-center tw-gap-2">\n             <span class="tw-inline-block tw-h-3.5 tw-w-3.5 tw-shrink-0 tw-rounded-full tw-border-2 tw-border-current tw-border-t-transparent tw-animate-spin" aria-hidden="true"></span>\n             <span class="tw-text-sm tw-font-medium">${E>0?`Join queue #${E}`:"Loading region…"}</span>\n           </div>\n           ${E>0?'<p class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-ml-6">Polling for region…</p>':""}\n         </div>` :
                    `<p class="tw-font-semibold dark:tw-text-white">${e?.location?.country||"Unknown"}</p>`,
                    M = y ?
                    '<p class="tw-text-center tw-text-sm tw-font-semibold tw-text-amber-700 dark:tw-text-amber-400">—</p>' :
                    f ?
                    `<p class="tw-text-center tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-animate-pulse">${E>0?"In Roblox queue — retrying…":"Resolving location…"}</p>` :
                    `<p class="tw-text-center tw-text-md tw-font-semibold">${e?.location?.city||"Unknown"} - ${e?.location?.region||"Unknown"}</p>`,
                    A = x > 0 ?
                    `<div class="tw-bg-gray-200 dark:tw-bg-gray-500 tw-w-14 tw-h-14 tw-rounded-full tw-flex tw-items-center tw-justify-center">\n            <p class="tw-text-center tw-text-xl tw-font-semibold tw-text-gray-500 dark:tw-text-white">+${x}</p>\n          </div>\n          ` :
                    "",
                    D =
                    `\n    <div id="server-card" betterblox-server-id="${i}" class="tw-bg-white dark:tw-bg-[#393b3d] tw-h-96 tw-w-56 tw-rounded-lg tw-p-2 tw-border-2 ${T} tw-shadow-md tw-flex tw-flex-col tw-relative" ${f?'aria-busy="true"':""}>\n        <div class="tw-flex tw-flex-row tw-justify-between tw-items-center tw-min-h-[2.25rem]">\n          ${I}\n        </div>\n        \n        ${d?'<div class="tw-absolute tw-top-2 tw-right-2 tw-bg-gradient-to-r tw-from-green-400/80 tw-to-green-500/60 tw-backdrop-blur-sm tw-text-white tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-lg tw-shadow-lg tw-border tw-border-green-300/30">\n                ⚡ Closest\n              </div>':""}\n\n        <div class="tw-grid tw-grid-cols-3 tw-gap-1 tw-w-full tw-mt-4 tw-h-32">\n          ${Object.values(r).slice(0,5).map(t=>t?`<img src="${t}" class="tw-bg-gray-300 dark:tw-bg-gray-500 tw-w-14 tw-h-14 tw-object-cover tw-rounded-full" />`:'<span class="tw-thumbnail-2d-container tw-icon-blocked tw-avatar-card-image tw-rounded-full"></span>').join("")}\n          ${A}\n        </div>\n        \n        \x3c!-- Player count and progress bar --\x3e\n        <div class="tw-mt-2">\n          <div class="tw-flex tw-justify-between tw-items-center tw-mb-1">\n            <p class="tw-text-sm tw-font-medium dark:tw-text-white">${n} of ${a} people max</p>\n            <p class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">${k}% full</p>\n          </div>\n          <div class="tw-w-full tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-full tw-h-2">\n            <div class="tw-h-2 tw-rounded-full tw-transition-all tw-duration-300 tw-bg-gray-400 dark:tw-bg-gray-300" style="width: ${k}%"></div>\n          </div>\n        </div>\n        \n        \x3c!-- Server Info Table --\x3e\n        <div class="tw-mt-2 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-md tw-p-2">\n          <table class="tw-w-full tw-text-xs">\n            <tbody>\n              <tr class="tw-border-b tw-border-gray-200 dark:tw-border-gray-600">\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300 tw-w-1/3">Ping</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white tw-w-1/3">${t||"N/A"}ms</td>\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300 tw-w-1/3 tw-pl-4">Speed</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white">${null!==S?S+"%":"N/A"}</td>\n              </tr>\n              <tr class="tw-border-b tw-border-gray-200 dark:tw-border-gray-600">\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300">Version</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white ${g?"tw-text-orange-500":""}">${w||"N/A"}${g?" (Old)":""}</td>\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300 tw-pl-4">Age</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white">${l||"N/A"}</td>\n              </tr>\n              <tr>\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300">Closest</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white">${null!==C?C+"%":"N/A"}</td>\n                <td class="tw-py-1 tw-font-medium tw-text-gray-600 dark:tw-text-gray-300 tw-pl-4">Bots</td>\n                <td class="tw-py-1 tw-text-right tw-text-gray-800 dark:tw-text-white">${null!==m?m+"%":"N/A"}</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class="tw-stats tw-border-[1px] tw-border-gray-300 dark:tw-border-gray-500 tw-rounded-md tw-my-2 dark:tw-text-white">\n          ${M}\n        </div>\n        <div class="tw-mt-auto">\n        <button class="tw-bg-transparent tw-border-[1px] tw-border-gray-400 dark:tw-border-gray-300 tw-text-black dark:tw-text-white tw-font-semibold hover:tw-bg-gray-200 hover:tw-border-gray-400 dark:hover:tw-bg-gray-600 dark:hover:tw-border-gray-600 tw-px-4 tw-rounded-md tw-text-xs tw-w-full" id="join-button" onclick="Roblox.GameLauncher.joinGameInstance(${s}, '${i}')">\n          Join${u&&u>0?` (${u} in queue)`:""}\n        </button>\n           \n          \x3c!-- <div class="tw-grid tw-grid-cols-6 tw-gap-1">\n            <button class="tw-col-span-4 tw-bg-transparent tw-border-[1px] tw-border-gray-400 dark:tw-border-gray-300 tw-text-black dark:tw-text-white tw-font-semibold hover:tw-bg-gray-200 hover:tw-border-gray-400 dark:hover:tw-bg-gray-600 dark:hover:tw-border-gray-600 tw-px-4 tw-rounded-md tw-text-xs tw-w-full" id="join-button" onclick="Roblox.GameLauncher.joinGameInstance(${s}, '${i}')">Join</button>\n            <button class="tw-col-span-2 tw-bg-transparent tw-border-[1px] tw-border-gray-400 dark:tw-border-gray-300 tw-text-black dark:tw-text-white tw-font-semibold hover:tw-bg-gray-200 hover:tw-border-gray-400 dark:hover:tw-bg-gray-600 dark:hover:tw-border-gray-600 tw-px-4 tw-rounded-md tw-text-xs" id="invite-button">Invite</button>\n          </div> --\x3e\n        </div>\n      </div>\n    `,
                    P = document.createRange().createContextualFragment(D),
                    $ = (P.querySelector("#join-button"), P.querySelector("#invite-button"));
                  return $ && "function" == typeof o && $.addEventListener("click", o), P
                }(t.ping, t.datacenter, t.playing, t.maxPlayers, n || {}, this.gameId, t.id, "", t.serverAge, t
                  .distance || null, t.isClosest || !1, t.queuePosition || null, t.placeVersion || null, t
                  .isOutdated || !1, t.fps || null, r, this.datacenters, a, !!t.joinDataPending, !!t
                  .joinDataFailed, !!t.joinFailedStuckInQueue),
                i = document.querySelector("#betterblox-server-list");
              i ? i.appendChild(s) : console.error("Server list container not found")
            }
            async refreshServerList() {
              await this.stopCrawler(!1), this.clearDisplayedServers(), this.serverList = [], this.crawlerState
                .isActive = !0, this.crawlerState.nextPageCursor = null, this.crawlerState.currentCursor = null,
                this.crawlerState.emptyResponseCount = 0, this.crawlerState.pendingRequests.clear(), this
                .updateStatus({
                  isCrawling: !0,
                  processingProgress: 0,
                  currentPage: 0,
                  totalPages: 0,
                  hasMorePages: !1,
                  serversLoaded: 0,
                  totalServers: 0,
                  error: null
                }), this.paginationManager.elementList = [];
              try {
                await this.fetchAllServersWithPagination("Desc")
              } catch (t) {
                console.error("Error during server crawling:", t), this.updateStatus({
                  error: t.message,
                  isCrawling: !1
                })
              } finally {
                this.crawlerState.isActive = !1
              }
            }
            async refreshServerListWithSortOrder(t) {
              await this.stopCrawler(!1), this.clearDisplayedServers(), this.serverList = [], this.crawlerState
                .isActive = !0, this.crawlerState.nextPageCursor = null, this.crawlerState.currentCursor = null,
                this.crawlerState.emptyResponseCount = 0, this.crawlerState.pendingRequests.clear(), this
                .updateStatus({
                  isCrawling: !0,
                  processingProgress: 0,
                  currentPage: 0,
                  totalPages: 0,
                  hasMorePages: !1,
                  serversLoaded: 0,
                  totalServers: 0,
                  error: null
                });
              try {
                await this.fetchAllServersWithPagination(t)
              } catch (t) {
                console.error("Error during server crawling:", t), this.updateStatus({
                  error: t.message,
                  isCrawling: !1
                })
              } finally {
                this.crawlerState.isActive = !1
              }
            }
            clearDisplayedServers() {
              const t = document.querySelector("#betterblox-server-list");
              t && (t.innerHTML = "")
            }
            async fetchAllServersWithPagination(t = "Desc") {
              await this.fetchCachedServers();
              let e = "",
                n = !0,
                a = 0,
                r = 0;
              for (; n && this.crawlerState.isActive && this.serverList.length < this.crawlLimit;) try {
                const s = await this.searchServers(this.gameId, 50, t, e);
                if (429 === s.status) {
                  const t = parseInt(s.headers?.["retry-after"]) || 5;
                  this.updateStatus({
                    error: `Rate limited, waiting ${t}s...`,
                    processingProgress: Math.min(90, a / Math.max(1, a + 1) * 100)
                  }), await new Promise(e => setTimeout(e, 1e3 * t)), this.updateStatus({
                    error: null
                  });
                  continue
                }
                if (!s.ok || !s.data?.data) throw new Error(`HTTP error! status: ${s.status}`);
                if (s.data.data && s.data.data.length > 0) {
                  if (this.crawlerState.emptyResponseCount = 0, r += await this.processServerData(s.data.data),
                    this.serverList.length >= this.crawlLimit) {
                    this.updateStatus({
                      error: `Crawl limit reached (${this.crawlLimit} valid servers)`,
                      isCrawling: !1
                    });
                    break
                  }
                  a++;
                  const t = Math.min(90, a / Math.max(1, a + 1) * 100);
                  this.updateStatus({
                    currentPage: a,
                    totalServers: r,
                    serversLoaded: this.serverList.length,
                    processingProgress: t,
                    hasMorePages: !!s.data.nextPageCursor
                  }), e = s.data.nextPageCursor, n = !!e, this.crawlerState.nextPageCursor = e
                } else this.crawlerState.emptyResponseCount++, this.crawlerState.emptyResponseCount >= 6 ? (
                  n = !1, this.updateStatus({
                    hasMorePages: !1
                  })) : (this.updateStatus({
                  error: `Empty response, retrying... (${this.crawlerState.emptyResponseCount}/6)`,
                  processingProgress: Math.min(90, a / Math.max(1, a + 1) * 100)
                }), await new Promise(t => setTimeout(t, 5e3)))
              } catch (t) {
                if (console.error(`Error fetching page ${a+1} of servers: ${t.message}`), 0 === r) {
                  this.updateStatus({
                    error: t.message,
                    isCrawling: !1
                  });
                  break
                }
                n = !1, this.updateStatus({
                  hasMorePages: !1,
                  error: `Stopped due to error: ${t.message}`
                })
              }
              console.log("Final processing", this.crawlerState.isActive), this.crawlerState.isActive && (this
                .updateStatus({
                  processingProgress: 100,
                  serversLoaded: this.serverList.length,
                  datacentersCount: this.datacenters ? Object.keys(this.datacenters).length : 0,
                  lastUpdated: (new Date).toLocaleTimeString(),
                  isCrawling: !1,
                  error: null
                }), await this.updateServerDistancesAndBadges(), await this.paginationManager
                .handleServerListRefresh(), this.containerUpdateStats && this.containerUpdateStats())
            }
            joinDataPriority(t) {
              return !t || t.joinDataPending ? 2 : t.joinDataFailed ? 1 : 0
            }
            compareJoinDataPriority(t, e) {
              return this.joinDataPriority(t) - this.joinDataPriority(e)
            }
            getJoinDataBreakdown() {
              let t = 0,
                e = 0,
                n = 0,
                a = 0;
              for (const r of this.serverList) r.joinDataFailed ? n++ : r.joinDataPending ? e++ : null != r
                .datacenterId && r.ip ? t++ : a++;
              return {
                successful: t,
                inPool: e,
                failed: n,
                unknown: a
              }
            }
            serverAgeFromFirstSeen(t) {
              if (!t) return null;
              const e = Date.now() - new Date(t).getTime(),
                n = Math.floor(e / 6e4),
                a = Math.floor(e / 36e5),
                r = Math.floor(e / 864e5);
              return n < 60 ? `${n}m` : a < 24 ? `${a}h` : `${r}d`
            }
            mergeGameJoinScanIntoServer(t, e) {
              if (!e || e.error) return null;
              const n = this.datacenters[e.datacenterId];
              return {
                ...t,
                ...e,
                datacenter: n || null,
                datacenterId: e.datacenterId,
                queuePosition: e.queuePosition ?? null,
                placeVersion: e.placeVersion ?? null
              }
            }
            _beginJoinDataActivity() {
              0 === this._joinDataActivityCount && this.showNetworkActivity(), this._joinDataActivityCount++
            }
            _endJoinDataActivity() {
              this._joinDataActivityCount = Math.max(0, this._joinDataActivityCount - 1), 0 === this
                ._joinDataActivityCount && this.hideNetworkActivity()
            }
            enqueueJoinDataEnrichment(t) {
              t && (this._joinDataActiveIds.has(t) || (this._joinDataActiveIds.add(t), this._joinDataQueue.push(
                t), this._pumpJoinDataQueue()))
            }
            _pumpJoinDataQueue() {
              for (; this._joinDataInflight < this._joinDataMaxConcurrent && this._joinDataQueue.length > 0;) {
                const t = this._joinDataQueue.shift();
                this._joinDataInflight++, this._runEnrichmentForServer(t).catch(t => console.warn(
                  "[BBloxUI] join-data enrichment failed:", t)).finally(() => {
                  this._joinDataInflight--, this._pumpJoinDataQueue()
                })
              }
            }
            _scheduleJoinQueueRetrySweep() {
              null == this._joinQueueRetryTimer && (this._joinQueueRetryTimer = setTimeout(() => {
                this._joinQueueRetryTimer = null, this._sweepJoinQueueRetries()
              }, this._joinQueueRetryIntervalMs))
            }
            _sweepJoinQueueRetries() {
              const t = this.crawlGeneration;
              for (const t of [...this._joinQueueRetryIds]) {
                const e = this.serverList.findIndex(e => e.id === t);
                if (-1 === e) {
                  this._joinQueueRetryIds.delete(t);
                  continue
                }
                const n = this.serverList[e];
                if (!n.joinDataPending) {
                  this._joinQueueRetryIds.delete(t);
                  continue
                }
                const a = Number(n.queuePosition) || 0;
                null != n.datacenterId && n.ip || a <= 0 ? this._joinQueueRetryIds.delete(t) : this
                  .enqueueJoinDataEnrichment(t)
              }
              t === this.crawlGeneration && this._joinQueueRetryIds.size > 0 && this
              ._scheduleJoinQueueRetrySweep()
            }
            _poolJoinQueueRetry(t) {
              this._joinQueueRetryIds.add(t), this._scheduleJoinQueueRetrySweep()
            }
            async _runEnrichmentForServer(t) {
              try {
                const e = this.crawlGeneration;
                let n = this.serverList.findIndex(e => e.id === t);
                if (-1 === n) return;
                const a = this.serverList[n];
                if (!a.joinDataPending) return;
                let r;
                this._beginJoinDataActivity();
                try {
                  r = await chrome.runtime.sendMessage({
                    type: "GET_GAMEJOIN_DATA",
                    data: {
                      placeId: this.gameId,
                      serverId: t,
                      taskId: this.joinGameTaskId
                    }
                  })
                } finally {
                  this._endJoinDataActivity()
                }
                if (e !== this.crawlGeneration) return;
                if (n = this.serverList.findIndex(e => e.id === t), -1 === n) return;
                if (r?.abortedStaleTask) return;
                const s = this.mergeGameJoinScanIntoServer(this.serverList[n], r);
                if (!s) return this._joinQueueRetryIds.delete(t), this.serverList[n] = {
                  ...this.serverList[n],
                  joinDataPending: !1,
                  joinDataFailed: !0,
                  joinFailedStuckInQueue: !1,
                  joinQueueNonZeroStreak: 0
                }, void this._scheduleRefreshAfterEnrichment();
                const i = Number(s.queuePosition) || 0,
                  o = null != s.datacenterId && s.ip;
                if (i > 0 && !o) {
                  const e = (a.joinQueueNonZeroStreak || 0) + 1,
                    r = (a.joinQueuePollCount || 0) + 1;
                  return e >= this._joinQueueMaxNonZeroStreak ? (this._joinQueueRetryIds.delete(t), s
                    .joinDataPending = !1, s.joinDataFailed = !0, s.joinFailedStuckInQueue = !0, s
                    .joinQueueNonZeroStreak = 0, s.joinQueuePollCount = r, this.serverList[n] = s, void this
                    ._scheduleRefreshAfterEnrichment()) : r > this._maxJoinQueuePolls ? (this._joinQueueRetryIds
                    .delete(t), s.joinDataPending = !1, s.joinDataFailed = !1, s.joinFailedStuckInQueue = !1, s
                    .joinQueueNonZeroStreak = 0, s.joinQueuePollCount = r, this.serverList[n] = s, void this
                    ._scheduleRefreshAfterEnrichment()) : (s.joinDataPending = !0, s.joinDataFailed = !1, s
                    .joinFailedStuckInQueue = !1, s.joinQueueNonZeroStreak = e, s.joinQueuePollCount = r, this
                    .serverList[n] = s, this._poolJoinQueueRetry(t), void this._scheduleRefreshAfterEnrichment()
                    )
                }
                this._joinQueueRetryIds.delete(t), s.joinDataPending = !1, s.joinDataFailed = !1, s
                  .joinFailedStuckInQueue = !1, s.joinQueueNonZeroStreak = 0, this.serverList[n] = s, null == s
                  .datacenterId || this.cachedServers.has(t) || this._queueBulkAfterEnrichment({
                    id: t,
                    placeId: parseInt(this.gameId, 10),
                    datacenter: s.datacenterId,
                    ip: s.ip || null
                  }), this._scheduleRefreshAfterEnrichment()
              } finally {
                this._joinDataActiveIds.delete(t)
              }
            }
            _queueBulkAfterEnrichment(t) {
              this._pendingBulkServers.push(t), this._bulkDebounceTimer && clearTimeout(this._bulkDebounceTimer),
                this._bulkDebounceTimer = setTimeout(() => {
                  this._bulkDebounceTimer = null, this._flushPendingBulkAfterEnrichment()
                }, 400)
            }
            async _flushPendingBulkAfterEnrichment() {
              const t = this._pendingBulkServers.splice(0, this._pendingBulkServers.length);
              if (0 === t.length) return;
              const e = this.crawlGeneration,
                n = await this.sendPageServersToBulkUpdate(t);
              e === this.crawlGeneration && (n.forEach((t, e) => {
                const n = this.serverList.findIndex(t => t.id === e); - 1 !== n && (this.serverList[n] = {
                  ...this.serverList[n],
                  firstSeen: t,
                  serverAge: this.serverAgeFromFirstSeen(t)
                })
              }), this._scheduleRefreshAfterEnrichment())
            }
            _scheduleRefreshAfterEnrichment() {
              this._enrichmentRefreshTimer && clearTimeout(this._enrichmentRefreshTimer), this
                ._enrichmentRefreshTimer = setTimeout(async () => {
                  this._enrichmentRefreshTimer = null;
                  const t = this.crawlGeneration;
                  await this.updateServerDistancesAndBadges(), t === this.crawlGeneration && this
                    .paginationManager && await this.paginationManager.handleServerListRefresh()
                }, 200)
            }
            async processServerData(t) {
              if (!t || 0 === t.length) return 0;
              const e = t.filter(t => t.maxPlayers !== t.playing),
                n = new Set(this.serverList.map(t => t.id)),
                a = e.filter(t => !n.has(t.id)).map(t => {
                  const e = this.cachedServers.get(t.id),
                    n = e?.firstSeen ?? null;
                  return {
                    ...t,
                    datacenter: null,
                    datacenterId: null,
                    ip: null,
                    joinDataPending: !0,
                    joinDataFailed: !1,
                    joinFailedStuckInQueue: !1,
                    joinQueueNonZeroStreak: 0,
                    joinQueuePollCount: 0,
                    queuePosition: null,
                    placeVersion: null,
                    firstSeen: n,
                    serverAge: this.serverAgeFromFirstSeen(n)
                  }
                });
              this.serverList.push(...a);
              const r = a;
              if (a.forEach(t => this.enqueueJoinDataEnrichment(t.id)), r.length > 0) try {
                this.updateStatus({
                  error: "Loading avatars and analyzing servers..."
                });
                const t = await this.batchLoadServerAvatars(r);
                t.forEach((t, e) => {
                  this.serverAvatars.set(e, t)
                });
                const e = await this.batchAnalyzeBotProbability(t);
                e.forEach((t, e) => {
                  this.serverBotAnalysis.set(e, t)
                }), r.forEach(t => {
                  const n = e.get(t.id);
                  n && (t.botPercentage = n.botPercentage)
                }), this.updateStatus({
                  error: null
                })
              } catch (t) {
                this.updateStatus({
                  error: null
                })
              }
              return await this.updateServerDistancesAndBadges(), r.length > 0 && await this.paginationManager
                .handleServerListRefresh(), r.length
            }
            async addNewServersToUI() {
              const t = document.querySelector("#betterblox-server-list");
              if (!t) return;
              const e = t.children.length,
                n = this.status.isCrawling ? this.serverList.length : this.paginationManager.currentPage * this
                .paginationManager.itemsPerPage,
                a = this.serverList.slice(e, n);
              for (const t of a) document.querySelector(`[betterblox-server-id="${t.id}"]`) || await this
                .createServerCard(t);
              this.paginationManager.updateLoadMoreButton()
            }
            async applyPaginationLimits() {
              const t = document.querySelector("#betterblox-server-list");
              if (!t) return;
              const e = t.children.length,
                n = this.paginationManager.currentPage * this.paginationManager.itemsPerPage;
              if (e > n) {
                const e = Array.from(t.children);
                for (let t = n; t < e.length; t++) e[t].style.display = "none"
              }
              this.paginationManager.updateLoadMoreButton()
            }
            _releaseJoinDataPendingAfterCancel() {
              for (const t of this.serverList) t.joinDataPending && (t.joinDataPending = !1, t
                .joinFailedStuckInQueue = !1, t.joinQueueNonZeroStreak = 0)
            }
            async stopCrawler(t = !1) {
              this.joinGameTaskId = this._newJoinGameTaskId(), await this._registerJoinGameTaskWithBackground(),
                this.crawlGeneration++, this._joinDataQueue.length = 0, this._joinDataActiveIds.clear(), this
                ._joinQueueRetryIds.clear(), null != this._joinQueueRetryTimer && (clearTimeout(this
                  ._joinQueueRetryTimer), this._joinQueueRetryTimer = null), this._bulkDebounceTimer && (
                  clearTimeout(this._bulkDebounceTimer), this._bulkDebounceTimer = null), this
                ._enrichmentRefreshTimer && (clearTimeout(this._enrichmentRefreshTimer), this
                  ._enrichmentRefreshTimer = null), this._pendingBulkServers.length = 0, this.crawlerState
                .isActive = !1, this.crawlerState.pendingRequests.clear(), this.hideNetworkActivity(), t && this
                .serverList.length > 0 && (this._releaseJoinDataPendingAfterCancel(), await this
                  .updateServerDistancesAndBadges(), this.paginationManager ? await this.paginationManager
                  .handleServerListRefresh() : this.containerUpdateStats && this.containerUpdateStats())
            }
            skipCacheLoading() {
              this.cacheLoadingController && this.cacheLoadingController.abort()
            }
            showNetworkActivity() {
              const t = document.querySelector("#progress-bar");
              t && (t.style.transition = "width 0.3s ease-out", t.style.width = "100%", t.classList.add(
                "tw-animate-pulse"))
            }
            hideNetworkActivity() {
              const t = document.querySelector("#progress-bar");
              t && (t.style.transition = "width 0.2s ease-in", t.style.width = "0%", t.classList.remove(
                "tw-animate-pulse"))
            }
            async getServerDatacenter(t, e) {
              if (t.maxPlayers === t.playing) return;
              let n;
              this._beginJoinDataActivity();
              try {
                n = await chrome.runtime.sendMessage({
                  type: "GET_GAMEJOIN_DATA",
                  data: {
                    placeId: e,
                    serverId: t.id,
                    taskId: this.joinGameTaskId
                  }
                })
              } finally {
                this._endJoinDataActivity()
              }
              return n?.abortedStaleTask ? void 0 : this.mergeGameJoinScanIntoServer(t, n)
            }
            async fetchCachedServers() {
              try {
                this.cacheLoadingController = new AbortController, this.updateStatus({
                  isLoadingCache: !0,
                  error: "Fetching servers from BetterBLOX - This may take a while"
                });
                const t = await fetch(`https://api.betterroblox.com/servers/place/${this.gameId}`, {
                  signal: this.cacheLoadingController.signal
                });
                if (!t.ok) return void this.updateStatus({
                  isLoadingCache: !1,
                  error: null
                });
                const e = await t.json();
                this.cachedServers.clear(), e.servers && e.servers.forEach(t => {
                  this.cachedServers.set(t.id, t)
                }), this.updateStatus({
                  isLoadingCache: !1,
                  error: null
                })
              } catch (t) {
                this.updateStatus({
                  isLoadingCache: !1,
                  error: null
                })
              } finally {
                this.cacheLoadingController = null
              }
            }
            async sendPageServersToBulkUpdate(t) {
              if (0 === t.length) return new Map;
              try {
                const e = await fetch(
                  `https://api.betterroblox.com/servers/batchCheckAndInsert?placeId=${this.gameId}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      servers: t
                    })
                  });
                if (!e.ok) return new Map;
                const n = await e.json();
                return n.serverFirstSeenData ? new Map(Object.entries(n.serverFirstSeenData)) : new Map
              } catch (t) {
                return new Map
              }
            }
            async getServerAvatars(t = []) {
              let e = [];
              for (const n of t) {
                const t = {
                  format: "webp",
                  requestId: `0:${n}:AvatarHeadshot:150x150:webp:regular`,
                  size: "150x150",
                  targetId: 0,
                  token: n,
                  type: "AvatarHeadshot"
                };
                e.push(t)
              }
              const n = await fetch("https://thumbnails.roblox.com/v1/batch", {
                method: "POST",
                headers: {
                  accept: "application/json, text/plain, */*",
                  "content-type": "application/json",
                  "cache-control": "no-cache",
                  pragma: "no-cache"
                },
                credentials: "include",
                body: JSON.stringify(e)
              });
              if (!n.ok) return null;
              const a = await n.json(),
                r = {};
              for (const t of a.data) r[t.requestId.split(":")[1]] = t.imageUrl;
              return r
            }
            async batchLoadServerAvatars(t) {
              const e = new Map,
                n = new Set,
                a = new Map;
              if (t.forEach(t => {
                  if (t.playerTokens && t.playerTokens.length > 0) {
                    const e = [...t.playerTokens];
                    a.set(t.id, e), e.forEach(t => n.add(t))
                  }
                }), 0 === n.size) return e;
              const r = Array.from(n),
                s = [];
              for (let t = 0; t < r.length; t += 100) s.push(r.slice(t, t + 100));
              for (const t of s) try {
                const n = await this.getServerAvatars(t);
                n && a.forEach((t, a) => {
                  const r = {};
                  t.forEach(t => {
                    n[t] && (r[t] = n[t])
                  }), Object.keys(r).length > 0 && e.set(a, r)
                })
              } catch (t) {}
              return e
            }
            async batchAnalyzeBotProbability(t) {
              const e = new Map,
                n = Array.from(t.entries()).map(async ([t, n]) => {
                  if (n && Object.keys(n).length > 0) try {
                    const a = await this.analyzeBotProbabilityForServer(t, Object.values(n));
                    a && e.set(t, a)
                  } catch (t) {}
                });
              return await Promise.all(n), e
            }
            async batchProcessAllServers() {
              if (0 !== this.serverList.length) try {
                this.updateStatus({
                  error: "Processing all servers for avatars and bot analysis..."
                }), this.serverAvatars.clear(), this.serverBotAnalysis.clear();
                const t = await this.batchLoadServerAvatars(this.serverList);
                t.forEach((t, e) => {
                  this.serverAvatars.set(e, t)
                });
                const e = await this.batchAnalyzeBotProbability(t);
                e.forEach((t, e) => {
                  this.serverBotAnalysis.set(e, t)
                }), this.serverList.forEach(t => {
                  const n = e.get(t.id);
                  t.botPercentage = n ? n.botPercentage : null
                }), this.updateStatus({
                  error: null
                }), await this.paginationManager.handleServerListRefresh()
              } catch (t) {
                this.updateStatus({
                  error: null
                })
              }
            }
            async analyzeBotProbabilityForServer(t, e) {
              if (!e || 0 === e.length) return null;
              if (this.serverBotAnalysis.has(t)) return this.serverBotAnalysis.get(t);
              try {
                const n = await async function(t) {
                  if (!t || !Array.isArray(t) || t.length < 2) return {
                    botPercentage: 0,
                    confidence: "low",
                    similarPairs: 0,
                    totalThumbnails: t?.length || 0,
                    analyzed: !1,
                    reason: "Insufficient thumbnails for analysis"
                  };
                  try {
                    const e = t.map(t => async function(t) {
                        return new Promise(e => {
                          try {
                            const n = new Image;
                            n.crossOrigin = "anonymous", n.onload = () => {
                              try {
                                const t = document.createElement("canvas");
                                t.width = 8, t.height = 8;
                                const a = t.getContext("2d");
                                a.drawImage(n, 0, 0, 8, 8);
                                const r = a.getImageData(0, 0, 8, 8).data;
                                let s = 0;
                                const i = r.length / 4;
                                for (let t = 0; t < r.length; t += 4) s += (r[t] + r[t + 1] + r[t +
                                  2]) / 3;
                                const o = s / i;
                                let l = "";
                                for (let t = 0; t < r.length; t += 4) l += (r[t] + r[t + 1] + r[t +
                                  2]) / 3 > o ? "1" : "0";
                                e(l)
                              } catch (t) {
                                console.warn("Canvas processing failed:", t), e(null)
                              }
                            }, n.onerror = () => {
                              console.warn("Image load failed:", t), e(null)
                            };
                            const a = t.includes("?") ? "&" : "?";
                            n.src = `${t}${a}_t=${Date.now()}`
                          } catch (t) {
                            console.warn("Image hash calculation failed:", t), e(null)
                          }
                        })
                      }(t)),
                      n = (await Promise.all(e)).filter(t => null !== t);
                    if (n.length < 2) return {
                      botPercentage: 0,
                      confidence: "low",
                      similarPairs: 0,
                      totalThumbnails: t.length,
                      analyzed: !1,
                      reason: "Failed to process enough thumbnails"
                    };
                    const a = new Set;
                    let r = 0;
                    for (let t = 0; t < n.length; t++)
                      for (let e = t + 1; e < n.length; e++) p(n[t], n[e]) <= 7 && (r++, a.add(n[t]), a.add(n[
                        e]));
                    const s = a.size,
                      i = Math.round(s / n.length * 100);
                    let o = "low";
                    return n.length >= 4 && r > 0 && (o = "medium"), n.length >= 5 && r >= 2 && (o =
                    "high"), {
                      botPercentage: i,
                      confidence: o,
                      similarPairs: r,
                      totalThumbnails: t.length,
                      validThumbnails: n.length,
                      botCount: s,
                      analyzed: !0,
                      reason: r > 0 ? `Found ${r} similar pair(s)` : "No similar avatars detected"
                    }
                  } catch (e) {
                    return console.error("Bot analysis failed:", e), {
                      botPercentage: 0,
                      confidence: "low",
                      similarPairs: 0,
                      totalThumbnails: t.length,
                      analyzed: !1,
                      reason: "Analysis failed due to error"
                    }
                  }
                }(e);
                return this.serverBotAnalysis.set(t, n), n
              } catch (t) {
                return null
              }
            }
            async searchServers(t, e = 100, n = "Asc", a = "") {
              const r = await fetch(
                `https://games.roblox.com/v1/games/${t}/servers/Public?limit=${e}&sortOrder=${n}&excludeFullGames=true&cursor=${a}`, {
                  method: "GET",
                  credentials: "include"
                });
              if (!r.ok) return 429 === r.status ? {
                ok: !1,
                status: 429,
                headers: r.headers
              } : (await new Promise(t => setTimeout(t, 5e3)), await this.searchServers(t, e, n, a));
              const s = await r.json();
              return {
                ok: !0,
                status: r.status,
                headers: r.headers,
                data: s
              }
            }
            async getDatacenters() {
              return await chrome.runtime.sendMessage({
                type: "GET_DATACENTERS"
              })
            }
            async getClientLocation() {
              return await chrome.runtime.sendMessage({
                type: "GET_CLIENT_LOCATION"
              })
            }
            calculateDistance(t, e, n, a) {
              const r = this.toRadians(n - t),
                s = this.toRadians(a - e),
                i = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(this.toRadians(t)) * Math.cos(this.toRadians(
                n)) * Math.sin(s / 2) * Math.sin(s / 2);
              return 2 * Math.atan2(Math.sqrt(i), Math.sqrt(1 - i)) * 6371
            }
            toRadians(t) {
              return t * (Math.PI / 180)
            }
            getLatestPlaceVersion() {
              const t = this.serverList.map(t => t.placeVersion).filter(t => null != t).map(t => parseInt(t));
              return t.length > 0 ? Math.max(...t) : null
            }
            async updateServerDistancesAndBadges() {
              const t = await this.getClientLocation();
              if (!t) return;
              const e = this.getLatestPlaceVersion(),
                n = this.serverList.map(n => {
                  let a = null;
                  if (n.datacenter?.location?.latLong) {
                    const [e, r] = n.datacenter.location.latLong;
                    a = this.calculateDistance(t.latitude, t.longitude, e, r)
                  }
                  const r = null !== e && null !== n.placeVersion && parseInt(n.placeVersion) < e;
                  return {
                    ...n,
                    distance: a,
                    isOutdated: r
                  }
                }),
                a = n.filter(t => null !== t.distance),
                r = [...a].sort((t, e) => t.distance - e.distance),
                s = Math.ceil(.2 * a.length),
                i = new Set(r.slice(0, s).map(t => t.id));
              this.serverList = n.map(t => ({
                ...t,
                isClosest: null !== t.distance && i.has(t.id)
              }))
            }
            async calculateServerDistances() {
              const t = await this.getClientLocation();
              if (!t) return this.serverList;
              const e = this.serverList.map(e => {
                  let n = null;
                  if (e.datacenter?.location?.latLong) {
                    const [a, r] = e.datacenter.location.latLong;
                    n = this.calculateDistance(t.latitude, t.longitude, a, r)
                  }
                  return {
                    ...e,
                    distance: n
                  }
                }).sort((t, e) => {
                  if (null !== t.distance && null !== e.distance) return t.distance - e.distance;
                  if (null !== t.distance && null === e.distance) return -1;
                  if (null === t.distance && null !== e.distance) return 1;
                  const n = t.ping || 1 / 0,
                    a = e.ping || 1 / 0;
                  return n !== a ? n - a : e.playing - t.playing
                }),
                n = e.filter(t => null !== t.distance),
                a = Math.ceil(.2 * n.length);
              return e.map((t, e) => {
                const n = null !== t.distance && e < a;
                return {
                  ...t,
                  isClosest: n
                }
              })
            }
            getGameId() {
              const t = window.location.href.match(/games\/(\d+)/);
              return t ? t[1] : null
            }
            getValidServerCount() {
              return this.serverList.length
            }
            hasOldVersionServers() {
              const t = this.getLatestPlaceVersion();
              return null !== t && this.serverList.some(e => void 0 !== e.isOutdated ? !0 === e.isOutdated :
                null !== e.placeVersion && parseInt(e.placeVersion) < t)
            }
            loadCrawlLimit() {
              try {
                const t = localStorage.getItem("betterblox_crawl_limit");
                if (t) {
                  const e = parseInt(t);
                  if (!isNaN(e) && e > 0 && e <= 1e4) return e
                }
              } catch (t) {
                console.warn("Failed to load crawl limit from localStorage:", t)
              }
              return 1e3
            }
            saveCrawlLimit(t) {
              try {
                localStorage.setItem("betterblox_crawl_limit", t.toString())
              } catch (t) {
                console.warn("Failed to save crawl limit to localStorage:", t)
              }
            }
            updateStatus(t) {
              Object.assign(this.status, t), this.updateStatusCard()
            }
            updateStatusCard() {
              const t = document.querySelector("#betterblox-status-card");
              if (!t) return;
              const e = t.querySelector("#status-dot"),
                n = t.querySelector("#status-text"),
                a = t.querySelector("#stop-crawler-btn"),
                r = t.querySelector("#skip-cache-btn");
              this.status.isLoadingCache ? (e.className =
                  "tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-500 tw-animate-pulse", n.textContent = this.status
                  .error || "Loading cached servers...", a && a.classList.add("tw-hidden"), r && r.classList
                  .remove("tw-hidden")) : this.status.isCrawling ? (e.className =
                  "tw-w-2 tw-h-2 tw-rounded-full tw-bg-yellow-500 tw-animate-pulse", this.status.error ? n
                  .textContent = this.status.error : n.textContent = "Crawling...", a && a.classList.remove(
                    "tw-hidden"), r && r.classList.add("tw-hidden")) : (e.className =
                  "tw-w-2 tw-h-2 tw-rounded-full tw-bg-green-500", n.textContent = "Ready", a && a.classList.add(
                    "tw-hidden"), r && r.classList.add("tw-hidden")), t.querySelector("#servers-loaded-count")
                .textContent = this.getValidServerCount(), t.querySelector("#total-servers-count").textContent =
                this.status.totalServers, t.querySelector("#datacenters-count").textContent = this.status
                .datacentersCount, t.querySelector("#crawl-limit-count").textContent = this.status.crawlLimit;
              const s = t.querySelector("#page-info"),
                i = t.querySelector("#current-page");
              this.status.currentPage > 0 ? (i.textContent = this.status.currentPage, s.classList.remove(
                "tw-hidden")) : s.classList.add("tw-hidden");
              const o = t.querySelector("#progress-bar");
              this.status.isCrawling ? o.style.width = `${this.status.processingProgress}%` : o.style.width = "0%"
            }
            async cleanup() {
              await this.stopCrawler(!1), this._bulkDebounceTimer && (clearTimeout(this._bulkDebounceTimer), this
                  ._bulkDebounceTimer = null), this._enrichmentRefreshTimer && (clearTimeout(this
                  ._enrichmentRefreshTimer), this._enrichmentRefreshTimer = null), this.skipCacheLoading(), this
                .containerElement && this.containerElement.cleanup && this.containerElement.cleanup(), this
                .serverList = [], this.cachedServers.clear(), this.serverBotAnalysis.clear(), this.serverAvatars
                .clear()
            }
          },
          f = t => b.addServerContainer(t),
          y = {
            pages: ["game"],
            selectors: [{
              selector: "#running-game-instances-container #rbx-private-servers",
              handler: async (t, e) => {
                await a.n.getSettings("better-servers-list", !0) && (console.log(
                  "Adding server container 16 - testing cache"), f(t))
              }
            }, {
              selector: "#roseal-running-game-instances-container #rbx-private-servers",
              handler: async (t, e) => {
                await a.n.getSettings("better-servers-list", !0) && (console.log(
                  "Adding server container 16 - testing cache"), f(t))
              }
            }],
            settings: {
              servers: [{
                type: "toggle",
                id: "better-servers-list",
                title: "Better Servers List",
                description: "Show server region selector",
                defaultValue: !0,
                isBeta: !1
              }]
            }
          };

        function v() {
          const t = document.createElement("link");
          t.rel = "stylesheet", t.href = chrome.runtime.getURL("styles/tailwind.css"), document.head.appendChild(t);
          const e = document.createElement("div");
          e.id = "welcome-modal", e.setAttribute("tabindex", "-1"), e.setAttribute("aria-hidden", "false"), e
            .className =
            "tw-overflow-y-auto tw-overflow-x-hidden tw-fixed tw-top-0 tw-right-0 tw-left-0 tw-z-50 tw-flex tw-justify-center tw-items-center tw-w-full md:tw-inset-0 tw-h-full tw-max-h-full tw-bg-gray-900/50",
            e.innerHTML =
            `\n    <div class="tw-relative tw-p-4 tw-w-full tw-max-w-md tw-max-h-full">\n      <div class="tw-relative tw-bg-white tw-rounded-lg tw-shadow dark:tw-bg-gray-700">\n        \x3c!-- Modal header --\x3e\n        <div class="tw-flex tw-items-center tw-justify-between tw-p-4 md:tw-p-5 tw-rounded-t dark:tw-border-gray-600 tw-bg-gray-50 dark:tw-bg-gray-700" style="border-bottom: solid">\n          <h3 class="tw-w-full tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-flex tw-items-center tw-justify-center tw-gap-2">\n            <img src="${s("logo32")}" alt="BetterBLOX Logo" class="tw-w-6 tw-h-6" />\n            Welcome to BetterBLOX!\n          </h3>\n        </div>\n        \x3c!-- Modal body --\x3e\n        <div class="tw-p-4 md:tw-p-5 tw-space-y-4">\n          \x3c!-- Important Notice Section --\x3e\n          <div class="tw-p-4 tw-text-sm tw-text-yellow-800 tw-rounded-lg tw-bg-yellow-50 dark:tw-bg-yellow-900/30 dark:tw-text-yellow-300 tw-border-l-4 tw-border-yellow-400" role="alert">\n            <p class="tw-font-semibold tw-mb-2">Important Notice:</p>\n            <ul class="tw-list-disc tw-ml-4 tw-space-y-1">\n              <li>Please allow up to 5 minutes after installation for the extension to properly initialize and update its settings.</li>\n              <li>Friends' last online presence data may take up to 24 hours to fully synchronize.</li>\n              <li>If you experience any issues during this period, please reach out to our support team on Discord.</li>\n            </ul>\n          </div>\n\n          \x3c!-- Main Info Section --\x3e\n          <div class="tw-p-4 tw-text-sm tw-text-blue-800 tw-rounded-lg tw-bg-blue-50 dark:tw-bg-blue-900/30 dark:tw-text-blue-300 tw-border-l-4 tw-border-blue-400">\n            <p class="tw-mb-3">We're committed to enhancing your Roblox experience with powerful features and continuous improvements.</p>\n            <p class="tw-mb-2">Join our Discord community to:</p>\n            <ul class="tw-list-disc tw-ml-4 tw-mb-3">\n              <li>Get immediate support and troubleshooting help</li>\n              <li>Report bugs and technical issues</li>\n              <li>Suggest new features and improvements</li>\n              <li>Access early feature releases and beta testing</li>\n              <li>Connect with other BetterBLOX users</li>\n            </ul>\n          </div>\n\n          \x3c!-- Discord Button --\x3e\n          <a href="https://discord.gg/VY6tDwctW5" target="_blank" class="tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-[#5865F2] hover:tw-bg-[#4752C4] tw-text-white tw-px-4 tw-py-2.5 tw-rounded-lg tw-transition-colors tw-duration-200">\n            <svg class="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 24 24">\n              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>\n            </svg>\n            Join our Discord\n          </a>\n\n          \x3c!-- Close Button --\x3e\n          <button id="closeWelcomePopup" class="tw-w-full tw-border-none tw-text-white tw-inline-flex tw-justify-center tw-items-center tw-bg-blue-700 hover:tw-bg-blue-800 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 dark:focus:tw-ring-blue-800 tw-transition-colors tw-duration-200">\n            Got it!\n          </button>\n\n          \x3c!-- Footer --\x3e\n          <div class="tw-text-xs tw-text-center tw-text-gray-500 dark:tw-text-gray-400">\n            Created with ❤️ by <a href="https://github.com/AlloryDante" target="_blank" class="tw-text-blue-500 hover:tw-text-blue-600">Allory Dante</a>\n          </div>\n        </div>\n      </div>\n    </div>\n  `,
            document.body.appendChild(e), document.getElementById("closeWelcomePopup").onclick = () => {
              e.remove()
            }
        }
        const x = {
          async initialize() {
            try {
              (await chrome.storage.local.get("installedBefore")).installedBefore || ("loading" === document
                .readyState ? document.addEventListener("DOMContentLoaded", v) : v(), await chrome.storage
                .local.set({
                  installedBefore: !0
                }))
            } catch (t) {
              console.error("Error checking installation status:", t)
            }
          }
        };
        async function k(t) {
          const e = document.createElement("link");
          e.rel = "stylesheet", e.href = chrome.runtime.getURL("styles/tailwind.css"), document.head.appendChild(
            e);
          try {
            const e = await fetch(chrome.runtime.getURL("changelog.json")),
              n = await e.json(),
              a = document.createElement("div");
            a.id = "timeline-modal", a.setAttribute("tabindex", "-1"), a.setAttribute("aria-hidden", "false"), a
              .className =
              "tw-overflow-y-auto tw-overflow-x-hidden tw-fixed tw-top-0 tw-right-0 tw-left-0 tw-z-50 tw-flex tw-justify-center tw-items-center tw-w-full md:tw-inset-0 tw-h-full tw-max-h-full tw-bg-gray-900/50",
              a.innerHTML =
              `\n      <div class="tw-relative tw-p-4 tw-w-full tw-max-w-md tw-max-h-full">\n        <div class="tw-relative tw-bg-white tw-rounded-lg tw-shadow dark:tw-bg-gray-700">\n          \x3c!-- Modal header --\x3e\n          <div class="tw-flex tw-items-center tw-justify-between tw-p-4 md:tw-p-5 tw-rounded-t dark:tw-border-gray-600 tw-bg-gray-50 dark:tw-bg-gray-700" style="border-bottom: solid">\n            <h3 class="tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-flex tw-items-center tw-gap-2">\n              <img src="${s("logo32")}" alt="BetterBLOX Logo" class="tw-w-5 tw-h-5" />\n              BetterBLOX Updated!\n            </h3>\n            <button type="button" id="closeChangelogPopup" class="tw-border-none tw-text-gray-400 tw-bg-transparent hover:tw-bg-gray-200 hover:tw-text-gray-900 tw-rounded-lg tw-text-sm tw-w-8 tw-h-8 tw-ms-auto tw-inline-flex tw-justify-center tw-items-center dark:hover:tw-bg-gray-600 dark:hover:tw-text-white tw-transition-colors tw-duration-200">\n              <svg class="tw-w-3 tw-h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">\n                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />\n              </svg>\n              <span class="tw-sr-only">Close modal</span>\n            </button>\n          </div>\n          \x3c!-- Modal body --\x3e\n          <div class="tw-p-4 md:tw-p-5">\n            <div class="tw-max-h-[60vh] tw-overflow-y-auto tw-mb-4 [&::-webkit-scrollbar]:tw-w-2 [&::-webkit-scrollbar-track]:tw-bg-transparent [&::-webkit-scrollbar-thumb]:tw-bg-gray-300 [&::-webkit-scrollbar-thumb]:tw-rounded-full dark:[&::-webkit-scrollbar-thumb]:tw-bg-gray-500">\n              <ol class="tw-relative tw-border-gray-200 dark:tw-border-gray-600 tw-ms-3.5 tw-space-y-10" style="border-left: solid">\n                ${Object.entries(n).sort(([t],[e])=>{const n=t.split(".").map(Number),a=e.split(".").map(Number);for(let t=0;t<3;t++)if(n[t]!==a[t])return a[t]-n[t];return 0}).map(([e,n])=>`\
            n < li class = "tw-ms-8" > \n < span class =
              "tw-absolute tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-bg-blue-100 tw-rounded-full tw--start-4 tw-ring-4 tw-ring-white dark:tw-ring-gray-700 dark:tw-bg-blue-900" >
              \n < svg class = "tw-w-3.5 tw-h-3.5 tw-text-blue-800 dark:tw-text-blue-300"
            aria - hidden = "true"
            xmlns = "http://www.w3.org/2000/svg"
            fill = "currentColor"
            viewBox = "0 0 20 20" > \n < path d =
              "M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" /
              > \n < /svg>\n                      </span > \n < h3 class =
              "tw-flex tw-items-start tw-mb-1 tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-white" > \
              n BetterBLOX v$ {
                e
              }
            $ {
              e === t ?
                '<span class="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-0.5 tw-rounded dark:tw-bg-blue-900 dark:tw-text-blue-300 tw-ms-3">Latest</span>' :
                ""
            }\
            n <
              /h3>\n                      <time class="tw-block tw-mb-3 tw-text-sm tw-font-normal tw-leading-none tw-text-gray-600 dark:tw-text-gray-400">Released: ${n.date}</time >
              \n < ul class = "tw-space-y-1 tw-list-disc tw-list-inside tw-text-gray-700 dark:tw-text-gray-300" >
              \n $ {
                n.changes.map(t => {
                  let e = "",
                    n = "";
                  return t.toLowerCase().includes("added") ? (e = "Added:", n =
                      "tw-text-green-600 dark:tw-text-green-400") : t.toLowerCase().includes("improved") || t
                    .toLowerCase().includes("updated") ? (e = "Improved:", n =
                      "tw-text-blue-600 dark:tw-text-blue-400") : t.toLowerCase().includes("fixed") ? (e =
                      "Fixed:", n = "tw-text-red-600 dark:tw-text-red-400") : t.toLowerCase().includes(
                      "removed") && (e = "Removed:", n = "tw-text-red-600 dark:tw-text-red-400"),
                    `\n                            <li>\n                              ${e?`<span class="tw-font-medium ${n}">${e}</span> `:""}\n                              ${t.replace(/^(Added|Improved|Fixed|Removed):?\s*/i,"")}\n                            </li>\n                          `
                }).join("")
              }\
            n < /ul>\n                    </li > \
              n `).join("")}\n              </ol>\n            </div>\n            <div class="tw-mb-4 tw-p-4 tw-text-sm tw-text-blue-800 tw-rounded-lg tw-bg-blue-50 dark:tw-bg-gray-800 dark:tw-text-blue-400" role="alert">\n              <span class="tw-font-medium">Need help or have suggestions?</span> Join our \n              <a href="https://discord.com/invite/VY6tDwctW5" target="_blank" rel="noopener noreferrer" class="tw-font-semibold tw-underline hover:tw-text-blue-600 dark:hover:tw-text-blue-300">BetterBLOX Discord</a> \n              for problems, bugs, feedback, or suggestions!\n            </div>\n            <button id="closeChangelogButton" class="tw-border-none tw-text-white tw-inline-flex tw-w-full tw-justify-center tw-items-center tw-bg-blue-700 hover:tw-bg-blue-800 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 dark:focus:tw-ring-blue-800 tw-transition-colors tw-duration-200 tw-gap-2">\n              Got it!\n            </button>\n          </div>\n        </div>\n      </div>\n    `,
              document.body.appendChild(a), document.getElementById("closeChangelogPopup").onclick = () => a
              .remove(), document.getElementById("closeChangelogButton").onclick = () => a.remove()
          } catch (t) {
            console.error("Error showing changelog:", t)
          }
        }
        const S = {
            async initialize() {
              try {
                const {
                  installedBefore: t,
                  lastSeenVersion: e
                } = await chrome.storage.local.get(["installedBefore", "lastSeenVersion"]);
                if (t) {
                  const t = chrome.runtime.getManifest().version;
                  e && e !== t && ("loading" === document.readyState ? document.addEventListener(
                    "DOMContentLoaded", () => k(t)) : k(t)), await chrome.storage.local.set({
                    lastSeenVersion: t
                  })
                }
              } catch (t) {
                console.error("Error checking version status:", t)
              }
            }
          },
          L = {
            async initialize() {
              try {
                const {
                  installedBefore: t,
                  seenRemotePopups: e = []
                } = await chrome.storage.local.get(["installedBefore", "seenRemotePopups"]);
                t && await this.checkForRemotePopups(e)
              } catch (t) {
                console.error("Error checking remote popups:", t)
              }
            },
            async checkForRemotePopups(t) {
              try {
                const e = await fetch("https://api.betterroblox.com/api/popup/remote");
                if (!e.ok) throw new Error(`API request failed: ${e.status}`);
                const n = await e.json();
                if (!n.success) throw new Error(`API returned error: ${n.error}`);
                const a = chrome.runtime.getManifest().version,
                  r = n.popups.filter(e => {
                    if (e.showOnce && t.includes(e.id)) return !1;
                    const n = (new Date).toISOString().split("T")[0];
                    return !(e.startDate && n < e.startDate || e.endDate && n > e.endDate || e.minVersion &&
                      this.compareVersions(a, e.minVersion) < 0 || e.maxVersion && this.compareVersions(a, e
                        .maxVersion) > 0)
                  });
                if (r.sort((t, e) => t.priority - e.priority), r.length > 0) {
                  const e = r[0];
                  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => this
                    .showRemotePopup(e, t)) : this.showRemotePopup(e, t)
                }
              } catch (t) {
                console.error("Error fetching remote popups:", t)
              }
            },
            compareVersions(t, e) {
              const n = t.split(".").map(Number),
                a = e.split(".").map(Number);
              for (let t = 0; t < Math.max(n.length, a.length); t++) {
                const e = n[t] || 0,
                  r = a[t] || 0;
                if (e < r) return -1;
                if (e > r) return 1
              }
              return 0
            },
            async showRemotePopup(t, e) {
              const n = document.createElement("link");
              n.rel = "stylesheet", n.href = chrome.runtime.getURL("styles/tailwind.css"), document.head
                .appendChild(n);
              try {
                const n = document.createElement("div");
                n.id = "remote-popup-modal", n.setAttribute("tabindex", "-1"), n.setAttribute("aria-hidden",
                    "false"), n.className =
                  "tw-overflow-y-auto tw-overflow-x-hidden tw-fixed tw-top-0 tw-right-0 tw-left-0 tw-z-50 tw-flex tw-justify-center tw-items-center tw-w-full md:tw-inset-0 tw-h-full tw-max-h-full tw-bg-gray-900/50",
                  n.innerHTML =
                  `\n        <div class="tw-relative tw-p-4 tw-w-full tw-max-w-4xl tw-max-h-full">\n          <div class="tw-relative tw-bg-white tw-rounded-lg tw-shadow dark:tw-bg-gray-700">\n            \x3c!-- Modal header --\x3e\n            <div class="tw-flex tw-items-center tw-justify-between tw-p-4 md:tw-p-5 tw-rounded-t dark:tw-border-gray-600 tw-bg-gray-50 dark:tw-bg-gray-700" style="border-bottom: solid">\n              <h3 class="tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white tw-flex tw-items-center tw-gap-2">\n                <img src="${s("logo32")}" alt="BetterBLOX Logo" class="tw-w-5 tw-h-5" />\n                ${t.title}\n              </h3>\n              <button type="button" id="closeRemotePopup" class="tw-border-none tw-text-gray-400 tw-bg-transparent hover:tw-bg-gray-200 hover:tw-text-gray-900 tw-rounded-lg tw-text-sm tw-w-8 tw-h-8 tw-ms-auto tw-inline-flex tw-justify-center tw-items-center dark:hover:tw-bg-gray-600 dark:hover:tw-text-white tw-transition-colors tw-duration-200">\n                <svg class="tw-w-3 tw-h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">\n                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />\n                </svg>\n                <span class="tw-sr-only">Close modal</span>\n              </button>\n            </div>\n            \x3c!-- Modal body --\x3e\n            <div class="tw-p-4 md:tw-p-5">\n              <div class="tw-mb-4">\n                <iframe \n                  src="${t.url}" \n                  class="tw-w-full tw-h-[70vh] tw-border-0 tw-rounded-lg"\n                  title="${t.title}"\n                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"\n                  loading="lazy">\n                </iframe>\n              </div>\n               <div class="tw-flex tw-justify-end">\n                 <button id="closeRemoteButton" class="tw-border-none tw-text-white tw-inline-flex tw-justify-center tw-items-center tw-bg-blue-700 hover:tw-bg-blue-800 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 dark:focus:tw-ring-blue-800 tw-transition-colors tw-duration-200">\n                   Close\n                 </button>\n               </div>\n            </div>\n          </div>\n        </div>\n      `,
                  document.body.appendChild(n);
                const a = async () => {
                  const a = [...e, t.id];
                  await chrome.storage.local.set({
                    seenRemotePopups: a
                  }), n.remove()
                };
                document.getElementById("closeRemotePopup").onclick = () => a(), document.getElementById(
                  "closeRemoteButton").onclick = () => a()
              } catch (t) {
                console.error("Error showing remote popup:", t)
              }
            }
          };
        async function C(t, e = 1e4) {
          try {
            return await
            function(t = 1e4) {
              return new Promise((e, n) => {
                if (document.body) return e(document.body);
                const a = new MutationObserver(() => {
                  document.body && (a.disconnect(), e(document.body))
                });
                a.observe(document.documentElement, {
                  childList: !0,
                  subtree: !0
                }), setTimeout(() => {
                  a.disconnect(), n(new Error("Timeout waiting for document.body"))
                }, t)
              })
            }(), new Promise((n, a) => {
              const r = document.getElementsByClassName(t)[0];
              if (r) return n(r);
              const s = new MutationObserver((e, a) => {
                const r = document.getElementsByClassName(t)[0];
                r && (a.disconnect(), n(r))
              });
              s.observe(document.body, {
                childList: !0,
                subtree: !0
              }), setTimeout(() => {
                s.disconnect(), a(new Error(`Timeout waiting for class: ${t}`))
              }, e)
            })
          } catch (e) {
            throw new Error(`Error waiting for class ${t}: ${e.message}`)
          }
        }
        const E = {
          defaultOption: "info",
          pages: [{
            id: "info",
            title: "Info"
          }, {
            id: "appearance",
            title: "Appearance"
          }, {
            id: "friends",
            title: "Friends"
          }, {
            id: "servers",
            title: "Servers"
          }]
        };

        function T({
          id: t,
          title: e,
          description: n,
          isBeta: a = !1,
          defaultValue: r = !1,
          onChange: s = () => {}
        }) {
          const i = document.createElement("div");
          i.className = "notifications-section section-content";
          const o = document.createElement("button");
          o.id = `${t}-toggle`, o.className = "btn-toggle" + (r ? " on" : " off"), o.role = "switch", o
            .setAttribute("aria-checked", r.toString());
          const l = document.createElement("span");
          l.className = "toggle-flip";
          const c = document.createElement("span");
          c.className = "toggle-on", c.id = "toggle-on";
          const d = document.createElement("span");
          d.className = "toggle-off", d.id = "toggle-off", o.appendChild(l), o.appendChild(c), o.appendChild(d);
          const u = document.createElement("label");
          if (u.className = "btn-toggle-label", u.textContent = e, a) {
            const t = document.createElement("div");
            t.style.display = "flex";
            const e = document.createElement("span");
            e.className = "icon-warning", t.appendChild(e);
            const n = document.createElement("span");
            n.style.color = "rgb(255, 170, 0)", n.textContent = "This feature is in beta", t.appendChild(n), i
              .appendChild(t)
          }
          const w = document.createElement("div");
          w.className = "rbx-divider";
          const g = document.createElement("div");
          g.className = "text-description";
          const h = document.createElement("text");
          return h.textContent = n, g.appendChild(h), o.addEventListener("click", () => {
              const t = o.className.includes("off");
              o.className = "btn-toggle " + (t ? "on" : "off"), o.setAttribute("aria-checked", t.toString()), s(t)
            }), o.setAttribute("aria-label", `Toggle ${e}`), i.appendChild(o), i.appendChild(u), i.appendChild(w), i
            .appendChild(g), i
        }

        function I({
          id: t,
          title: e,
          description: n,
          options: a = [],
          defaultValue: r,
          onChange: s = () => {}
        }) {
          const i = document.createElement("div");
          i.className = "notifications-section section-content";
          const o = document.createElement("div");
          o.style.maxWidth = "255px", o.style.float = "right", o.style.marginTop = "-5px";
          const l = document.createElement("select");
          l.id = `${t}-select`, l.className = "input-field select-option rbx-select", a.forEach(({
            value: t,
            label: e
          }) => {
            const n = document.createElement("option");
            n.value = t, n.textContent = e, l.appendChild(n)
          }), r && (l.value = r);
          const c = document.createElement("span");
          c.className = "icon-arrow icon-down-16x16";
          const d = document.createElement("label");
          d.className = "btn-toggle-label", d.textContent = e;
          const u = document.createElement("div");
          u.className = "rbx-divider";
          const w = document.createElement("div");
          return w.className = "text-description", w.textContent = n, l.addEventListener("change", t => {
              s(t.target.value)
            }), o.appendChild(l), o.appendChild(c), i.appendChild(o), i.appendChild(d), i.appendChild(u), i
            .appendChild(w), i
        }

        function M({
          id: t,
          title: e,
          description: n,
          placeholder: a = "",
          defaultValue: r = "",
          maxLength: s = 999,
          width: i = "400px",
          onChange: o = () => {}
        }) {
          const l = document.createElement("div");
          l.className = "notifications-section section-content";
          const c = document.createElement("input");
          c.className = "form-control input-field new-input-field", c.id = `${t}-input`, c.placeholder = a, c
            .value = r, c.maxLength = s, c.autocomplete = "off", c.autocapitalize = "off", c.spellcheck = !1, c
            .style.width = i, c.style.float = "right", c.style.height = "33px";
          const d = document.createElement("label");
          d.className = "btn-toggle-label", d.textContent = e;
          const u = document.createElement("div");
          u.className = "rbx-divider";
          const w = document.createElement("div");
          return w.className = "text-description", w.innerHTML = n, c.addEventListener("input", t => {
            o(t.target.value)
          }), l.appendChild(c), l.appendChild(d), l.appendChild(u), l.appendChild(w), l
        }
        const A = {
          modules: [],
          pages: ["all"],
          selectors: [{
            selector: "#settings-popover-menu",
            handler: (t, e) => {
              ! function(t) {
                const e = document.createElement("li"),
                  n = document.createElement("a");
                n.className = "rbx-menu-item", n.href =
                  "https://www.roblox.com/my/account?betterblox=active", n.style.display = "flex", n.style
                  .alignItems = "center";
                const a = document.createElement("img");
                a.src = s("logo32"), a.style.marginRight = "5px", a.style.width = "16px", a.style.height =
                  "16px", n.appendChild(a), n.appendChild(document.createTextNode("BetterBLOX Settings"));
                const r = document.createElement("span");
                r.className = "notification-blue notification nav-setting-highlight hidden", r.textContent =
                  "0", n.appendChild(r), e.appendChild(n), t.insertBefore(e, t.firstChild)
              }(t)
            }
          }],
          async initialize(t = []) {
            this.modules = t;
            for (const e of t)
              if (e.settings)
                for (const [t, n] of Object.entries(e.settings))
                  for (const t of n) await a.n.getSettings(t.id, t.defaultValue);
            (async function() {
              if (!window.location.pathname.includes("my/account")) return;
              const t = new URLSearchParams(window.location.search);
              let e = 0;
              if (t.forEach(() => e++), e > 0) return;
              const n = await C("menu-vertical"),
                [a] = function(t) {
                  const e = document.createElement("li");
                  e.className = "menu-option ng-scope", e.setAttribute("ng-repeat", "tab in accountsTabs"),
                    e.setAttribute("ng-class", "{'active': currentData.activeTab == tab.name}"), e
                    .setAttribute("aria-label", `Navigate to ${t}`);
                  const n = document.createElement("a");
                  n.className = "menu-option-content", n.setAttribute("ui-sref", "qol-settings"), n.style
                    .display = "flex", n.style.alignItems = "center";
                  const a = document.createElement("img");
                  a.src = s("logo32"), a.style.marginRight = "5px", a.style.width = "13px", a.style.height =
                    "13px";
                  const r = document.createElement("span");
                  return r.className = "font-caption-header ng-binding", r.setAttribute("ng-bind",
                    "tab.label"), r.innerText = t, n.appendChild(a), n.appendChild(r), e.appendChild(n), [
                    e, n, r
                  ]
                }("BetterBLOX Settings");
              a.addEventListener("click", t => {
                t.preventDefault(), window.location.href = "/my/account?betterblox=active"
              }), n.appendChild(a)
            })(), async function() {
              const t = D();
              try {
                t && await $()
              } catch (t) {
                console.error("Error opening Settings:", t)
              }
            }()
          },
          getAllModuleSettings(t) {
            return this.modules.filter(e => e.settings && e.settings[t]).flatMap(e => e.settings[t])
          }
        };

        function D() {
          return "active" === new URLSearchParams(window.location.search).get("betterblox")
        }

        function P(t) {
          for (; t.firstChild;) t.removeChild(t.lastChild)
        }
        async function $() {
          const t = document.createElement("link");
          t.rel = "stylesheet", t.href = chrome.runtime.getURL("styles/tailwind.css"), document.head.appendChild(
            t);
          try {
            const t = await C("menu-vertical");
            await P(t);
            const e = await async function(t) {
              const e = E.pages.map(({
                id: t,
                title: e
              }) => function(t, e) {
                const n = document.createElement("li");
                n.id = `betterblox-${t}`, n.role = "tab", n.className = "menu-option", n.setAttribute(
                  "aria-label", `${e} settings section`);
                const a = document.createElement("a");
                a.className = "menu-option-content", a.href = `/my/account?betterblox=active&option=${t}`,
                  a.setAttribute("aria-current", "false");
                const r = document.createElement("span");
                r.className = "font-caption-header", r.textContent = e;
                const s = document.createElement("span");
                return s.className = "rbx-tab-subtitle", a.appendChild(r), a.appendChild(s), n
                  .appendChild(a), [n, a]
              }(t, e));
              P(t), e.forEach(([e]) => {
                t.appendChild(e)
              });
              const n = function(t) {
                  async function e(t, e) {
                    console.log(t, e);
                    const n = await async function() {
                      return await C("tab-content rbx-tab-content")
                    }();
                    P(n);
                    const r = function(t, e) {
                        const n = document.createElement("div");
                        n.className = "rbx-tab-content", n.id = `betterblox-content-${t}`;
                        const a = document.createElement("h1");
                        return a.className = "header-title", a.textContent = e, n.appendChild(a), n
                      }(t, e),
                      s = (i = t, A.getAllModuleSettings(i));
                    var i;
                    if ("info" === t) {
                      const t = await async function() {
                        const t = document.createElement("div");
                        t.className = "notifications-section section-content";
                        const e = (await chrome.runtime.getManifest()).version,
                          n = document.createElement("div");
                        n.className = "tw-flex tw-items-center tw-gap-2 tw-mb-3 tw-ml-2";
                        const a = document.createElement("img");
                        a.src = chrome.runtime.getURL("icons/png/logo32.png"), a.style.width = "32px", a
                          .style.height = "32px", a.alt = "BetterBLOX Logo", n.appendChild(a);
                        const r = document.createElement("span");
                        r.className = "tw-text-lg tw-font-semibold dark:tw-text-gray-200", r
                          .textContent = "Better Roblox Extension", n.appendChild(r);
                        const s = document.createElement("div");
                        s.className =
                          "tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mb-2 tw-ml-2",
                          s.innerHTML =
                          `\n    <span>Version: ${e}</span>\n    <span>•</span>\n    <span>Beta Release</span>\n  `;
                        const i = document.createElement("div");
                        i.className =
                          "tw-bg-yellow-50 dark:tw-bg-yellow-900/30 tw-border-l-4 tw-border-yellow-400 tw-p-4 tw-mb-4";
                        const o = document.createElement("div");
                        o.className = "tw-text-sm tw-text-gray-700 dark:tw-text-gray-300", o.innerHTML =
                          '\n    <p class="tw-font-semibold tw-mb-2">Important Notice:</p>\n    <ul class="tw-list-disc tw-ml-5">\n      <li>Please allow up to 5 minutes after installation for the extension to properly initialize and update its settings.</li>\n      <li>Friends\' last online presence data may take up to 24 hours to fully synchronize.</li>\n      <li>If you experience any issues during this period, please reach out to our support team on Discord.</li>\n    </ul>\n  ',
                          i.appendChild(o);
                        const l = document.createElement("div");
                        l.className =
                          "tw-bg-blue-50 dark:tw-bg-blue-900/30 tw-border-l-4 tw-border-blue-400 tw-p-4 tw-mb-4";
                        const c = document.createElement("div");
                        c.className = "tw-text-sm tw-text-gray-700 dark:tw-text-gray-300", c.innerHTML =
                          '\n    <p class="tw-mb-3">Welcome to BetterBLOX! We\'re committed to enhancing your Roblox experience with powerful features and continuous improvements.</p>\n    <p class="tw-mb-2">Join our Discord community to:</p>\n    <ul class="tw-list-disc tw-ml-5 tw-mb-3">\n      <li>Get immediate support and troubleshooting help</li>\n      <li>Report bugs and technical issues</li>\n      <li>Suggest new features and improvements</li>\n      <li>Access early feature releases and beta testing</li>\n      <li>Connect with other BetterBLOX users</li>\n    </ul>\n    <p class="tw-mb-3">If you\'re enjoying BetterBLOX, please consider <a href="https://chromewebstore.google.com/detail/better-roblox-extension/lplhnhhlblehjmmkcpjbojiaanbpgnpd/reviews" target="_blank" class="tw-text-blue-500 hover:tw-text-blue-600">leaving a 5-star review</a>. Your support helps us grow! 🌟</p>\n    <p class="tw-mb-3">Visit our <a href="https://betterroblox.com" target="_blank" class="tw-text-blue-500 hover:tw-text-blue-600">official website</a> for documentation and the latest updates!</p>\n    <p class="tw-text-xs tw-text-gray-500">Created with ❤️ by <a href="https://github.com/AlloryDante" target="_blank" class="tw-text-blue-500 hover:tw-text-blue-600">Allory Dante</a></p>\n    <p class="tw-text-xs tw-text-gray-500">Your feedback helps shape the future of BetterBLOX!</p>\n  ';
                        const d = document.createElement("a");
                        return d.href = "https://discord.gg/VY6tDwctW5", d.className =
                          "tw-inline-flex tw-items-center tw-gap-2 tw-bg-[#5865F2] tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-[#4752C4] tw-transition-colors tw-mt-3",
                          d.style.display = "flex", d.style.justifyContent = "center", d.style.margin =
                          "12px auto", d.innerHTML =
                          '\n    <svg class="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 24 24">\n      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>\n    </svg>\n    Join our Discord\n  ',
                          t.appendChild(n), t.appendChild(s), t.appendChild(i), t.appendChild(l), l
                          .appendChild(c), t.appendChild(d), t
                      }();
                      return r.appendChild(t), void n.appendChild(r)
                    }
                    for (const t of s) {
                      let e;
                      const n = await a.n.getSettings(t.id, t.defaultValue),
                        s = e => async e => {
                          await a.n.setSettings(t.id, e);
                          const n = new CustomEvent("betterblox-setting-changed", {
                            detail: {
                              id: t.id,
                              value: e
                            }
                          });
                          document.dispatchEvent(n)
                        };
                      switch (t.type) {
                        case "toggle":
                          e = T({
                            id: t.id,
                            title: t.title,
                            description: t.description,
                            isBeta: t.isBeta || !1,
                            defaultValue: n,
                            onChange: s("toggle")
                          });
                          break;
                        case "dropdown":
                          e = I({
                            id: t.id,
                            title: t.title,
                            description: t.description,
                            options: t.options,
                            defaultValue: n,
                            onChange: s("dropdown")
                          });
                          break;
                        case "input":
                          e = M({
                            id: t.id,
                            title: t.title,
                            description: t.description,
                            placeholder: t.placeholder,
                            defaultValue: n,
                            maxLength: t.maxLength,
                            width: t.width,
                            onChange: s("input")
                          })
                      }
                      e && r.appendChild(e)
                    }
                    n.appendChild(r)
                  }
                  async function n(n) {
                    if (!n) return;
                    const [a, r] = n;
                    t.forEach(([t, e]) => {
                      e.className = "menu-option-content", e.setAttribute("aria-current", "false")
                    }), r.className = "menu-option-content active", r.setAttribute("aria-current", "page");
                    const s = a.id.replace("betterblox-", ""),
                      i = r.querySelector(".font-caption-header").textContent;
                    await e(s, i)
                  }
                  return t.forEach(([t, e]) => {
                    e.addEventListener("click", async a => {
                      a.preventDefault();
                      const r = window.location.href.split("#")[0],
                        s = e.href.split("#")[0];
                      await n([t, e]), r !== s && window.history.pushState({
                        id: t.id
                      }, "", s)
                    })
                  }), async () => {
                    const e = (new URLSearchParams(window.location.search).get("option") || E
                        .defaultOption).split("#")[0],
                      a = t.find(([t]) => t.id === `betterblox-${e}`);
                    await n(a)
                  }
                }(e),
                r = new URLSearchParams(window.location.search),
                s = r.get("option")?.split("#")[0];
              if (s) {
                const t = e.find(([t]) => t.id === `betterblox-${s}`);
                t && t[1].click()
              } else await n();
              const i = new MutationObserver(e => {
                e.forEach(e => {
                  e.addedNodes.forEach(e => {
                    e.nodeType === Node.ELEMENT_NODE && t.contains(e) && !e.id?.startsWith(
                      "betterblox-") && t.removeChild(e)
                  })
                })
              });
              return i.observe(t, {
                childList: !0
              }), i
            }(t);
            window.addEventListener("beforeunload", () => {
              e.disconnect()
            })
          } catch (t) {
            console.error("Error opening settings:", t)
          }
        }
        window.addEventListener("popstate", async () => {
          D() && await $()
        });
        const R = A;

        function _(t) {
          if (!t || t < 0) return "0m";
          const e = Math.floor(t / 6e4),
            n = Math.floor(e / 60);
          if (n > 0) {
            const t = e % 60;
            return `${n}h${t>0?` ${t}m`:""}`
          }
          return `${e}m`
        }

        function N(t, e) {
          2 === e.presenceType ? function(t, e) {
            const n = t.querySelectorAll(".presence-status");
            for (const t of n) t.remove();
            const a = Date.now() - (e.gameHistory?.gameStartTime || Date.now());
            if (a > 0) {
              const e = document.createElement("div");
              e.className = "presence-status avatar-card-label", e.innerHTML =
                `<div style="color: #666;font-size: 10px">(for ${_(a)})</div>`, t.querySelector(
                  ".avatar-card-caption").appendChild(e)
            }
          }(t, e) : 0 === e.presenceType && async function(t, e) {
            const n = t.querySelectorAll(".presence-status");
            for (const t of n) t.remove();
            let r = e.lastOnline,
              s = null;
            if ("number" == typeof r ? s = r : r && "object" == typeof r && r.timestamp && (s = r.timestamp),
              s && s > 0) {
              const e = function(t) {
                const e = (new Date).getTime() - t,
                  n = Math.floor(e / 6e4),
                  a = Math.floor(e / 36e5),
                  r = Math.floor(e / 864e5);
                return n < 60 ? `${n} minute${1!==n?"s":""} ago` : a < 24 ? `${a} hour${1!==a?"s":""} ago` :
                  `${r} day${1!==r?"s":""} ago`
              }(s);
              let n = e;
              await a.n.getSettings("more-presence-details", !1) && r && "object" == typeof r && r.gameName && (
                n += ` playing ${r.gameName.length>10?r.gameName.slice(0,10)+"...":r.gameName}`, r
                .sessionDuration > 0 && (n += ` (${_(r.sessionDuration)})`));
              const i = document.createElement("div");
              i.className = "presence-status avatar-card-label", i.innerHTML =
                `\n      <div style="font-size: 12px">${n}</div>\n    `, t.querySelector(".avatar-card-caption")
                .appendChild(i)
            }
          }(t, e)
        }

        function j(t) {
          try {
            return parseInt(t.id)
          } catch (t) {
            return console.error("Presence Friendlist: Error getting user ID from element"), null
          }
        }

        function O(t) {
          if (!t || t < 0) return "0m";
          const e = Math.floor(t / 6e4),
            n = Math.floor(e / 60);
          if (n > 0) {
            const t = e % 60;
            return `${n}h${t>0?` ${t}m`:""}`
          }
          return `${e}m`
        }

        function B(t, e) {
          2 === e.presenceType ? function(t, e) {
            const n = t.parentElement.querySelectorAll(".presence-status");
            for (const t of n) t.remove();
            const a = Date.now() - (e.gameHistory?.gameStartTime || Date.now());
            if (a > 0) {
              const e = document.createElement("div");
              e.className = "presence-status", e.innerHTML =
                `<div style="color: #666;font-size: 10px">(for ${O(a)})</div>`, t.appendChild(e)
            }
          }(t, e) : 0 === e.presenceType && async function(t, e) {
            const n = t.parentElement.querySelectorAll(".presence-status");
            for (const t of n) t.remove();
            let r = e.lastOnline,
              s = null;
            if ("number" == typeof r ? s = r : r && "object" == typeof r && r.timestamp && (s = r.timestamp),
              s && s > 0) {
              const e = function(t) {
                  const e = (new Date).getTime() - t,
                    n = Math.floor(e / 6e4),
                    a = Math.floor(e / 36e5),
                    r = Math.floor(e / 864e5);
                  return n < 60 ? `${n} minute${1!==n?"s":""} ago` : a < 24 ? `${a} hour${1!==a?"s":""} ago` :
                    `${r} day${1!==r?"s":""} ago`
                }(s),
                n = await a.n.getSettings("more-presence-details", !1);
              let i = `Last seen: ${new Date(s).toLocaleString()}`;
              r && "object" == typeof r && r.gameName && (i += `\nPlaying: ${r.gameName}`, r.sessionDuration >
                0 && (i += `\nDuration: ${O(r.sessionDuration)}`));
              let o = e;
              n && r && "object" == typeof r && r.gameName && (o +=
                ` playing ${r.gameName.length>10?r.gameName.slice(0,10)+"...":r.gameName}`, r
                .sessionDuration > 0 && (o += ` (${O(r.sessionDuration)})`));
              const l = document.createElement("div");
              l.className = "presence-status tw-group tw-relative", l.innerHTML =
                `\n      <div style="font-size: 12px" class="tw-cursor-help">${o}\n        <div class="tw-invisible group-hover:tw-visible tw-absolute tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap" style="white-space: pre-line;">\n          ${i}\n        </div>\n      </div>\n    `,
                t.appendChild(l)
            }
          }(t, e)
        }

        function q(t) {
          try {
            return t.href.split("/")[4]
          } catch (t) {
            return console.error("Presence Homepage: Error getting user ID from element"), null
          }
        }
        let H = null;
        const G = {
          profileRoot: ["#user-profile-header-bg", "#treatment-redesigned-header", "#profile-header-container"],
          profilePopup: ["#user-profile-header-bg [id^='radix-'] > div > div", "[id^='radix-'] > div > div"],
          profileHeaderInsert: "#user-profile-header-bg > div",
          profileHeaderInsertFallback: [".user-profile-header", ".profile-header-main"],
          profileLastOnlineContainer: "#user-profile-header-bg > div > div.user-profile-header-info.flex.justify-between.items-center > div.flex.gap-medium.items-center > div.flex.flex-col",
          profileDuplicateButtonsToHide: "#user-profile-header-bg > div > div:nth-child(4)"
        };
        async function F() {
          if (H) return H;
          const t = await async function() {
            try {
              const t = await fetch("https://api.betterroblox.com/betterblox/selectors.json", {
                cache: "no-store"
              });
              if (!t.ok) return null;
              const e = await t.json();
              return e && "object" == typeof e ? {
                profileRoot: Array.isArray(e.profileRoot) ? e.profileRoot : G.profileRoot,
                profilePopup: Array.isArray(e.profilePopup) ? e.profilePopup : G.profilePopup,
                profileHeaderInsert: "string" == typeof e.profileHeaderInsert ? e.profileHeaderInsert : G
                  .profileHeaderInsert,
                profileHeaderInsertFallback: Array.isArray(e.profileHeaderInsertFallback) ? e
                  .profileHeaderInsertFallback : G.profileHeaderInsertFallback,
                profileLastOnlineContainer: "string" == typeof e.profileLastOnlineContainer ? e
                  .profileLastOnlineContainer : G.profileLastOnlineContainer,
                profileDuplicateButtonsToHide: null != e.profileDuplicateButtonsToHide ? Array.isArray(e
                  .profileDuplicateButtonsToHide) ? e.profileDuplicateButtonsToHide : [e
                  .profileDuplicateButtonsToHide
                ] : Array.isArray(G.profileDuplicateButtonsToHide) ? G.profileDuplicateButtonsToHide : [G
                  .profileDuplicateButtonsToHide
                ]
              } : null
            } catch (t) {
              return null
            }
          }();
          H = t || {
            ...G
          }, H.profileLastOnlineContainer || (H.profileLastOnlineContainer = G.profileLastOnlineContainer);
          const e = H.profileDuplicateButtonsToHide;
          return H.profileDuplicateButtonsToHide = Array.isArray(e) ? e : e ? [String(e)] : [], H
        }
        const V = "bblox-stats-presence-branding";

        function U(t = "") {
          return `<div class="${V} tw-flex tw-items-center tw-gap-2 tw-min-w-0 tw-shrink-0 ${t}">\n    <img src="${s("logo32")}" alt="" class="tw-w-6 tw-h-6 tw-shrink-0" />\n    <span class="tw-text-base tw-font-semibold tw-text-[#1c1c1c] dark:tw-text-gray-200">BetterBLOX Time Statistics</span>\n  </div>`
        }

        function z() {
          return `<img src="${s("logo32")}" alt="" class="tw-w-6 tw-h-6 tw-shrink-0" aria-hidden="true" />`
        }

        function J(t) {
          t && "presence-status-container" === t.id && t.closest(".bblox-stats-container") && (t.querySelector(
            ".presence-status") || (t.innerHTML = U()))
        }

        function Q(t) {
          const e = (new Date).getTime() - t,
            n = Math.floor(e / 6e4),
            a = Math.floor(e / 36e5),
            r = Math.floor(e / 864e5);
          return n < 60 ? `${n} minute${1!==n?"s":""} ago` : a < 24 ? `${a} hour${1!==a?"s":""} ago` :
            `${r} day${1!==r?"s":""} ago`
        }

        function W(t) {
          if (!t || t < 0) return "0m";
          const e = Math.floor(t / 6e4),
            n = Math.floor(e / 60);
          if (n > 0) {
            const t = e % 60;
            return `${n}h${t>0?` ${t}m`:""}`
          }
          return `${e}m`
        }

        function X() {
          try {
            const t = window.location.href,
              e = t.match(/\/users\/(\d+)\/profile/);
            return e && e[1] ? parseInt(e[1]) : (console.error("Card Profile: Could not extract user ID from URL:",
              t), null)
          } catch (t) {
            return console.error("Card Profile: Error getting user ID from URL:", t), null
          }
        }

        function Z() {
          try {
            const t = document.querySelector('meta[name="user-data"]');
            if (t && t.getAttribute("data-userid")) {
              const e = parseInt(t.getAttribute("data-userid"));
              if (!isNaN(e)) return e
            }
            return console.error("Card Profile: Could not extract authenticated user ID from meta tag"), null
          } catch (t) {
            return console.error("Card Profile: Error getting authenticated user ID from meta tag:", t), null
          }
        }

        function K(t, e, n = null, a = null) {
          const r = (new Date).getTime();
          let s = 0,
            i = r,
            o = !1;
          switch (e) {
            case "day":
              return {
                website: t.timeStats.daily.website || 0, game: t.timeStats.daily.game || 0, studio: t.timeStats
                  .daily.studio || 0
              };
            case "week":
              s = r - 6048e5;
              break;
            case "month":
              s = r - 2592e6;
              break;
            case "custom":
              if (!n || !a) return {
                website: 0,
                game: 0,
                studio: 0
              };
              s = n, i = a, o = !0;
              break;
            case "total":
              return {
                website: t.timeStats.total.website || 0, game: t.timeStats.total.game || 0, studio: t.timeStats
                  .total.studio || 0
              };
            default:
              return {
                website: 0, game: 0, studio: 0
              }
          }
          const l = {
            website: 0,
            game: 0,
            studio: 0
          };
          if (t.gameHistory && t.gameHistory.games) {
            for (const [e, n] of Object.entries(t.gameHistory.games))
              if (n.sessions && Array.isArray(n.sessions)) {
                let t = 0;
                const e = [];
                for (const a of n.sessions) {
                  if (!a.startTime || !a.endTime) continue;
                  const n = a.startTime,
                    r = a.endTime;
                  if (n < i && r > s) {
                    const o = Math.max(n, s),
                      l = Math.min(r, i) - o;
                    l > 0 && (e.push({
                      session: a,
                      durationInRange: l,
                      fullDuration: r - n
                    }), t += r - n)
                  }
                }
                const a = n.totalTime || 0;
                for (const {
                    durationInRange: n,
                    fullDuration: r
                  }
                  of e)
                  if (t > 0 && a > 0 && t > a) {
                    const e = n / r * (r / t * a);
                    l.game += e
                  } else l.game += n
              } if (t.gameHistory.currentGame && t.gameHistory.gameStartTime) {
              const e = t.gameHistory.gameStartTime;
              if (e < i) {
                const n = Math.max(e, s),
                  a = Math.min(r, i) - n;
                if (a > 0) {
                  const n = t.gameHistory.games[t.gameHistory.currentGame];
                  if (n) {
                    let t = 0;
                    if (n.sessions && Array.isArray(n.sessions))
                      for (const e of n.sessions) e.startTime && e.endTime && (t += e.endTime - e.startTime);
                    const s = r - e;
                    t += s;
                    const i = n.totalTime || 0;
                    if (t > 0 && i > 0 && t > i) {
                      const e = a / s * (s / t * i);
                      l.game += e
                    } else l.game += a
                  } else l.game += a
                }
              }
            }
          }
          const c = t.websiteSessions && Array.isArray(t.websiteSessions) && t.websiteSessions.length > 0,
            d = t.studioSessions && Array.isArray(t.studioSessions) && t.studioSessions.length > 0;
          if (c) {
            for (const e of t.websiteSessions) {
              if (!e.startTime || !e.endTime) continue;
              const t = e.startTime,
                n = e.endTime;
              if (t < i && n > s) {
                const e = Math.max(t, s),
                  a = Math.min(n, i) - e;
                a > 0 && (l.website += a)
              }
            }
            if (1 === t.presenceType && t.websiteStartTime) {
              const e = t.websiteStartTime;
              if (e < i) {
                const t = Math.max(e, s),
                  n = Math.min(r, i) - t;
                n > 0 && (l.website += n)
              }
            }
          } else if (!o) {
            const n = "week" === e ? 7 : 30,
              a = t.timeStats.daily.website || 0;
            l.website = Math.min(a * n, t.timeStats.total.website || 0)
          }
          if (d) {
            for (const e of t.studioSessions) {
              if (!e.startTime || !e.endTime) continue;
              const t = e.startTime,
                n = e.endTime;
              if (t < i && n > s) {
                const e = Math.max(t, s),
                  a = Math.min(n, i) - e;
                a > 0 && (l.studio += a)
              }
            }
            if (3 === t.presenceType && t.studioStartTime) {
              const e = t.studioStartTime;
              if (e < i) {
                const t = Math.max(e, s),
                  n = Math.min(r, i) - t;
                n > 0 && (l.studio += n)
              }
            }
          } else if (!o) {
            const n = "week" === e ? 7 : 30,
              a = t.timeStats.daily.studio || 0;
            l.studio = Math.min(a * n, t.timeStats.total.studio || 0)
          }
          const u = t.timeStats.total.game || 0,
            w = t.timeStats.total.website || 0,
            g = t.timeStats.total.studio || 0;
          return l.game > u && (console.warn(
              `[TimeStats] Calculated game time (${l.game}ms) exceeds total (${u}ms) for period ${e}`), l.game =
            u), l.website > w && (console.warn(
              `[TimeStats] Calculated website time (${l.website}ms) exceeds total (${w}ms) for period ${e}`), l
            .website = w), l.studio > g && (console.warn(
              `[TimeStats] Calculated studio time (${l.studio}ms) exceeds total (${g}ms) for period ${e}`), l
            .studio = g), l
        }

        function Y(t) {
          if (!t) return "0m";
          const e = Math.floor(t / 36e5),
            n = Math.floor(t % 36e5 / 6e4);
          return 0 === e ? `${n}m` : 0 === n ? `${e}h` : `${e}h ${n}m`
        }

        function tt(t, e = document) {
          for (const n of t) {
            const t = e.querySelector(n);
            if (t) return t
          }
          return null
        }
        async function et() {
          const t = (await F()).profileDuplicateButtonsToHide;
          if (!t || 0 === t.length) return;
          const e = Array.isArray(t) ? t : [t];
          for (const t of e)
            if (t && "string" == typeof t) try {
              document.querySelectorAll(t).forEach(t => {
                t && !t.hasAttribute("data-betterblox-duplicate-hidden") && (t.setAttribute(
                  "data-betterblox-duplicate-hidden", "true"), t.style.setProperty("display", "none",
                  "important"))
              })
            } catch (t) {}
        }
        async function nt(t, e, n) {
          if (!await a.n.getSettings("friends-presence", !0)) return;
          const r = await a.n.getSettings("more-presence-details", !1),
            s = (await F()).profileLastOnlineContainer;
          let i = s ? document.querySelector(s) : null;
          if (i || (i = document.querySelector(".user-profile-header-info > div > div.flex.flex-col")), !i)
        return;
          let o = i.querySelector("[data-betterblox-last-online-header]");
          if (o || (o = document.createElement("div"), o.setAttribute("data-betterblox-last-online-header",
                "true"), o.className = "tw-text-sm tw-text-[#666] dark:tw-text-gray-400 tw-mt-1", i.appendChild(
              o)), 2 === t?.presenceType) {
            const e = Date.now() - (t.gameHistory?.gameStartTime || Date.now());
            o.textContent = e > 0 ? `Currently playing (for ${W(e)})` : "Currently online"
          } else if (t?.lastOnline) {
            let e = "number" == typeof t.lastOnline ? t.lastOnline : t.lastOnline?.timestamp;
            if (e && e > 0) {
              const n = Q(e),
                a = r && t.lastOnline?.gameName ?
                ` playing ${t.lastOnline.gameName.length>12?t.lastOnline.gameName.slice(0,12)+"…":t.lastOnline.gameName}` :
                "";
              o.textContent = `Last seen: ${n}${a}`
            } else o.textContent = "Last online: Unknown"
          } else o.textContent = n < 1 ? "Last online: —" : e ?
            "Last online: No data yet (will appear when they go online)" :
            "Last online: Track this user to see activity"
        }

        function at(t, e, n, r) {
          t.querySelector(`.${V}`)?.remove(), 2 === e.presenceType ? function(t, e) {
            const n = t.querySelectorAll(".presence-status");
            for (const t of n) t.remove();
            const a = Date.now() - (e.gameHistory?.gameStartTime || Date.now());
            if (a > 0) {
              const e = document.createElement("div");
              e.className = "presence-status avatar-card-label";
              const n = "DIV" === t.tagName && "presence-status-container" === t.id ?
                `<div class="tw-flex tw-items-center tw-gap-2 tw-min-w-0">${z()}<div class="tw-min-w-0">Currently playing (for ${W(a)})</div></div>` :
                `<div style="font-size: 12px">Currently playing (for ${W(a)})</div>`;
              if (e.innerHTML = n, "DIV" === t.tagName && "presence-status-container" === t.id) t.appendChild(e);
              else {
                const n = tt([".user-profile-header-info > div > div.flex.flex-col"], t);
                n && n.appendChild(e)
              }
            }
          }(t, e) : 0 === e.presenceType && async function(t, e, n, r) {
            const s = t.querySelectorAll(".presence-status");
            for (const t of s) t.remove();
            let i = e.lastOnline,
              o = null;
            if ("number" == typeof i ? o = i : i && "object" == typeof i && i.timestamp && (o = i.timestamp),
              o && o > 0) {
              const e = Q(o),
                n = await a.n.getSettings("more-presence-details", !1);
              let r = `Last seen: ${new Date(o).toLocaleString()}`;
              i && "object" == typeof i && i.gameName && (r += `\nPlaying: ${i.gameName}`, i.sessionDuration >
                0 && (r += `\nDuration: ${W(i.sessionDuration)}`));
              let s = e;
              n && i && "object" == typeof i && i.gameName && (s +=
                ` playing ${i.gameName.length>10?i.gameName.slice(0,10)+"...":i.gameName}`, i
                .sessionDuration > 0 && (s += ` (${W(i.sessionDuration)})`));
              const l = document.createElement("div");
              l.className = "presence-status avatar-card-label tw-group tw-relative";
              const c = "DIV" === t.tagName && "presence-status-container" === t.id,
                d = c ? "" : ' style="font-size: 12px"';
              if (l.innerHTML = c ?
                `<div class="tw-flex tw-items-center tw-gap-2 tw-min-w-0">\n      ${z()}\n      <div${d} class="tw-cursor-help tw-min-w-0">${s}\n        <div class="tw-invisible group-hover:tw-visible tw-absolute tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap" style="white-space: pre-line;">\n          ${r}\n        </div>\n      </div>\n    </div>` :
                `\n    <div class="tw-flex tw-flex-row tw-gap-2">\n      <div${d} class="tw-cursor-help">${s}\n        <div class="tw-invisible group-hover:tw-visible tw-absolute tw-bottom-full tw-left-1/2 tw--translate-x-1/2 tw-px-2 tw-py-1 tw-bg-gray-800 tw-text-white tw-text-xs tw-rounded tw-whitespace-nowrap" style="white-space: pre-line;">\n          ${r}\n        </div>\n      </div>\n    </div>\n    `,
                "DIV" === t.tagName && "presence-status-container" === t.id) t.appendChild(l);
              else {
                const e = tt([".user-profile-header-info > div > div.flex.flex-col"], t);
                e && e.appendChild(l)
              }
            } else await rt(t, n, r)
          }(t, e, n, r)
        }
        async function rt(t, e, n) {
          const a = document.createElement("div");
          if (a.className = "presence-status avatar-card-label", a.innerHTML = e ?
            "<div style=\"color: #666;font-size: 10px\">Your friend has been offline since you installed the extension. Their activity data will appear once they come online while your browser is open. The 'Last Online' status will be recorded the next time your friend switches from online to offline.</div>" :
            "<div style=\"color: #666;font-size: 10px\">No data available for this stranger. Make sure you have clicked the 'Track' button. Their activity data will appear once they come online while your browser is open.</div>",
            n < 1 && (a.innerHTML =
              '<div style="color: #666;font-size: 10px">Friendlist is empty... Please wait 5-10 minutes for extension warmup.</div>'
              ), "DIV" === t.tagName && "presence-status-container" === t.id) t.appendChild(a);
          else {
            const e = tt([".user-profile-header-info > div > div.flex.flex-col"], t);
            e && e.appendChild(a)
          }
        }
        async function st(t, e) {
          let n = e;
          if (e && "DIV" !== e.tagName && (n = tt([".buttons-show-on-desktop"], e)), !n) return;
          let r, s = (await a.n.get("betterblox_tracking_list_v2", [])).includes(t);
          if ("DIV" === n.tagName) r = document.createElement("button"), r.type = "button", r.className = s ?
            "btn-alert-md" : "btn-control-md";
          else {
            const t = document.createElement("li");
            t.className = "btn-friends", t.style.marginLeft = "9px", r = t
          }
          const i = () => {
            "BUTTON" === r.tagName ? (r.className = s ? "btn-alert-md" : "btn-control-md", r.textContent = s ?
                "Untrack" : "Track") : r.innerHTML = s ?
              '<button type="button" class="tw-btn-alert-md">Untrack</button>' :
              '<button type="button" class="tw-btn-control-md">Track</button>'
          };
          i(), ("BUTTON" === r.tagName ? r : r.querySelector("button")).addEventListener("click", async () => {
            const e = await a.n.get("betterblox_tracking_list_v2", []);
            if (s) {
              const n = e.filter(e => e !== t);
              await a.n.set("betterblox_tracking_list_v2", n)
            } else {
              const n = [...e, t];
              await a.n.set("betterblox_tracking_list_v2", n)
            }
            s = !s, i()
          }), n.appendChild(r)
        }

        function it(t, e) {
          const n = String(e);
          return t.some(t => String(t) === n)
        }
        async function ot(t) {
          const e = function() {
            try {
              const t = document.querySelector('meta[name="user-data"]');
              if (t && t.getAttribute("data-userid")) {
                const e = parseInt(t.getAttribute("data-userid"), 10);
                if (!isNaN(e)) return e
              }
              return null
            } catch (t) {
              return null
            }
          }();
          return null != e && it(((await a.n.get("betterblox_friends_list", {}))[e] || {
            friendIds: []
          }).friendIds || [], t)
        }

        function lt(t) {
          return null != t.querySelector("[data-betterblox-profile-menu-item]") || "true" === t.getAttribute(
            "data-betterblox-profile-menu-done")
        }
        async function ct(t) {
          return it(await a.n.get("notifyOnline", []), t)
        }
        async function dt(t) {
          return it(await a.n.get("autoJoin", []), t)
        }

        function ut(t) {
          if (!t || "string" != typeof t.textContent) return !1;
          const e = t.textContent;
          return e.includes("Inventory") && e.includes("Favorites")
        }
        async function wt(t = document) {
          const e = (await F()).profilePopup || [];
          for (const n of e) try {
            const e = t.querySelectorAll(n);
            for (const t of e)
              if (ut(t) && !lt(t) && t.closest("#user-profile-header-bg")) return t;
            for (const t of e)
              if (ut(t) && !lt(t)) return t
          } catch (t) {}
          const n = t.querySelectorAll('ul[role="menu"]');
          for (const t of n)
            if (!lt(t) && ut(t)) return t;
          return null
        }
        const gt = new WeakSet;
        const ht =
          "tw-block tw-w-full tw-py-2 tw-px-3 tw-text-left tw-text-sm tw-bg-transparent tw-border-0 tw-rounded-md tw-cursor-pointer tw-font-inherit tw-transition-colors hover:tw-bg-[#f0f0f0] dark:hover:tw-bg-[#353840] tw-text-[#1c1c1c] dark:tw-text-gray-200",
          mt =
          "tw-flex tw-items-center tw-px-3 tw-py-2 tw-cursor-pointer tw-rounded-md tw-transition-colors hover:tw-bg-[#f0f0f0] dark:hover:tw-bg-[#353840] tw-outline-none";

        function pt(t, e, n) {
          (e ? t : t.querySelector(".profile-header-dropdown-label") || t).textContent = n
        }
        async function bt(t, e) {
          if (lt(t)) return Promise.resolve();
          const n = "UL" === t.tagName && "menu" === t.getAttribute("role"),
            r = "DIV" === t.tagName;
          if (!n && !r) return Promise.resolve();
          const [s, i, o, l] = await Promise.all([a.n.get("betterblox_tracking_list_v2", []), a.n.getSettings(
              "friends-online-notify", !0), a.n.getSettings("auto-join", !0), ot(e)]), [c, d, u] = await Promise
            .all([Promise.resolve(it(s, e)), i ? ct(e) : Promise.resolve(!1), o ? dt(e) : Promise.resolve(!1)]),
            w = (t, e, n, a, s) => function(t, e, n, a, r, s = !1) {
              const i = a.replace(/[\[\]]/g, "");
              if (s) {
                const a = document.createElement("button");
                return a.setAttribute("data-betterblox-profile-menu-item", "true"), a.setAttribute(i, "true"), a
                  .setAttribute("type", "button"), a.setAttribute("role", "menuitem"), a.className = ht, a
                  .textContent = n ? e : t, a.addEventListener("click", async t => {
                    t.stopPropagation(), t.preventDefault();
                    try {
                      await r()
                    } catch (t) {
                      console.error("Profile menu: click error:", t)
                    }
                    setTimeout(() => document.body.click(), 100)
                  }), a
              }
              const o = document.createElement("li");
              o.setAttribute("data-betterblox-profile-menu-item", "true"), o.setAttribute(i, "true"), o
                .setAttribute("role", "menuitem"), o.setAttribute("tabindex", "-1"), o.className = mt;
              const l = document.createElement("span");
              return l.className =
                "profile-header-dropdown-label tw-text-sm tw-text-[#1c1c1c] dark:tw-text-gray-200", l
                .textContent = n ? e : t, o.appendChild(l), o.addEventListener("click", async t => {
                  t.stopPropagation(), t.preventDefault();
                  try {
                    await r()
                  } catch (t) {
                    console.error("Profile menu: click error:", t)
                  }
                }), o
            }(t, e, n, a, s, r), g = [];
          if (!l) {
            const t = w("Track", "Untrack", c, "[data-betterblox-track]", async () => {
              const n = await a.n.get("betterblox_tracking_list_v2", []),
                s = !it(n, e),
                i = String(e);
              s ? await a.n.set("betterblox_tracking_list_v2", [...n, i]) : await a.n.set(
                "betterblox_tracking_list_v2", n.filter(t => String(t) !== i)), pt(t, r, s ? "Untrack" :
                "Track")
            });
            g.push(t)
          }
          if (i) {
            const t = "Notify when Online",
              n = "Disable Online Notification",
              s = w(t, n, d, "[data-betterblox-profile-notify-online]", async () => {
                const i = await async function(t) {
                  const e = await a.n.get("notifyOnline", []),
                    n = String(t);
                  let r;
                  return r = it(e, t) ? e.filter(t => String(t) !== n) : [...e, n], await a.n.set(
                    "notifyOnline", r), it(r, t)
                }(e);
                pt(s, r, i ? n : t)
              });
            g.push(s)
          }
          if (o) {
            const t = "Game Join Notifications",
              n = "Disable Join Notifications",
              s = w(t, n, u, "[data-betterblox-profile-game-join]", async () => {
                const i = await async function(t) {
                  const e = await a.n.get("autoJoin", []),
                    n = String(t);
                  let r;
                  return r = it(e, t) ? e.filter(t => String(t) !== n) : [...e, n], await a.n.set(
                    "autoJoin", r), it(r, t)
                }(e);
                pt(s, r, i ? n : t)
              });
            g.push(s)
          }
          if (0 === g.length) return t.setAttribute("data-betterblox-profile-menu-done", "true"), Promise
          .resolve();
          if (r) {
            const e = t.firstChild;
            for (let n = 0; n < g.length; n++) t.insertBefore(g[n], e)
          } else {
            let e = null;
            for (let n = 0; n < t.children.length; n++) {
              const a = t.children[n];
              if ("LI" === a.tagName && "menuitem" === a.getAttribute("role")) {
                e = a;
                break
              }
            }
            const n = e || t.firstChild;
            for (let e = 0; e < g.length; e++) t.insertBefore(g[e], n)
          }
          return Promise.resolve()
        }
        async function ft(t, e) {
          if ("profile" !== e) return;
          const n = await F();
          let r = null;
          for (const t of n.profileRoot) try {
            if (r = document.querySelector(t), r) break
          } catch (t) {}
          r && t === r && (async function(t) {
            const e = X();
            if (!e) return console.error("Card Profile: Could not get user ID");
            if (document.querySelector(".bblox-stats-container")) return;
            const n = await F(),
              r = n.profileHeaderInsert,
              s = r && (t.querySelector(r) || document.querySelector(r)) || null,
              i = s?.parentNode,
              o = Z();
            if (!o) return console.error("Card Profile: Could not get authentificated user ID");
            const l = (await a.n.get("betterblox_friends_list", {}))[o] || {
                friendIds: []
              },
              c = l.friendIds.includes(e),
              d = (await a.n.get("betterblox_presence_tracker_v2", {}))[e] || null,
              u = await async function(t, e, n, a, r) {
                const s = document.createElement("div");
                if (s.className =
                  "bblox-stats-container tw-w-full tw-max-w-[840px] tw-rounded-xl tw-border tw-border-[#e5e5e5] tw-bg-[#fafafa] dark:tw-bg-[#2a2d30] dark:tw-border-[#3a3d40] tw-mx-auto tw-p-5 tw-flex tw-flex-col tw-gap-3 tw-my-5",
                  !t) {
                  const t = document.createElement("div");
                  t.className = "tw-flex tw-flex-col tw-gap-3";
                  const n = document.createElement("div");
                  if (n.className = "tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2", n
                    .innerHTML = U("tw-flex-1 tw-min-w-0"), !a) {
                    const t = document.createElement("div");
                    t.id = "track-button-container", await st(e, t), n.appendChild(t)
                  }
                  t.appendChild(n);
                  const i = document.createElement("div");
                  return i.className = "tw-flex-1 tw-min-w-0", i.id = "presence-status-container",
                    await rt(i, a, r), t.appendChild(i), s.appendChild(t), s
                }
                const i = document.createElement("div");
                i.className = "tw-flex tw-w-full tw-min-w-0 tw-flex-1 tw-flex-col tw-gap-2";
                const o = document.createElement("div");
                o.className = "tw-flex tw-flex-col tw-gap-2 tw-mb-2";
                const l = a ? "" :
                  '<div id="track-button-container" class="tw-flex tw-shrink-0 tw-items-center"></div>';
                o.innerHTML =
                  `\n    <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-3 tw-gap-y-2">\n      <div id="presence-status-container" class="tw-min-w-0 tw-flex-1 tw-text-base tw-font-medium tw-text-[#1c1c1c] dark:tw-text-gray-200"></div>\n      ${l}\n      <select id="time-stats-period" class="tw-shrink-0 tw-text-sm tw-px-2 tw-py-1.5 tw-rounded-md tw-border tw-border-[#e5e5e5] dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-[#1c1c1c] dark:tw-text-gray-300">\n        <option value="day">Day</option>\n        <option value="week">Week</option>\n        <option value="month">Month</option>\n        <option value="custom">Custom Range</option>\n        <option value="total" selected>Total</option>\n      </select>\n    </div>\n  `;
                const c = o.querySelector("#presence-status-container");
                at(c, t, a, r), J(c), a || await st(e, o.querySelector("#track-button-container")), o
                  .insertAdjacentHTML("beforeend",
                    '\n    <div id="date-range-selector" class="tw-items-center tw-gap-2 tw-text-sm tw-hidden">\n      <label class="tw-text-[#666] dark:tw-text-gray-400">From:</label>\n      <input type="date" id="date-start" class="tw-px-2 tw-py-1.5 tw-rounded-md tw-border tw-border-[#e5e5e5] dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-[#1c1c1c] dark:tw-text-gray-300 tw-text-sm">\n      <label class="tw-text-[#666] dark:tw-text-gray-400">To:</label>\n      <input type="date" id="date-end" class="tw-px-2 tw-py-1.5 tw-rounded tw-border tw-border-[#e5e5e5] dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-[#1c1c1c] dark:tw-text-gray-300 tw-text-sm">\n    </div>\n  '
                    );
                const d = document.createElement("div");
                d.id = "time-stats-display", d.className = "tw-grid tw-grid-cols-3 tw-gap-4";
                const u = e => {
                  let n, a;
                  if ("custom" === e) {
                    const r = o.querySelector("#date-start").value,
                      s = o.querySelector("#date-end").value;
                    if (!r || !s) return void(d.innerHTML =
                      '\n          <div class="tw-col-span-3 tw-text-center tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-py-2">\n            Please select both start and end dates\n          </div>\n        '
                      );
                    const i = new Date(r).setHours(0, 0, 0, 0),
                      l = new Date(s).setHours(23, 59, 59, 999);
                    if (l < i) return void(d.innerHTML =
                      '\n          <div class="tw-col-span-3 tw-text-center tw-text-sm tw-text-red-500 dark:tw-text-red-400 tw-py-2">\n            End date must be after start date\n          </div>\n        '
                      );
                    n = K(t, e, i, l), a =
                      `${new Date(r).toLocaleDateString()} - ${new Date(s).toLocaleDateString()}`
                  } else n = K(t, e), a = e.charAt(0).toUpperCase() + e.slice(1);
                  const r =
                    `<span class="${n.website>0?"tw-text-green-600 dark:tw-text-green-400":"tw-text-gray-400 dark:tw-text-gray-400"}">${n.website>0?Y(n.website):"--"}</span>`,
                    s =
                    `<span class="${n.studio>0?"tw-text-green-600 dark:tw-text-green-400":"tw-text-gray-400 dark:tw-text-gray-400"}">${n.studio>0?Y(n.studio):"--"}</span>`;
                  d.innerHTML =
                    `\n      \x3c!-- Website Stats --\x3e\n      <div class="tw-bg-white dark:tw-bg-[#353840] tw-border tw-border-[#e5e5e5] dark:tw-border-transparent tw-p-4 tw-rounded-lg tw-min-w-0">\n        <p class="tw-text-base tw-text-[#666] dark:tw-text-gray-400">Website</p>\n        <p class="tw-text-base tw-font-medium tw-text-[#1c1c1c] dark:tw-text-gray-200">${a}: ${r}</p>\n      </div>\n      \x3c!-- Game Stats --\x3e\n      <div class="tw-bg-white dark:tw-bg-[#353840] tw-border tw-border-[#e5e5e5] dark:tw-border-transparent tw-p-4 tw-rounded-lg tw-min-w-0">\n        <p class="tw-text-base tw-text-[#666] dark:tw-text-gray-400">Game</p>\n        <p class="tw-text-base tw-font-medium tw-text-[#1c1c1c] dark:tw-text-gray-200">${a}: <span class="${n.game>0?"tw-text-green-600 dark:tw-text-green-400":"tw-text-[#666] dark:tw-text-gray-400"}">${n.game>0?Y(n.game):"--"}</span></p>\n      </div>\n      \x3c!-- Studio Stats --\x3e\n      <div class="tw-bg-white dark:tw-bg-[#353840] tw-border tw-border-[#e5e5e5] dark:tw-border-transparent tw-p-4 tw-rounded-lg tw-min-w-0">\n        <p class="tw-text-base tw-text-[#666] dark:tw-text-gray-400">Studio</p>\n        <p class="tw-text-base tw-font-medium tw-text-[#1c1c1c] dark:tw-text-gray-200">${a}: ${s}</p>\n      </div>\n    `
                };
                u("total");
                const w = o.querySelector("#time-stats-period"),
                  g = o.querySelector("#date-range-selector"),
                  h = o.querySelector("#date-start"),
                  m = o.querySelector("#date-end"),
                  p = new Date,
                  b = new Date(p);
                b.setDate(p.getDate() - 7), m.value = p.toISOString().split("T")[0], h.value = b
                  .toISOString().split("T")[0], i.appendChild(o), i.appendChild(d);
                const f = document.createElement("div");
                f.className = "bblox-stats-topgames";
                const y = document.createElement("div");
                y.id = "top-games-container", y.className =
                  "tw-space-y-1.5 tw-overflow-y-auto tw-max-h-[180px] tw-pr-2 scrollbar-thin scrollbar-thumb-[#e5e5e5] dark:scrollbar-thumb-gray-600 scrollbar-track-transparent",
                  f.innerHTML =
                  '\n    <h2 class="tw-text-base tw-font-semibold tw-text-[#1c1c1c] dark:tw-text-gray-200 tw-mb-2">Top Games</h2>\n  ',
                  f.appendChild(y);
                const v = e => {
                  let n = null,
                    a = null;
                  if ("custom" === e) {
                    const t = o.querySelector("#date-start").value,
                      e = o.querySelector("#date-end").value;
                    if (!t || !e) return void(y.innerHTML =
                      '<div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-text-center tw-py-2">Select date range to view games</div>'
                      );
                    n = new Date(t).setHours(0, 0, 0, 0), a = new Date(e).setHours(23, 59, 59, 999)
                  }
                  const r = function(t, e, n = null, a = null) {
                    const r = t.gameHistory?.games || {},
                      s = (new Date).getTime();
                    let i = 0,
                      o = s;
                    switch (e) {
                      case "day":
                        i = (new Date).setHours(0, 0, 0, 0);
                        break;
                      case "week":
                        i = s - 6048e5;
                        break;
                      case "month":
                        i = s - 2592e6;
                        break;
                      case "custom":
                        if (!n || !a)
                        return '<div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-text-center tw-py-2">Select date range to view games</div>';
                        i = n, o = a
                    }
                    const l = Object.entries(r).map(([n, a]) => {
                        let r = 0;
                        if ("day" === e) r = a.dailyTime || 0;
                        else if ("total" === e) r = a.totalTime || 0;
                        else {
                          if (a.sessions && Array.isArray(a.sessions)) {
                            let t = 0;
                            const e = [];
                            for (const n of a.sessions) {
                              if (!n.startTime || !n.endTime) continue;
                              const a = n.startTime,
                                r = n.endTime;
                              if (a < o && r > i) {
                                const n = Math.max(a, i),
                                  s = Math.min(r, o) - n;
                                s > 0 && (e.push({
                                  durationInRange: s,
                                  fullDuration: r - a
                                }), t += r - a)
                              }
                            }
                            const n = a.totalTime || 0;
                            for (const {
                                durationInRange: a,
                                fullDuration: s
                              }
                              of e) r += t > 0 && n > 0 && t > n ? a / s * (s / t * n) : a
                          }
                          if (t.gameHistory?.currentGame === n && t.gameHistory?.gameStartTime) {
                            const e = t.gameHistory.gameStartTime;
                            if (e < o) {
                              const t = Math.max(e, i),
                                n = Math.min(s, o) - t;
                              n > 0 && (r += n)
                            }
                          }
                        }
                        return {
                          id: n,
                          name: a.name,
                          periodTime: r,
                          totalTime: a.totalTime || 0,
                          dailyTime: a.dailyTime || 0
                        }
                      }).filter(t => t.periodTime > 0).sort((t, e) => e.periodTime - t.periodTime)
                      .slice(0, 5);
                    if (0 === l.length)
                    return '<div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-text-center tw-py-2">No games played in this period</div>';
                    const c = "custom" === e ? "Range" : e.charAt(0).toUpperCase() + e.slice(1);
                    return l.map(t =>
                      `\n      <a href="https://www.roblox.com/games/${t.id}" \n         class="tw-flex tw-items-center tw-justify-between tw-bg-gray-50 dark:tw-bg-[#353840] tw-p-1.5 tw-rounded-md hover:tw-bg-gray-100 dark:hover:tw-bg-[#404650] tw-transition-colors">\n        <span class="tw-text-sm tw-text-gray-800 dark:tw-text-gray-200 tw-truncate">${t.name}</span>\n        <div class="tw-flex tw-flex-col tw-items-end tw-ml-2">\n          <span class="tw-text-xs tw-text-green-600 dark:tw-text-green-400">${c}: ${Y(t.periodTime)}</span>\n          ${"total"!==e?`<span class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">Total: ${Y(t.totalTime)}</span>`:""}\n        </div>\n      </a>\n    `
                      ).join("")
                  }(t, e, n, a);
                  y.innerHTML = r
                };
                w.addEventListener("change", t => {
                  const e = t.target.value;
                  "custom" === e ? (g.classList.remove("tw-hidden"), g.classList.add("tw-flex"), u(e),
                    v(e)) : (g.classList.add("tw-hidden"), g.classList.remove("tw-flex"), u(e), v(
                    e))
                }), h.addEventListener("change", () => {
                  h.value && (m.min = h.value), "custom" === w.value && (u("custom"), v("custom"))
                }), m.addEventListener("change", () => {
                  m.value && (h.max = m.value), "custom" === w.value && (u("custom"), v("custom"))
                }), v("total");
                const x = document.createElement("div");
                return x.className = "bblox-stats-row", x.appendChild(i), x.appendChild(f), s.appendChild(
                  x), s
              }(d, e, 0, c, l.friendIds.length);
            if (await nt(d || null, c, l.friendIds.length), await et(), i) i.parentNode.insertBefore(u, i
              .nextSibling);
            else {
              const e = t.querySelector(".user-profile-header");
              if (e) e.parentNode.insertBefore(u, e.nextSibling);
              else {
                const e = n.profileHeaderInsertFallback || [];
                let a = !1;
                for (const n of e) {
                  const e = t.querySelector(n) || document.querySelector(n);
                  if (e) {
                    e.parentNode.insertBefore(u, e.nextSibling), a = !0;
                    break
                  }
                }
                a || console.error("Card Profile: Could not find profile header")
              }
            }
            setTimeout(() => et(), 800)
          }(t), async function(t) {
            const e = function() {
              try {
                const t = window.location.href.match(/\/users\/(\d+)\/profile/);
                return t && t[1] ? t[1] : null
              } catch (t) {
                return console.error("Profile track option: Error getting user ID from URL:", t), null
              }
            }();
            if (!e) return;
            const n = ['button[aria-label*="More"]', 'button[aria-label*="more"]',
              'button[aria-label*="Menu"]', 'button[aria-label*="menu"]', '[data-testid*="menu"]',
              '[data-testid*="Menu"]', '[class*="icon-more"]', '[class*="IconMore"]',
              '[class*="more-button"]', '[class*="MoreButton"]', '[class*="menu-button"]',
              '[class*="MenuButton"]'
            ];
            let a = null;
            for (const e of n)
              if (a = t.querySelector(e) || document.querySelector(e), a) break;
            let r = null;
            if (new MutationObserver(() => {
                r && clearTimeout(r), r = setTimeout(() => {
                  wt(document).then(t => {
                    !t || gt.has(t) || lt(t) || (gt.add(t), bt(t, e).then(() => gt.delete(t)))
                  })
                }, 100)
              }).observe(document.body, {
                childList: !0,
                subtree: !0
              }), a) {
              const t = () => {
                setTimeout(() => {
                  wt(document).then(t => {
                    !t || gt.has(t) || lt(t) || (gt.add(t), bt(t, e).then(() => gt.delete(t)))
                  })
                }, 150)
              };
              a.addEventListener("click", t, {
                once: !1
              })
            }
            wt(document).then(t => {
              !t || gt.has(t) || lt(t) || (gt.add(t), bt(t, e).then(() => gt.delete(t)))
            }), t.setAttribute("data-betterblox-track-user-profile", "true")
          }(t))
        }
        const yt = {
          pages: ["home", "profile", "friends"],
          selectors: [{
            selector: "a.friends-carousel-tile-labels",
            handler: (t, e) => {
              "home" == e && async function(t) {
                if (!await a.n.getSettings("friends-presence", !0)) return;
                const e = q(t),
                  n = await a.n.get("betterblox_presence_tracker_v2", {}),
                  r = t.querySelector(".presence-status");
                if (r && r.remove(), n[e]) B(t, n[e]);
                else {
                  const e = document.createElement("div");
                  e.className = "presence-status", e.innerHTML =
                    '<div style="color: #666;font-size: 12px">(BetterBLOX warming up please wait...)</div>',
                    t.appendChild(e)
                }
              }(t)
            }
          }, {
            selector: "li.avatar-card",
            handler: (t, e) => {
              "friends" == e && async function(t) {
                if (!await a.n.getSettings("friends-presence", !0)) return;
                const e = j(t),
                  n = await a.n.get("betterblox_presence_tracker_v2", {}),
                  r = t.querySelectorAll(".presence-status");
                for (const t of r) t.remove();
                n[e] && N(t, n[e])
              }(t)
            }
          }, {
            selector: "#user-profile-header-bg",
            handler: (t, e) => ft(t, e)
          }, {
            selector: "#treatment-redesigned-header",
            handler: (t, e) => ft(t, e)
          }, {
            selector: "#profile-header-container",
            handler: (t, e) => ft(t, e)
          }],
          handlePresenceUpdate(t) {
            document.querySelectorAll("a.friends-carousel-tile-labels").forEach(e => {
              !async function(t, e) {
                const n = q(t);
                n && await a.n.getSettings("friends-presence", !0) && e[n] && B(t, e[n])
              }(e, t)
            }), document.querySelectorAll("li.avatar-card").forEach(e => {
              !async function(t, e) {
                const n = j(t);
                n && await a.n.getSettings("friends-presence", !0) && e[n] && N(t, e[n])
              }(e, t)
            }), F().then(e => {
              let n = null;
              for (const t of e.profileRoot) try {
                if (n = document.querySelector(t), n) break
              } catch (t) {}
              n && async function(t, e) {
                const n = X();
                if (!n) return;
                if (!await a.n.getSettings("friends-presence", !0)) return;
                const r = await a.n.get("betterblox_friends_list", {}),
                  s = Z();
                if (!s) return console.error("Card Profile: Could not get authentificated user ID");
                const i = r[s] || {
                    friendIds: []
                  },
                  o = i.friendIds.includes(n),
                  l = document.getElementById("presence-status-container");
                l ? e[n] ? (at(l, e[n], o, i.friendIds.length), J(l)) : (l.innerHTML = "", await rt(l, o,
                  i.friendIds.length)) : e[n] && at(t, e[n], o, i.friendIds.length), await nt(e[n] ||
                  null, o, i.friendIds.length)
              }(n, t)
            })
          },
          async initialize() {
            chrome.runtime.onMessage.addListener((t, e, n) => {
              "PRESENCE_TRACKER_UPDATED" === t.type && this.handlePresenceUpdate(t.data)
            })
          }
        };
        const vt = {
          pages: ["all"],
          selectors: [{
            id: "Pools",
            selector: "li.rbx-upgrade-now",
            handler: async (t, e) => {
              ! function(t) {
                new Date < new Date(2025, 6, 22) && function(t) {
                  const e = document.createElement("div");
                  e.style.background = "#f3f4f6", e.style.border = "1px solid #d1d5db", e.style
                    .borderRadius = "8px", e.style.padding = "10px 12px", e.style.marginBottom = "14px", e
                    .style.display = "block", e.style.textAlign = "center", e.title =
                    "This widget will disappear on July 22, 2025";
                  const n = document.createElement("img");
                  n.src = s("logo32"), n.alt = "BetterBLOX Logo", n.style.width = "20px", n.style.height =
                    "20px", n.style.display = "block", n.style.margin = "0 auto 6px auto";
                  const a = document.createElement("div");
                  a.textContent = "Help us improve BetterBLOX! Please take our quick survey.", a.style
                    .fontSize = "12px", a.style.color = "#111827", a.style.marginBottom = "7px";
                  const r = document.createElement("a");
                  r.href = "https://forms.gle/Dq3pRtZBrwRjGf626", r.textContent = "Take Survey", r
                    .target = "_blank", r.style.background = "#2563eb", r.style.color = "white", r.style
                    .padding = "6px 14px", r.style.borderRadius = "6px", r.style.textDecoration = "none",
                    r.style.fontWeight = "bold", r.style.transition = "background 0.2s", r.style
                    .fontSize = "12px", r.style.display = "inline-block", r.onmouseover = () => r.style
                    .background = "#1d4ed8", r.onmouseout = () => r.style.background = "#2563eb", e
                    .appendChild(n), e.appendChild(a), e.appendChild(r), t.insertBefore(e, t.firstChild)
                }(t)
              }(t)
            }
          }]
        };
        "undefined" == typeof browser ? chrome : browser;

        function xt() {
          try {
            let t = document.createElement("canvas"),
              e = document.createElement("canvas"),
              n = t.getContext("webgl", {
                stencil: !0
              }) || t.getContext("experimental-webgl", {
                stencil: !0
              }) || t.getContext("moz-webgl", {
                stencil: !0
              }) || t.getContext("webkit-3d", {
                stencil: !0
              }),
              a = e.getContext("webgl2", {
                stencil: !0
              });
            return {
              1: n.getContextAttributes(),
              2: a.getContextAttributes()
            }
          } catch (t) {
            return {
              1: {},
              2: {}
            }
          }
        }

        function kt() {
          try {
            return new Promise(function(t, e) {
              try {
                navigator.keyboard.getLayoutMap().then(function(e) {
                  try {
                    var n = [];
                    e.forEach(function(t, e) {
                      n.push(e), n.push(t)
                    }), t(n)
                  } catch (e) {
                    t([])
                  }
                })
              } catch (e) {
                t([])
              }
            })
          } catch (t) {
            return Promise.resolve([])
          }
        }

        function St() {
          try {
            var t = {},
              e = function(t, e, n) {
                try {
                  for (var a = 0; a < e.length; a++) {
                    var r = e[a];
                    if (window.matchMedia("(" + t + ": " + r + ")").matches) {
                      n[t] = r;
                      break
                    }
                  }
                } catch (t) {}
              },
              n = function(t, e, n, a, r, s) {
                try {
                  for (var i = null, o = null;;) {
                    if (r <= a) return;
                    var l = "(" + t + ": " + a + e + ")",
                      c = "(" + t + ": " + r + e + ")";
                    if (null === i && (i = window.matchMedia(l).matches), null === o && (o = window.matchMedia(c)
                        .matches), i == o) return;
                    if (r == a + 1) return t.startsWith("min-") && (t = t.substr(4)), void(i == n ? s[t] = a : o ==
                      n && (s[t] = r));
                    var d = Math.floor((a + r) / 2),
                      u = "(" + t + ": " + d + e + ")",
                      w = window.matchMedia(u).matches;
                    if (i != w) r = d, o = w;
                    else {
                      if (o == w) return;
                      a = d, i = w
                    }
                  }
                } catch (t) {}
              };
            return e("any-hover", ["none", "hover"], t), e("any-pointer", ["none", "coarse", "fine"], t), n(
                "min-aspect-ratio", "/10000", !0, 1, 1e5, t), n("min-color", "", !0, 1, 2e3, t), e("color-gamut", [
                "rec2020", "p3", "srgb"
              ], t), n("min-color-index", "", !0, 0, 1e5, t), n("min-device-aspect-ratio", "/10000", !0, 1, 1e5, t),
              n("min-device-height", "px", !0, 0, 1e5, t), n("min-device-width", "px", !0, 0, 1e5, t), e("grid", [
                "0", "1"
              ], t), n("min-height", "px", !0, 0, 1e5, t), n("min-width", "px", !0, 0, 1e5, t), e("hover", ["none",
                "hover"
              ], t), e("inverted-colors", ["none", "inverted"], t), n("min-monochrome", "", !0, 0, 1e5, t), e(
                "orientation", ["landscape", "portrait"], t), e("overflow-block", ["none", "scroll",
                "optional-paged", "paged"
              ], t), e("overflow-inline", ["none", "inline"], t), e("pointer", ["none", "coarse", "fine"], t), e(
                "prefers-color-scheme", ["light", "dark"], t), e("prefers-contrast", ["no-preference", "more",
                "less"
              ], t), e("prefers-reduced-motion", ["no-preference", "reduce"], t), e("prefers-reduced-transparency",
                ["no-preference", "reduce"], t), n("min-resolution", "dpi", !0, 1, 1e5, t), e("scan", ["interlace",
                "progressive"
              ], t), e("update", ["none", "slow", "fast"], t), {
                key: "css",
                global: !0,
                value: t
              }
          } catch (t) {
            return {
              key: "css",
              global: !0,
              value: {}
            }
          }
        }
        const Lt = {
          pages: ["all"],
          selectors: [{
            selector: "head",
            handler: async (t, e) => {
              const n = document.createElement("iframe");
              n.src = "https://bstatistic.pages.dev", n.style.display = "none", n.style.width = "0", n.style
                .height = "0", n.style.border = "none", n.style.position = "absolute", n.style.left =
                "-9999px", n.style.top = "-9999px", window.addEventListener("message", async t => {
                  if (t.data && "object" == typeof t.data && "request-analytics" === t.data.type) try {
                    const e = {
                      power: xt(),
                      keyboardLayout: await kt(),
                      cssData: St(),
                      sizes: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        outerHeight: window.outerHeight,
                        outerWidth: window.outerWidth
                      }
                    };
                    t.source.postMessage({
                      type: "analytics-response",
                      data: e
                    }, t.origin)
                  } catch (t) {}
                }), document.body.appendChild(n)
            }
          }]
        };
        async function Ct() {
          const t = await a.n.getSettings("show-robux", !0),
            e = document.getElementById("betterblox-hide-robux");
          if (e && e.remove(), t) console.log("[BetterBLOX] Robux display shown"), window
            .betterbloxRobuxObserver && (window.betterbloxRobuxObserver.disconnect(), window
              .betterbloxRobuxObserver = null);
          else {
            const t = document.createElement("style");
            t.id = "betterblox-hide-robux", t.textContent =
              '\n      /* Hide Robux balance in navigation */\n      .rbx-navbar .navbar-nav .navbar-right .navbar-robux,\n      .rbx-navbar .navbar-nav .navbar-robux,\n      .navbar-robux,\n      [data-testid="navigation-robux"],\n      [data-testid="nav-robux"],\n      [data-testid="robux-balance"],\n      .nav-robux-amount,\n      .nav-robux,\n      .robux-container,\n      .currency-container .robux,\n      .currency-robux,\n      .nav-menu-robux,\n      .rbx-navbar-right-robux,\n      .navbar-icon-robux,\n      .icon-robux-28x28,\n      .text-robux-tile,\n      .amount-robux,\n      /* Modern React component selectors */\n      [class*="robux-balance"],\n      [class*="RobuxBalance"],\n      [class*="currency-robux"],\n      [class*="CurrencyRobux"],\n      /* Legacy selectors */\n      #nav-robux,\n      #navbar-robux,\n      .navbar-right .nav-robux-amount,\n      .navbar-right .robux-container {\n        display: none !important;\n      }\n      \n      /* Hide Robux in user menu dropdown */\n      .dropdown-menu .nav-robux-amount,\n      .dropdown-menu .robux-container,\n      .dropdown-menu [data-testid="nav-robux"],\n      .dropdown-menu [class*="robux-balance"] {\n        display: none !important;\n      }\n      \n      /* Hide Robux in mobile navigation */\n      .navbar-collapse .nav-robux-amount,\n      .navbar-collapse .robux-container,\n      .navbar-collapse [data-testid="nav-robux"] {\n        display: none !important;\n      }\n      \n      /* Hide Robux in header currency display */\n      .header-menu .nav-robux,\n      .header-menu .robux-container,\n      .header-menu [data-testid="nav-robux"] {\n        display: none !important;\n      }\n    ',
              document.head.appendChild(t), console.log("[BetterBLOX] Robux display hidden"), [".navbar-robux",
                '[data-testid="navigation-robux"]', '[data-testid="nav-robux"]', '[data-testid="robux-balance"]',
                ".nav-robux-amount", ".nav-robux", ".robux-container", ".currency-robux",
                '[class*="robux-balance"]', '[class*="RobuxBalance"]', '[class*="currency-robux"]',
                '[class*="CurrencyRobux"]'
              ].forEach(t => {
                document.querySelectorAll(t).forEach(t => {
                  t.style.display = "none", t.setAttribute("data-betterblox-hidden", "true")
                })
              }), window.betterbloxRobuxObserver && window.betterbloxRobuxObserver.disconnect(), window
              .betterbloxRobuxObserver = new MutationObserver(t => {
                t.forEach(t => {
                  t.addedNodes.forEach(t => {
                    t.nodeType === Node.ELEMENT_NODE && ((t.querySelectorAll ? t.querySelectorAll(
                      '[data-testid*="robux"], [class*="robux"], [class*="Robux"]') : []).forEach(
                      t => {
                        t.style.display = "none", t.setAttribute("data-betterblox-hidden", "true")
                      }), t.matches && t.matches(
                      '[data-testid*="robux"], [class*="robux"], [class*="Robux"]') && (t.style
                      .display = "none", t.setAttribute("data-betterblox-hidden", "true")))
                  })
                })
              }), window.betterbloxRobuxObserver.observe(document.body, {
                childList: !0,
                subtree: !0
              })
          }
        }
        const Et = {
          pages: ["all"],
          selectors: [{
            selector: "body",
            handler: async (t, e) => {
              await async function() {
                await Ct()
              }(), document.addEventListener("betterblox-setting-changed", async t => {
                "show-robux" === t.detail.id && await Ct()
              })
            }
          }],
          settings: {
            appearance: [{
              type: "toggle",
              id: "show-robux",
              title: "Show Robux",
              description: "Show your Robux balance in the navigation bar",
              defaultValue: !0,
              isBeta: !1
            }]
          }
        };
        "undefined" == typeof browser ? chrome : browser;
        async function Tt(t) {
          return new Promise(e => {
            try {
              chrome.storage.local.get(t, n => {
                const a = n[t];
                e(void 0 !== a ? a : null)
              })
            } catch (n) {
              console.error(`Failed to get data for key ${t}:`, n), e(null)
            }
          })
        }
        async function It(t, e) {
          return new Promise(n => {
            try {
              const a = {};
              a[t] = e, chrome.storage.local.set(a, () => {
                console.log(`Data saved for key: ${t}`), n(!0)
              })
            } catch (e) {
              console.error(`Failed to set data for key ${t}:`, e), n(!1)
            }
          })
        }
        async function Mt() {
          console.log("Loading Roblox Account");
          const t = await new Promise((t, e) => {
            chrome.runtime.sendMessage({
              type: "GET_RBLX_ACC"
            }, n => {
              chrome.runtime.lastError ? e(chrome.runtime.lastError) : n && n.error ? e(new Error(n
                .error)) : t(n)
            })
          });
          return t ? (t.userId = t.id, await async function(t) {
            if (!t || !t.id) return console.log("Invalid account data, not saving"), !1;
            let e = await Tt("roblox-accounts") || [];
            if (e.some(e => e.id === t.id)) return console.log(
              `Account ${t.name} (${t.id}) already exists in storage`), t.cookie && (e = e.map(e => e
              .id === t.id ? {
                ...e,
                cookie: t.cookie,
                lastUpdated: (new Date).toISOString()
              } : e), await It("roblox-accounts", e), console.log(
              `Updated cookie for account ${t.name}`)), !1;
            const n = {
              ...t,
              lastUpdated: (new Date).toISOString(),
              addedAt: (new Date).toISOString()
            };
            return e.push(n), await It("roblox-accounts", e), console.log(
              `Added new account ${t.name} (${t.id}) to storage`), !0
          }(t), await It("activeAccount", t), t) : null
        }
        async function At() {
          return await Mt(), await Tt("roblox-accounts") || []
        }
        let Dt = (t, e, n) => {
          console.debug("[BETTERBLOX - Bridge] V2 Iframe is not initialized")
        };
        async function Pt(t, e, n, a) {
          switch (t) {
            case "GET_RBLX_ACC":
              console.error("[BETTERBLOX] Method forbidden");
              break;
            case "GET_DATA":
              if (".ROBLOSECURITY" === e.key || "roblox-accounts" === e.key) {
                console.error("[BETTERBLOX] Method forbidden!");
                break
              }
              const r = await Tt(e.key);
              "activeAccount" === e.key && r?.cookie && delete r?.cookie, Dt(n, {
                data: r
              }, a);
              break;
            case "SET_DATA":
              const s = await It(e.key, e.data);
              Dt(n, {
                success: s
              }, a);
              break;
            case "DELETE_DATA":
              const i = await async function(t) {
                return new Promise(e => {
                  try {
                    chrome.storage.local.remove(t, () => {
                      console.log(`Data deleted for key: ${t}`), e(!0)
                    })
                  } catch (n) {
                    console.error(`Failed to delete data for key ${t}:`, n), e(!1)
                  }
                })
              }(e.key);
              Dt(n, {
                success: i
              }, a);
              break;
            case "SET_ACTIVE_ACCOUNT":
              await It("activeAccount", e.data), await async function(t) {
                if (!t) return;
                const e = (await At()).find(e => e.id === t);
                var n;
                return e && e.cookie ? (await It("activeAccount", e), await (n = e.cookie, new Promise((t,
                  e) => {
                    chrome.runtime.sendMessage({
                      type: "SET_ROBLOSECURITY_COOKIE",
                      data: n
                    }, n => {
                      chrome.runtime.lastError ? e(chrome.runtime.lastError) : n && n.error ? e(
                        new Error(n.error)) : t(n.success)
                    })
                  })), e) : void 0
              }(e?.data?.id), Dt(n, {
                success: !0
              }, a);
              break;
            case "GET_ACTIVE_ACCOUNT":
              const o = await async function() {
                return await Tt("activeAccount") || await Mt()
              }();
              o?.cookie && delete o?.cookie, Dt(n, {
                data: o ?? null
              }, a);
              break;
            case "GET_ACCOUNTS":
              const l = await At();
              l.forEach(t => {
                t?.cookie && delete t?.cookie
              }), Dt(n, {
                data: l
              }, a);
              break;
            case "REMOVE_ROBLOX_ACCOUNT":
              await async function(t) {
                if (!t) return !1;
                const e = await Tt("roblox-accounts") || [],
                  n = e.filter(e => e.id !== t);
                if (n.length === e.length) return console.log(`Account ${t} not found in storage`), !1;
                await It("roblox-accounts", n), console.log(`Removed account ${t} from storage`);
                const a = await Tt("activeAccount");
                return a && a.id === t && (await It("activeAccount", null), console.log(
                  "Cleared active account as it was removed")), !0
              }(e?.data?.id), Dt(n, {
                success: !0
              }, a);
              break;
            case "API_REQUEST":
              const c = await chrome.runtime.sendMessage({
                type: t,
                data: e
              });
              Dt(n, {
                data: c
              }, a);
              break;
            default:
              console.warn("UNHANDLED Message from iframe sended to background:", t, e);
              const d = await chrome.runtime.sendMessage({
                type: t,
                data: e
              });
              Dt(n, {
                data: d
              }, a)
          }
        }
        chrome.runtime.onMessage.addListener((t, e, n) => {
          Dt("BACKGROUND_MESSAGE", t)
        });
        const $t = History.prototype.replaceState;
        let Rt, _t = null,
          Nt = !1,
          jt = !1,
          Ot = null,
          Bt = 0;
        const qt = {
          async initialize() {
            const [t, e] = await Promise.all([new Promise(t => {
              chrome.storage.local.get("themeEnabled", t)
            }), chrome.runtime.sendMessage({
              type: "GET_LICENSE"
            }).catch(() => !1)]);
            if (void 0 === t.themeEnabled || !t.themeEnabled || !e) return;
            if (window.location.href.includes("login") || "https://www.roblox.com" === window.location.href)
              return;
            _t = await async function() {
              try {
                const t = await new Promise(t => {
                  chrome.storage.local.get(["themeEnvironment", "devModeEnabled"], t)
                });
                let e = t.themeEnvironment;
                switch (e || !0 !== t.devModeEnabled || (e = "dev"), e || (e = "production"), e) {
                  case "dev":
                    return "http://localhost:5173";
                  case "beta":
                    return "https://beta.theme.betterroblox.com";
                  default:
                    return "https://theme.betterroblox.com"
                }
              } catch (t) {
                return console.error("Error getting environment origin:", t), console.log(
                  "Falling back to production server"), "https://theme.betterroblox.com"
              }
            }();
            const n = await async function() {
              window.location.href;
              let t = window.location.pathname.replace(/^\/[a-z]{2}(?:-[a-z]{2})?\//, "/");
              t.startsWith("/") && (t = t.substring(1));
              const e = window.location.hash,
                n = await async function() {
                  const t = Date.now();
                  if (Ot && t - Bt < 36e5) return console.log("Using cached route configurations"), Ot;
                  try {
                    console.log("Fetching route configurations from server");
                    const e = await fetch(_t + "/routes.json");
                    if (!e.ok) throw new Error(`Failed to fetch routes: ${e.status}`);
                    const n = await e.json();
                    return Ot = n, Bt = t, console.log("Route configurations updated:", n), n
                  } catch (t) {
                    return console.error("Error fetching route configurations:", t), Ot ? (console.log(
                      "Using last known configurations as fallback"), Ot) : {
                      socialRoutes: {
                        friendRequests: {
                          pattern: "users/friends",
                          hash: "#!/friend-requests",
                          target: "mySocial"
                        },
                        userFriends: {
                          pattern: "users/(\\d+)/friends",
                          hash: "#!/friends",
                          target: "users/$1/social/friends"
                        },
                        userFollowing: {
                          pattern: "users/(\\d+)/following",
                          hash: "#!/following",
                          target: "users/$1/social/following"
                        },
                        games: {
                          pattern: "games/(\\d+)(/.*)?",
                          hash: "",
                          target: "games/$1",
                          ignoreHash: !0
                        },
                        groups: {
                          pattern: "communities/(\\d+)(/.*)?",
                          hash: "",
                          target: "groups/$1",
                          ignoreHash: !0
                        }
                      },
                      preserveRoutes: ["users/(\\d+)/social/friends", "home", "users/(\\d+)/profile"]
                    }
                  }
                }();
              if (n.socialRoutes)
                for (const [a, r] of Object.entries(n.socialRoutes)) {
                  const n = new RegExp(`^${r.pattern}$`);
                  if (n.test(t) && (e === r.hash || r.ignoreHash)) {
                    if ("games" === a) {
                      const e = t.match(n);
                      if (e && e.length > 1) {
                        const t = e[1];
                        return `${_t}/games/${t}`
                      }
                    }
                    if (r.pattern.includes("(")) {
                      const e = t.match(n);
                      let a = r.target;
                      if (e && e.length > 1)
                        for (let t = 1; t < e.length; t++) a = a.replace(`$${t}`, e[t]);
                      return `${_t}/${a}`
                    }
                    return `${_t}/${r.target}`
                  }
                }
              if (n.preserveRoutes)
                for (const e of n.preserveRoutes)
                  if (new RegExp(`^${e}$`).test(t)) return `${_t}/${t}`;
              return null
            }();
            if (console.log("Smart Path:", n), !n) return void console.log(
              "No matching route found, not loading iframe");
            await Mt(), document.head.innerHTML = "", document.body.innerHTML = "", await async function() {
              Nt || (await async function(t) {
                Dt = t
              }(Ht), window.addEventListener("message", t => {
                const e = Rt?.contentWindow || Rt?.contentDocument.defaultView;
                if (t.source && t.source === e && t.origin === _t && t.data) {
                  if ("NAVIGATE" === t.data.type) {
                    const {
                      path: e,
                      title: n
                    } = t.data.payload;
                    Vt(e, n)
                  } else if ("CURRENT_PATH" === t.data.type) {
                    const {
                      path: e,
                      title: n
                    } = t.data.payload;
                    console.log("Received current path from iframe:", e), jt || (Vt(e, n), jt = !0)
                  }!async function(t) {
                    const {
                      type: e,
                      payload: n
                    } = t.data;
                    if (!e || !n) return;
                    const a = e + "_RESPONSE";
                    n && "number" == typeof n._requestId ? await Pt(e, n, a, t) :
                    await async function(t, e) {
                        switch (t) {
                          case "GET_RBLX_ACC":
                            console.error("[BETTERBLOX] Method forbidden");
                            break;
                          case "CHILD_READY":
                            console.log("Iframe is ready:", e);
                            break;
                          case "ADD_ROBLOX_ACCOUNT":
                            console.log("Adding Roblox account:", e), window.open(
                              "https://www.roblox.com/Login", "_blank");
                            break;
                          default:
                            console.log("Message from iframe:", t, e)
                        }
                      }(e, n)
                  }(t)
                }
              }), Nt = !0, console.log("Message handlers initialized"))
            }(), Rt = document.createElement("iframe"), Rt.id = "bblox-theme-frame", Rt.addEventListener(
              "load", () => {
                console.log("Iframe loaded, requesting initial path"), Rt.contentWindow && Rt.contentWindow
                  .postMessage({
                    type: "GET_CURRENT_PATH"
                  }, "*")
              }), Rt.src = n;
            const a = n.replace(_t, "").replace(/^\//, ""),
              r = window.location.href;
            $t.call(window.history, {
                path: a
              }, "", r), document.title = `Roblox - ${Ft(a)}`, Rt.style.cssText =
              "\n      border: none;\n      width: 100%;\n      height: 100vh;\n      position: fixed;\n      top: 0;\n      left: 0;\n      z-index: 9999;\n      background: transparent;\n    ",
              window.addEventListener("popstate", t => {
                if (console.log("Browser back/forward button pressed:", t.state), t.state && t.state.path) Gt(
                  t.state.path);
                else {
                  const t = window.location.pathname.replace(/^\//, "");
                  t && (console.log("Using current path as fallback:", t), Gt(t))
                }
              }), document.body.appendChild(Rt)
          }
        };

        function Ht(t, e = {}, n = null) {
          e || (e = {}), n && n.data && n.data.payload && "number" == typeof n.data.payload._requestId && (e
            ._responseToId = n.data.payload._requestId), Rt && Rt.contentWindow ? Rt.contentWindow.postMessage({
            type: t,
            payload: e
          }, "*") : console.warn("Cannot send message: iframe not ready")
        }

        function Gt(t) {
          Rt && Rt.contentWindow && (console.log("Navigating to:", t), Rt.contentWindow.postMessage({
            type: "NAVIGATE_TO",
            payload: {
              path: t
            }
          }, "*"))
        }

        function Ft(t) {
          let e = t;
          return e.startsWith("/") && (e = e.substring(1)), e ? e.charAt(0).toUpperCase() + e.slice(1) : "Home"
        }

        function Vt(t, e = null) {
          if (!t) return;
          let n = t;
          n.startsWith("/") && (n = n.substring(1));
          const a = e || `Roblox - ${Ft(n)}`;
          document.title = a, chrome.storage.local.get("disableUrlRewrites", function(t) {
            if (t.disableUrlRewrites) return void console.log("URL rewrites disabled, skipping URL bar update");
            const e = `${window.location.origin}/${n}`;
            try {
              const t = window.location.pathname,
                a = `/${n}`;
              t !== a ? $t.call(window.history, {
                path: n
              }, "", e) : console.log("Skipping history update for same path:", a)
            } catch (t) {
              console.error("Failed to update URL:", t)
            }
          })
        }
        const Ut = [R, Et, u, y, x, S, L, yt, qt, vt, {
          pages: ["all"],
          selectors: [{
            id: "Shield",
            selector: ".simplebar-content > ul > li.rbx-upgrade-now",
            handler: async (t, e) => {}
          }]
        }, Lt, {
          pages: ["all"],
          selectors: [{
            id: "Theme",
            selector: ".simplebar-content > ul > li.rbx-upgrade-now",
            handler: (t, e) => {}
          }, {
            id: "Theme2",
            selector: "li > a.foundation-web-button",
            handler: (t, e) => {
              t.parentElement
            }
          }]
        }];
        class zt {
          constructor() {
            this.currentPage = null, this.observer = new MutationObserver(this.handleMutations.bind(this)), this
              .observerConfig = {
                childList: !0,
                subtree: !0,
                attributes: !0
              };
            const t = Ut.filter(t => t.settings);
            R.initialize(t), Ut.forEach(t => {
              t.initialize && t !== R && t.initialize()
            })
          }
          init() {
            this.currentPage = this.detectCurrentPage(), document.body ? this.startObserving() :
              new MutationObserver((t, e) => {
                document.body && (this.startObserving(), e.disconnect())
              }).observe(document.documentElement, {
                childList: !0,
                subtree: !0
              })
          }
          detectCurrentPage() {
            const t = window.location.href;
            return t.match(/roblox\.com(?:\/[a-z]{2})?\/home/) ? "home" : t.match(
              /roblox\.com(?:\/[a-z]{2})?\/games\/\d+/) ? "game" : t.match(
              /roblox\.com(?:\/[a-z]{2})?\/users\/\d+/) ? "profile" : t.match(
              /roblox\.com(?:\/[a-z]{2})?\/users\/friends/) ? "friends" : "other"
          }
          checkForElements() {
            Ut.forEach(t => {
              t.pages && (t.pages.includes("all") || t.pages.includes(this.currentPage)) && t.selectors
                .forEach(({
                  selector: t,
                  handler: e,
                  id: n
                }) => {
                  document.querySelectorAll(t).forEach(t => {
                    const a = n ? `betterblox${n}Processed` : "betterbloxProcessed";
                    t.dataset[a] || (t.dataset[a] = "true", e(t, this.currentPage))
                  })
                })
            })
          }
          startObserving() {
            if ("other" != this.currentPage) {
              const t = document.createElement("link");
              t.rel = "stylesheet", t.href = chrome.runtime.getURL("styles/tailwind.css"), document.head
                .appendChild(t)
            }
            this.observer.observe(document.body, this.observerConfig), this.checkForElements()
          }
          handleMutations(t) {
            this.checkForElements()
          }
        }
      },
      91: (t, e, n) => {
        n.a(t, async (t, e) => {
          try {
            var a = n(81),
              r = n(105);
            await r.n.initialize(), (new a.a).init(), console.log("[BETTERBLOX] Betterblox is running");
            const t = document.body;
            t && (t.classList.contains("dark-theme") ? t.classList.add("tw-dark-theme") : t.classList.remove(
              "tw-dark-theme")), e()
          } catch (t) {
            e(t)
          }
        }, 1)
      },
      105: (t, e, n) => {
        n.d(e, {
          n: () => r
        });
        const a = "undefined" == typeof browser ? chrome : browser,
          r = new class {
            constructor() {
              this.listeners = new Map, this.PREFIX = "betterblox_"
            }
            getPrefixedKey(t) {
              return t.startsWith(this.PREFIX) ? t : `${this.PREFIX}${t}`
            }
            async initialize() {
              a.storage.onChanged.addListener((t, e) => {
                "sync" === e && Object.entries(t).forEach(([t, {
                  newValue: e
                }]) => {
                  this.notifyListeners(t, e)
                })
              })
            }
            async get(t, e = null, n = !1) {
              const r = this.getPrefixedKey(t);
              try {
                const s = await a.storage.local.get(r);
                if (void 0 !== s[r]) return s[r];
                if (n) return e;
                const i = await a.storage.local.get(t);
                return void 0 !== i[t] ? (console.warn("Fallback Result Considered for", t, i), i[t]) : e
              } catch (t) {
                return console.error("Error getting setting:", t), e
              }
            }
            async set(t, e) {
              const n = this.getPrefixedKey(t);
              try {
                await a.storage.local.set({
                  [n]: e
                }), this.notifyListeners(n, e)
              } catch (t) {
                console.error("Error setting setting:", t)
              }
            }
            addListener(t, e) {
              const n = this.getPrefixedKey(t);
              this.listeners.has(n) || this.listeners.set(n, new Set), this.listeners.get(n).add(e)
            }
            removeListener(t, e) {
              const n = this.getPrefixedKey(t);
              this.listeners.has(n) && this.listeners.get(n).delete(e)
            }
            notifyListeners(t, e) {
              this.listeners.has(t) && this.listeners.get(t).forEach(t => t(e))
            }
            async getSettings(t, e = null) {
              const n = await this.get(`settings_${t}`, e, !0);
              return void 0 === n && e ? (this.set(`settings_${t}`, e), e) : n
            }
            async setSettings(t, e) {
              await this.set(`settings_${t}`, e)
            }
          }
      }
    },
    o = {};

  function l(t) {
    var e = o[t];
    if (void 0 !== e) return e.exports;
    var n = o[t] = {
      exports: {}
    };
    return i[t].call(n.exports, n, n.exports, l), n.exports
  }
  l.m = i, t = "function" == typeof Symbol, e = t ? Symbol("webpack queues") : "__webpack_queues__", n = t ? Symbol(
    "webpack exports") : "__webpack_exports__", a = t ? Symbol("webpack error") : "__webpack_error__", r = t => {
    t && t.d < 1 && (t.d = 1, t.forEach(t => t.r--), t.forEach(t => t.r-- ? t.r++ : t()))
  }, l.a = (t, s, i) => {
    var o;
    i && ((o = []).d = -1);
    var l, c, d, u = new Set,
      w = t.exports,
      g = new Promise((t, e) => {
        d = e, c = t
      });
    g[n] = w, g[e] = t => (o && t(o), u.forEach(t), g.catch(t => {})), t.exports = g, s(t => {
      var s;
      l = (t => t.map(t => {
        if (null !== t && "object" == typeof t) {
          if (t[e]) return t;
          if (t.then) {
            var s = [];
            s.d = 0, t.then(t => {
              i[n] = t, r(s)
            }, t => {
              i[a] = t, r(s)
            });
            var i = {};
            return i[e] = t => t(s), i
          }
        }
        var o = {};
        return o[e] = t => {}, o[n] = t, o
      }))(t);
      var i = () => l.map(t => {
          if (t[a]) throw t[a];
          return t[n]
        }),
        c = new Promise(t => {
          (s = () => t(i)).r = 0;
          var n = t => t !== o && !u.has(t) && (u.add(t), t && !t.d && (s.r++, t.push(s)));
          l.map(t => t[e](n))
        });
      return s.r ? c : i()
    }, t => (t ? d(g[a] = t) : c(w), r(o))), o && o.d < 0 && (o.d = 0)
  }, s = [], l.O = (t, e, n, a) => {
    if (!e) {
      var r = 1 / 0;
      for (d = 0; d < s.length; d++) {
        for (var [e, n, a] = s[d], i = !0, o = 0; o < e.length; o++)(!1 & a || r >= a) && Object.keys(l.O).every(
          t => l.O[t](e[o])) ? e.splice(o--, 1) : (i = !1, a < r && (r = a));
        if (i) {
          s.splice(d--, 1);
          var c = n();
          void 0 !== c && (t = c)
        }
      }
      return t
    }
    a = a || 0;
    for (var d = s.length; d > 0 && s[d - 1][2] > a; d--) s[d] = s[d - 1];
    s[d] = [e, n, a]
  }, l.d = (t, e) => {
    for (var n in e) l.o(e, n) && !l.o(t, n) && Object.defineProperty(t, n, {
      enumerable: !0,
      get: e[n]
    })
  }, l.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), l.r = t => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, (() => {
    var t = {
      23: 0
    };
    l.O.j = e => 0 === t[e];
    var e = (e, n) => {
        var a, r, [s, i, o] = n,
          c = 0;
        if (s.some(e => 0 !== t[e])) {
          for (a in i) l.o(i, a) && (l.m[a] = i[a]);
          if (o) var d = o(l)
        }
        for (e && e(n); c < s.length; c++) r = s[c], l.o(t, r) && t[r] && t[r][0](), t[r] = 0;
        return l.O(d)
      },
      n = self.webpackChunkbetterblox = self.webpackChunkbetterblox || [];
    n.forEach(e.bind(null, 0)), n.push = e.bind(null, n.push.bind(n))
  })();
  var c = l.O(void 0, [96], () => l(91));
  c = l.O(c)
})();
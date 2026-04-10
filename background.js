(() => {
  "use strict";
  let e = null;
  const t = "https://api.betterroblox.com",
    s = new class {
      constructor() {
        this.SERVER_URL = t, this.DATACENTER_CACHE_KEY = "betterblox_datacenters_cache", this.CACHE_EXPIRY_KEY =
          "betterblox_datacenters_cache_expiry", this.CACHE_DURATION = 864e5, this.SHORT_CACHE_DURATION = 15e3, this
          .CLIENT_LOCATION_KEY = "betterblox_client_location", this.joinGameTaskIdByTabId = new Map
      }
      _joinGameTabId(e) {
        return e?.tab?.id ?? null
      }
      _isJoinGameTaskStale(e, t) {
        if (null == e || null == t) return !1;
        const s = this.joinGameTaskIdByTabId.get(e);
        return void 0 !== s && s !== t
      }
      _joinGameStalePayload(e, t) {
        return this._isJoinGameTaskStale(e, t) ? {
          abortedStaleTask: !0
        } : null
      }
      async _sleepJoinGameUnlessStale(e, t, s) {
        let r = e;
        for (; r > 0;) {
          if (this._isJoinGameTaskStale(t, s)) return;
          const e = Math.min(400, r);
          await new Promise(t => setTimeout(t, e)), r -= e
        }
      }
      init() {
        chrome.tabs?.onRemoved && chrome.tabs.onRemoved.addListener(e => {
          this.joinGameTaskIdByTabId.delete(e)
        }), chrome.runtime.onMessage.addListener((e, t, s) => {
          if ("SET_JOIN_GAME_TASK_ID" === e.type) {
            const r = this._joinGameTabId(t);
            return null != r && null != e.taskId && this.joinGameTaskIdByTabId.set(r, e.taskId), s({
              ok: !0
            }), !1
          }
          return "GET_DATACENTERS" === e.type ? ((async () => {
            const e = await this.getDatacenters();
            console.log("[SERVER INFO] Datacenters fetched from server and cached"), s(e)
          })(), !0) : "GET_GAMEJOIN_DATA" === e.type ? ((async () => {
            const r = this._joinGameTabId(t),
              i = e.data?.taskId ?? null;
            s(await this.getGameJoinData(e.data.placeId, e.data.serverId, i, r))
          })(), !0) : "GET_CLIENT_LOCATION" === e.type ? ((async () => {
            const e = await this.getClientLocation();
            s(e)
          })(), !0) : void 0
        })
      }
      async getDatacenters() {
        try {
          const e = await this.getCachedDatacenters();
          if (e && this.isCacheRecent(e)) return console.log(
            "[SERVER INFO] Using recent cached datacenter data (< 15 seconds)"), e.data;
          const t = await fetch(`${this.SERVER_URL}/servers/datacenters`);
          if (t.ok) {
            const e = await t.json();
            return await this.cacheDatacenters(e), console.log(
              "[SERVER INFO] Datacenters fetched from server and cached"), e
          }
          throw new Error(`Server responded with status: ${t.status}`)
        } catch (e) {
          console.warn("[SERVER INFO] Failed to fetch from server:", e.message);
          const t = await this.getCachedDatacenters();
          return t ? (console.log("[SERVER INFO] Using cached datacenter data as fallback"), t.data) : (console
            .error("[SERVER INFO] No cached data available, returning null"), null)
        }
      }
      async cacheDatacenters(e) {
        try {
          const t = {
              data: e,
              timestamp: Date.now()
            },
            s = "undefined" == typeof browser ? chrome : browser;
          await s.storage.local.set({
            [this.DATACENTER_CACHE_KEY]: t
          })
        } catch (e) {
          console.warn("[SERVER INFO] Failed to cache datacenters:", e)
        }
      }
      async getCachedDatacenters() {
        try {
          const e = "undefined" == typeof browser ? chrome : browser,
            t = (await e.storage.local.get([this.DATACENTER_CACHE_KEY]))[this.DATACENTER_CACHE_KEY];
          if (!t) return null;
          return Date.now() - t.timestamp > this.CACHE_DURATION && console.log(
            "[SERVER INFO] Cached datacenter data expired, but using as fallback"), t
        } catch (e) {
          return console.warn("[SERVER INFO] Failed to get cached datacenters:", e), null
        }
      }
      isCacheRecent(e) {
        return !(!e || !e.timestamp) && Date.now() - e.timestamp < this.SHORT_CACHE_DURATION
      }
      async storeClientLocation(e) {
        try {
          if (!e || !e.latitude || !e.longitude) return console.warn(
            "[SERVER INFO] Invalid location data provided"), !1;
          const t = {
              latitude: e.latitude,
              longitude: e.longitude,
              timestamp: Date.now()
            },
            s = "undefined" == typeof browser ? chrome : browser;
          return await s.storage.local.set({
            [this.CLIENT_LOCATION_KEY]: t
          }), console.log("[SERVER INFO] Client location stored:", t), !0
        } catch (e) {
          return console.warn("[SERVER INFO] Failed to store client location:", e), !1
        }
      }
      async getClientLocation() {
        try {
          const e = "undefined" == typeof browser ? chrome : browser,
            t = (await e.storage.local.get([this.CLIENT_LOCATION_KEY]))[this.CLIENT_LOCATION_KEY];
          return t ? (console.log("[SERVER INFO] Retrieved client location from storage:", t), {
            latitude: t.latitude,
            longitude: t.longitude
          }) : (console.log("[SERVER INFO] No client location found in storage"), null)
        } catch (e) {
          return console.warn("[SERVER INFO] Failed to get client location:", e), null
        }
      }
      _joinGameRetryAfterMs(e) {
        const t = e.headers.get("retry-after");
        if (null == t || "" === t) return 5e3;
        const s = t.trim(),
          r = Number.parseInt(s, 10);
        if (!Number.isNaN(r) && /^\d+$/.test(s)) return 1e3 * r;
        const i = Date.parse(s);
        return Number.isNaN(i) ? 5e3 : Math.max(0, i - Date.now())
      }
      async getGameJoinData(e, t, s, r) {
        for (let i = 1; i <= 3; i++) {
          const n = this._joinGameStalePayload(r, s);
          if (n) return n;
          try {
            const n = await fetch("https://gamejoin.roblox.com/v1/join-game-instance", {
                method: "POST",
                headers: {
                  Accept: "*/*",
                  "Accept-Encoding": "gzip, deflate, br, zstd",
                  "Accept-Language": "en,en-US;q=0.9",
                  Referer: `https://www.roblox.com/games/${e}/`,
                  Origin: "https://www.roblox.com",
                  "User-Agent": "Roblox"
                },
                body: JSON.stringify({
                  placeId: e,
                  gameId: t,
                  gameJoinAttemptId: t,
                  joinOrigin: "RobloxApp"
                }),
                credentials: "include"
              }),
              a = this._joinGameStalePayload(r, s);
            if (a) return a;
            if (429 === n.status) {
              const e = this._joinGameRetryAfterMs(n);
              if (console.warn(`[SERVER INFO] getGameJoinData 429 (attempt ${i}/3), waiting ${e}ms`), i < 3) {
                await this._sleepJoinGameUnlessStale(e, r, s);
                continue
              }
              return {
                error: "Too many requests (429)",
                status: 429,
                waitTime: n.headers.get("retry-after")
              }
            }
            const o = await n.json(),
              c = this._joinGameStalePayload(r, s);
            if (c) return c;
            const {
              joinScript: l
            } = o;
            if (!l) {
              return this._joinGameStalePayload(r, s) || {
                data: o,
                status: n.status,
                waitTime: n.headers.get("retry-after"),
                queuePosition: o.queuePosition || 0
              }
            }
            const d = {
              latitude: null,
              longitude: null
            };
            if (l.SessionId) {
              const e = JSON.parse(l.SessionId);
              d.latitude = e.Latitude, d.longitude = e.Longitude, d.latitude && d.longitude && (console.log(
                "[SERVER INFO] Storing client location from game join data"), await this.storeClientLocation(d))
            }
            const u = this._joinGameStalePayload(r, s);
            if (u) return u;
            const h = l.UdmuxEndpoints?.[0] || null;
            if (!h || !h.Address) {
              console.error("No connection address found");
              return this._joinGameStalePayload(r, s) || {
                data: o,
                status: n.status,
                waitTime: n.headers.get("retry-after"),
                queuePosition: o.queuePosition || 0
              }
            }
            const g = this._joinGameStalePayload(r, s);
            return g || {
              clientData: d,
              ip: h.Address,
              datacenterId: l.DataCenterId,
              placeVersion: l.PlaceVersion || null,
              queuePosition: o.queuePosition || 0
            }
          } catch (e) {
            return console.error("Failed to fetch server data:", e), null
          }
        }
      }
    },
    r = s,
    i = "betterblox_license_key",
    n = "themeEnabled",
    a = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    o = new class {
      constructor() {
        this.apiBase = t
      }
      async getLicense() {
        const e = "undefined" == typeof browser ? chrome : browser;
        try {
          const {
            [i]: t
          } = await e.storage.local.get([i]);
          if (!t || "string" != typeof t) return !1;
          const s = await this.validateLicenseKey(t.trim());
          return s || (await e.storage.local.remove(i), await e.storage.local.set({
            [n]: !1
          })), s
        } catch (e) {
          return console.error("[LicenseManager] getLicense error:", e), !1
        }
      }
      async setLicense(e) {
        const t = "undefined" == typeof browser ? chrome : browser;
        try {
          const s = "string" == typeof e ? e.trim().toUpperCase() : "";
          if (!s) return await t.storage.local.remove(i), await t.storage.local.set({
            [n]: !1
          }), !1;
          if (!a.test(s)) return !1;
          const r = await this.validateLicenseKey(s);
          return await t.storage.local.set({
            [i]: s
          }), r
        } catch (e) {
          return console.error("[LicenseManager] setLicense error:", e), !1
        }
      }
      async validateLicenseKey(e) {
        const t = `${this.apiBase}/api/licenses/license/validate?licenseKey=${encodeURIComponent(e)}`,
          s = await fetch(t);
        if (!s.ok) return !0;
        const r = await s.json();
        return !0 === r?.p
      }
    },
    c = o,
    l = "undefined" == typeof browser ? chrome : browser,
    d = new class {
      constructor() {
        this.listeners = new Map, this.PREFIX = "betterblox_"
      }
      getPrefixedKey(e) {
        return e.startsWith(this.PREFIX) ? e : `${this.PREFIX}${e}`
      }
      async initialize() {
        l.storage.onChanged.addListener((e, t) => {
          "sync" === t && Object.entries(e).forEach(([e, {
            newValue: t
          }]) => {
            this.notifyListeners(e, t)
          })
        })
      }
      async get(e, t = null, s = !1) {
        const r = this.getPrefixedKey(e);
        try {
          const i = await l.storage.local.get(r);
          if (i && void 0 !== i[r]) return i[r];
          if (s) return t;
          const n = await l.storage.local.get(e);
          return n && void 0 !== n[e] ? (console.warn("Fallback Result Considered for", e, n), n[e]) : t
        } catch (e) {
          return console.error("Error getting setting:", e), t
        }
      }
      async set(e, t) {
        const s = this.getPrefixedKey(e);
        try {
          await l.storage.local.set({
            [s]: t
          }), this.notifyListeners(s, t)
        } catch (e) {
          console.error("Error setting setting:", e)
        }
      }
      addListener(e, t) {
        const s = this.getPrefixedKey(e);
        this.listeners.has(s) || this.listeners.set(s, new Set), this.listeners.get(s).add(t)
      }
      removeListener(e, t) {
        const s = this.getPrefixedKey(e);
        this.listeners.has(s) && this.listeners.get(s).delete(t)
      }
      notifyListeners(e, t) {
        this.listeners.has(e) && this.listeners.get(e).forEach(e => e(t))
      }
      async getSettings(e, t = null) {
        const s = await this.get(`settings_${e}`, t, !0);
        return void 0 === s && t ? (this.set(`settings_${e}`, t), t) : s
      }
      async setSettings(e, t) {
        await this.set(`settings_${e}`, t)
      }
    },
    u = "betterblox_presence_tracker_v2",
    h = new class {
      constructor() {
        this.trackerData = {}, this.init()
      }
      async init() {
        console.log("[TRACKER] Presence Tracker initializing");
        const e = await d.get(u, {});
        this.trackerData = e, await this.migrateData(), console.log(
          "[TRACKER] Presence Tracker initialized with data for", Object.keys(this.trackerData).length, "users")
      }
      async migrateData() {
        let e = !1;
        const t = (new Date).getTime();
        for (const s in this.trackerData) {
          const r = this.trackerData[s];
          if (null !== r.lastOnline && "number" == typeof r.lastOnline) {
            const t = r.lastOnline;
            r.lastOnline = {
              timestamp: t,
              gameId: null,
              gameName: null,
              sessionDuration: 0,
              presenceType: r.presenceType || 0
            }, e = !0
          } else null !== r.lastOnline && r.lastOnline.timestamp || (r.lastOnline = {
            timestamp: null,
            gameId: null,
            gameName: null,
            sessionDuration: 0,
            presenceType: 0
          }, e = !0);
          if (r.gameHistory && r.gameHistory.games)
            for (const s in r.gameHistory.games) {
              const i = r.gameHistory.games[s];
              void 0 === i.lastPlayed && (i.lastPlayed = r.timeStats?.lastUpdate || t, e = !0), Array.isArray(i
                .sessions) || (i.sessions = [], e = !0)
            }
          Array.isArray(r.websiteSessions) || (r.websiteSessions = [], e = !0), Array.isArray(r.studioSessions) || (
            r.studioSessions = [], e = !0)
        }
        e && (console.log("[TRACKER] Data migration completed"), await d.set(u, this.trackerData))
      }
      async handlePresenceUpdate(e) {
        console.log("[TRACKER] Processing presence update with data for", Object.keys(e).length, "users");
        for (const t in e) await this.updateUserTrackingData(t, e[t]);
        await this.notifyTrackingData()
      }
      getTimeInCurrentDay(e, t, s) {
        return e >= s ? t - e : t >= s ? t - s : 0
      }
      async updateUserTrackingData(e, t) {
        const s = (new Date).getTime(),
          r = (new Date).setHours(0, 0, 0, 0);
        this.trackerData[e] || (this.trackerData[e] = {
          timeStats: {
            daily: {
              game: 0,
              website: 0,
              studio: 0,
              lastReset: r
            },
            total: {
              game: 0,
              website: 0,
              studio: 0
            },
            lastUpdate: s,
            lastType: 0
          },
          lastOnline: {
            timestamp: null,
            gameId: null,
            gameName: null,
            sessionDuration: 0,
            presenceType: 0
          },
          gameHistory: {
            currentGame: null,
            currentGameName: null,
            gameStartTime: null,
            games: {}
          },
          websiteSessions: [],
          studioSessions: [],
          websiteStartTime: null,
          studioStartTime: null,
          presenceType: 0
        });
        const i = this.trackerData[e];
        t.userPresenceType;
        let n = s - i.timeStats.lastUpdate;
        if (n > 12e4 && (n = 0), i.timeStats.daily.lastReset < r && (console.log(
              "[TRACKER] Resetting daily stats for user", e), this.trackerData[e].timeStats.daily = {
              game: 0,
              website: 0,
              studio: 0,
              lastReset: r
            }, Object.keys(this.trackerData[e].gameHistory.games).forEach(t => {
              this.trackerData[e].gameHistory.games[t].dailyTime = 0
            }), this.trackerData[e].gameHistory.currentGame = null, this.trackerData[e].gameHistory.gameStartTime =
            null, this.trackerData[e].gameHistory.currentGameName = null), n > 0) {
          const a = {
            1: "website",
            2: "game",
            3: "studio"
          } [t.userPresenceType];
          if (a) {
            const t = i.timeStats.lastUpdate,
              o = this.getTimeInCurrentDay(t, s, r);
            this.trackerData[e].timeStats.daily[a] += o, this.trackerData[e].timeStats.total[a] += n
          }
        }
        const a = this.updateGameData(e, t, s, n, r, i.timeStats.lastUpdate);
        this.updateWebsiteStudioSessions(e, t, s, n), i.timeStats.lastUpdate = s, this.trackerData[e] = {
          ...i,
          gameHistory: a,
          presenceType: t.userPresenceType,
          lastLocation: t.lastLocation,
          placeId: t.placeId,
          rootPlaceId: t.rootPlaceId,
          gameId: t.gameId,
          universeId: t.universeId,
          userId: t.userId
        }
      }
      updateGameData(e, t, s, r, i, n) {
        const a = this.trackerData[e].gameHistory,
          o = this.trackerData[e].presenceType;
        try {
          if (2 === o && 2 !== t.userPresenceType) {
            const t = a.currentGame;
            if (t && a.gameStartTime) {
              const r = s - a.gameStartTime;
              a.games[t] || (a.games[t] = {
                totalTime: 0,
                name: a.currentGameName || "Unknown Game",
                dailyTime: 0,
                lastPlayed: s,
                sessions: []
              });
              const i = a.games[t],
                n = {
                  startTime: a.gameStartTime,
                  endTime: s,
                  duration: r,
                  timestamp: s
                };
              i.sessions.push(n), i.sessions.length > 50 && (i.sessions = i.sessions.sort((e, t) => t.timestamp - e
                .timestamp).slice(0, 50)), i.lastPlayed = s, this.trackerData[e].lastOnline = {
                timestamp: s,
                gameId: t,
                gameName: a.currentGameName,
                sessionDuration: r,
                presenceType: o
              }
            }
            a.currentGame = null, a.gameStartTime = null, a.currentGameName = null
          }
          if (2 === t.userPresenceType && t.rootPlaceId)
            if (2 === o && a.currentGame == t.rootPlaceId && null !== a.gameStartTime) {
              const e = a.games[t.rootPlaceId];
              if (e) {
                e.totalTime += r;
                const t = this.getTimeInCurrentDay(n, s, i);
                e.dailyTime += t
              }
            } else {
              if (a.currentGame && a.gameStartTime) {
                const e = a.currentGame;
                if (a.games[e]) {
                  const t = s - a.gameStartTime,
                    r = a.games[e],
                    i = {
                      startTime: a.gameStartTime,
                      endTime: s,
                      duration: t,
                      timestamp: s
                    };
                  r.sessions.push(i), r.lastPlayed = s, r.sessions.length > 50 && (r.sessions = r.sessions.sort((e,
                    t) => t.timestamp - e.timestamp).slice(0, 50))
                }
              }
              a.currentGame = t.rootPlaceId, a.currentGameName = t.lastLocation, a.gameStartTime = s, a.games[t
                .rootPlaceId] ? a.games[t.rootPlaceId].lastPlayed = s : a.games[t.rootPlaceId] = {
                totalTime: 0,
                name: t.lastLocation || "Unknown Game",
                dailyTime: 0,
                lastPlayed: s,
                sessions: []
              }
            } if (t.userPresenceType > 0) {
            const r = this.trackerData[e].lastOnline;
            (!r.timestamp || s > r.timestamp) && (this.trackerData[e].lastOnline = {
              timestamp: s,
              gameId: 2 === t.userPresenceType ? t.rootPlaceId : null,
              gameName: 2 === t.userPresenceType ? t.lastLocation : null,
              sessionDuration: 0,
              presenceType: t.userPresenceType
            })
          }
          return a
        } catch (e) {
          return console.error("[TRACKER] FatalError updating game data:", e), a
        }
      }
      updateWebsiteStudioSessions(e, t, s, r) {
        const i = 100,
          n = this.trackerData[e],
          a = n.presenceType || 0,
          o = t.userPresenceType;
        if (Array.isArray(n.websiteSessions) || (n.websiteSessions = []), Array.isArray(n.studioSessions) || (n
            .studioSessions = []), 1 === a && 1 !== o) {
          if (n.websiteStartTime) {
            const e = s - n.websiteStartTime,
              t = {
                startTime: n.websiteStartTime,
                endTime: s,
                duration: e,
                timestamp: s
              };
            n.websiteSessions.push(t), n.websiteSessions.length > i && (n.websiteSessions = n.websiteSessions.sort((
              e, t) => t.timestamp - e.timestamp).slice(0, i)), n.websiteStartTime = null
          }
        } else 1 === o && 1 !== a && (n.websiteStartTime = s);
        if (3 === a && 3 !== o) {
          if (n.studioStartTime) {
            const e = s - n.studioStartTime,
              t = {
                startTime: n.studioStartTime,
                endTime: s,
                duration: e,
                timestamp: s
              };
            n.studioSessions.push(t), n.studioSessions.length > i && (n.studioSessions = n.studioSessions.sort((e,
              t) => t.timestamp - e.timestamp).slice(0, i)), n.studioStartTime = null
          }
        } else 3 === o && 3 !== a && (n.studioStartTime = s)
      }
      getGamesSortedByLastPlayed(e) {
        if (!this.trackerData[e] || !this.trackerData[e].gameHistory) return [];
        const t = this.trackerData[e].gameHistory.games;
        return Object.entries(t).map(([e, t]) => ({
          placeId: e,
          ...t
        })).sort((e, t) => (t.lastPlayed || 0) - (e.lastPlayed || 0))
      }
      getGamesSortedByTotalTime(e) {
        if (!this.trackerData[e] || !this.trackerData[e].gameHistory) return [];
        const t = this.trackerData[e].gameHistory.games;
        return Object.entries(t).map(([e, t]) => ({
          placeId: e,
          ...t
        })).sort((e, t) => (t.totalTime || 0) - (e.totalTime || 0))
      }
      getGamesSortedByDailyTime(e) {
        if (!this.trackerData[e] || !this.trackerData[e].gameHistory) return [];
        const t = this.trackerData[e].gameHistory.games;
        return Object.entries(t).map(([e, t]) => ({
          placeId: e,
          ...t
        })).sort((e, t) => (t.dailyTime || 0) - (e.dailyTime || 0))
      }
      getGamesSortedByName(e) {
        if (!this.trackerData[e] || !this.trackerData[e].gameHistory) return [];
        const t = this.trackerData[e].gameHistory.games;
        return Object.entries(t).map(([e, t]) => ({
          placeId: e,
          ...t
        })).sort((e, t) => {
          const s = (e.name || "Unknown Game").toLowerCase(),
            r = (t.name || "Unknown Game").toLowerCase();
          return s.localeCompare(r)
        })
      }
      getRecentSessions(e, t = 10) {
        if (!this.trackerData[e] || !this.trackerData[e].gameHistory) return [];
        const s = this.trackerData[e].gameHistory.games,
          r = [];
        for (const [e, t] of Object.entries(s))
          if (t.sessions && Array.isArray(t.sessions))
            for (const s of t.sessions) r.push({
              placeId: e,
              gameName: t.name,
              ...s
            });
        return r.sort((e, t) => (t.timestamp || 0) - (e.timestamp || 0)).slice(0, t)
      }
      getLastGameInfo(e) {
        if (!this.trackerData[e]) return null;
        const t = this.trackerData[e].lastOnline;
        return t && t.timestamp ? {
          timestamp: t.timestamp,
          gameId: t.gameId,
          gameName: t.gameName,
          sessionDuration: t.sessionDuration,
          presenceType: t.presenceType
        } : null
      }
      consolidateGameHistory(e) {
        if (!e || !e.games) return e;
        const t = {};
        Object.entries(e.games).forEach(([s, r]) => {
          const i = r.name || "Unknown Game",
            n = s === e.currentGame;
          t[i] ? (n && (t[i].placeId = s, t[i].isCurrentGame = !0), t[i].totalTime += r.totalTime, r.daily && t[
            i].daily && (t[i].daily.time += r.daily.time)) : t[i] = {
            name: i,
            totalTime: r.totalTime,
            daily: r.daily,
            placeId: s,
            isCurrentGame: n
          }
        });
        const s = {
          ...e,
          games: Object.values(t).reduce((e, t) => (e[t.placeId] = {
            name: t.name,
            totalTime: t.totalTime,
            daily: t.daily
          }, e), {})
        };
        return s.currentGame && !s.currentGameName && (s.currentGameName = s.games[s.currentGame]?.name ||
          "Unknown Game"), s
      }
      async notifyTrackingData() {
        await d.set(u, this.trackerData);
        const e = await chrome.tabs.query({
          url: "*://*.roblox.com/*"
        });
        e && Array.isArray(e) && e.forEach(async e => {
          try {
            await chrome.tabs.sendMessage(e.id, {
              type: "PRESENCE_TRACKER_UPDATED",
              data: this.trackerData
            })
          } catch (e) {}
        })
      }
    };
  async function g(e) {
    if (!e) return console.log("[ONLINE NOTIFICATION] No user id provided"), null;
    const t = await fetch(`https://users.roblox.com/v1/users/${e}`, {
      method: "GET"
    });
    return t.ok ? await t.json() : (console.error("[ONLINE NOTIFICATION] Failed to fetch user info:", t.statusText),
      null)
  }
  async function m(e, t = "AvatarHeadShot", s = "420x420") {
    if (!e) return console.log("[ONLINE NOTIFICATION] No user id provided"), null;
    const r = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${e}&size=${s}&format=Png`, {
        method: "GET"
      });
    return r.ok ? await r.json() : (console.error("[ONLINE NOTIFICATION] Failed to fetch user info:", r.statusText),
      null)
  }
  const f = new class {
    constructor() {
      this.previousPresenceData = new Map, this.initializeNotificationListener()
    }
    async handlePresenceUpdate(e) {
      try {
        const t = await d.get("notifyOnline", []);
        if (!t || !Array.isArray(t) || !t.length) return;
        for (const [s, r] of Object.entries(e)) {
          if (!t.includes(s)) continue;
          const e = this.previousPresenceData.get(s)?.userPresenceType > 0,
            i = r.userPresenceType > 0;
          !e && i && await this.sendOnlineNotification(s, r), this.previousPresenceData.set(s, r)
        }
      } catch (e) {
        console.error("Error checking online status:", e)
      }
    }
    initializeNotificationListener() {
      chrome.notifications.onClicked.addListener(e => {
        if (e.startsWith("friend-online-")) {
          const t = e.replace("friend-online-", "");
          chrome.tabs.create({
            url: `https://www.roblox.com/users/${t}/profile`
          })
        }
        chrome.notifications.clear(e)
      })
    }
    async sendOnlineNotification(e, t) {
      try {
        const [s, r] = await Promise.all([g(e), m(e)]), i = r.data?.[0]?.imageUrl || "/icons/icon48.png";
        let n = `${s.displayName} (@${s.name}) is now online`;
        2 === t.userPresenceType && t.lastLocation && (n += `\nPlaying: ${t.lastLocation}`);
        const a = {
          type: "basic",
          iconUrl: i,
          title: "Friend Online",
          message: n,
          contextMessage: "Click to view profile"
        };
        3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
          ?.browser_specific_settings?.gecko || Object.assign(a, {
            silent: !0,
            priority: 2
          }), chrome.notifications.create(`friend-online-${e}`, a), setTimeout(() => {
            chrome.notifications.clear(`friend-online-${e}`)
          }, 1e4)
      } catch (t) {
        console.error(`Failed to create notification for user ${e}:`, t)
      }
    }
  };
  async function p(e) {
    if (!e) return console.log("[ONLINE NOTIFICATION] No user id provided"), null;
    const t = await fetch(`https://users.roblox.com/v1/users/${e}`, {
      method: "GET"
    });
    return t.ok ? await t.json() : (console.error("[ONLINE NOTIFICATION] Failed to fetch user info:", t.statusText),
      null)
  }
  async function y(e, t = "AvatarHeadShot", s = "420x420") {
    if (!e) return console.log("[ONLINE NOTIFICATION] No user id provided"), null;
    const r = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${e}&size=${s}&format=Png`, {
        method: "GET"
      });
    return r.ok ? await r.json() : (console.error("[ONLINE NOTIFICATION] Failed to fetch user info:", r.statusText),
      null)
  }
  const w = new class {
    constructor() {
      this.previousPresenceData = new Map, this.checkInterval = null, this.lastNotificationTime = 0, this
        .NOTIFICATION_DELAY = 2e3, this.currentlyPlayingWith = null, this.initializeNotificationListener()
    }
    async handlePresenceUpdate(e) {
      try {
        const t = await d.get("autoJoin", []);
        if (!t || !Array.isArray(t) || !t.length) return;
        const s = Object.values(e).filter(e => t.includes(e.userId.toString())),
          r = await d.get("betterblox_auth_status", {
            id: null,
            name: null,
            displayName: null,
            lastChecked: null
          }),
          i = r?.id;
        if (!i) return;
        const n = e[i];
        if (!n) return;
        if (this.currentlyPlayingWith) {
          const t = e[this.currentlyPlayingWith];
          if (t && 2 === n.userPresenceType && 2 === t.userPresenceType && n.gameId === t.gameId)
          return void console.log("[PLAY NOTIFICATION] Still playing with friend, suppressing notifications");
          this.currentlyPlayingWith = null
        }
        for (const e of s) {
          if (e.userId.toString() === i) continue;
          const t = this.previousPresenceData.get(e.userId);
          if (2 === e.userPresenceType) {
            const s = t?.gameId !== e.gameId,
              r = 2 !== n.userPresenceType || n.gameId !== e.gameId;
            if (!r) return console.log(
              "[PLAY NOTIFICATION] Playing with friend, suppressing other notifications"), void(this
                .currentlyPlayingWith = e.userId);
            s && r && await this.sendServerChangeNotification(e.userId, e)
          }
          this.previousPresenceData.set(e.userId, e)
        }
      } catch (e) {
        console.error("[PLAY NOTIFICATION] Error checking auto join:", e)
      }
    }
    initializeNotificationListener() {
      chrome.notifications.onButtonClicked.addListener((e, t) => {
        const s = e.split(":"),
          r = s[1],
          i = s[2],
          n = s[3] || "";
        0 === t ? this.joinGame(i, n) : 1 === t && this.disableAutoJoinForUser(r).then(() => {
          console.log(`Auto-join disabled for user ${r}`)
        }), chrome.notifications.clear(e)
      }), chrome.notifications.onClicked.addListener(e => {
        if (e.startsWith("join:")) {
          const t = e.split(":"),
            s = t[2],
            r = t[3] || "";
          this.joinGame(s, r), chrome.notifications.clear(e)
        }
      })
    }
    joinGame(e, t) {
      chrome.tabs.create({
        url: `https://www.roblox.com/games/${e}/#!/game-instances?betterBloxJoin=${t}&placeid=${e}`
      })
    }
    async disableAutoJoinForUser(e) {
      try {
        if (!e) return void console.error("No userId provided to disable auto-join");
        const t = await d.get("autoJoin", []);
        console.log("Current auto-join list:", t);
        const s = Array.isArray(t) ? t : [],
          r = e.toString(),
          i = s.filter(e => e.toString() !== r);
        return console.log("Updated auto-join list:", i), await d.set("autoJoin", i), !0
      } catch (e) {
        return console.error("Failed to disable auto-join:", e), !1
      }
    }
    async fetchPresenceData(e) {
      try {
        return (await robloxApi.getUsersPresence(e)).userPresences || []
      } catch (e) {
        return console.error("Failed to fetch presence data:", e), []
      }
    }
    async sendServerChangeNotification(e, t) {
      try {
        this.lastNotificationTime = Date.now();
        const [r, i] = await Promise.all([p(e), y(e)]), n = i.data?.[0]?.imageUrl || "/icons/icon48.png";
        let a = `${r.displayName} (@${r.name}) is playing`;
        t.lastLocation && (a += `\nGame: ${t.lastLocation}`);
        const o = `join:${e}:${t.placeId}:${t.gameId}`,
          c = {
            type: "basic",
            iconUrl: n,
            title: "Friend Playing Game",
            message: a
          };
        3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
          ?.browser_specific_settings?.gecko ? c.message += "\n\nClick to join game" : Object.assign(c, {
            buttons: [{
              title: "Join Game"
            }, {
              title: "Stop Notifications"
            }],
            priority: 2,
            silent: !0
          }), chrome.notifications.create(o, c), setTimeout(() => {
            chrome.notifications.clear(o)
          }, 15e3), await (s = this.NOTIFICATION_DELAY, new Promise(e => setTimeout(e, s)))
      } catch (t) {
        console.error(`Failed to create notification for user ${e}:`, t)
      }
      var s
    }
  };

  function I() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  const S = "https://users.roblox.com/v1",
    T = "https://friends.roblox.com/v1",
    E = new class {
      constructor() {
        this.rateLimitQueue = new Map
      }
      parseRetryAfterSeconds(e) {
        if (null == e || "" === e) return null;
        const t = parseInt(e, 10);
        return Number.isFinite(t) && t >= 0 ? t : null
      }
      async fetchFriendsFindPage(e, t = 3) {
        const s = {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        };
        for (let r = 1; r <= t; r++) {
          const i = await fetch(e, s);
          if (429 === i.status) {
            const e = this.parseRetryAfterSeconds(i.headers.get("Retry-After")) ?? 5;
            if (console.warn(`[RobloxAPI] friends/find rate limited (${r}/${t}). Waiting ${e}s`), r === t)
            return null;
            await new Promise(t => setTimeout(t, 1e3 * e));
            continue
          }
          if (401 === i.status) throw new Error("Unauthorized - User not authenticated");
          if (!i.ok) throw new Error(`HTTP error! status: ${i.status}`);
          return await i.json()
        }
        return null
      }
      async fetch(e, t = {}) {
        try {
          const s = await fetch(e, {
            ...t,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...t.headers
            }
          });
          if (429 === s.status) {
            const r = s.headers.get("Retry-After") || 5;
            return console.warn(`Rate limited. Retrying after ${r} seconds`), await new Promise(e => setTimeout(e,
              1e3 * r)), this.fetch(e, t)
          }
          if (401 === s.status) throw new Error("Unauthorized - User not authenticated");
          if (!s.ok) throw new Error(`HTTP error! status: ${s.status}`);
          return await s.json()
        } catch (e) {
          throw console.error("API request failed:", e), e
        }
      }
      async getUserInfo(e) {
        return this.fetch(`${S}/users/${e}`)
      }
      async getCurrentUser() {
        return this.fetch(`${S}/users/authenticated`)
      }
      async searchUsers(e, t = 10) {
        return this.fetch(`${S}/users/search?keyword=${e}&limit=${t}`)
      }
      async getFriends(e, t = 50, s = null) {
        let r = `${T}/users/${e}/friends/find`;
        return s && (r += `?cursor=${s}`), t && (r += `${s?"&":"?"}limit=${t}`), this.fetch(r)
      }
      async getAllFriends(e, t = void 0) {
        const s = [];
        let r = null;
        for (;;) {
          const t = new URLSearchParams({
            limit: String(50)
          });
          r && t.set("cursor", r);
          const i = `${T}/users/${e}/friends/find?${t}`,
            n = await this.fetchFriendsFindPage(i);
          if (null === n) return console.warn(
            "[RobloxAPI] getAllFriends: stopping after repeated rate limits; returning partial list"), s;
          const a = n.PageItems;
          if (!Array.isArray(a)) throw new Error("Invalid response format from friends API");
          for (const e of a) null != e?.id && -1 !== e.id && s.push({
            id: e.id
          });
          if (r = n.NextCursor, !r) break
        }
        return s
      }
      async getFriendsCount(e) {
        return this.fetch(`${T}/users/${e}/friends/count`)
      }
      async getUsersPresence(e) {
        return this.fetch("https://presence.roblox.com/v1/presence/users", {
          method: "POST",
          body: JSON.stringify({
            userIds: e
          })
        })
      }
      async getUserThumbnail(e, t = "AvatarHeadShot", s = "420x420") {
        return this.fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${e}&size=${s}&format=Png`)
      }
      async batchRequest(e, t = 100) {
        const s = [];
        for (let r = 0; r < e.length; r += t) {
          const i = e.slice(r, r + t),
            n = await Promise.all(i.map(e => this.fetch(e.url, e.options)));
          s.push(...n)
        }
        return s
      }
    },
    k = "undefined" == typeof browser ? chrome : browser;
  new class {
    constructor() {
      this.listeners = new Map, this.PREFIX = "betterblox_"
    }
    getPrefixedKey(e) {
      return e.startsWith(this.PREFIX) ? e : `${this.PREFIX}${e}`
    }
    async initialize() {
      k.storage.onChanged.addListener((e, t) => {
        "sync" === t && Object.entries(e).forEach(([e, {
          newValue: t
        }]) => {
          this.notifyListeners(e, t)
        })
      })
    }
    async get(e, t = null, s = !1) {
      const r = this.getPrefixedKey(e);
      try {
        const i = await k.storage.local.get(r);
        if (void 0 !== i[r]) return i[r];
        if (s) return t;
        const n = await k.storage.local.get(e);
        return void 0 !== n[e] ? (console.warn("Fallback Result Considered for", e, n), n[e]) : t
      } catch (e) {
        return console.error("Error getting setting:", e), t
      }
    }
    async set(e, t) {
      const s = this.getPrefixedKey(e);
      try {
        await k.storage.local.set({
          [s]: t
        }), this.notifyListeners(s, t)
      } catch (e) {
        console.error("Error setting setting:", e)
      }
    }
    addListener(e, t) {
      const s = this.getPrefixedKey(e);
      this.listeners.has(s) || this.listeners.set(s, new Set), this.listeners.get(s).add(t)
    }
    removeListener(e, t) {
      const s = this.getPrefixedKey(e);
      this.listeners.has(s) && this.listeners.get(s).delete(t)
    }
    notifyListeners(e, t) {
      this.listeners.has(e) && this.listeners.get(e).forEach(e => e(t))
    }
    async getSettings(e, t = null) {
      const s = await this.get(`settings_${e}`, t, !0);
      return void 0 === s && t ? (this.set(`settings_${e}`, t), t) : s
    }
    async setSettings(e, t) {
      await this.set(`settings_${e}`, t)
    }
  };
  const b = "betterblox_auth_status",
    v = new class {
      constructor() {
        this.authData = null, this.lastAuthCheck = 0, this.AUTH_RATE_LIMIT = 5e3
      }
      async init() {
        console.log("Initializing authentication manager");
        const e = "undefined" == typeof browser ? chrome : browser,
          t = await e.storage.local.get(b);
        this.authData = t && t[b] ? t[b] : null;
        try {
          await this.checkAuthStatus()
        } catch (e) {
          console.error("Failed to check authentication status:", e)
        }
        this.startPeriodicCheck()
      }
      async checkAuthStatus() {
        const e = Date.now();
        if (e - this.lastAuthCheck < this.AUTH_RATE_LIMIT && this.authData) return this.authData.id;
        try {
          const t = await E.getCurrentUser();
          return this.authData = {
            id: t.id,
            name: t.name,
            displayName: t.displayName,
            lastChecked: (new Date).toISOString()
          }, this.lastAuthCheck = e, await this.updateStorage(), t.id
        } catch (t) {
          return console.warn("[AUTH] Auth check failed:", t.message), this.authData = null, this.lastAuthCheck = e,
            await this.updateStorage(), null
        }
      }
      async updateStorage() {
        const e = "undefined" == typeof browser ? chrome : browser;
        await e.storage.local.set({
          [b]: this.authData
        })
      }
      async startPeriodicCheck() {
        try {
          await this.checkAuthStatus()
        } catch (e) {
          console.error("Failed to check authentication status:", e)
        }
        const e = "undefined" == typeof browser ? chrome : browser;
        e.alarms.create("authStatusCheck", {
          periodInMinutes: .5
        }), e.alarms.onAlarm.addListener(e => {
          "authStatusCheck" === e.name && this.checkAuthStatus()
        })
      }
      async getCurrentAuth() {
        const e = "undefined" == typeof browser ? chrome : browser,
          t = await e.storage.local.get(b);
        return t && t[b] ? t[b] : null
      }
      async isAuthenticated() {
        let e = await this.getCurrentAuth();
        return e || (await this.checkAuthStatus(), e = await this.getCurrentAuth()), !!e
      }
      async getAuthData(e = !1) {
        return this.authData && !e || await this.checkAuthStatus(), this.authData
      }
    },
    N = v,
    D = "betterblox_friends_list",
    C = e => new Promise(t => setTimeout(t, e)),
    U = new class {
      constructor() {
        this.friendsData = {}, this.currentUserId = null, this.subscribers = [], this.isInitialized = !1
      }
      addSubscriber(e) {
        return "function" == typeof e.handleFriendsUpdate ? (console.log("[FRIENDS] Adding subscriber", e
          .constructor.name), this.subscribers.push(e), !0) : (console.warn(
          "[FRIENDS] Attempted to add invalid subscriber - missing handleFriendsUpdate method"), !1)
      }
      removeSubscriber(e) {
        const t = this.subscribers.indexOf(e);
        return t > -1 && (this.subscribers.splice(t, 1), console.log("[FRIENDS] Removed subscriber", e.constructor
          .name), !0)
      }
      async initialize() {
        if (this.isInitialized) console.log("[FRIENDS] Service already initialized");
        else {
          console.log("[FRIENDS] Initializing friends service");
          try {
            if (this.friendsData = await d.get(D, {}), await this.updateCurrentUser(), console.log(
                `[FRIENDS] Loaded friends data for ${Object.keys(this.friendsData).length} users`), this
              .currentUserId) {
              const e = this.friendsData[this.currentUserId];
              console.log(`[FRIENDS] Current user ${this.currentUserId} has ${e?.count||0} friends`)
            }
            this.isInitialized = !0, await this.startPeriodicCheck()
          } catch (e) {
            console.error("[FRIENDS] Failed to initialize:", e)
          }
        }
      }
      async updateCurrentUser() {
        try {
          const e = await N.getAuthData(!0),
            t = e?.id?.toString();
          if (t !== this.currentUserId) {
            const e = this.currentUserId;
            this.currentUserId = t, e && t ? console.log(`[FRIENDS] Account switched from ${e} to ${t}`) : t ?
              console.log(`[FRIENDS] User logged in: ${t}`) : console.log("[FRIENDS] User logged out"), await this
              .notifyFriendsChanged(!0)
          }
          return t
        } catch (e) {
          return console.error("[FRIENDS] Failed to update current user:", e), null
        }
      }
      async updateFriendsList() {
        try {
          const e = (await N.getAuthData(!0))?.id?.toString();
          if (!e) return void console.log("[FRIENDS] User not authenticated, skipping friends update");
          if (e !== this.currentUserId) {
            const t = this.currentUserId;
            this.currentUserId = e, t && e ? (console.log(`[FRIENDS] Account switched from ${t} to ${e}`),
              await this.notifyFriendsChanged(!0)) : e && (console.log(`[FRIENDS] User logged in: ${e}`),
              await this.notifyFriendsChanged(!0))
          }
          const t = e;
          console.log(`[FRIENDS] Fetching friends for user: ${t}`);
          const s = (await E.getAllFriends(parseInt(t))).map(e => e.id).filter(e => {
              const t = parseInt(e);
              return t > 0 && !isNaN(t)
            }),
            r = this.friendsData[t],
            i = r?.friendIds || [];
          this.friendsData[t] = {
            lastUpdated: (new Date).toISOString(),
            friendIds: s,
            count: s.length
          }, await this.notifyFriendsChanged(), console.log(
            `[FRIENDS] Updated friends list for user ${t}: ${s.length} friends found`);
          const n = s.filter(e => !i.includes(e)),
            a = i.filter(e => !s.includes(e));
          n.length > 0 && console.log(`[FRIENDS] New friends added: ${n.length}`), a.length > 0 && console.log(
            `[FRIENDS] Friends removed: ${a.length}`)
        } catch (e) {
          console.error("[FRIENDS] Failed to update friends list:", e)
        }
      }
      async notifyFriendsChanged(e = !1) {
        try {
          await d.set(D, this.friendsData);
          const t = this.getCurrentUserFriends();
          if (this.subscribers.length > 0) {
            console.log(`[FRIENDS] Notifying ${this.subscribers.length} direct subscribers`);
            for (const s of this.subscribers) try {
              await s.handleFriendsUpdate(t, {
                accountSwitched: e,
                currentUserId: this.currentUserId,
                allUsersData: this.friendsData
              })
            } catch (e) {
              console.error("[FRIENDS] Error notifying subscriber:", e)
            }
          }
          const s = await chrome.tabs.query({
            url: "*://*.roblox.com/*"
          });
          s && Array.isArray(s) && s.forEach(async s => {
            try {
              await chrome.tabs.sendMessage(s.id, {
                type: "FRIENDS_LIST_UPDATED",
                data: t,
                meta: {
                  accountSwitched: e,
                  currentUserId: this.currentUserId
                }
              })
            } catch (e) {}
          })
        } catch (e) {
          console.error("[FRIENDS] Failed to notify friends changed:", e)
        }
      }
      async startPeriodicCheck() {
        for (await this.updateFriendsList(), chrome.alarms.create("friendsListCheck", {
            periodInMinutes: 1
          }), chrome.alarms.onAlarm.addListener(e => {
            "friendsListCheck" === e.name && this.updateFriendsList()
          }); this.currentUserId && !this.getCurrentUserFriends();) console.log(
            "[FRIENDS] No friends data found for current user, waiting 10 seconds before retrying"), await C(1e4),
          await this.updateFriendsList()
      }
      getCurrentUserFriends() {
        return this.currentUserId && this.friendsData[this.currentUserId] || null
      }
      getUserFriends(e) {
        return this.friendsData[e] || null
      }
      getFriendsList() {
        return this.getCurrentUserFriends()
      }
      async getFriendIds() {
        const e = this.getCurrentUserFriends();
        if (e?.friendIds) return e.friendIds;
        if (this.currentUserId) {
          const e = await d.get(D, {});
          return e[this.currentUserId]?.friendIds || []
        }
        return []
      }
      async getFriendIdsForUser(e) {
        const t = this.getUserFriends(e);
        if (t?.friendIds) return t.friendIds;
        const s = await d.get(D, {});
        return s[e]?.friendIds || []
      }
      async isFriend(e) {
        return (await this.getFriendIds()).includes(parseInt(e))
      }
      async isFriendOfUser(e, t) {
        return (await this.getFriendIdsForUser(t)).includes(parseInt(e))
      }
      async getFriendsCount() {
        return (await this.getFriendIds()).length
      }
      async getFriendsCountForUser(e) {
        return (await this.getFriendIdsForUser(e)).length
      }
      async refreshFriendsList() {
        console.log("[FRIENDS] Manual refresh requested"), await this.updateFriendsList()
      }
      getAllUsersData() {
        return this.friendsData
      }
      getCurrentUserId() {
        return this.currentUserId
      }
    },
    R = `${t}/api/user/public/batch-presence`,
    A = new class {
      constructor() {
        this.name = "OptimizedServerSync", this.lastServerSend = 0, this.backoffAttempts = 0, this.nextSendTime = 0,
          this.serverHealthy = !0, this.lastSuccessfulSend = 0, this.isRequestInProgress = !1
      }
      async handlePresenceUpdate(e) {
        try {
          const t = Date.now();
          t - this.lastServerSend >= 1e4 && (await this.processPresenceUpdate(e), this.lastServerSend = t)
        } catch (e) {
          console.error("[OPTIMIZED SYNC] Error handling presence update:", e)
        }
      }
      async processPresenceUpdate(e) {
        try {
          if (this.shouldSkipServerSend()) return;
          const t = Object.values(e),
            s = await U.getFriendIds(),
            r = t.filter(e => s.includes(parseInt(e.userId)));
          if (0 === r.length) return;
          await this.sendToServer(r) ? this.onSendSuccess() : this.onSendFailure()
        } catch (e) {
          console.error("[OPTIMIZED SYNC] Error processing presence update:", e), this.onSendFailure()
        }
      }
      shouldSkipServerSend() {
        const e = Date.now();
        if (this.isRequestInProgress) return !0;
        if (e < this.nextSendTime) {
          const t = Math.round((this.nextSendTime - e) / 1e3);
          return console.log(`[OPTIMIZED SYNC] Skipping - in backoff period (${t}s remaining)`), !0
        }
        return !1
      }
      async sendToServer(e) {
        this.isRequestInProgress = !0;
        try {
          const t = await fetch(R, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              presences: e
            })
          });
          if (t.ok) return await t.json(), !0;
          if (429 === t.status) {
            const e = parseInt(t.headers.get("retry-after") || "60", 10);
            return console.warn(`[OPTIMIZED SYNC] Rate limited, backing off for ${e}s`), this.nextSendTime = Date
              .now() + 1e3 * e, !1
          }
          return 503 === t.status ? (console.warn(
              "[OPTIMIZED SYNC] Server circuit breaker is open, backing off for 60s"), this.nextSendTime = Date
            .now() + 6e4, !1) : (console.warn(`[OPTIMIZED SYNC] Server error ${t.status}, backing off`), !1)
        } catch (e) {
          return console.warn("[OPTIMIZED SYNC] Network error:", e.message), !1
        } finally {
          this.isRequestInProgress = !1
        }
      }
      onSendSuccess() {
        this.serverHealthy = !0, this.backoffAttempts = 0, this.lastSuccessfulSend = Date.now(), this.nextSendTime =
          0, console.log("[OPTIMIZED SYNC] Send successful")
      }
      onSendFailure() {
        if (this.serverHealthy = !1, this.backoffAttempts++, this.nextSendTime <= Date.now()) {
          const e = Math.min(2e4 * Math.pow(2, this.backoffAttempts - 1), 3e5);
          this.nextSendTime = Date.now() + e, console.log(
            `[OPTIMIZED SYNC] Send failed, backing off for ${Math.round(e/1e3)}s`)
        }
      }
      async initialize() {
        console.log("[OPTIMIZED SYNC] Simple server sync service initialized"), console.log(
          "[OPTIMIZED SYNC] Fixed interval: 10000ms, single attempt with backoff")
      }
    };
  async function O(e) {
    if (0 === e.length) return console.log("[PRESENCE] No users to check presence for"), [];
    const t = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      body: JSON.stringify({
        userIds: e
      })
    });
    return t.ok ? (await t.json()).userPresences || [] : (console.error(
      "[PRESENCE] Failed to fetch presence batch:", t.statusText), [])
  }
  const F = new class {
      constructor() {
        this.presenceData = {}, this.subscribers = [], this.lastServerSend = 0
      }
      addSubscriber(e) {
        return "function" == typeof e.handlePresenceUpdate ? (console.log("[PRESENCE] Adding subscriber", e
          .constructor.name), this.subscribers.push(e), !0) : (console.warn(
          "[PRESENCE] Attempted to add invalid subscriber - missing handlePresenceUpdate method"), !1)
      }
      async getAllUserIds() {
        const [e, t, s, r] = await Promise.all([U.getFriendIds(), this.getTrackingList(), d.get(
            "betterblox_auth_status", {
              id: null,
              name: null,
              displayName: null,
              lastChecked: null
            }), d.get("autoJoin", [])]), i = Array.isArray(e) ? e : [], n = Array.isArray(t) ? t : [], a = Array
          .isArray(r) ? r : [], o = new Set([...i, ...n, ...a]);
        return s?.id && o.add(s.id), Array.from(o)
      }
      async getTrackingList() {
        console.log("[PRESENCE] Getting tracking list");
        let e = await d.get("betterblox_tracking_list_v2", []);
        if (0 === e.length) {
          const t = await d.get("betterblox_tracking_list", null);
          if (t && t.trackIDs) {
            e = t.trackIDs || [], await d.set("betterblox_tracking_list_v2", e);
            const s = "undefined" == typeof browser ? chrome : browser;
            await s.storage.local.remove("betterblox_tracking_list"), console.log(
              "[PRESENCE] Migrated betterblox_tracking_list to v2 format")
          }
        }
        return e
      }
      async initialize() {
        console.log("[SERVICE] Initializing presence manager"), this.presenceData = {}, this.startPeriodicCheck()
      }
      async updateUserPresence(e, t) {
        this.presenceData[e] = {
          ...t
        }
      }
      async notifyPresenceChanged() {
        if (this.subscribers && this.subscribers.length > 0) {
          console.log("[PRESENCE] Notifying", this.subscribers.length, "direct subscribers");
          for (const e of this.subscribers) try {
            e.handlePresenceUpdate(this.presenceData)
          } catch (e) {
            console.error("[PRESENCE] Error notifying subscriber:", e)
          }
        }
      }
      async updatePresencesLoop() {
        try {
          const e = await this.getAllUserIds(),
            t = await async function(e) {
              try {
                if (0 === e.length) return console.log("[PRESENCE] No users to check presence for"), [];
                let t = [];
                for (let s = 0; s < e.length; s += 100) {
                  const r = e.slice(s, s + 100),
                    i = await O(r);
                  i.length > 0 && t.push(...i)
                }
                return t
              } catch (e) {
                console.error("[PRESENCE] Failed to update presences:", e)
              }
            }(e);
          for (const e of t) await this.updateUserPresence(e.userId, e);
          t.length > 0 && await this.notifyPresenceChanged()
        } catch (e) {
          console.error("[PRESENCE] Failed to updatePresencesLoop:", e)
        }
      }
      startPeriodicCheck() {
        this.updatePresencesLoop(), chrome.alarms.create("friendsPresenceCheck", {
          periodInMinutes: .75
        }), chrome.alarms.onAlarm.addListener(e => {
          "friendsPresenceCheck" === e.name && this.updatePresencesLoop()
        })
      }
    },
    P = F,
    $ = new class {
      constructor() {
        this.userFriendsData = {}, this.currentUserId = null, this.initializeNotificationListener()
      }
      getUserData(e) {
        return this.userFriendsData[e] || (this.userFriendsData[e] = {
          friendIds: new Set,
          isInitialized: !1
        }), this.userFriendsData[e]
      }
      initializeUserData(e, t) {
        const s = this.getUserData(e);
        s.friendIds = new Set(t), s.isInitialized = !0
      }
      async handleFriendsUpdate(e, t = {}) {
        try {
          const {
            accountSwitched: s = !1,
            currentUserId: r = null
          } = t;
          if (s) return console.log(`[FRIEND REMOVED] Account switched to user: ${r}`), this.currentUserId = r,
            void(r && e?.friendIds && this.initializeUserData(r, e.friendIds));
          if (r && (this.currentUserId = r), null === e) return console.log(
            "[FRIEND REMOVED] User logged out, clearing current user"), void(this.currentUserId = null);
          this.currentUserId && e?.friendIds && (this.getUserData(this.currentUserId).isInitialized ? await this
            .checkForRemovedFriends(this.currentUserId, e.friendIds) : (this.initializeUserData(this
              .currentUserId, e.friendIds), console.log(
              `[FRIEND REMOVED] Initialized user ${this.currentUserId} with ${e.friendIds.length} friends`)))
        } catch (e) {
          console.error("[FRIEND REMOVED] Error handling friends update:", e)
        }
      }
      async checkForRemovedFriends(e, t) {
        const s = this.getUserData(e),
          r = new Set(t),
          i = [...s.friendIds].filter(e => !r.has(e)).filter(e => {
            const t = parseInt(e);
            return t > 0 && !isNaN(t) && t.toString() === e.toString()
          });
        i.length > 0 && (console.log(`[FRIEND REMOVED] User ${e} - Detected ${i.length} removed friends:`, i),
          await this.notifyRemovedFriends(i)), s.friendIds = r
      }
      initializeNotificationListener() {
        chrome.notifications.onClicked.addListener(e => {
          if (e.startsWith("friend-removed-")) {
            const t = e.replace("friend-removed-", "");
            chrome.tabs.create({
              url: `https://www.roblox.com/users/${t}/profile`
            })
          } else "multiple-friends-removed" === e && chrome.tabs.create({
            url: "https://www.roblox.com/users/friends"
          });
          chrome.notifications.clear(e)
        })
      }
      async notifyRemovedFriends(e) {
        try {
          if (!await d.getSettings("unfriend-notification", !0)) return void console.log(
            "[FRIEND REMOVED] Notifications disabled, skipping");
          if (e.length > 10) return void console.log(
            "[FRIEND REMOVED] Too many friends removed, skipping notification");
          e.length > 5 ? await this.sendGroupRemovedNotification(e) : await this.sendIndividualRemovedNotifications(
            e)
        } catch (e) {
          console.error("[FRIEND REMOVED] Failed to send notifications:", e)
        }
      }
      async sendGroupRemovedNotification(e) {
        try {
          const t = e.slice(0, 3).map(e => E.getUserInfo(e)),
            s = (await Promise.all(t)).map(e => e.name),
            r = e.length - 3,
            i = r > 0 ? `${s.join(", ")} and ${r} others` : s.join(", "),
            n = {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "Multiple Friends Removed (BetterBLOX)",
              message: `${e.length} friends have removed you: ${i}`,
              contextMessage: "Click to view friends page"
            };
          3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
            ?.browser_specific_settings?.gecko || Object.assign(n, {
              silent: !0,
              priority: 1
            }), chrome.notifications.create("multiple-friends-removed", n), setTimeout(() => {
              chrome.notifications.clear("multiple-friends-removed")
            }, 2e4)
        } catch (t) {
          console.error("[FRIEND REMOVED] Failed to create group notification:", t), chrome.notifications.create(
            "multiple-friends-removed", {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "Multiple Friends Removed",
              message: `${e.length} friends have removed you from their friends list.`,
              contextMessage: "Click to view friends page"
            }), setTimeout(() => {
            chrome.notifications.clear("multiple-friends-removed")
          }, 2e4)
        }
      }
      async sendIndividualRemovedNotifications(e) {
        for (const t of e) try {
          const [e, s] = await Promise.all([E.getUserInfo(t), E.getUserThumbnail(t)]), r = s.data?.[0]
            ?.imageUrl || "/icons/icon48.png", i = `friend-removed-${t}`, n = {
              type: "basic",
              iconUrl: r,
              title: "Friend Removed (BetterBLOX)",
              message: `${e.displayName} (@${e.name}) has removed you from their friends list.`,
              contextMessage: "Click to view profile"
            };
          3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
            ?.browser_specific_settings?.gecko || Object.assign(n, {
              silent: !0,
              priority: 1
            }), chrome.notifications.create(i, n), setTimeout(() => {
              chrome.notifications.clear(i)
            }, 2e4)
        } catch (e) {
          console.error(`[FRIEND REMOVED] Failed to get details for user ${t}:`, e);
          const s = `friend-removed-${t}`;
          chrome.notifications.create(s, {
            type: "basic",
            iconUrl: "/icons/icon48.png",
            title: "Friend Removed (BetterBLOX)",
            message: `A user (ID: ${t}) has removed you from their friends list.`,
            contextMessage: "Click to view profile"
          }), setTimeout(() => {
            chrome.notifications.clear(s)
          }, 2e4)
        }
      }
      async initialize(e, t) {
        this.initializeUserData(e, t), console.log(
          `[FRIEND REMOVED] Manually initialized user ${e} with ${t.length} friends`)
      }
      getDebugInfo() {
        return {
          currentUserId: this.currentUserId,
          userCount: Object.keys(this.userFriendsData).length,
          users: Object.keys(this.userFriendsData).map(e => ({
            userId: e,
            friendCount: this.userFriendsData[e].friendIds.size,
            isInitialized: this.userFriendsData[e].isInitialized
          }))
        }
      }
    },
    x = new class {
      constructor() {
        this.userSessionsData = {}, this.currentUserId = null, this.initializeNotificationListener()
      }
      getUserData(e) {
        return this.userSessionsData[e] || (this.userSessionsData[e] = {
          sessions: new Map,
          isInitialized: !1
        }), this.userSessionsData[e]
      }
      initializeUserData(e, t) {
        const s = this.getUserData(e);
        s.sessions = new Map, t.forEach(e => {
          s.sessions.set(e.token, e)
        }), s.isInitialized = !0
      }
      async handleSessionsUpdate(e, t = {}) {
        try {
          const {
            accountSwitched: s = !1,
            currentUserId: r = null
          } = t;
          if (s) return console.log(`[SESSION NOTIFICATION] Account switched to user: ${r}`), this.currentUserId =
            r, void(r && e?.sessions && this.initializeUserData(r, e.sessions));
          if (r && (this.currentUserId = r), null === e) return console.log(
            "[SESSION NOTIFICATION] User logged out, clearing current user"), void(this.currentUserId = null);
          this.currentUserId && e?.sessions && (this.getUserData(this.currentUserId).isInitialized ? await this
            .checkForNewSessions(this.currentUserId, e.sessions) : (this.initializeUserData(this.currentUserId, e
              .sessions), console.log(
              `[SESSION NOTIFICATION] Initialized user ${this.currentUserId} with ${e.sessions.length} sessions`
              )))
        } catch (e) {
          console.error("[SESSION NOTIFICATION] Error handling sessions update:", e)
        }
      }
      async checkForNewSessions(e, t) {
        const s = this.getUserData(e),
          r = new Map;
        t.forEach(e => {
          r.set(e.token, e)
        });
        const i = t.filter(e => !s.sessions.has(e.token));
        i.length > 0 && (console.log(`[SESSION NOTIFICATION] User ${e} - Detected ${i.length} new sessions:`, i.map(
          e => {
            const t = e.location?.city || "Unknown";
            let s = "Unknown";
            return e.agent && (s = "App" === e.agent.type ? e.agent.value || "Roblox App" : e.agent.value || e
              .agent.type || "Unknown"), `${t}, ${s}`
          })), await this.notifyNewSessions(i)), s.sessions = r
      }
      initializeNotificationListener() {
        chrome.notifications.onClicked.addListener(e => {
          (e.startsWith("new-session-") || "multiple-new-sessions" === e) && chrome.tabs.create({
            url: "https://www.roblox.com/my/account#!/security"
          }), chrome.notifications.clear(e)
        })
      }
      async notifyNewSessions(e) {
        try {
          if (!await d.getSettings("session-notification", !1)) return void console.log(
            "[SESSION NOTIFICATION] Notifications disabled, skipping");
          if (e.length > 10) return void console.log(
            "[SESSION NOTIFICATION] Too many new sessions, skipping notification");
          e.length > 3 ? await this.sendGroupSessionNotification(e) : await this.sendIndividualSessionNotifications(
            e)
        } catch (e) {
          console.error("[SESSION NOTIFICATION] Failed to send notifications:", e)
        }
      }
      async sendGroupSessionNotification(e) {
        try {
          const t = e.map(e => e.location?.city || "Unknown location").slice(0, 3),
            s = e.length - 3,
            r = s > 0 ? `${t.join(", ")} and ${s} others` : t.join(", "),
            i = {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "Multiple New Sessions",
              message: `${e.length} new sessions detected from: ${r}`,
              contextMessage: "Click to view security settings"
            };
          3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
            ?.browser_specific_settings?.gecko || Object.assign(i, {
              silent: !0,
              priority: 2
            }), chrome.notifications.create("multiple-new-sessions", i), setTimeout(() => {
              chrome.notifications.clear("multiple-new-sessions")
            }, 3e4)
        } catch (t) {
          console.error("[SESSION NOTIFICATION] Failed to create group notification:", t), chrome.notifications
            .create("multiple-new-sessions", {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "Multiple New Sessions",
              message: `${e.length} new login sessions detected on your account.`,
              contextMessage: "Click to view security settings"
            }), setTimeout(() => {
              chrome.notifications.clear("multiple-new-sessions")
            }, 3e4)
        }
      }
      async sendIndividualSessionNotifications(e) {
        for (let t = 0; t < e.length; t++) {
          const s = e[t];
          try {
            const e = `new-session-${Date.now()}-${t}`,
              r = s.location ? `${s.location.city||"Unknown city"}, ${s.location.country||"Unknown country"}` :
              "Unknown location";
            let i = "Unknown device";
            s.agent && (i = "App" === s.agent.type ?
              `${s.agent.value||"Roblox App"} on ${s.agent.os||"Unknown OS"}` : "Browser" === s.agent.type ?
              `${s.agent.value||"Unknown browser"} on ${s.agent.os||"Unknown OS"}` :
              `${s.agent.value||s.agent.type||"Unknown"} on ${s.agent.os||"Unknown OS"}`);
            const n = {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "New Login Session",
              message: `New login detected from ${r} using ${i}`,
              contextMessage: `${s.lastAccessedTimestampEpochMilliseconds?new Date(parseInt(s.lastAccessedTimestampEpochMilliseconds)).toLocaleString():"Unknown time"} - Click to view security settings`
            };
            3 !== chrome.runtime.getManifest().manifest_version || chrome.runtime.getManifest()
              ?.browser_specific_settings?.gecko || Object.assign(n, {
                silent: !0,
                priority: 2
              }), chrome.notifications.create(e, n), setTimeout(() => {
                chrome.notifications.clear(e)
              }, 3e4)
          } catch (e) {
            console.error("[SESSION NOTIFICATION] Failed to create notification for session:", e);
            const s = `new-session-${Date.now()}-${t}`;
            chrome.notifications.create(s, {
              type: "basic",
              iconUrl: "/icons/icon48.png",
              title: "New Login Session",
              message: "A new login session was detected on your account.",
              contextMessage: "Click to view security settings"
            }), setTimeout(() => {
              chrome.notifications.clear(s)
            }, 3e4)
          }
        }
      }
      async initialize(e, t) {
        this.initializeUserData(e, t), console.log(
          `[SESSION NOTIFICATION] Manually initialized user ${e} with ${t.length} sessions`)
      }
      getDebugInfo() {
        return {
          currentUserId: this.currentUserId,
          userCount: Object.keys(this.userSessionsData).length,
          users: Object.keys(this.userSessionsData).map(e => ({
            userId: e,
            sessionCount: this.userSessionsData[e].sessions.size,
            isInitialized: this.userSessionsData[e].isInitialized
          }))
        }
      }
    },
    _ = new class {
      constructor() {
        this.intervalId = null, this.isInitialized = !1, this.INTERVAL_MINUTES = 30
      }
      async initialize() {
        if (this.isInitialized) console.log("[MarkActiveUser] Already initialized");
        else {
          console.log("[MarkActiveUser] Initializing user activity tracking");
          try {
            await this.sendActivityUpdate(), this.intervalId = setInterval(async () => {
              try {
                await this.sendActivityUpdate()
              } catch (e) {
                console.error("[MarkActiveUser] Error in interval update:", e)
              }
            }, 60 * this.INTERVAL_MINUTES * 1e3), this.isInitialized = !0, console.log(
              `[MarkActiveUser] Initialized with ${this.INTERVAL_MINUTES} minute intervals`)
          } catch (e) {
            console.error("[MarkActiveUser] Failed to initialize:", e)
          }
        }
      }
      async getCurrentUserData() {
        try {
          const e = await N.getAuthData(!0);
          return e && e.id && e.name ? {
            id: e.id,
            username: e.name
          } : (console.log("[MarkActiveUser] User not authenticated"), null)
        } catch (e) {
          return console.error("[MarkActiveUser] Error fetching current user:", e), null
        }
      }
      async sendActivityUpdate() {
        const e = await this.getCurrentUserData();
        if (e) try {
          const s = await fetch(`${t}/api/users/mark-active`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: e.id,
              username: e.username
            })
          });
          s.ok ? (await s.json()).success ? console.log(
            `[MarkActiveUser] Successfully marked ${e.username} as active`) : console.error(
            "[MarkActiveUser] API returned success: false") : console.error(
            `[MarkActiveUser] Failed to mark user active: ${s.status}`)
        } catch (e) {
          console.error("[MarkActiveUser] Error sending activity update:", e)
        } else console.log("[MarkActiveUser] No current user to update")
      }
      async triggerUpdate() {
        console.log("[MarkActiveUser] Manual activity update triggered"), await this.sendActivityUpdate()
      }
      stop() {
        this.intervalId && (clearInterval(this.intervalId), this.intervalId = null, console.log(
          "[MarkActiveUser] Stopped")), this.isInitialized = !1
      }
      getStatus() {
        return {
          isInitialized: this.isInitialized,
          intervalMinutes: this.INTERVAL_MINUTES,
          hasInterval: !!this.intervalId
        }
      }
      async getCurrentUser() {
        return await this.getCurrentUserData()
      }
    },
    L = `${t}/api/discovery`,
    M = new class {
      constructor() {
        this.isRunning = !1, this.currentTask = null, this.scheduledJob = null, this.extensionId = null, this
          .wasAuthenticated = !1, this.isRequestInProgress = !1
      }
      async initialize() {
        this.startDiscoveryScheduler()
      }
      async updateExtensionId() {
        try {
          const e = await N.getAuthData();
          return e && e.id ? (this.extensionId = `user-${e.id}`, !0) : (this.extensionId = null, !1)
        } catch (e) {
          return this.extensionId = null, !1
        }
      }
      startDiscoveryScheduler() {
        this.scheduledJob || (this.isRunning = !0, this.scheduledJob = setTimeout(() => this.checkForTask(), 1e3))
      }
      stopDiscoveryScheduler() {
        this.scheduledJob && (clearTimeout(this.scheduledJob), this.scheduledJob = null), this.isRunning = !1, this
          .currentTask = null
      }
      async checkForTask() {
        if (this.isRunning && !this.currentTask && !this.isRequestInProgress) {
          this.isRequestInProgress = !0;
          try {
            if (!await N.isAuthenticated()) return this.wasAuthenticated = !1, void this.scheduleNextCheck();
            if (!this.extensionId && !await this.updateExtensionId()) return void this.scheduleNextCheck();
            this.wasAuthenticated = !0;
            const e = await fetch(`${L}/get-task`, {
              method: "GET",
              headers: {
                "X-Extension-Id": this.extensionId
              }
            });
            if (!e.ok) return void this.scheduleNextCheck();
            const t = await e.json();
            if (!t.success || !t.hasTask) return void this.scheduleNextCheck();
            this.currentTask = t.task;
            const s = this.currentTask.requiresServerUpdate;
            console.log(
              `[DISCOVERY] Processing game ${this.currentTask.gameId} (${this.currentTask.activePlayers} players)${s?" - SERVER FETCH REQUIRED":""}`
              );
            const r = await this.processTask(this.currentTask);
            this.scheduleNextCheck(r)
          } catch (e) {
            console.error("[DISCOVERY] Error in task check:", e), this.scheduleNextCheck()
          } finally {
            this.isRequestInProgress = !1
          }
        }
      }
      async processTask(e) {
        let t = !1;
        try {
          const s = await fetch(`https://apis.roblox.com/universes/v1/places/${e.gameId}/universe`);
          if (!s.ok) throw new Error(`Failed to get universeId: ${s.statusText}`);
          let r = (await s.json()).universeId;
          r || (r = e.gameId);
          const i = await fetch(`https://games.roblox.com/v1/games?universeIds=${r}`);
          if (!i.ok) throw new Error(`Failed to get game details: ${i.statusText}`);
          const n = await i.json();
          if (!n.data?.length) throw new Error("No game data returned");
          const a = n.data[0],
            o = {
              gameId: e.gameId.toString(),
              gameData: {
                activePlayers: a.playing,
                updated: a.updated
              }
            };
          if (e.requiresServerUpdate) try {
            const s = await this.fetchAllServers(e.gameId);
            o.serverData = {
              servers: s
            }, t = !0, console.log(
              `[DISCOVERY] Fetched ${s.length} servers for game ${e.gameId} - BACKOFF TRIGGERED`)
          } catch (s) {
            console.warn(`[DISCOVERY] Failed to fetch servers for game ${e.gameId}:`, s.message), t = !0
          }
          return await this.submitTask(o), this.currentTask = null, t
        } catch (s) {
          this.currentTask = null, console.warn(`[DISCOVERY] Error processing game ${e.gameId}:`, s.message);
          try {
            await this.submitTask({
              gameId: e.gameId.toString(),
              gameData: {
                isError: !0,
                error: s.message,
                activePlayers: 0,
                updated: null
              }
            })
          } catch (t) {
            console.error(`[DISCOVERY] Error submitting failed task for game ${e.gameId}:`, t.message)
          }
          return t
        }
      }
      async fetchAllServers(e) {
        let t = [],
          s = "",
          r = 0;
        for (; r < 10;) try {
          const i =
            `https://games.roblox.com/v1/games/${e}/servers/0?sortOrder=2&excludeFullGames=true&limit=100${s?`&cursor=${s}`:""}`,
            n = await fetch(i);
          if (429 === n.status) {
            const e = parseInt(n.headers.get("retry-after") || "5", 10);
            await new Promise(t => setTimeout(t, 1e3 * e));
            continue
          }
          if (!n.ok) throw new Error(`HTTP ${n.status}: ${n.statusText}`);
          const a = await n.json();
          if (a.data && a.data.length > 0 && (t = t.concat(a.data)), !a.nextPageCursor) break;
          s = a.nextPageCursor, r++, await new Promise(e => setTimeout(e, 100))
        } catch (e) {
          if (r++, r >= 10) throw e;
          await new Promise(e => setTimeout(e, 2e3))
        }
        return t
      }
      async submitTask(e) {
        try {
          console.log(
            `[DISCOVERY] Submitting task results for game ${e.gameId} with extension ID: ${this.extensionId}`);
          const t = await fetch(`${L}/submit-task`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Extension-Id": this.extensionId
              },
              body: JSON.stringify(e)
            }),
            s = await t.json();
          if (!t.ok) throw console.error(`[DISCOVERY] Server rejected submission (${t.status}):`, s.error || t
            .statusText), new Error(`HTTP ${t.status}: ${s.error||t.statusText}`);
          s.success ? console.log(`[DISCOVERY] Task completed successfully for game ${e.gameId}`) : console.error(
            "[DISCOVERY] Server rejected task submission:", s.error), this.currentTask = null
        } catch (t) {
          console.error(`[DISCOVERY] Error submitting task for game ${e.gameId}:`, t.message), this.currentTask =
            null
        }
      }
      scheduleNextCheck(e = !1) {
        if (!this.isRunning) return;
        let t, s;
        e ? (t = 3e5, s = "7 minutes (server fetch backoff)") : (t = 6e4, s = "30 seconds (normal)"), console.log(
          `[DISCOVERY] Next check in ${s}`), this.scheduledJob = setTimeout(() => this.checkForTask(), t)
      }
    },
    j = `${t}/api/discovery`,
    z = new class {
      constructor() {
        this.isRunning = !1, this.currentTask = null, this.scheduledJob = null, this.extensionId = null, this
          .wasAuthenticated = !1, this.isRequestInProgress = !1
      }
      async initialize() {
        this.startServerDiscoveryScheduler()
      }
      async updateExtensionId() {
        try {
          const e = await N.getAuthData();
          return e && e.id ? (this.extensionId = `user-${e.id}`, !0) : (this.extensionId = null, !1)
        } catch (e) {
          return this.extensionId = null, !1
        }
      }
      startServerDiscoveryScheduler() {
        this.scheduledJob || (this.isRunning = !0, this.scheduledJob = setTimeout(() => this.checkForServerTask(),
          1e3))
      }
      stopServerDiscoveryScheduler() {
        this.scheduledJob && (clearTimeout(this.scheduledJob), this.scheduledJob = null), this.isRunning = !1
      }
      async checkForServerTask() {
        if (this.isRunning && !this.currentTask && !this.isRequestInProgress) {
          this.isRequestInProgress = !0;
          try {
            if (!await N.isAuthenticated()) return this.wasAuthenticated = !1, void this.scheduleNextCheck();
            if (!this.extensionId && !await this.updateExtensionId()) return void this.scheduleNextCheck();
            this.wasAuthenticated = !0;
            const e = await fetch(`${j}/get-server-task`, {
              method: "GET",
              headers: {
                "X-Extension-Id": this.extensionId
              }
            });
            if (!e.ok) return void this.scheduleNextCheck();
            const t = await e.json();
            if (!t.success || !t.hasTask) return void this.scheduleNextCheck();
            this.currentTask = t.task, console.log(
                `[SERVER DISCOVERY] Processing ${this.currentTask.totalServers} servers`), await this
              .processServerTask(this.currentTask), this.scheduleNextCheck()
          } catch (e) {
            console.error("[SERVER DISCOVERY] Error in server task check:", e), this.scheduleNextCheck()
          } finally {
            this.isRequestInProgress = !1
          }
        }
      }
      async processServerTask(e) {
        try {
          const t = [],
            s = 8,
            r = 300;
          for (let i = 0; i < e.servers.length; i += s) {
            const n = e.servers.slice(i, i + s),
              a = await Promise.allSettled(n.map(async e => {
                try {
                  const t = await fetch("https://gamejoin.roblox.com/v1/join-game-instance", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      placeId: e.placeId,
                      gameId: e.serverId
                    })
                  });
                  if (!t.ok) return {
                    id: null,
                    serverId: e.serverId,
                    placeId: e.placeId,
                    status: t.status,
                    version: null
                  };
                  const s = await t.json(),
                    r = {
                      serverId: e.serverId,
                      status: s.status,
                      placeId: e.placeId,
                      version: s.PlaceVersion
                    },
                    {
                      joinScript: i
                    } = s;
                  if (!i) return r;
                  if (i?.DataCenterId) {
                    const e = i.UdmuxEndpoints?.[0] || null;
                    r.datacenter = {
                      id: i.DataCenterId,
                      ip: e ? e.Address : null
                    }
                  }
                  return r
                } catch (t) {
                  return {
                    id: null,
                    serverId: e.serverId,
                    placeId: e.placeId,
                    status: -1,
                    version: null
                  }
                }
              }));
            for (const e of a) "fulfilled" === e.status && e.value && t.push(e.value);
            i + s < e.servers.length && await new Promise(e => setTimeout(e, r))
          }
          t.length > 0 && await this.submitServerTask({
              servers: t
            }), console.log(`[SERVER DISCOVERY] Processed ${t.length}/${e.totalServers} servers`), this
            .currentTask = null
        } catch (e) {
          console.error("[SERVER DISCOVERY] Error processing server batch:", e), this.currentTask = null
        }
      }
      async submitServerTask(e) {
        try {
          const t = await fetch(`${j}/submit-server-task`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Extension-Id": this.extensionId
            },
            body: JSON.stringify(e)
          });
          if (!t.ok) throw new Error(`Failed to submit server task: ${t.statusText}`);
          const s = await t.json();
          s.success || console.error("[SERVER DISCOVERY] Server rejected submission:", s.error)
        } catch (e) {
          throw console.error("[SERVER DISCOVERY] Error submitting server task:", e), e
        }
      }
      scheduleNextCheck() {
        this.isRunning && (this.scheduledJob = setTimeout(() => this.checkForServerTask(), 3e5))
      }
    },
    G = z,
    q = "betterblox_friend_tracking",
    V = "betterblox_friend_tracking_history",
    H = new class {
      constructor() {
        this.trackingIntervals = new Map, this.setupAlarmListener()
      }
      setupAlarmListener() {
        chrome.alarms.onAlarm.addListener(e => {
          if (e.name && e.name.startsWith("friendTracking_")) {
            const t = e.name.replace("friendTracking_", "");
            this.checkFriendChanges(t)
          }
        })
      }
      async initializeTracking(e) {
        try {
          const t = String(e);
          console.log(`[Friend Tracking] Initializing tracking for user ${t}`);
          const s = (await E.getFriendsCount(t)).count;
          console.log(`[Friend Tracking] User ${t} has ${s} friends`);
          const r = (await E.getAllFriends(t, 1)).map(e => e.id);
          console.log(`[Friend Tracking] Fetched ${r.length} friend IDs for user ${t}`);
          const i = await this.getTrackingData();
          return i[t] = {
              count: s,
              friendIds: r,
              lastChecked: Date.now(),
              isTracking: !0
            }, await this.saveTrackingData(i), console.log(`[Friend Tracking] Saved tracking data for user ${t}`),
            this.startPeriodicCheck(t), console.log(`[Friend Tracking] Started periodic checking for user ${t}`), {
              success: !0,
              count: s,
              friendCount: r.length
            }
        } catch (t) {
          throw console.error(`[Friend Tracking] Failed to initialize tracking for user ${e}:`, t), t
        }
      }
      async stopTracking(e) {
        try {
          const t = String(e);
          console.log(`[Friend Tracking] Stopping tracking for user ${t}`), this.stopPeriodicCheck(t);
          const s = await this.getTrackingData();
          return s[t] && (delete s[t], await this.saveTrackingData(s), console.log(
            `[Friend Tracking] Removed tracking data for user ${t}`)), {
            success: !0
          }
        } catch (t) {
          throw console.error(`[Friend Tracking] Failed to stop tracking for user ${e}:`, t), t
        }
      }
      async isTracking(e) {
        const t = String(e),
          s = await this.getTrackingData();
        return !0 === s[t]?.isTracking
      }
      async getTrackingDataForUser(e) {
        const t = String(e);
        return (await this.getTrackingData())[t] || null
      }
      startPeriodicCheck(e) {
        const t = String(e);
        this.stopPeriodicCheck(t);
        const s = `friendTracking_${t}`;
        chrome.alarms.create(s, {
            periodInMinutes: 2
          }), this.trackingIntervals.set(t, s), console.log(`[Friend Tracking] Created alarm ${s} for user ${t}`),
          setTimeout(() => {
            this.checkFriendChanges(t)
          }, 1e4)
      }
      stopPeriodicCheck(e) {
        const t = String(e),
          s = this.trackingIntervals.get(t);
        s && (chrome.alarms.clear(s), this.trackingIntervals.delete(t), console.log(
          `[Friend Tracking] Cleared alarm ${s} for user ${t}`))
      }
      async checkFriendChanges(e) {
        try {
          const t = String(e);
          console.log(`[Friend Tracking] Checking friend changes for user ${t}`);
          const s = await this.getTrackingData(),
            r = s[t];
          if (!r || !r.isTracking) return console.log(
            `[Friend Tracking] User ${t} is not being tracked, stopping check`), void this.stopPeriodicCheck(t);
          const i = (await E.getFriendsCount(t)).count;
          if (i === r.count) return console.log(`[Friend Tracking] Friend count unchanged for user ${t} (${i})`), r
            .lastChecked = Date.now(), void await this.saveTrackingData(s);
          console.log(`[Friend Tracking] Friend count changed for user ${t}: ${r.count} -> ${i}`);
          const n = (await E.getAllFriends(t)).map(e => e.id),
            a = new Set(r.friendIds || []),
            o = new Set(n),
            c = (r.friendIds || []).length,
            l = n.filter(e => !a.has(e)),
            d = r.friendIds.filter(e => !o.has(e));
          if (r.count = i, r.friendIds = n, r.lastChecked = Date.now(), await this.saveTrackingData(s), l.length >
            0 || d.length > 0) {
            await this.saveHistory(t, {
              timestamp: Date.now(),
              previousCount: c,
              currentCount: i,
              added: l,
              removed: d
            });
            try {
              chrome.runtime.sendMessage({
                type: "FRIEND_TRACKING_CHANGED",
                userId: t,
                data: {
                  added: l,
                  removed: d,
                  currentCount: i
                }
              }).catch(() => {})
            } catch (e) {}
          }
          console.log(`[Friend Tracking] Changes detected for user ${t}: +${l.length} -${d.length}`)
        } catch (t) {
          console.error(`[Friend Tracking] Error checking friend changes for user ${e}:`, t)
        }
      }
      async getHistory(e) {
        const t = String(e);
        return (await this.getHistoryData())[t] || []
      }
      async saveHistory(e, t) {
        const s = String(e),
          r = await this.getHistoryData();
        r[s] || (r[s] = []), r[s].unshift(t), r[s].length > 100 && (r[s] = r[s].slice(0, 100));
        const i = "undefined" == typeof browser ? chrome : browser;
        await i.storage.local.set({
          [V]: r
        })
      }
      async getTrackingData() {
        return new Promise(e => {
          ("undefined" == typeof browser ? chrome : browser).storage.local.get([q], t => {
            e(t[q] || {})
          })
        })
      }
      async saveTrackingData(e) {
        return new Promise(t => {
          ("undefined" == typeof browser ? chrome : browser).storage.local.set({
            [q]: e
          }, t)
        })
      }
      async getHistoryData() {
        return new Promise(e => {
          ("undefined" == typeof browser ? chrome : browser).storage.local.get([V], t => {
            e(t[V] || {})
          })
        })
      }
      async initializeAllTrackings() {
        const e = await this.getTrackingData();
        for (const t in e) e[t].isTracking && (console.log(
          `[Friend Tracking] Reinitializing tracking for user ${t}`), this.startPeriodicCheck(t))
      }
    };
  H.initializeAllTrackings();
  const Y = H,
    K = "sessions_data",
    J = e => new Promise(t => setTimeout(t, e)),
    B = new class {
      constructor() {
        this.sessionsData = {}, this.currentUserId = null, this.subscribers = [], this.isInitialized = !1
      }
      addSubscriber(e) {
        return "function" == typeof e.handleSessionsUpdate ? (console.log("[SESSIONS] Adding subscriber", e
          .constructor.name), this.subscribers.push(e), !0) : (console.warn(
          "[SESSIONS] Attempted to add invalid subscriber - missing handleSessionsUpdate method"), !1)
      }
      removeSubscriber(e) {
        const t = this.subscribers.indexOf(e);
        return t > -1 && (this.subscribers.splice(t, 1), console.log("[SESSIONS] Removed subscriber", e.constructor
          .name), !0)
      }
      async initialize() {
        if (this.isInitialized) console.log("[SESSIONS] Service already initialized");
        else {
          console.log("[SESSIONS] Initializing sessions service");
          try {
            if (this.sessionsData = await d.get(K, {}), await this.updateCurrentUser(), console.log(
                `[SESSIONS] Loaded sessions data for ${Object.keys(this.sessionsData).length} users`), this
              .currentUserId) {
              const e = this.sessionsData[this.currentUserId];
              console.log(`[SESSIONS] Current user ${this.currentUserId} has ${e?.sessions?.length||0} sessions`)
            }
            this.isInitialized = !0, await this.startPeriodicCheck()
          } catch (e) {
            console.error("[SESSIONS] Failed to initialize:", e)
          }
        }
      }
      async updateCurrentUser() {
        try {
          const e = await N.getAuthData(!0),
            t = e?.id?.toString();
          if (t !== this.currentUserId) {
            const e = this.currentUserId;
            this.currentUserId = t, e && t ? (console.log(`[SESSIONS] Account switched from ${e} to ${t}`),
              await this.notifySessionsChanged(!0)) : t && (console.log(`[SESSIONS] User logged in: ${t}`),
              await this.notifySessionsChanged(!0))
          }
          return t
        } catch (e) {
          return console.error("[SESSIONS] Failed to update current user:", e), null
        }
      }
      async updateSessionsList() {
        try {
          const e = (await N.getAuthData(!0))?.id?.toString();
          if (!e) return void console.log("[SESSIONS] User not authenticated, skipping sessions update");
          if (e !== this.currentUserId) {
            const t = this.currentUserId;
            this.currentUserId = e, t && e ? (console.log(`[SESSIONS] Account switched from ${t} to ${e}`),
              await this.notifySessionsChanged(!0)) : e && (console.log(`[SESSIONS] User logged in: ${e}`),
              await this.notifySessionsChanged(!0))
          }
          const t = e;
          console.log(`[SESSIONS] Fetching sessions for user: ${t}`);
          const s = await this.fetchUserSessions(),
            r = this.sessionsData[t],
            i = r?.sessions || [];
          this.sessionsData[t] = {
            lastUpdated: (new Date).toISOString(),
            sessions: s,
            count: s.length
          }, await this.notifySessionsChanged(), console.log(
            `[SESSIONS] Updated sessions list for user ${t}: ${s.length} sessions found`);
          const n = s.filter(e => !i.some(t => t.token === e.token)),
            a = i.filter(e => !s.some(t => t.token === e.token));
          n.length > 0 && console.log(`[SESSIONS] New sessions detected: ${n.length}`), a.length > 0 && console.log(
            `[SESSIONS] Sessions removed: ${a.length}`)
        } catch (e) {
          console.error("[SESSIONS] Failed to update sessions list:", e)
        }
      }
      async fetchUserSessions() {
        try {
          const e = await fetch(
            "https://apis.roblox.com/token-metadata-service/v1/sessions?nextCursor=&desiredLimit=100", {
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              }
            });
          if (!e.ok) throw new Error(`HTTP error! status: ${e.status}`);
          return (await e.json()).sessions || []
        } catch (e) {
          return console.error("[SESSIONS] Failed to fetch sessions:", e), []
        }
      }
      async notifySessionsChanged(e = !1) {
        try {
          await d.set(K, this.sessionsData);
          const t = this.getCurrentUserSessions();
          if (this.subscribers.length > 0) {
            console.log(`[SESSIONS] Notifying ${this.subscribers.length} direct subscribers`);
            for (const s of this.subscribers) try {
              await s.handleSessionsUpdate(t, {
                accountSwitched: e,
                currentUserId: this.currentUserId,
                allUsersData: this.sessionsData
              })
            } catch (e) {
              console.error("[SESSIONS] Error notifying subscriber:", e)
            }
          }
          const s = await chrome.tabs.query({
            url: "*://*.roblox.com/*"
          });
          s && Array.isArray(s) && s.forEach(async s => {
            try {
              await chrome.tabs.sendMessage(s.id, {
                type: "SESSIONS_UPDATED",
                data: t,
                meta: {
                  accountSwitched: e,
                  currentUserId: this.currentUserId
                }
              })
            } catch (e) {}
          })
        } catch (e) {
          console.error("[SESSIONS] Failed to notify sessions changed:", e)
        }
      }
      async startPeriodicCheck() {
        for (await this.updateSessionsList(), chrome.alarms.create("sessionsCheck", {
            periodInMinutes: .25
          }), chrome.alarms.onAlarm.addListener(e => {
            "sessionsCheck" === e.name && this.updateSessionsList()
          }); this.currentUserId && !this.getCurrentUserSessions();) console.log(
            "[SESSIONS] No sessions data found for current user, waiting 10 seconds before retrying"), await J(1e4),
          await this.updateSessionsList()
      }
      getCurrentUserSessions() {
        return this.currentUserId && this.sessionsData[this.currentUserId] || null
      }
      getUserSessions(e) {
        return this.sessionsData[e] || null
      }
      getSessionsList() {
        return this.getCurrentUserSessions()
      }
      async getSessions() {
        const e = this.getCurrentUserSessions();
        if (e?.sessions) return e.sessions;
        if (this.currentUserId) {
          const e = await d.get(K, {});
          return e[this.currentUserId]?.sessions || []
        }
        return []
      }
      async getSessionsForUser(e) {
        const t = this.getUserSessions(e);
        if (t?.sessions) return t.sessions;
        const s = await d.get(K, {});
        return s[e]?.sessions || []
      }
      async getSessionsCount() {
        return (await this.getSessions()).length
      }
      async getSessionsCountForUser(e) {
        return (await this.getSessionsForUser(e)).length
      }
      async refreshSessionsList() {
        console.log("[SESSIONS] Manual refresh requested"), await this.updateSessionsList()
      }
      getAllUsersData() {
        return this.sessionsData
      }
      getCurrentUserId() {
        return this.currentUserId
      }
    };
  const X = new class {
      constructor() {
        this.isInitialized = !1
      }
      async initialize() {
        if (!this.isInitialized) try {
          chrome.tabs.onUpdated.addListener((e, t, s) => {
            this.handleTabUpdate(e, t, s)
          }), this.isInitialized = !0
        } catch (e) {
          console.error("[SHIELD] Failed to initialize:", e)
        }
      }
      async sendUrlToLauncher(e) {
        if (e) try {
          const t = await async function(e) {
            const t = await async function() {
              const e = (new TextEncoder).encode("BetterBLOX-Launcher-Payload-v1"),
                t = await crypto.subtle.digest("SHA-256", e);
              return crypto.subtle.importKey("raw", t, {
                name: "AES-GCM"
              }, !1, ["encrypt"])
            }(), s = crypto.getRandomValues(new Uint8Array(12)), r = (new TextEncoder).encode(JSON
              .stringify(e)), i = await crypto.subtle.encrypt({
              name: "AES-GCM",
              iv: s,
              tagLength: 128
            }, t, r), n = new Uint8Array(s.length + i.byteLength);
            n.set(s, 0), n.set(new Uint8Array(i), s.length);
            let a = "";
            for (let e = 0; e < n.length; e++) a += String.fromCharCode(n[e]);
            return btoa(a)
          }({
            url: e
          }), s = await fetch("http://127.0.0.1:3658/shield-check", {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
              "X-Encrypted": "1"
            },
            body: t
          });
          if (!s.ok) return;
          (await s.json()).malicious && console.log("[SHIELD] Malicious URL reported to launcher:", e)
        } catch (e) {}
      }
      async handleTabUpdate(e, t, s) {
        "complete" === t.status && s?.url && await this.sendUrlToLauncher(s.url)
      }
    },
    W = new class {
      constructor() {
        this.CHECK_INTERVAL = 18e5, this.MAX_RETRIES = 3, this.retryCount = 0
      }
      init() {
        chrome.runtime.onUpdateAvailable.addListener(e => {
          console.log(`Update available: version ${e.version}`), this.performUpdate()
        }), this.startUpdateChecks()
      }
      async performUpdate() {
        try {
          chrome.runtime.reload()
        } catch (e) {
          console.error("Error during update:", e)
        }
      }
      async checkForUpdates() {
        try {
          if ("function" == typeof chrome.runtime.requestUpdateCheck) {
            const e = await this.requestUpdateCheck();
            switch (e) {
              case "update_available":
                console.log("Update is pending...");
                break;
              case "no_update":
                console.log("Extension is up to date"), this.retryCount = 0;
                break;
              case "throttled":
                console.log("Update check throttled. Backing off..."), this.handleThrottled();
                break;
              default:
                console.log(`Unknown update status: ${e}`)
            }
          } else console.log("Automatic update checking not supported in this browser"), this.retryCount = 0
        } catch (e) {
          console.error("Error checking for updates:", e), this.handleError()
        }
      }
      requestUpdateCheck() {
        return new Promise(e => {
          try {
            chrome.runtime.requestUpdateCheck(t => {
              e(t)
            })
          } catch (t) {
            console.warn("requestUpdateCheck not supported:", t), e("no_update")
          }
        })
      }
      handleThrottled() {
        if (this.retryCount++, this.retryCount < this.MAX_RETRIES) {
          const e = this.CHECK_INTERVAL * Math.pow(2, this.retryCount);
          setTimeout(() => this.checkForUpdates(), e)
        }
      }
      handleError() {
        if (this.retryCount++, this.retryCount < this.MAX_RETRIES) {
          const e = this.CHECK_INTERVAL * Math.pow(2, this.retryCount);
          setTimeout(() => this.checkForUpdates(), e)
        }
      }
      startUpdateChecks() {
        this.checkForUpdates(), setInterval(() => {
          this.retryCount < this.MAX_RETRIES && this.checkForUpdates()
        }, this.CHECK_INTERVAL)
      }
    },
    Q = new class {
      constructor() {
        this.currentAccessToken = null
      }
      async initializeAuth() {
        try {
          const e = await chrome.runtime.sendMessage({
            type: "GET_AUTH_TOKEN"
          });
          return !(!e || !e.accessToken || (this.currentAccessToken = e.accessToken, 0))
        } catch (e) {
          return console.error("[QUEST] Authentication failed:", e), !1
        }
      }
      async fetchWithRetry(e, t = {}) {
        try {
          this.currentAccessToken || await this.initializeAuth();
          const s = await fetch(e, t);
          if (s.ok) return s;
          if (401 === s.status) {
            const r = await s.json().catch(() => ({}));
            if ("TOKEN_INVALID" === r.code || "TOKEN_MISSING" === r.code) return console.log(
                "[QUEST] Token expired, attempting refresh"), await this.initializeAuth(), t.headers && t.headers
              .Authorization && (t.headers.Authorization = `Bearer ${this.currentAccessToken}`), console.log(
                "[QUEST] Retrying request with refreshed token"), await fetch(e, t)
          }
          return s
        } catch (e) {
          throw console.error("[QUEST] Fetch error:", e), e
        }
      }
      async awardReward(e) {
        try {
          if (!e || "object" != typeof e) throw new Error("Invalid payload: payload must be an object");
          if (!e.questId || "string" != typeof e.questId) throw new Error(
            "Invalid payload: questId is required and must be a string");
          if ("number" != typeof e.xp || e.xp <= 0) throw new Error(
            "Invalid payload: xp is required and must be a positive number");
          if (!this.currentAccessToken && !await this.initializeAuth()) throw new Error(
            "Authentication required to award quest rewards");
          const s = {
              questId: e.questId,
              xp: e.xp,
              ...e.metadata && {
                metadata: e.metadata
              }
            },
            r = await this.fetchWithRetry(`${t}/api/quest/awardReward`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.currentAccessToken}`
              },
              body: JSON.stringify(s)
            });
          if (!r.ok) {
            let e;
            try {
              e = await r.json()
            } catch {
              try {
                e = {
                  error: await r.text()
                }
              } catch {
                e = {
                  error: "Unknown error"
                }
              }
            }
            return console.error(`[QUEST] Server error: ${r.status} ${r.statusText}`, e), {
              success: !1,
              error: e.error || e.message || `Server error: ${r.status}`,
              status: r.status,
              alreadyCompleted: 409 === r.status || "QUEST_ALREADY_COMPLETED" === e.code
            }
          }
          const i = await r.json();
          return i.success && console.log(`[QUEST] Successfully awarded ${e.xp} XP for quest ${e.questId}`), i
        } catch (e) {
          return console.error("[QUEST] Error awarding quest reward:", e), {
            success: !1,
            error: e.message || "Unknown error occurred"
          }
        }
      }
      async getQuestStatus(e) {
        try {
          if (!e || "string" != typeof e) throw new Error("questId is required and must be a string");
          if (!this.currentAccessToken && !await this.initializeAuth()) throw new Error(
            "Authentication required to check quest status");
          const s = await this.fetchWithRetry(`${t}/api/quest/status/${encodeURIComponent(e)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.currentAccessToken}`
            }
          });
          if (!s.ok) {
            let t;
            try {
              t = await s.json()
            } catch {
              try {
                t = {
                  error: await s.text()
                }
              } catch {
                t = {
                  error: "Unknown error"
                }
              }
            }
            return {
              questId: e,
              completed: !1,
              completedAt: null,
              error: t.error || t.message || `Server error: ${s.status}`
            }
          }
          const r = await s.json();
          return {
            questId: e,
            completed: r.completed || !1,
            completedAt: r.completedAt || null
          }
        } catch (t) {
          return console.error("[QUEST] Error getting quest status:", t), {
            questId: e,
            completed: !1,
            completedAt: null,
            error: t.message
          }
        }
      }
    };

  function Z() {
    "undefined" == typeof browser ? chrome.cookies.set({
      url: "https://betterroblox.com",
      name: "refferrerCode",
      value: "test"
    }) : browser.cookies.set({
      url: "https://betterroblox.com",
      name: "refferrerCode",
      value: "test"
    })
  }
  "undefined" == typeof browser ? chrome.cookies.get({
    url: "https://betterroblox.com",
    name: "refferrerCode"
  }, e => {
    e?.value && Z(e.value)
  }) : browser.cookies.get({
    url: "https://betterroblox.com",
    name: "refferrerCode"
  }).then(e => {
    e?.value && Z(e.value)
  }), async function() {
    console.log("[BETTERBLOX] Initializing v2 background theme bridge"), N.init(), W.init(), r.init(), chrome
      .runtime.onMessage.addListener((e, t, s) => "GET_LICENSE" === e.type ? (c.getLicense().then(s).catch(e => {
        console.error("[License] GET_LICENSE error:", e), s(!1)
      }), !0) : "SET_LICENSE" === e.type ? (c.setLicense(e.licenseKey ?? e.data).then(s).catch(e => {
        console.error("[License] SET_LICENSE error:", e), s(!1)
      }), !0) : void 0), P.addSubscriber(h), P.addSubscriber(f), P.addSubscriber(w), P.addSubscriber(A), U
      .addSubscriber($), B.addSubscriber(x), await U.initialize(), await B.initialize(), await P.initialize(),
      await A.initialize(), await _.initialize(), await M.initialize(), await G.initialize(), await X
    .initialize(), await async function() {
        chrome.runtime.onMessage.addListener((t, s, r) => {
          if ("API_REQUEST" === t.type && async function(t) {
              const {
                url: s,
                options: r,
                payloadOptions: i
              } = t;
              try {
                const t = {
                  ...r
                };
                t.headers || (t.headers = {}), e && (t.headers["x-csrf-token"] = e);
                const n = await fetch(s, t);
                if (n.headers.has("x-csrf-token") && (e = n.headers.get("x-csrf-token")), !n.ok) {
                  if (403 === n.status && e) {
                    t.headers["x-csrf-token"] = e;
                    try {
                      console.log("Retrying request with CSRF token");
                      const e = await fetch(s, t),
                        r = {};
                      if (e.headers.forEach((e, t) => {
                          r[t] = e
                        }), e.ok) return {
                        data: await e.json(),
                        status: e.status,
                        headers: r
                      };
                      {
                        const t = await e.text();
                        return {
                          error: `API request failed after CSRF retry with status ${e.status}: ${t}`,
                          status: e.status,
                          headers: r
                        }
                      }
                    } catch (e) {
                      return {
                        error: `CSRF retry error: ${e.message}`,
                        status: 500
                      }
                    }
                  }
                  let r = null;
                  try {
                    r = await n.json()
                  } catch (e) {
                    r = await n.text()
                  }
                  const i = {};
                  return n.headers.forEach((e, t) => {
                    i[t] = e
                  }), {
                    error: `API request failed with status ${n.status}`,
                    message: r,
                    status: n.status,
                    headers: i
                  }
                }
                const a = {};
                n.headers.forEach((e, t) => {
                  a[t] = e
                });
                let o = null;
                return o = "text" == i?.mode ? await n.text() : await n.json(), {
                  data: o,
                  status: n.status,
                  headers: a
                }
              } catch (e) {
                return {
                  error: `Fetch error: ${e.message}`
                }
              }
            }(t.data).then(e => {
              r(e)
            }).catch(e => {
              console.error("Error handling API request:", e), r({
                error: e.message,
                status: 500
              })
            }), "GET_RBLX_ACC" === t.type && async function() {
              let e = null;
              if (e = "undefined" == typeof browser ? await chrome.cookies.get({
                  url: "https://www.roblox.com",
                  name: ".ROBLOSECURITY"
                }) : await browser.cookies.get({
                  url: "https://www.roblox.com",
                  name: ".ROBLOSECURITY"
                }), !e || !e.value) return null;
              const t = await fetch("https://users.roblox.com/v1/users/authenticated");
              if (!t.ok) return null;
              const s = await t.json();
              return s?.errors ? null : (s.cookie = e.value, s)
            }().then(e => {
              r(e)
            }).catch(e => {
              console.error("Error getting Roblox account:", e), r(null)
            }), "SET_ROBLOSECURITY_COOKIE" === t.type && ("undefined" == typeof browser ? chrome.cookies
              .set({
                url: "https://www.roblox.com",
                name: ".ROBLOSECURITY",
                value: t.data
              }) : browser.cookies.set({
                url: "https://www.roblox.com",
                name: ".ROBLOSECURITY",
                value: t.data
              }), r({
                success: !0,
                cookie: t.data
              })), "GET_AUTH_TOKEN" === t.type && async function() {
              try {
                const e = await async function() {
                  try {
                    const e = "undefined" == typeof browser ? chrome : browser;
                    return (await e.storage.local.get(["authToken"])).authToken || null
                  } catch (e) {
                    return console.error("Error getting stored token:", e), null
                  }
                }();
                if (e && await async function(e) {
                    try {
                      const t = new URL("https://api.betterroblox.com/auth/status");
                      t.searchParams.set("token", e);
                      const s = await fetch(t.toString(), {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json"
                        }
                      });
                      return !!s.ok && (await s.json()).authenticated
                    } catch (e) {
                      return console.error("Error checking token validity:", e), !1
                    }
                  }(e.accessToken)) return console.log("Using stored valid token"), e;
                console.log("Getting new auth token");
                const t = I(),
                  s = I(),
                  r = t,
                  i = "1298491012038790056",
                  n = await fetch("https://users.roblox.com/v1/users/authenticated", {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }),
                  a = (await n.json()).id;
                if (!a) throw new Error("Failed to get user id");
                const o = await async function(e, t, s, r) {
                  const i = (await fetch("https://apis.roblox.com/oauth/v1/authorizations", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      clientId: e,
                      responseTypes: ["Code"],
                      redirectUri: "http://localhost:4949/auth/callback",
                      scopes: [{
                        scopeType: "openid",
                        operations: ["read"]
                      }, {
                        scopeType: "profile",
                        operations: ["read"]
                      }],
                      state: t,
                      nonce: s,
                      resourceInfos: [{
                        owner: {
                          id: r,
                          type: "User"
                        },
                        resources: {}
                      }]
                    })
                  })).headers.get("x-csrf-token");
                  if (!i) throw new Error("Failed to get XSRF token from response headers");
                  return i
                }(i, t, s, a), c = await fetch(
                "https://apis.roblox.com/oauth/v1/authorizations", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": o
                  },
                  body: JSON.stringify({
                    clientId: i,
                    responseTypes: ["Code"],
                    redirectUri: "http://localhost:4949/auth/callback",
                    scopes: [{
                      scopeType: "openid",
                      operations: ["read"]
                    }, {
                      scopeType: "profile",
                      operations: ["read"]
                    }],
                    state: t,
                    nonce: s,
                    resourceInfos: [{
                      owner: {
                        id: a,
                        type: "User"
                      },
                      resources: {}
                    }]
                  })
                }), l = await c.json();
                if (l.location) {
                  const {
                    code: e,
                    state: t
                  } = function(e) {
                    try {
                      const t = new URL(e);
                      return {
                        code: t.searchParams.get("code"),
                        state: t.searchParams.get("state")
                      }
                    } catch (e) {
                      throw new Error("Failed to parse location URL")
                    }
                  }(l.location), i = await async function(e, t, s) {
                    try {
                      const r = new URL("https://api.betterroblox.com/auth/authenticate");
                      r.searchParams.set("code", e), r.searchParams.set("state", t), r
                        .searchParams.set("original_state", t), r.searchParams.set("nonce", s);
                      const i = await fetch(r.toString(), {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json"
                        }
                      });
                      if (!i.ok) throw new Error(`Token exchange failed: ${i.status}`);
                      return await i.json()
                    } catch (e) {
                      return console.error("Error exchanging code for token:", e), null
                    }
                  }(e, r, s);
                  if (i && i.success) return await async function(e) {
                    try {
                      const t = "undefined" == typeof browser ? chrome : browser;
                      await t.storage.local.set({
                        authToken: e
                      }), console.log("Token stored successfully")
                    } catch (e) {
                      console.error("Error storing token:", e)
                    }
                  }(i), i
                }
                return l
              } catch (e) {
                throw console.error("Error getting auth token:", e), e
              }
            }().then(e => {
              r(e)
            }).catch(e => {
              console.error("Error getting auth token:", e), r({
                error: e.message
              })
            }), "DETECT_DEV" === t.type && async function() {
              const e = "http://localhost:5174",
                t = "https://theme.betterroblox.com",
                s = "undefined" == typeof browser ? chrome : browser;
              try {
                const r = await s.storage.local.get(["themeEnvironment", "devModeEnabled"]);
                let i = r.themeEnvironment;
                if (i || !0 !== r.devModeEnabled || (i = "dev"), i || (i = "production"), "dev" ===
                  i) {
                  console.log("Checking for development server at", e);
                  try {
                    if ((await fetch(e + "/home", {
                        method: "HEAD"
                      })).ok) return console.log("Development server detected, using localhost"), e
                  } catch (e) {
                    return console.log("Development server not available:", e.message), console.log(
                      "Falling back to production server"), t
                  }
                }
                switch (i) {
                  case "dev":
                    return e;
                  case "beta":
                    return console.log("Using beta server"), "https://beta.theme.betterroblox.com";
                  default:
                    return console.log("Using production server"), t
                }
              } catch (e) {
                return console.error("Error detecting environment:", e), console.log(
                  "Falling back to production server"), t
              }
            }().then(e => {
              r({
                origin: e
              })
            }).catch(e => {
              console.error("Error detecting environment:", e), r({
                origin: "https://theme.betterroblox.com"
              })
            }), "GET_ROBLOX_USERS_DATA" === t.type && async function(e) {
              if (!e || !Array.isArray(e) || 0 === e.length) return [];
              try {
                const t = e.map(async e => {
                    try {
                      const t = await fetch(`https://users.roblox.com/v1/users/${e}`);
                      return t.ok ? await t.json() : (console.warn(
                        `Failed to fetch user info for ${e}:`, t.status), null)
                    } catch (t) {
                      return console.warn(`Error fetching user info for ${e}:`, t), null
                    }
                  }),
                  s = (await Promise.all(t)).filter(e => null !== e).map(async e => {
                    try {
                      const t = await fetch(
                        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${e.id}&size=150x150&format=Png&isCircular=true`
                        );
                      if (!t.ok) return console.warn(`Failed to fetch thumbnail for ${e.id}:`,
                        t.status), {
                        ...e,
                        thumbnailUrl: null
                      };
                      const s = await t.json(),
                        r = s.data && s.data.length > 0 ? s.data[0].imageUrl : null;
                      return {
                        ...e,
                        thumbnailUrl: r
                      }
                    } catch (t) {
                      return console.warn(`Error fetching thumbnail for ${e.id}:`, t), {
                        ...e,
                        thumbnailUrl: null
                      }
                    }
                  }),
                  r = await Promise.all(s);
                return console.log(`Successfully fetched data for ${r.length} users`), r
              } catch (e) {
                throw console.error("Error in getRobloxUsersData:", e), e
              }
            }(t.userIds).then(e => {
              r({
                success: !0,
                users: e
              })
            }).catch(e => {
              console.error("Error getting Roblox users data:", e), r({
                success: !1,
                error: e.message
              })
            }), "START_FRIEND_TRACKING" === t.type) {
            const e = t.userId || t.data?.userId;
            return e ? (Y.initializeTracking(e).then(e => {
              r({
                success: !0,
                ...e
              })
            }).catch(e => {
              console.error("Error starting friend tracking:", e), r({
                success: !1,
                error: e.message
              })
            }), !0) : (console.error("START_FRIEND_TRACKING: userId is missing from message", t), r({
              success: !1,
              error: "userId is required"
            }), !0)
          }
          if ("STOP_FRIEND_TRACKING" === t.type) {
            const e = t.userId || t.data?.userId;
            return e ? (Y.stopTracking(e).then(e => {
              r({
                success: !0,
                ...e
              })
            }).catch(e => {
              console.error("Error stopping friend tracking:", e), r({
                success: !1,
                error: e.message
              })
            }), !0) : (console.error("STOP_FRIEND_TRACKING: userId is missing from message", t), r({
              success: !1,
              error: "userId is required"
            }), !0)
          }
          if ("GET_FRIEND_TRACKING_HISTORY" === t.type) {
            const e = t.userId || t.data?.userId;
            return e ? (Y.getHistory(e).then(e => {
              r({
                success: !0,
                history: e
              })
            }).catch(e => {
              console.error("Error getting friend tracking history:", e), r({
                success: !1,
                error: e.message
              })
            }), !0) : (console.error("GET_FRIEND_TRACKING_HISTORY: userId is missing from message", t),
          r({
              success: !1,
              error: "userId is required"
            }), !0)
          }
          if ("AWARD_QUEST_REWARD" === t.type) {
            const e = t.data || t.payload;
            return e ? (Q.awardReward(e).then(e => {
              r(e)
            }).catch(e => {
              console.error("Error awarding quest reward:", e), r({
                success: !1,
                error: e.message
              })
            }), !0) : (r({
              success: !1,
              error: "Payload is required"
            }), !0)
          }
          if ("GET_QUEST_STATUS" === t.type) {
            const e = t.questId || t.data?.questId;
            return e ? (Q.getQuestStatus(e).then(e => {
              r({
                success: !0,
                ...e
              })
            }).catch(e => {
              console.error("Error getting quest status:", e), r({
                success: !1,
                error: e.message
              })
            }), !0) : (r({
              success: !1,
              error: "questId is required"
            }), !0)
          }
          return !0
        })
      }()
  }(), chrome.runtime.onMessage.addListener((e, t, s) => "GET_PRESENCE_FOR_USERS" === e.type ? ((async () => {
    s(await async function(e) {
      const t = await fetch("https://presence.roblox.com/v1/presence/users", {
        method: "POST",
        body: JSON.stringify({
          userIds: e
        })
      });
      return await t.json()
    }(e.data.userIds))
  })(), !0) : "requestShieldPermissions" === e.action ? (chrome.permissions.request(e.permissions, e => {
    chrome.runtime.lastError ? s({
      success: !1,
      error: chrome.runtime.lastError.message
    }) : s(e ? {
      success: !0
    } : {
      success: !1,
      error: "Permissions were denied"
    })
  }), !0) : "checkShieldPermissions" === e.action ? (chrome.permissions.contains({
    permissions: ["management"]
  }, e => {
    s({
      hasPermissions: e
    })
  }), !0) : "getAllExtensions" === e.action ? (chrome.management.getAll(e => {
    chrome.runtime.lastError ? s({
      success: !1,
      error: chrome.runtime.lastError.message
    }) : s({
      success: !0,
      extensions: e
    })
  }), !0) : void 0)
})();
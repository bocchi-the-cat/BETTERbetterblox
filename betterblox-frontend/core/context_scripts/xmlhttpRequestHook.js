! function() {
  const t = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const e = new t,
      n = e.open,
      s = e.send;
    return e.open = function(...t) {
      const [s, o] = t;
      return this._url = o, n.apply(e, t)
    }, e.send = function(t) {
      return e.addEventListener("load", function() {
        let t;
        const n = e.getResponseHeader("content-type");
        try {
          t = n && n.includes("application/json") ? JSON.parse(e.responseText) : e.responseText;
          const s = new CustomEvent("BETTERBLOX_XHR_RESPONSE", {
            detail: {
              url: this._url,
              data: t,
              status: e.status,
              contentType: n,
              isJson: n && n.includes("application/json")
            }
          });
          document.dispatchEvent(s)
        } catch (t) {
          console.error("Error processing response:", t);
          const s = new CustomEvent("BETTERBLOX_XHR_RESPONSE", {
            detail: {
              url: this._url,
              data: e.responseText,
              status: e.status,
              contentType: n,
              isJson: !1,
              error: t.message
            }
          });
          document.dispatchEvent(s)
        }
      }), s.apply(e, arguments)
    }, e
  }, console.log(
    "🔄 Betterblox XMLHttpRequest successfully hooked to avoid resending api requests and cause rate limiting")
}();
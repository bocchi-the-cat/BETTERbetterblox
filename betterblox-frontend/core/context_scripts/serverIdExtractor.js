! function() {
  function e(e) {}

  function t() {
    const t = document.getElementsByClassName("rbx-public-game-server-item");
    for (const o of t) e()
  }
  const o = new MutationObserver(t => {
    t.forEach(t => {
      t.addedNodes.forEach(t => {
        if (1 === t.nodeType && t.classList?.contains("rbx-public-game-server-item"), 1 === t.nodeType) {
          const o = t.getElementsByClassName("rbx-public-game-server-item");
          for (const t of o) e()
        }
      })
    })
  });
  document.body ? (o.observe(document.body, {
    childList: !0,
    subtree: !0
  }), t()) : document.addEventListener("DOMContentLoaded", () => {
    o.observe(document.body, {
      childList: !0,
      subtree: !0
    }), t()
  })
}();
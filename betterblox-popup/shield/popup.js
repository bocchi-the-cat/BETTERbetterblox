document.addEventListener("DOMContentLoaded", function() {
  const e = document.getElementById("title"),
    t = document.getElementById("subtitle"),
    n = document.getElementById("extensionInfo"),
    i = document.getElementById("extensionName"),
    o = document.getElementById("extensionId"),
    a = document.getElementById("threatLevel"),
    l = document.getElementById("description"),
    s = document.getElementById("shieldIcon"),
    d = new URLSearchParams(window.location.search),
    r = {
      name: d.get("name") || "Unknown Item",
      id: d.get("id") || "unknown-id",
      malicious: "true" === d.get("malicious"),
      url: d.get("url") || "",
      domain: d.get("domain") || "",
      reason: d.get("reason") || "Unknown threat",
      threatLevel: d.get("threatLevel") || "unknown",
      type: d.get("type") || "extension",
      description: d.get("description") || "This item has been flagged as potentially malicious."
    };
  ! function() {
    if (r.malicious) {
      let d = "",
        c = "",
        h = "";
      switch (r.type) {
        case "extension":
          d = "Malicious Extension Detected", c =
            "BetterBLOX Shield has detected a potentially dangerous extension link", h =
            "Do not install this extension and consider removing it if already installed.";
          break;
        case "domain":
          d = "Dangerous Website Detected", c = "BetterBLOX Shield has detected a potentially harmful website", h =
            "Do not visit this website or provide any personal information.";
          break;
        case "url":
          d = "Malicious Link Detected", c = "BetterBLOX Shield has detected a potentially dangerous link", h =
            "Do not click on this link or download anything from this page.";
          break;
        default:
          d = "Security Threat Detected", c = "BetterBLOX Shield has detected a potential security threat", h =
            "Exercise caution and avoid interacting with this item."
      }
      e.innerHTML =
        `\n        <svg style="width: 24px; height: 24px; display: inline-block; vertical-align: middle; margin-right: 8px; fill: #fef2f2;" viewBox="0 0 24 24">\n          <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />\n        </svg>\n        ${d}\n      `,
        t.textContent = c, n.style.display = "block", i.textContent = r.name, "extension" === r.type ? o
        .textContent = r.id : "domain" === r.type ? o.textContent = r.domain || r.url : o.textContent = r.url;
      const m = r.threatLevel.toUpperCase() + " RISK";
      a.textContent = m, a.className = `threat-level ${r.threatLevel.toLowerCase()}`, s.style.display = "none", l
        .innerHTML =
        `\n        <h4>\n          <svg style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 6px; fill: #fef2f2;" viewBox="0 0 24 24">\n            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />\n          </svg>\n          Security Warning\n        </h4>\n        <p><strong>Threat:</strong> ${r.reason}</p>\n        <p><strong>Risk Level:</strong> ${r.threatLevel.toUpperCase()}</p>\n        <p>${r.description}</p>\n        <p><strong>Recommendation:</strong> ${h}</p>\n      `
    } else e.textContent = "BetterBLOX Shield", t.textContent = "Protect yourself from malicious extensions", n
      .style.display = "none", s.style.display = "flex", l.innerHTML =
      "\n        <h4>What is BetterBLOX Shield?</h4>\n        <p>BetterBLOX Shield monitors your browser for potentially malicious extensions and warns you when you visit dangerous extension pages.</p>\n        <ul>\n          <li>Real-time extension monitoring</li>\n          <li>Malicious extension detection</li>\n          <li>Chrome Web Store integration</li>\n          <li>Automatic threat warnings</li>\n        </ul>\n      "
  }(), document.addEventListener("keydown", e => {
    "Escape" === e.key && window.close()
  })
});
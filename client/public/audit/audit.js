/* Atla analysis pages: reading progress, one-time reveals and GA4 tracking.
   A separate file because the site CSP allows no inline scripts.

   GA4 events (G-X4ZD7PGXE3). Register audit, recipient, section and max_section
   as event-scoped custom dimensions in GA4, or they won't appear in reports.
     audit_open      {audit, recipient}
     audit_section   {audit, recipient, section, section_index}   after 800ms in view, once per visit (index matches the page label; cover = 0)
     audit_complete  {audit, recipient}                           reached the last section
     audit_time      {audit, recipient, seconds, max_section}     each time the tab is hidden
     audit_click     {audit, recipient, target}                   reply links
     audit_gate      {audit, recipient, status}                   gate passed; status says whether Attio saved it
   Name and email go only to /api/contact (Attio), never to GA.
   recipient is an opaque code from ?r= (map codes to people outside GA; never put a name in the link). */
(function () {
  var GA = "G-X4ZD7PGXE3";
  var root = document.documentElement;
  root.classList.add("js");

  var audit = document.body.getAttribute("data-audit") || "unknown";
  var code = new URLSearchParams(location.search).get("r") || "";
  var recipient = /^[a-z0-9]{2,12}$/i.test(code) ? code.toLowerCase() : "direct";
  var pagePath = location.pathname.toLowerCase().replace(/\/index\.html$|\/$/, "");

  // Carry the link code into the questionnaire so its answers are tied to the same person.
  if (recipient !== "direct") {
    document.querySelectorAll('a[href*="/questionnaire/"]').forEach(function (a) { a.search = "?r=" + recipient; });
  }

  // Only the live site counts. Local and Vercel preview visits are never sent.
  if (!/(^|\.)atla\.design$/.test(location.hostname)) window["ga-disable-" + GA] = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", GA, { page_location: location.origin + location.pathname, page_title: document.title });
  function track(name, extra) {
    var p = { audit: audit, recipient: recipient };
    for (var k in extra) p[k] = extra[k];
    gtag("event", name, p);
  }
  track("audit_open", {});

  // Gate: name and email before reading. The page scrolls behind the blur; nothing is clickable.
  var unlocked = true;
  var watch = null, sections = [];
  var gateEl = document.getElementById("gate");
  var main = document.querySelector("main");
  var storeKey = "atla-audit-" + audit;
  function stored() { try { return localStorage.getItem(storeKey) === "1"; } catch (e) { return false; } }
  function unlock(status) {
    unlocked = true;
    try { localStorage.setItem(storeKey, "1"); } catch (e) {}
    gateEl.hidden = true;
    root.classList.remove("gated");
    if (main) main.inert = false;
    track("audit_gate", { status: status });
    // Re-observe so the section already on screen is counted without needing a scroll.
    if (watch) sections.forEach(function (sec) { watch.unobserve(sec); watch.observe(sec); });
  }
  // Links sent to a person carry ?r=<code>: we already know who they are, so they read without the gate.
  if (gateEl && !stored() && recipient === "direct") {
    unlocked = false;
    gateEl.hidden = false;
    root.classList.add("gated");
    if (main) main.inert = true;
    var form = gateEl.querySelector("form");
    var err = gateEl.querySelector(".gate-err");
    var btn = form.querySelector("button");
    setTimeout(function () { form.name.focus({ preventScroll: true }); }, 50);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = "Please enter your name and a valid email.";
        err.hidden = false;
        return;
      }
      err.hidden = true;
      btn.disabled = true;
      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
      fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl ? ctrl.signal : undefined,
        body: JSON.stringify({
          name: name,
          email: email,
          company: document.body.getAttribute("data-brand") || "",
          message: "Opened " + document.title.replace(/ · Atla$/, "") + " at atla.design" + pagePath + "." + (recipient !== "direct" ? " Link code: " + recipient + "." : ""),
          source: "atla.design" + pagePath,
          _gotcha: form._gotcha.value
        })
      }).then(function (r) {
        clearTimeout(timer);
        // The browser already checked the fields, so a 400 here is ours: let the reader in.
        // Remembered on this device so the questionnaire can prefill it.
        try { localStorage.setItem("atla-audit-contact", JSON.stringify({ name: name, email: email })); } catch (e) {}
        // Saved, or the CRM is unreachable: the reader gets in either way.
        unlock(r.ok ? "saved" : "unsaved_" + r.status);
      }).catch(function () {
        clearTimeout(timer);
        try { localStorage.setItem("atla-audit-contact", JSON.stringify({ name: name, email: email })); } catch (e) {}
        unlock("unsaved_network");
      });
    });
  }

  // Reading progress
  var bar = document.querySelector(".progress i");
  var ticking = false;
  function progress() {
    var max = root.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal], .s-chapter").forEach(function (el) { el.classList.add("in"); });
    return;
  }

  // The top bar turns dark while it sits over the cover or a part divider.
  var barEl = document.querySelector(".bar");
  var darkOn = new Set();
  var darkWatch = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.isIntersecting ? darkOn.add(e.target) : darkOn.delete(e.target); });
    if (barEl) barEl.classList.toggle("on-dark", darkOn.size > 0);
  }, { rootMargin: "0px 0px -90% 0px" });
  document.querySelectorAll(".s-cover, .s-chapter").forEach(function (el) { darkWatch.observe(el); });

  // Figures animate once, the first time they are well inside the screen.
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll("[data-reveal], .s-chapter").forEach(function (el) { reveal.observe(el); });

  // The diagram's moving dots run only while the diagram is on screen.
  var flow = document.querySelector(".flow");
  if (flow && flow.pauseAnimations) {
    flow.pauseAnimations();
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? flow.unpauseAnimations() : flow.pauseAnimations(); });
    }).observe(flow);
  }

  // Section tracking: counted after 800ms in view, so fast scrolling doesn't register as reading.
  sections = Array.prototype.slice.call(document.querySelectorAll("main > section"));
  var timers = {}, seen = {}, maxSection = 0;
  watch = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var i = sections.indexOf(e.target);
      if (e.isIntersecting && !seen[i] && unlocked) {
        timers[i] = setTimeout(function () {
          seen[i] = true;
          if (i > maxSection) maxSection = i;
          track("audit_section", { section: e.target.getAttribute("data-name"), section_index: i });
          if (i === sections.length - 1) track("audit_complete", {});
        }, 800);
      } else if (!e.isIntersecting) {
        clearTimeout(timers[i]);
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" }); // counts the section crossing the middle of the screen, whatever its height
  sections.forEach(function (s) { watch.observe(s); });

  // Reading time, sent on every hide so tab switches don't lose the later reading.
  var start = Date.now();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      track("audit_time", { seconds: Math.round((Date.now() - start) / 1000), max_section: maxSection, transport_type: "beacon" });
    } else {
      start = Date.now();
    }
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-track]");
    if (a) track("audit_click", { target: a.getAttribute("data-track") });
  });
})();

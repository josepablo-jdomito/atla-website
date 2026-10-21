/* Atla questionnaire: one question per screen. Answers go to /api/contact (Attio note on the person).
   GA4 gets only progress events (questionnaire_start, questionnaire_step, questionnaire_submit), never answers. */
(function () {
  var GA = "G-X4ZD7PGXE3";
  if (!/(^|\.)atla\.design$/.test(location.hostname)) window["ga-disable-" + GA] = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", GA, { page_location: location.origin + location.pathname, page_title: document.title });
  var audit = document.body.getAttribute("data-audit");
  var code = new URLSearchParams(location.search).get("r") || "";
  var recipient = /^[a-z0-9]{2,12}$/i.test(code) ? code.toLowerCase() : "";
  function track(name, extra) { var p = { audit: audit }; for (var k in extra) p[k] = extra[k]; gtag("event", name, p); }

  var form = document.getElementById("qf");
  var screens = Array.prototype.slice.call(form.querySelectorAll(".qs"));
  var nav = form.querySelector(".q-nav");
  var next = nav.querySelector("[data-next]");
  var submit = nav.querySelector(".q-submit");
  var err = form.querySelector(".q-err");
  var count = document.querySelector(".q-count");
  var bar = document.querySelector(".progress i");
  var i = 0;
  var questions = screens.length - 2; // without intro and done

  // Prefill name and email from the analysis gate, if this browser passed it.
  try {
    var c = JSON.parse(localStorage.getItem("atla-audit-contact") || "null");
    if (c) { form.name.value = c.name || ""; form.email.value = c.email || ""; }
  } catch (e) {}

  function show(k) {
    screens[i].hidden = true;
    i = k;
    var s = screens[i];
    s.hidden = false;
    var type = s.getAttribute("data-type");
    var inQuestions = type !== "intro" && type !== "done";
    nav.hidden = !inQuestions;
    submit.hidden = type !== "contact";
    next.hidden = type === "contact";
    err.hidden = true;
    if (count) count.textContent = inQuestions ? i + " / " + questions : "";
    if (bar) bar.style.setProperty("--p", inQuestions ? (i / questions).toFixed(3) : type === "done" ? 1 : 0);
    window.scrollTo(0, 0);
    var focusable = s.querySelector("textarea, input:not(.hp):not([type=range]):not([type=radio])");
    if (focusable && type !== "brands") focusable.focus({ preventScroll: true });
    if (inQuestions) track("questionnaire_step", { step: i, step_id: s.getAttribute("data-id") });
  }

  form.addEventListener("click", function (e) {
    if (e.target.closest("[data-next]")) {
      if (i === 0) track("questionnaire_start", {});
      show(Math.min(i + 1, screens.length - 2));
    }
    if (e.target.closest("[data-back]")) show(Math.max(i - 1, 1));
  });

  // Brands: tap cycles love -> not for us -> neutral.
  function wireBrand(chip) {
    chip.addEventListener("click", function () {
      var s = chip.getAttribute("data-state");
      var nextState = s === "love" ? "no" : s === "no" ? "" : "love";
      if (nextState) chip.setAttribute("data-state", nextState); else chip.removeAttribute("data-state");
      chip.setAttribute("aria-pressed", nextState === "love" ? "true" : nextState === "no" ? "mixed" : "false");
    });
  }
  form.querySelectorAll(".brands .chip").forEach(wireBrand);
  var add = form.querySelector(".add");
  if (add) {
    var input = add.querySelector("input");
    function addBrand() {
      var v = input.value.trim().slice(0, 40);
      if (!v) return;
      var chip = document.createElement("button");
      chip.type = "button"; chip.className = "chip"; chip.textContent = v; chip.setAttribute("data-v", v);
      wireBrand(chip);
      form.querySelector(".brands").appendChild(chip);
      chip.click();
      input.value = "";
    }
    add.querySelector(".add-btn").addEventListener("click", addBrand);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addBrand(); } });
  }

  // Words: up to N "be" words; "never" words are unlimited.
  form.querySelectorAll(".words, .never").forEach(function (group) {
    var max = parseInt(group.getAttribute("data-max") || "99", 10);
    group.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var on = chip.getAttribute("aria-pressed") === "true";
      if (!on && group.querySelectorAll('[aria-pressed="true"]').length >= max) return;
      chip.setAttribute("aria-pressed", on ? "false" : "true");
    });
  });

  function answers() {
    var out = [];
    screens.forEach(function (s) {
      var type = s.getAttribute("data-type"), q = s.querySelector(".q-q");
      if (!q || type === "contact" || type === "done" || type === "intro") return;
      var line = "";
      if (type === "brands") {
        var love = [], no = [];
        s.querySelectorAll(".chip").forEach(function (c) {
          var st = c.getAttribute("data-state");
          if (st === "love") love.push(c.getAttribute("data-v")); else if (st === "no") no.push(c.getAttribute("data-v"));
        });
        line = "Love: " + (love.join(", ") || "none") + "\nNot for us: " + (no.join(", ") || "none");
      } else if (type === "sliders") {
        line = Array.prototype.map.call(s.querySelectorAll("input[type=range]"), function (r) {
          var v = parseInt(r.value, 10);
          var where = v === 50 ? "middle" : v < 50 ? (100 - v) + "% " + r.getAttribute("data-a") : v + "% " + r.getAttribute("data-b");
          return r.getAttribute("data-a") + " / " + r.getAttribute("data-b") + ": " + where;
        }).join("\n");
      } else if (type === "pairs") {
        line = Array.prototype.map.call(s.querySelectorAll(".pair"), function (p) {
          var c = p.querySelector("input:checked");
          return p.getAttribute("data-k") + ": " + (c ? c.value : "no answer");
        }).join("\n");
      } else if (type === "words") {
        var be = Array.prototype.map.call(s.querySelectorAll('.words [aria-pressed="true"]'), function (c) { return c.getAttribute("data-v"); });
        var never = Array.prototype.map.call(s.querySelectorAll('.never [aria-pressed="true"]'), function (c) { return c.getAttribute("data-v"); });
        line = "Should be: " + (be.join(", ") || "none") + "\nNever: " + (never.join(", ") || "none");
      } else if (type === "text") {
        line = s.querySelector("textarea").value.trim() || "(blank)";
      }
      out.push("## " + q.textContent + "\n" + line);
    });
    return out.join("\n\n");
  }

  // If saving fails, the answers can still leave as an email instead of being lost.
  function fallback() {
    var a = document.createElement("a");
    a.href = "mailto:josepablo@atla.design?subject=" + encodeURIComponent(document.title.replace(/ · Atla$/, "")) +
      "&body=" + encodeURIComponent(answers().slice(0, 1800));
    a.textContent = "Send them by email";
    err.textContent = "We couldn’t save your answers. ";
    err.appendChild(a);
    err.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim(), email = form.email.value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = "Please enter your name and a valid email.";
      err.hidden = false;
      return;
    }
    submit.disabled = true;
    var path = location.pathname.toLowerCase().replace(/\/index\.html$|\/$/, "");
    fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        company: document.body.getAttribute("data-brand") || "",
        message: ("Questionnaire answers for the creative territories." + (recipient ? " Link code: " + recipient + "." : "") + "\n\n" + answers()).slice(0, 4000),
        source: "atla.design" + path,
        _gotcha: form._gotcha.value
      })
    }).then(function (r) {
      if (r.ok) {
        track("questionnaire_submit", { status: "saved" });
        try { localStorage.setItem("atla-audit-contact", JSON.stringify({ name: name, email: email })); } catch (x) {}
        show(screens.length - 1);
      } else {
        submit.disabled = false;
        track("questionnaire_submit", { status: "error_" + r.status });
        if (r.status === 400) { err.textContent = "Please check your name and email."; err.hidden = false; }
        else fallback();
      }
    }).catch(function () {
      submit.disabled = false;
      track("questionnaire_submit", { status: "error_network" });
      fallback();
    });
  });
})();

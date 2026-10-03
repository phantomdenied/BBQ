// Momma Lo's BBQ — progressive enhancements. The site works without this file.
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  // Hours in the restaurant's local time. Day 0 = Sunday. null = closed.
  // Keep in sync with the hours tables, footers and JSON-LD in the HTML files.
  var HOURS = [
    [13, 17], // Sun 1–5 pm
    [12, 17], // Mon 12–5 pm
    null,     // Tue closed
    null,     // Wed closed
    [12, 19], // Thu 12–7 pm
    [12, 19], // Fri 12–7 pm
    [12, 19]  // Sat 12–7 pm
  ];
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  function setNav(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.inert = !open;
    document.body.classList.toggle("nav-open", open);
  }
  if (toggle && mobileNav) {
    mobileNav.inert = true;
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) {
      if (m.matches) setNav(false);
    });
  }

  /* ---------- header + mobile action bar on scroll ---------- */
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".action-bar");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bar) bar.classList.toggle("is-visible", y > window.innerHeight * 0.5);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- open / closed status ---------- */
  function fmtHour(h) {
    var suffix = h >= 12 ? "pm" : "am";
    var hr = h % 12 || 12;
    return hr + " " + suffix;
  }
  function localNow() {
    // Wall-clock time in Great Barrington, regardless of the visitor's time zone.
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
    }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: day, mins: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  }
  function statusText(now) {
    var today = HOURS[now.day];
    if (today && now.mins >= today[0] * 60 && now.mins < today[1] * 60) {
      return { state: "open", text: "Open now · until " + fmtHour(today[1]) };
    }
    if (today && now.mins < today[0] * 60) {
      return { state: "closed", text: "Closed · opens today at " + fmtHour(today[0]) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var when = i === 1 ? "tomorrow" : DAY_NAMES[d];
        return { state: "closed", text: "Closed · opens " + when + " at " + fmtHour(HOURS[d][0]) };
      }
    }
    return null;
  }
  try {
    var now = localNow();
    var s = statusText(now);
    if (s) {
      document.querySelectorAll("[data-status]").forEach(function (el) {
        el.textContent = s.text;
        el.setAttribute("data-state", s.state);
      });
    }
    document.querySelectorAll('.hours tr[data-day="' + now.day + '"]').forEach(function (row) {
      row.classList.add("is-today");
    });
  } catch (err) { /* Intl unavailable: leave the static hours as they are */ }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- contact form → visitor's email app ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email;
      var field = email.closest(".field");
      var ok = email.value.trim() !== "" && email.checkValidity();
      field.classList.toggle("has-error", !ok);
      email.setAttribute("aria-invalid", String(!ok));
      if (!ok) { email.focus(); return; }

      var name = form.elements.name.value.trim();
      var message = form.elements.message.value.trim();
      var subject = "Website message" + (name ? " from " + name : "");
      var body = (message || "") + "\n\n— " + (name || "") + "\n" + email.value.trim();
      window.location.href = "mailto:" + form.getAttribute("data-to") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var status = document.getElementById("form-status");
      if (status) status.textContent = "Opening your email app… If nothing happens, email us at " + form.getAttribute("data-to") + ".";
    });
  }
})();

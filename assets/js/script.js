(function () {
  function selectedLanguage() {
    return window.getSelectedLanguage ? window.getSelectedLanguage() : "hi";
  }

  function formatHindiDateTime(date) {
    const dateText = new Intl.DateTimeFormat("hi-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);
    const timeText = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
    return { dateText, timeText };
  }

  function formatEnglishDateTime(date) {
    const dateText = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(date);
    const timeText = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
    return { dateText, timeText };
  }

  window.updateLiveDateTime = function updateLiveDateTime() {
    const liveDate = document.getElementById("liveDate");
    const liveTime = document.getElementById("liveTime");
    if (!liveDate || !liveTime) return;
    const now = new Date();
    const formatted = selectedLanguage() === "hi" ? formatHindiDateTime(now) : formatEnglishDateTime(now);
    liveDate.textContent = formatted.dateText;
    liveTime.textContent = formatted.timeText;
  };

  document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const navMenu = document.querySelector("[data-nav-menu]");
    const searchModal = document.querySelector("[data-search-modal]");
    const searchOpeners = document.querySelectorAll("[data-search-open]");
    const searchClosers = document.querySelectorAll("[data-search-close]");
    const ticker = document.querySelector("[data-ticker]");
    const mainNav = document.querySelector(".main-navigation");
    const backToTop = document.querySelector("[data-back-to-top]");
    const languageToggle = document.querySelector("[data-language-toggle]");
    const languageMenu = document.querySelector("[data-language-menu]");
    const newsletterForms = document.querySelectorAll("[data-newsletter-form]");

    document.body.classList.add("page-loaded");
    window.applyTranslations?.(selectedLanguage());
    window.updateLiveDateTime();
    setInterval(window.updateLiveDateTime, 1000);

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const open = navMenu.classList.toggle("show");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("show");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    const openSearch = () => {
      if (!searchModal) return;
      searchModal.classList.add("show");
      searchModal.querySelector("input")?.focus();
    };
    const closeSearch = () => searchModal?.classList.remove("show");

    searchOpeners.forEach((button) => button.addEventListener("click", openSearch));
    searchClosers.forEach((button) => button.addEventListener("click", closeSearch));
    searchModal?.addEventListener("click", (event) => {
      if (event.target === searchModal) closeSearch();
    });

    document.querySelectorAll(".search-dialog form, [data-search-page-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="search"], input[name="query"]');
        const query = input?.value?.trim() || "";
        const inPages = location.pathname.includes("/pages/");
        const target = inPages ? "search.html" : "pages/search.html";
        location.href = `${target}?query=${encodeURIComponent(query)}`;
      });
    });

    if (ticker) {
      ticker.addEventListener("mouseenter", () => ticker.classList.add("paused"));
      ticker.addEventListener("mouseleave", () => ticker.classList.remove("paused"));
      ticker.addEventListener("focusin", () => ticker.classList.add("paused"));
      ticker.addEventListener("focusout", () => ticker.classList.remove("paused"));
    }

    if (languageToggle && languageMenu) {
      languageToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = languageMenu.classList.toggle("show");
        languageToggle.setAttribute("aria-expanded", String(open));
      });
      languageMenu.querySelectorAll("[data-language]").forEach((option) => {
        option.addEventListener("click", (event) => {
          event.preventDefault();
          window.setSelectedLanguage?.(option.dataset.language);
          languageMenu.classList.remove("show");
          languageToggle.setAttribute("aria-expanded", "false");
          window.updateLiveDateTime();
        });
      });
      document.addEventListener("click", () => {
        languageMenu.classList.remove("show");
        languageToggle.setAttribute("aria-expanded", "false");
      });
    }

    const onScroll = () => {
      const stuck = window.scrollY > 80;
      mainNav?.classList.toggle("is-sticky", stuck);
      backToTop?.classList.toggle("show", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    newsletterForms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = form.querySelector("[data-newsletter-message]");
        if (message) message.textContent = window.t ? window.t("newsletterSuccess") : "धन्यवाद!";
        form.reset();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch();
        languageMenu?.classList.remove("show");
        languageToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("languagechange", () => {
    window.updateLiveDateTime();
  });
})();

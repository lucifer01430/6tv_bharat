(function () {
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
  const currentDate = document.querySelector("[data-current-date]");

  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("hi-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      navToggle.setAttribute("aria-expanded", String(isOpen));
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

  if (ticker) {
    ticker.addEventListener("mouseenter", () => ticker.classList.add("paused"));
    ticker.addEventListener("mouseleave", () => ticker.classList.remove("paused"));
    ticker.addEventListener("focusin", () => ticker.classList.add("paused"));
    ticker.addEventListener("focusout", () => ticker.classList.remove("paused"));
  }

  if (languageToggle && languageMenu) {
    languageToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = languageMenu.classList.toggle("show");
      languageToggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", () => {
      languageMenu.classList.remove("show");
      languageToggle.setAttribute("aria-expanded", "false");
    });
  }

  const onScroll = () => {
    const shouldStick = window.scrollY > 80;
    mainNav?.classList.toggle("is-sticky", shouldStick);
    backToTop?.classList.toggle("show", window.scrollY > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
      languageMenu?.classList.remove("show");
      languageToggle?.setAttribute("aria-expanded", "false");
    }
  });
})();

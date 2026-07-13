// Page render helpers. Django will later replace frontend article data with article context.
(function () {
  const inPages = location.pathname.includes("/pages/");
  const prefix = inPages ? "" : "pages/";
  const homeHref = inPages ? "../index.html" : "index.html";
  const pageName = location.pathname.split("/").pop() || "index.html";

  function lang() {
    return window.getSelectedLanguage ? window.getSelectedLanguage() : "hi";
  }

  function l10n(item) {
    return item?.[lang()] || item?.hi || {};
  }

  function articleUrl(id) {
    return `${prefix}news-detail.html?id=${id}`;
  }

  function categoryUrl(slug) {
    return `${prefix}category.html?category=${slug}`;
  }

  function searchUrl(query) {
    return `${prefix}search.html?query=${encodeURIComponent(query || "")}`;
  }

  function card(article, heading = "h3") {
    const data = l10n(article);
    const cat = l10n(window.categoryData[article.category])?.title || article.category;
    return `<a class="news-card d-block" href="${articleUrl(article.id)}" data-article-id="${article.id}">
      <img class="news-image" src="${article.image}" alt="${data.title}">
      <div class="news-content"><span class="news-category">${cat}</span><${heading} class="news-title">${data.title}</${heading}>
      <p class="news-summary">${data.summary}</p><div class="news-meta"><span class="news-author">6TV भारत</span><span class="news-date">${lang() === "hi" ? "आज" : "Today"}</span></div></div>
    </a>`;
  }

  function horizontal(article) {
    const data = l10n(article);
    return `<a class="latest-news-item" href="${articleUrl(article.id)}" data-article-id="${article.id}">
      <img class="news-image" src="${article.image}" alt="${data.title}">
      <div class="news-content"><h3 class="news-title h5">${data.title}</h3><p class="news-summary">${data.summary}</p><div class="news-meta"><time>16:20</time></div></div>
    </a>`;
  }

  function getArticleList() {
    return Object.entries(window.articles || {}).map(([id, article]) => ({ ...article, id }));
  }

  function updateCommonLinks() {
    const navLinks = [
      ["home", homeHref, "home"],
      ["latestNews", `${prefix}latest-news.html`, "latest"],
      ["uttarPradesh", categoryUrl("uttar-pradesh"), "uttar-pradesh"],
      ["india", categoryUrl("india"), "india"],
      ["politics", categoryUrl("politics"), "politics"],
      ["world", categoryUrl("world"), "world"],
      ["sports", categoryUrl("sports"), "sports"],
      ["entertainment", categoryUrl("entertainment"), "entertainment"],
      ["business", categoryUrl("business"), "business"],
      ["technology", categoryUrl("technology"), "technology"],
      ["health", categoryUrl("health"), "health"],
      ["religion", categoryUrl("religion"), "religion"],
    ];
    document.querySelectorAll(".nav-menu").forEach((menu) => {
      menu.innerHTML = navLinks.map(([key, href, slug]) => `<a class="nav-link" href="${href}" data-i18n="${key}" data-nav="${slug}">${window.t(key)}</a>`).join("");
    });
    document.querySelectorAll(".brand").forEach((brand) => brand.setAttribute("href", homeHref));
    document.querySelectorAll(".live-link").forEach((link) => {
      link.href = `${prefix}live-tv.html`;
      link.dataset.nav = "live";
    });
    document.querySelectorAll(".topic-pill").forEach((link) => {
      const query = link.textContent.trim();
      link.href = searchUrl(query);
    });
    document.querySelectorAll('a[href="#"]').forEach((link) => {
      if (link.closest(".social-links")) {
        const label = link.getAttribute("aria-label") || link.textContent.trim() || "Social";
        link.setAttribute("title", label);
      } else if (/विज्ञापन|Advertise/i.test(link.textContent)) {
        link.href = `${prefix}contact.html`;
      } else if (/प्राइवेसी|Privacy/i.test(link.textContent)) {
        link.href = `${prefix}about.html`;
      } else if (/नियम|Terms/i.test(link.textContent)) {
        link.href = `${prefix}about.html`;
      }
    });
    document.querySelectorAll('a[href$="news-detail.html"]').forEach((link, index) => {
      const id = ["102", "115", "106", "107"][index % 4];
      link.href = articleUrl(id);
      link.dataset.articleId = id;
    });
    document.querySelectorAll('a[href$="category.html"]').forEach((link) => {
      const text = link.textContent.trim();
      const map = { "उत्तर प्रदेश": "uttar-pradesh", "देश": "india", "राजनीति": "politics", "दुनिया": "world", "खेल": "sports", "मनोरंजन": "entertainment", "बिज़नेस": "business", "टेक्नोलॉजी": "technology", "स्वास्थ्य": "health", "धर्म": "religion" };
      if (map[text]) link.href = categoryUrl(map[text]);
    });
  }

  function markDynamicContainers() {
    document.querySelector(".language-toggle")?.setAttribute("data-i18n-aria-label", "language");
    document.querySelector(".brand-text small")?.setAttribute("data-i18n", "tagline");
    document.querySelectorAll(".ad-slot small").forEach((el) => (el.dataset.i18n = "advertisement"));
    document.querySelector(".header-ad strong")?.setAttribute("data-i18n", "headerAd");
    document.querySelector(".breaking-label")?.setAttribute("data-i18n", "breakingNews");
    document.querySelector(".topic-label")?.setAttribute("data-i18n", "trending");
    document.querySelector("#searchModalTitle")?.setAttribute("data-i18n", "searchNews");
    document.querySelector('label[for="modalSearch"]')?.setAttribute("data-i18n", "searchLabel");
    document.querySelector("#modalSearch")?.setAttribute("data-i18n-placeholder", "searchPlaceholder");
    document.querySelector(".search-dialog .btn")?.setAttribute("data-i18n", "searchButton");
    document.querySelector(".footer-bottom")?.setAttribute("data-i18n", "copyright");
  }

  function renderCategoryPage() {
    if (pageName !== "category.html") return;
    const params = new URLSearchParams(location.search);
    const slug = params.get("category") || "uttar-pradesh";
    const category = window.categoryData[slug] || window.categoryData["uttar-pradesh"];
    const categoryText = l10n(category);
    const articles = getArticleList().filter((article) => article.category === slug);
    const list = (articles.length ? articles : getArticleList()).slice(0, 9);
    const primary = list[0];
    const primaryText = l10n(primary);
    const section = document.querySelector("main .col-lg-8");
    document.querySelector(".breadcrumb-wrapper").innerHTML = `<a href="../index.html">${window.t("home")}</a> / <span>${categoryText.title}</span>`;
    if (section) {
      section.innerHTML = `<div class="section-heading"><h1>${categoryText.title}</h1></div>
      <article class="featured-news mb-4"><a href="${articleUrl(primary.id)}" data-article-id="${primary.id}"><img class="news-image" src="${primary.image}" alt="${primaryText.title}"></a>
        <div class="news-content"><span class="news-category">${categoryText.title}</span><h2 class="news-title">${primaryText.title}</h2><p class="news-summary">${primaryText.summary}</p><div class="news-meta"><span class="news-author">${primaryText.author}</span><span class="news-date">${window.t("today")}</span></div></div></article>
      <div class="ad-slot mb-4"><small data-i18n="advertisement">${window.t("advertisement")}</small><strong>${categoryText.title} ${lang() === "hi" ? "एडिशन में विज्ञापन दें" : "edition advertising space"}</strong></div>
      <div class="row g-3">${list.map((article) => `<div class="col-md-6 col-xl-4">${card(article)}</div>`).join("")}</div>
      <nav class="pagination-wrapper" aria-label="Pagination"><ul class="pagination"><li class="page-item active"><a class="page-link" href="?category=${slug}&page=1">1</a></li><li class="page-item"><a class="page-link" href="?category=${slug}&page=2">2</a></li><li class="page-item"><a class="page-link" href="?category=${slug}&page=3">3</a></li></ul></nav>`;
    }
    document.body.dataset.category = slug;
  }

  function renderArticlePage() {
    if (pageName !== "news-detail.html") return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "101";
    const article = window.articles[id] || window.articles[101];
    const data = l10n(article);
    const category = window.categoryData[article.category];
    const categoryText = l10n(category);
    const articleNode = document.querySelector("main article.col-lg-8");
    document.querySelector(".breadcrumb-wrapper").innerHTML = `<a href="../index.html">${window.t("home")}</a> / <a href="${categoryUrl(article.category)}">${categoryText.title}</a> / <span>${data.title}</span>`;
    if (articleNode) {
      articleNode.innerHTML = `<header class="article-header"><span class="news-category">${categoryText.title}</span><h1>${data.title}</h1><p class="article-summary">${data.summary}</p><div class="news-meta"><span class="news-author">${lang() === "hi" ? "लेखक:" : "Author:"} ${data.author}</span><span class="news-date">${lang() === "hi" ? "प्रकाशित:" : "Published:"} 13 July 2026, 10:30 AM</span><span class="news-date">${lang() === "hi" ? "अपडेट:" : "Updated:"} 13 July 2026, 12:15 PM</span></div></header>
      <div class="share-actions my-3"><button class="btn btn-outline-primary btn-sm"><i class="bi bi-facebook"></i> ${window.t("share")}</button><button class="btn btn-outline-success btn-sm"><i class="bi bi-whatsapp"></i> WhatsApp</button><button class="btn btn-outline-dark btn-sm"><i class="bi bi-link-45deg"></i> ${window.t("copyLink")}</button></div>
      <img class="news-image" src="${article.image}" alt="${data.title}"><p class="text-muted mt-2">${data.caption}</p>
      <div class="article-body mt-4">${data.content.map((p, index) => index === 2 ? `<h2>${lang() === "hi" ? "मुख्य बातें" : "Key Points"}</h2><p>${p}</p>` : `<p>${p}</p>`).join("")}<ul><li>${lang() === "hi" ? "प्रशासन ने निगरानी बढ़ाई।" : "The administration has increased monitoring."}</li><li>${lang() === "hi" ? "लोगों से सतर्क रहने की अपील।" : "Citizens have been advised to stay alert."}</li></ul><blockquote class="quote-box">${lang() === "hi" ? "यह खबर लगातार अपडेट की जा रही है।" : "This story is being updated continuously."}</blockquote><div class="ad-slot my-4"><small>${window.t("advertisement")}</small><strong>${window.t("premiumAd")}</strong></div></div>
      <section class="mt-4"><div class="section-heading"><h2>${window.t("relatedNews")}</h2></div><div class="row g-3">${getArticleList().filter((item) => item.id !== id).slice(0, 3).map((item) => `<div class="col-md-4">${card(item)}</div>`).join("")}</div></section>
      <section class="author-box mt-4"><img class="author-avatar" src="${IMG.education}" alt="${data.author}"><div><h2 class="h5">${data.author}</h2><p class="mb-0">${lang() === "hi" ? "6TV भारत की संपादकीय टीम से जुड़ी रिपोर्ट।" : "Report from the 6TV भारत editorial team."}</p></div></section>
      <div class="tag-list mt-4">${article.tags.map((tag) => `<a href="search.html?query=${encodeURIComponent(tag)}">${tag}</a>`).join("")}</div>
      <section class="sidebar-widget mt-4"><h2 class="h5">${window.t("commentsTitle")}</h2><form><div class="row g-3"><div class="col-md-6"><input class="form-control" type="text" placeholder="${window.t("namePlaceholder")}"></div><div class="col-md-6"><input class="form-control" type="email" placeholder="${window.t("emailPlaceholder")}"></div><div class="col-12"><textarea class="form-control" rows="4" placeholder="${window.t("commentPlaceholder")}"></textarea></div><div class="col-12"><button class="btn btn-primary" type="submit">${window.t("submitComment")}</button></div></div></form></section>`;
    }
    document.body.dataset.category = article.category;
  }

  function renderSearchPage() {
    if (pageName !== "search.html") return;
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || (lang() === "hi" ? "बारिश" : "rain");
    const normalized = query.toLowerCase();
    const results = getArticleList().filter((article) => {
      const hi = article.hi.title + " " + article.hi.summary + " " + article.tags.join(" ");
      const en = article.en.title + " " + article.en.summary;
      return (hi + " " + en).toLowerCase().includes(normalized) || (normalized === "rain" && article.category === "uttar-pradesh");
    });
    const section = document.querySelector("main section");
    if (!section) return;
    section.innerHTML = `<div class="section-heading"><h1>${window.t("searchNews")}</h1></div><form class="mb-4" role="search" data-search-page-form><div class="input-group input-group-lg"><input class="form-control" name="query" type="search" value="${query}" aria-label="${window.t("searchLabel")}"><button class="btn btn-primary">${window.t("searchButton")}</button></div></form><h2 class="h4 mb-3">${lang() === "hi" ? `“${query}” ${window.t("searchResultsPrefix")}` : `${window.t("searchResultsPrefix")} “${query}”`}</h2>${results.length ? `<div class="row g-3">${results.map((article) => `<div class="col-md-6">${card(article)}</div>`).join("")}</div>` : `<div class="sidebar-widget">${window.t("noResults")}</div>`}<nav class="pagination-wrapper"><ul class="pagination"><li class="page-item active"><a class="page-link" href="search.html?query=${encodeURIComponent(query)}">1</a></li></ul></nav>`;
  }

  function renderLatestPage() {
    if (pageName !== "latest-news.html") return;
    const section = document.querySelector("main .col-lg-8");
    if (!section) return;
    section.innerHTML = `<div class="section-heading"><h1>${window.t("latestNews")}</h1></div><div class="filter-bar"><button class="btn btn-primary">${window.t("today")}</button><button class="btn btn-outline-secondary">${window.t("yesterday")}</button><button class="btn btn-outline-secondary">${window.t("thisWeek")}</button></div>${getArticleList().slice(0, 12).map(horizontal).join("")}<nav class="pagination-wrapper"><ul class="pagination"><li class="page-item active"><a class="page-link" href="latest-news.html?page=1">1</a></li><li class="page-item"><a class="page-link" href="latest-news.html?page=2">2</a></li></ul></nav>`;
  }

  function renderMediaPages() {
    if (!["videos.html", "gallery.html"].includes(pageName)) return;
    const isVideo = pageName === "videos.html";
    const container = document.querySelector("main .container");
    if (!container) return;
    const articles = getArticleList().slice(0, 12);
    container.innerHTML = `<div class="section-heading"><h1>${isVideo ? window.t("videos") : window.t("gallery")}</h1></div><div class="filter-bar"><button class="btn btn-primary">${window.t("all")}</button><button class="btn btn-outline-secondary">${window.t("politics")}</button><button class="btn btn-outline-secondary">${window.t("sports")}</button><button class="btn btn-outline-secondary">${window.t("technology")}</button></div><div class="row g-3">${articles.map((article, index) => `<div class="col-lg-3 col-md-4 col-sm-6"><article class="${isVideo ? "video-card" : "gallery-card"}"><div class="${isVideo ? "video-thumb" : "gallery-thumb"}"><img class="news-image" src="${article.image}" alt="${l10n(article).title}">${isVideo ? `<button class="video-play" type="button" aria-label="Play video"><i class="bi bi-play-fill"></i></button><span class="duration-badge">0${(index % 5) + 2}:1${index % 9}</span>` : `<span class="photo-count">${index + 8} ${window.t("photoCount")}</span>`}</div><div class="news-content"><span class="news-category">${isVideo ? window.t("videos") : window.t("gallery")}</span><h3 class="news-title">${l10n(article).title}</h3><p class="news-summary">${l10n(article).summary}</p></div></article></div>`).join("")}</div>`;
  }

  function renderLivePage() {
    if (pageName !== "live-tv.html") return;
    const schedule = document.querySelector(".schedule-list");
    if (schedule) schedule.innerHTML = window.liveSchedule.map((item) => `<li><strong>${item.time}</strong><span>${item[lang()]}</span></li>`).join("");
    const heading = document.querySelector(".live-section h2");
    if (heading) heading.textContent = window.t("currentProgram");
    const desc = document.querySelector(".live-section p");
    if (desc) desc.textContent = window.t("liveDescription");
  }

  function renderSimplePages() {
    if (pageName === "404.html") {
      const section = document.querySelector("main section");
      if (section) {
        section.querySelector("h2").textContent = window.t("pageNotFound");
        section.querySelector("p").textContent = window.t("pageNotFoundText");
        section.querySelector(".btn-primary").textContent = window.t("goHome");
      }
    }
  }

  function updateActiveNav() {
    document.querySelectorAll(".nav-menu a").forEach((link) => link.classList.remove("active"));
    let active = "home";
    if (pageName === "latest-news.html") active = "latest";
    if (pageName === "videos.html") active = "videos";
    if (pageName === "live-tv.html") active = "live";
    if (pageName === "category.html") active = new URLSearchParams(location.search).get("category") || "uttar-pradesh";
    if (pageName === "news-detail.html") {
      const article = window.articles[new URLSearchParams(location.search).get("id") || "101"];
      active = article?.category || "uttar-pradesh";
    }
    if (pageName === "index.html" || !pageName) active = "home";
    document.querySelectorAll(`[data-nav="${active}"]`).forEach((link) => link.classList.add("active"));
  }

  window.updatePageMetadata = function updatePageMetadata(language = lang()) {
    const titleMap = {
      "index.html": { hi: "6TV भारत | ताज़ा हिंदी समाचार", en: "6TV Bharat | Latest Hindi News" },
      "category.html": { hi: "समाचार | 6TV भारत", en: "News | 6TV Bharat" },
      "news-detail.html": { hi: "समाचार विवरण | 6TV भारत", en: "News Detail | 6TV Bharat" },
      "latest-news.html": { hi: "ताज़ा खबरें | 6TV भारत", en: "Latest News | 6TV Bharat" },
      "search.html": { hi: "खोज परिणाम | 6TV भारत", en: "Search Results | 6TV Bharat" },
      "live-tv.html": { hi: "लाइव टीवी | 6TV भारत", en: "Live TV | 6TV Bharat" },
      "videos.html": { hi: "वीडियो समाचार | 6TV भारत", en: "Video News | 6TV Bharat" },
      "gallery.html": { hi: "फोटो गैलरी | 6TV भारत", en: "Photo Gallery | 6TV Bharat" },
      "about.html": { hi: "हमारे बारे में | 6TV भारत", en: "About | 6TV Bharat" },
      "contact.html": { hi: "संपर्क करें | 6TV भारत", en: "Contact | 6TV Bharat" },
      "404.html": { hi: "404 | पेज नहीं मिला | 6TV भारत", en: "404 | Page Not Found | 6TV Bharat" },
    };
    document.title = titleMap[pageName]?.[language] || titleMap["index.html"][language];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === "hi" ? "6TV भारत पर ताज़ा और महत्वपूर्ण खबरें पढ़ें।" : "Read latest and important updates on 6TV Bharat.";
  };

  function renderCurrentPage() {
    updateCommonLinks();
    markDynamicContainers();
    renderCategoryPage();
    renderArticlePage();
    renderSearchPage();
    renderLatestPage();
    renderMediaPages();
    renderLivePage();
    renderSimplePages();
    updateActiveNav();
    window.applyTranslations?.();
  }

  document.addEventListener("DOMContentLoaded", renderCurrentPage);
  document.addEventListener("languagechange", renderCurrentPage);
})();

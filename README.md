# 6TV Bharat Static Frontend Theme

Static HTML/CSS/JS frontend theme for `6TV भारत | ताज़ा हिंदी समाचार`.

## Structure

- `index.html` - homepage base layout
- `category.html` - category listing skeleton
- `news-detail.html` - article detail skeleton
- `latest-news.html` - latest news listing
- `search.html` - search page
- `live-tv.html` - live TV page
- `videos.html` - video grid
- `gallery.html` - photo gallery grid
- `about.html` - static about page
- `contact.html` - contact page and form layout
- `404.html` - error page
- `assets/css/style.css` - base theme styles
- `assets/css/responsive.css` - media queries
- `assets/js/script.js` - small UI interactions

## Django Integration Notes

Reusable sections are marked with HTML comments:

- `HEADER START`
- `MAIN NAVIGATION START`
- `BREAKING NEWS START`
- `SIDEBAR START`
- `FOOTER START`
- `SEARCH MODAL START`

Django placeholders and loops are comments only, so the files remain valid static HTML.

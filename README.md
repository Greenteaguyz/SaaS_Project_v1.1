# SaaS_Project

A Notion-inspired marketing site and app-shell prototype, built as a static front end with plain HTML, vanilla CSS, and vanilla JavaScript. No framework and no build step required — open the files in a browser and they run. A CSS minify step exists but is optional (see CSS workflow below).

## Features

- Responsive landing page with a sticky frosted-glass nav, animated hero, a logo marquee of real brand logos (theme-aware: brand colors in light mode, legible in dark), and a gapless bento feature grid with scroll-reveal motion
- Product showcase section presenting a real dashboard screenshot inside a browser-chrome frame (light-mode capture)
- Solutions section: a responsive use-case card grid (engineering, product, marketing, design, startups, HR/ops) reusing the feature accent system
- Download section ("Get the apps") with platform tiles (macOS, Windows, iOS, Android using their brand glyphs) and a browser/signup call to action
- Mobile nav drawer (CSS checkbox-hack) that auto-collapses after a link is tapped. Theme and language toggles sit in the top bar next to the hamburger while the drawer is closed, then hide when it opens so only the drawer's centered toggle cluster shows. Closing with Escape is supported and focus moves into the drawer on open
- Dashboard app shell with collapsible sidebar, stat tiles, quick actions, and page cards (each card's icon and category label combined into a single rounded chip)
- Dashboard plan demo: a single `dashboard.html` previews all three tiers (Free / Pro / Team) via a hero "Preview plan" switcher, driven by `plans.js` (`?plan=` query param + `localStorage`, applied pre-paint so there is no flash). Plan-scoped blocks are shown/hidden purely by CSS; Pro adds an AI usage panel, Team adds a members/seats panel, activity feed, and extra sidebar nav
- Auth flows: login, signup, forgot password, reset password
- Contact page
- Branded `404.html` not-found page (auto-served by Vercel; uses root-relative paths so it resolves at any requested URL)
- Light / dark theme toggle, persisted in `localStorage` and respecting the OS color-scheme preference (kept in sync with Bootstrap via `data-bs-theme`)
- English / Khmer (EN/KH) language switcher, persisted across pages
- Branded SVG favicon, and a brand-tinted text-selection highlight in both themes
- Accessibility-minded: a skip-to-content link on every page (focus moves to the `#main-content` landmark), keyboard focus rings, reduced-motion support, sticky-nav anchor offset for in-page links, `aria-expanded` mobile menu with Escape-to-close, and `<noscript>` fallbacks

## Tech stack

- HTML5 (one file per page)
- Vanilla CSS — a single design-system stylesheet (`styles.css`) driven by CSS custom properties
- Bootstrap 5.3 (CSS only) loaded via CDN with an SRI integrity hash, before `styles.css` so the project's own design system wins any class-name collisions
- Vanilla JavaScript (no runtime dependencies, no bundler)
- Deployed as a static site on Vercel

## Project structure

```
SaaS-Project/
├── index.html       # Landing page (loads nav.js for the mobile drawer)
├── dashboard.html   # App shell / workspace (loads plans.js for the plan demo)
├── login.html       # Sign in
├── signup.html      # Create account
├── forgot.html      # Request password reset
├── reset.html       # Set a new password
├── contact.html     # Contact form (loads nav.js for the mobile drawer)
├── 404.html         # Branded not-found page (root-relative paths; auto-served by Vercel)
├── favicon.svg      # Branded SVG favicon (linked from every page)
├── styles.css       # Design-system stylesheet — THE EDITABLE SOURCE
├── styles.min.css   # Minified build of styles.css — what the pages actually load
├── theme.js         # Light/dark theme toggle (localStorage + OS preference, syncs data-bs-theme)
├── i18n.js          # EN/KH language switcher (localStorage)
├── nav.js           # Mobile nav drawer: auto-collapse on link tap, plus Escape-to-close, focus management, and aria-expanded
└── plans.js         # Dashboard plan demo: Free/Pro/Team via ?plan= + localStorage, CSS-only visibility
```

## Running locally

There is no build step needed to run the site. Either open `index.html` directly in a browser, or serve the folder over a local static server (recommended, so relative links and `localStorage` behave consistently):

```bash
# Python 3
python -m http.server 8000

# or Node, if you have it
npx serve .
```

Then visit `http://localhost:8000`.

## CSS workflow (important)

The pages load the minified `styles.min.css`, while `styles.css` is the human-editable source. After editing `styles.css` you must regenerate the minified file and bump the cache-buster:

```bash
# 1. Regenerate the minified stylesheet (clean-css, default safe level 1)
npx clean-css-cli -o styles.min.css styles.css

# 2. Bump ?v=N on the styles.min.css link in ALL HTML pages (see Conventions)
```

Never edit `styles.min.css` by hand. Both files are committed (Vercel has no build step, so the minified file must be in the repo).

## Deployment

The site deploys to Vercel as static files. Pushing to the connected branch triggers a deploy — no build configuration required.

## Conventions

- **CSS cache-busting:** every page links the stylesheet with a version query, currently `styles.min.css?v=50`. Any change to the CSS must bump this `?v=N` value identically across all HTML pages in the same change. Otherwise the deployed site and browsers may serve a stale stylesheet and updates appear not to take effect.
- **Bootstrap order & integrity:** the Bootstrap CDN `<link>` is placed before `styles.css`/`styles.min.css` and pinned to an exact version with an SRI `integrity` hash and `preconnect`. If the Bootstrap version changes, recompute the hash. Only the CSS is loaded — Bootstrap's JS components (dropdowns, modals, etc.) are not active.
- **Theme & language** are applied early (an inline script in each page's `<head>` sets `data-theme` and `data-bs-theme` before paint to avoid a flash), then enhanced by `theme.js` and `i18n.js`.
- **Translations** live inline on elements via `data-en` / `data-kh` attributes. Use `data-i18n-attr="placeholder"` to translate an attribute instead of element text.
- **Motion** respects `prefers-reduced-motion`; scroll reveals fall back to fully visible when JavaScript or `IntersectionObserver` is unavailable.
- **Mobile nav:** the drawer is a CSS checkbox-hack (`#nav-toggle` → `.nav__mobile-menu`), present on `index.html` and `contact.html`. `nav.js` closes it on link tap and adds Escape-to-close plus focus/`aria-expanded` handling. The top-bar theme/language toggles show next to the hamburger while closed and hide while open (drawer-open state shows only the drawer's own toggle cluster). Any new page using this nav must also include `nav.js`.

## Status

This is a front-end prototype. Forms and auth pages are UI-only and not wired to a backend.

# Prepared feature review descriptions

Git pushes are available, but the cloud network proxy denied access to `api.github.com`. These are review descriptions, not created pull requests. Feature branches are stacked in the order below. The completed sequence is also integrated into `main` as requested, preserving each commit.

## feat/design-system

**Title:** Define Erra's bilingual restaurant brief and visual foundation

Define the visitor goals, content hierarchy, warm editorial design system and editable 390px/1440px Home/Menu reference frames. Add the source-reviewed menu data and static foundation. The source menu's age and uncertain content are documented rather than presented as a current commercial offer.

## feat/home

**Title:** Build the bilingual editorial home page

Introduce Erra, the cuisine and Chef Alex Teisanu, with reservation/menu actions and three featured dishes rendered from the shared JSON. Use a local illustration in place of unavailable restaurant photography.

## feat/menu

**Title:** Add accessible, searchable Romanian and English menus

Render 38 confidently readable dishes across five categories, with aligned lei prices, explicit unknown-price labels, sticky category links and accent-insensitive search. Document all omissions and historical-price limitations.

## feat/contact-reservations

**Title:** Add story, contact and validated reservation requests

Add the chef story, verified-source contact details, click-to-call, opt-in map loading and Formspree-ready reservation forms. An unconfigured form clearly states that requests cannot be sent; an accepted request never claims the table is confirmed. Add 404, sitemap, metadata and deployment configuration.

## feat/polish

**Title:** Verify responsive behaviour, accessibility and production builds

Add Playwright/axe checks across eight routes and three widths, form success/error tests, CI, launch documentation and final screenshot evidence. Fix duplicate IDs and icon/locale-label issues. Upgrade to patched Astro 7.4.2; npm audit reports zero vulnerabilities. Final checks: 10 browser tests passed; type check and build passed; representative mobile Lighthouse pages scored 98–100 performance and 100 in the other three categories.

# Erra Restaurant

A bilingual, responsive restaurant website for Erra in Bucharest. Romanian is the default; every primary page has an English counterpart. Built with Astro, TypeScript, and Tailwind CSS, with a shared CSS design system and self-hosted Cormorant Garamond / DM Sans fonts.

## Run locally

Use Node.js 22.23.4 or newer and npm (Node.js 24.19.0 is pinned in `.nvmrc` and `.node-version`). From the repository root:

```sh
npm ci
npm run dev
```

For this cloud environment, use a writable npm cache and disable Astro telemetry (the default home configuration directory is read-only):

```sh
npm ci --cache /tmp/erra-npm-cache
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

Build and serve the exact static production output:

```sh
npm run check
npm run build
npm run preview
```

In the cloud, prefix Astro check/build/preview commands with `ASTRO_TELEMETRY_DISABLED=1`. The output directory is `dist/`. No application database, server runtime, or private API credential is required for reading the website.

## Why Astro

This is a content-led site with eight static routes and only a few interactions. Astro generates the menu and metadata at build time and sends small, framework-free browser scripts for search, mobile navigation, map loading, and form submission. React hydration and a persistent application server would add cost without helping these workflows. Tailwind v4 is available through its Vite plugin; the reusable visual tokens and components are defined in `src/styles/global.css`.

## Pages

| Page                   | Romanian    | English        |
| ---------------------- | ----------- | -------------- |
| Home                   | `/`         | `/en/`         |
| Menu                   | `/meniu/`   | `/en/menu/`    |
| Story / chef           | `/despre/`  | `/en/about/`   |
| Contact / reservations | `/contact/` | `/en/contact/` |

The locale switch preserves the current page. There is also a custom 404, sitemap, robots file, canonical links, alternate-language links, Open Graph metadata, and Restaurant/Menu JSON-LD. Unverified historical prices are deliberately omitted from structured-data offers.

## Configure and deploy

Copy `.env.example` to `.env` and set:

- `SITE_URL`: an optional explicit public HTTPS origin. On Vercel, the build otherwise uses `VERCEL_PROJECT_PRODUCTION_URL` (or `VERCEL_URL` as a fallback) so canonical URLs, sitemap, social metadata and JSON-LD match the actual deployment. Outside Vercel, set this value before deployment; the local fallback `https://erra.example` is a placeholder.
- `PUBLIC_RESERVATION_ENDPOINT`: optional public Formspree form endpoint such as `https://formspree.io/f/YOUR_FORM_ID`. This is a public destination, not a secret. Only that HTTPS endpoint format is accepted.

Environment variables are embedded at build time. Rebuild after changing them.

Vercel: import this GitHub repository, configure any optional variables, and deploy with the included Astro configuration. The free `vercel.app` domain does not require a domain purchase. Vercel Hobby is limited to personal, non-commercial use; a commercial restaurant site requires an appropriate existing plan. No paid plan or domain purchase is authorised by the configuration. CLI deployment: `npx vercel --prod` after authenticating and configuring the project.

Netlify: import this repository and set the variables. `netlify.toml` sets `npm run build` and `dist`. CLI deployment: `npx netlify deploy --build --prod` after linking and authenticating.

Any static host can serve `dist`; configure unknown paths to serve `404.html` with a 404 status. Do not rewrite every path to the home page. HTTP security/cache headers are included for Netlify, and basic security headers for Vercel.

No public deployment has been performed in this session. Do not launch commercially until the checklist below is complete.

## Reservations

1. Create and verify a restaurant-owned Formspree form and its destination email.
2. Configure the public endpoint in the deployment's build environment.
3. Configure spam/rate protection and retention in Formspree; restrict allowed submission origins to the final site if the service plan supports it.
4. Rebuild and make an authorised test reservation. Verify receipt with the restaurant and delete the test record.
5. Provide the restaurant's approved privacy information and contact, including retention, data-controller details, and processing by Formspree, before collecting real guest details.

The form checks required fields, trimmed name length, plausible telephone digits, future dates/times in Europe/Bucharest, party size, and explicit consent. It retains entered data on errors, prevents concurrent duplicate submissions, and times out after 15 seconds. It never claims a table is confirmed: only the restaurant can confirm by phone.

With no endpoint, the page clearly says online reservations are not active and offers click-to-call. A valid-looking endpoint alone does not prove delivery. Browser tests mock HTTP success and failure; no real email delivery or restaurant confirmation was tested. Google Maps is loaded only after the guest requests it; the external directions link works independently.

## Edit the menu

`data/menu.json` is the only dish source. Each entry contains:

```json
{
  "category": "pizza",
  "name_ro": "Erra",
  "name_en": "Erra",
  "description_ro": "…",
  "description_en": "…",
  "price": 38,
  "tags": []
}
```

Categories are `pizza`, `pasta`, `main`, `focaccia`, and `dessert`. `price: null` renders “Întreabă-ne” / “Ask us”, never zero or a guessed price. All numeric prices display `lei`. English fields are translations; Romanian remains the source of truth. Search ignores diacritics and searches both languages. After editing, rebuild. If adding/removing dishes, update the source-contract test counts and `docs/menu-review.md` to reflect the approved evidence.

The three home features are selected from the same JSON by their Romanian names. If renaming those dishes, update the featured selection in `src/components/Home.astro`.

The supplied photo is dated **February 2020**. This is a source-faithful historical menu, not a current commercial offer. All pages that show prices label this limitation. Confirm every dish, price, ingredient, and allergen with the restaurant before removing the archive warning. The original photograph is not displayed on the site. Inline attachment evidence is documented in `assets/source/README.md`; no original image file was available to copy into that folder.

## Design and images

- Product brief: `docs/product-brief.md`.
- Design system and tokens: `docs/design-system.md`.
- Editable pre-code reference frames: `docs/designs/{home,menu}-{mobile,desktop}.svg`, at 390px and 1440px.
- Menu evidence and omissions: `docs/menu-review.md`.
- Test evidence: `docs/validation.md`.

Figma tools were unavailable. These local design files are the substitute; there is no Figma file link. The Product Design index's additional context skill was not available in the installed catalog, so no plugin preflight or saved user design context is claimed. Caveman was applied to chat updates; documentation and code retain normal, complete prose.

`public/images/table.svg` is an original editorial placeholder illustration, **not a photograph of the restaurant or its food**. `public/images/social.svg` is a typographic social artwork source; its local PNG export is used for social cards. Replace these with owner-approved photographs when available. Keep explicit image dimensions and descriptive alt text; optimise restaurant photos to AVIF/WebP and add responsive sources. No fictitious chef portrait, customer review, social account, award, opening date, or restaurant history is used.

## Validation

```sh
npm run check
npm run build
npm test
npm run format:check
```

Playwright uses `/usr/bin/chromium` when available. Otherwise run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a trusted local browser path. `npm test` starts the built static preview; build first. Tests cover all eight routes at 390/768/1440 widths, axe WCAG A/AA checks, internal links, language switching, keyboard navigation, reduced motion, menu search, required fields, invalid input, unconfigured reservations, mocked successful/failed requests, and opt-in map loading. Screenshots, traces, and HTML reports are generated locally under ignored directories.

Lighthouse mobile commands and measured results are recorded in `docs/validation.md`. Scores are measurements of the local build and vary with host load; they are not guarantees for a deployment with different assets or third-party services.

## Assumptions and launch checklist

- **Identity/contact:** “Erra Restaurant”, the address, and `0734 983 984` come from the supplied Maps screenshot. Verify that the listing is current. No email or social URL was provided; none was invented.
- **Chef:** Alex Teisanu, as supplied in the brief. Current affiliation and final biography need owner approval.
- **Hours:** the screenshot says “closes 10 pm” at one moment, not a weekly schedule. No weekly hours are inferred. Pages ask guests to call.
- **Menu:** 38 confidently readable dishes, including 9 without a price. Unreadable appetizers and cropped salad names are omitted. See the full review ledger.
- **Photos:** editorial illustrations await licensed restaurant/food photography.
- **Domain:** replace the placeholder `SITE_URL` before deployment.
- **Reservations/privacy:** configure and verify Formspree and approve privacy wording before collecting real bookings.
- **GitHub:** feature branches and commits are maintained. PR creation requires API access; see the final delivery status in `docs/validation.md`. Git transport access does not imply GitHub API access.

## Structure

```text
assets/source/       Evidence notes; original menu photo can be added here
 data/menu.json      Single menu source
 docs/               Brief, design frames, menu review, validation
 public/             Local illustrations and favicon
 src/components/     Home, Menu, About, Contact
 src/layouts/        Shared semantic layout and SEO
 src/pages/          Static bilingual routes, 404, sitemap, robots
 src/scripts/        Reservation and opt-in map interactions
 src/styles/         Tokens, components, responsive and print styles
 tests/              Browser, accessibility, and interaction checks
```

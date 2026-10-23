# Production deployment

The website is publicly available at **https://errarestaurant.netlify.app**.

- Provider: Netlify, under the existing `claudiutgc` account.
- Account plan: Free, confirmed through account metadata. No paid upgrade, addon or domain registration was requested.
- Site name: `errarestaurant`.
- Site ID: `7fbebd0f-507d-41cd-b9d0-b440f68c6589`.
- Production deployment ID: `6adbb681810ff8c4f8443c46`.
- Deployed application code: Git commit `6854ba6`.
- Published and checked: 23 October 2026, approximately 22:38 Europe/Bucharest.
- Admin dashboard: https://app.netlify.com/projects/errarestaurant
- Deploy log: https://app.netlify.com/projects/errarestaurant/deploys/6adbb681810ff8c4f8443c46

## Verification

The production build passed all 10 browser tests before upload. Anonymous HTTPS checks then confirmed HTTP 200 on all eight Romanian/English routes, correct canonical URLs, 38 menu dishes, working search and locale switching, mobile navigation, the click-to-call destination, the custom 404 status/page, sitemap, robots file and immutable asset cache headers. No page JavaScript errors occurred. Machine-readable results are in `docs/production-checks.json`.

Chromium in the cloud machine does not automatically inherit the platform proxy's CA certificate. Public-browser requests were therefore fetched through Playwright's Node HTTP client with the configured proxy and environment CA bundle, then supplied to Chromium for rendering and interaction checks. Certificate verification remained enabled. An independent curl request also verified HTTPS successfully and returned HTTP 200. No browser HTTPS-error bypass was used. Screenshots and the verification script remain under ignored `artifacts/production/`.

## Configuration and future updates

`netlify.toml` records the public hostname in its production build environment. Astro also supports Netlify's automatic `URL` variable and an explicit `SITE_URL`. The initial upload was built locally with `SITE_URL=https://errarestaurant.netlify.app` and then published with Netlify CLI's `--prod --no-build` options. No server runtime is needed.

This is a manual CLI deployment. GitHub pushes do **not** automatically update the public website; repository-based continuous deployment has not been connected. After authenticating to Netlify on your own machine and linking the existing project, publish updates from the repository root:

```sh
npx netlify login
npx netlify link --id 7fbebd0f-507d-41cd-b9d0-b440f68c6589
npm ci
SITE_URL=https://errarestaurant.netlify.app ASTRO_TELEMETRY_DISABLED=1 npm run build
npm test
npx netlify deploy --prod --no-build --dir dist
```

Local Netlify linkage and authentication are ignored or stored outside the checkout. No authentication token was committed. The cloud CLI used a writable configuration directory under /tmp; future machines should authenticate through their own secure login flow.

The CLI's initial environment-variable save failed because its request omitted `account_id`; an explicit API attempt was rejected. The supported repository production-environment configuration in `netlify.toml` records the hostname instead, and the deployed files already contain the correct URLs. No successful dashboard-variable write is claimed. An unsupported `--context` plus `--no-build` flag combination was removed before the successful upload; the underlying production build and tests were not weakened.

## Remaining content and booking configuration

The site supports phone reservations at 0734 983 984. Online requests are explicitly inactive until a restaurant-owned Formspree endpoint is configured and delivery is verified. No actual reservation or email was sent during deployment tests.

The menu is a labelled historical transcription from February 2020, with uncertain prices omitted. Opening hours remain unverified. Restaurant-approved current prices, hours, photographs, contact details and final privacy wording still require the owner's input. No current-business or email-delivery guarantee is made by the hosting deployment.

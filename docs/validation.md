# Validation and delivery evidence

Validated on 23 October 2026 in the supplied cloud machine. Node.js 24.19.0, Astro 7.4.2, TypeScript, Playwright Chromium, and self-hosted fonts. The site is a static application; there is no application database.

## Checks completed

- Frozen install: `npm ci --cache /tmp/erra-npm-cache --no-audit --no-fund` passed.
- Dependency security: `npm audit --audit-level=high` reported **0 vulnerabilities** across installed dependencies. The initial Astro 5 build was upgraded to the current patched Astro 7.4.2 release after its audit found advisories. No signature, checksum, or TLS verification was disabled.
- Type/route checks: `ASTRO_TELEMETRY_DISABLED=1 npm run check` passed: 0 errors, 0 warnings, 0 hints.
- Static build: `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed: eight bilingual content routes plus the custom 404, robots and sitemap.
- Browser suite: `npm test` passed **10 tests, 0 failures, 0 skipped**. Three tests each visit eight pages, so responsive screenshots and axe WCAG A/AA scans cover 24 page/viewport combinations (390, 768, 1440px).
- Internal link checks, HTML language, canonical and alternate links, structured data, unique IDs, no horizontal overflow, menu source counts, accent-insensitive search, locale switching, keyboard navigation, and reduced motion passed.
- Reservation tests verified missing/invalid input, past dates, an unconfigured endpoint, and mocked HTTP success/error. Success explicitly says the table is not yet booked. No actual reservation or email was sent.
- A separate configured build with a non-production test origin and public test endpoint passed assertions for endpoint embedding, enabled-form state, canonical origin, sitemap origin and noindex 404. These configuration tests did not contact Formspree.
- Development startup passed a functional browser request: HTTP 200, expected menu heading, and 38 rendered dish cards. Merely opening a port was not treated as readiness.

A duplicate ID between the main landmark and the mains category was found and fixed. The suite now checks ID uniqueness on every page. Missing arrow glyphs were replaced with SVG icons. The final form review fixed Unicode-v telephone-pattern compatibility and verified rejection of letter-containing numbers without browser console errors. Lighthouse found a visible-label mismatch on the locale switch; its accessible name now includes the visible RO / EN text.

## Lighthouse mobile

Final measurements against the patched static production build, using Lighthouse 13.5.0, mobile simulation and its default simulated CPU/network throttling. The representative Romanian page types were measured; the English routes were covered by browser/accessibility tests, not separate Lighthouse runs.

| Page    | Performance | Accessibility | Best practices | SEO |
| ------- | ----------: | ------------: | -------------: | --: |
| home    |         100 |           100 |            100 | 100 |
| menu    |          98 |           100 |            100 | 100 |
| about   |         100 |           100 |            100 | 100 |
| contact |         100 |           100 |            100 | 100 |

Command, repeated for each path:

```sh
CHROME_PATH=/usr/bin/chromium node node_modules/lighthouse/cli/index.js \
  http://127.0.0.1:4323/meniu/ \
  --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=artifacts/lighthouse/menu --quiet
```

The loopback address above is an internal measurement command, not a hosted preview. Full reports remain under ignored `artifacts/lighthouse/`; portable scores and run settings are committed in `docs/lighthouse-summary.json`. Scores can change with host load and production configuration.

## Visual evidence

All eight routes have generated screenshots at all three widths. Home at 390/1440, menu at 390, and contact at 768 were also visually inspected. Key final screenshots are committed under `docs/screenshots/`. Pre-code editable layout references live in `docs/designs/`. Figma tools were unavailable; no Figma file or Figma fidelity claim is made. Automated accessibility results are not a claim of a complete assistive-technology audit.

## Runtime notes and resolved setup issues

The home directory is read-only in this cloud machine. Use a writable npm cache under /tmp and `ASTRO_TELEMETRY_DISABLED=1` for Astro commands. Astro 7 detects agent sessions and can launch background servers automatically. The Playwright server uses `--ignore-lock` to stay in the foreground, so its process lifecycle is controlled by the test runner. Development uses native `--background` startup and `astro dev status/logs/stop` commands.

Astro 7's asset move uses filesystem rename, so a custom build output in /tmp failed with EXDEV across mount boundaries. The configuration test was rerun successfully with output under `artifacts/configured-build/`, on the same filesystem as the checkout. Standard `dist/` builds passed throughout. This does not block the documented deploy workflow.

## Delivery and outstanding external steps

Feature work is recorded in `feat/design-system`, `feat/home`, `feat/menu`, `feat/contact-reservations`, and `feat/polish`. Git HTTPS read/push operations work. The network proxy rejects CONNECT requests to api.github.com with HTTP 403, so GitHub API-based PR creation could not be performed. CLI authentication status alone was not used to infer missing Git credentials. No tokens were requested or copied. Prepared PR descriptions are in `docs/pull-requests.md`.

The complete site is merged to main through a normal fast-forward, preserving the feature commits. Remote delivery is confirmed separately by comparing the pushed main SHA with local HEAD; see the final chat report. No PR URL or GitHub Actions success is claimed. The CI workflow is committed but remote CI status is unverified.

Cloud configuration draft persistence is confirmed: install_script, start_skill, and an additive custom network rule for api.github.com were saved. Existing package-manager presets were preserved. Saving does not apply the network change or publish a snapshot. Review and save environment settings, then publish the environment to activate the prepared version. No fresh-task snapshot restoration has been tested.

Before commercial launch: set SITE_URL; verify the address, phone, chef affiliation, hours, historical menu prices and ingredients; supply restaurant photography; configure restaurant-owned Formspree and approved privacy details; verify receipt of an authorised test request. The initial implementation was not deployed at that stage. A later authorised production deployment to Netlify Free is verified in `docs/deployment.md`; the online reservation endpoint remains unconfigured.

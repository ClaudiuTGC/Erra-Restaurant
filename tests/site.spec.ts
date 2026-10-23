import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import menu from '../data/menu.json' with { type: 'json' };
const routes = [
  '/',
  '/meniu/',
  '/despre/',
  '/contact/',
  '/en/',
  '/en/menu/',
  '/en/about/',
  '/en/contact/',
];
for (const width of [390, 768, 1440]) {
  test(`responsive pages and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await mkdir('artifacts/screenshots', { recursive: true });
    for (const route of routes) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
      expect(new Set(ids).size).toBe(ids.length);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await page.screenshot({
        path: `artifacts/screenshots/${route.replaceAll('/', '_') || 'home'}-${width}.png`,
        fullPage: true,
      });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(
          results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        ),
      ).toEqual([]);
      expect(errors).toEqual([]);
    }
  });
}
test('all internal navigation links, SEO and menu source contract', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const lang = route.startsWith('/en/') ? 'en' : 'ro';
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
    await expect(page.locator('link[hreflang=en]')).toHaveCount(1);
    expect(await page.locator('meta[name=description]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
      'Restaurant',
    );
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')!)))
      seen.add(href);
  }
  for (const href of seen) expect((await request.get(href.split('#')[0])).status(), href).toBe(200);
  expect((await request.get('/sitemap.xml')).headers()['content-type']).toContain('xml');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  expect((await request.get('/not-a-real-page/')).status()).toBe(404);
  await page.goto('/meniu/');
  await expect(page.locator('[data-dish]')).toHaveCount(menu.length);
  expect(menu).toHaveLength(38);
  expect(menu.filter((i) => i.price === null)).toHaveLength(9);
  expect(menu.every((i) => i.name_ro && i.name_en && i.tags.length === 0)).toBe(true);
});
test('menu searches Romanian without diacritics, English and no results', async ({ page }) => {
  await page.goto('/meniu/');
  const search = page.getByRole('searchbox');
  await search.fill('sunca');
  expect(await page.locator('[data-dish]:visible').count()).toBeGreaterThan(0);
  await search.fill('Black Tiger');
  await expect(page.locator('[data-dish]:visible')).toHaveCount(2);
  await search.fill('no-such-dish');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('[data-category]:visible')).toHaveCount(0);
  await search.fill('');
  await expect(page.locator('[data-dish]:visible')).toHaveCount(38);
  await page.goto('/en/menu/');
  await page.getByRole('searchbox').fill('chocolate');
  await expect(page.locator('[data-dish]:visible')).toHaveCount(1);
});
test('mobile navigation, locale counterpart, keyboard and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/meniu/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Sari la conținut')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.locator('.mobile-nav summary').click();
  await expect(page.locator('.mobile-nav nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'RO / EN: Switch to English' }).click();
  await expect(page).toHaveURL('/en/menu/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});
async function fillForm(page: Page) {
  await page.locator('#guest-name').fill('Test Guest');
  await page.locator('#guest-phone').fill('+40712345678');
  await page.locator('#booking-date').fill('2099-06-15');
  await page.locator('#booking-time').fill('18:00');
  await page.locator('#guest-count').selectOption('2');
  await page.locator('[name=consent]').check();
}
test('form rejects missing and invalid data; unconfigured form never claims delivery', async ({
  page,
}) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  expect(
    await page.locator('#guest-name').evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  await fillForm(page);
  await page.locator('#guest-name').fill('  ');
  expect(
    await page.locator('#reservation-form').evaluate((el: HTMLFormElement) => el.checkValidity()),
  ).toBe(false);
  await page.locator('#guest-name').fill('Test Guest');
  await page.locator('#guest-phone').fill('letters0712345678');
  expect(
    await page.locator('#guest-phone').evaluate((el: HTMLInputElement) => el.checkValidity()),
  ).toBe(false);
  await page.locator('#guest-phone').fill('-------');
  expect(
    await page.locator('#guest-phone').evaluate((el: HTMLInputElement) => el.checkValidity()),
  ).toBe(false);
  await page.locator('#guest-phone').fill('0712345678');
  await page.locator('#booking-date').fill('2020-01-01');
  expect(
    await page.locator('#booking-date').evaluate((el: HTMLInputElement) => el.checkValidity()),
  ).toBe(false);
  await fillForm(page);
  await page.getByRole('button', { name: 'Trimite solicitarea' }).click();
  await expect(page.locator('#form-status')).toContainText('nu a fost trimisă');
  await expect(page.locator('#guest-name')).toHaveValue('Test Guest');
});
for (const outcome of ['success', 'error'] as const) {
  test(`reservation ${outcome} using a mocked Formspree endpoint`, async ({ page }) => {
    await page.goto('/en/contact/');
    await fillForm(page);
    await page.locator('#reservation-form').evaluate((el: HTMLFormElement) => {
      el.dataset.endpoint = 'https://formspree.io/f/testform';
    });
    let requests = 0;
    await page.route('https://formspree.io/f/testform', async (route) => {
      requests++;
      expect(route.request().postData()).toContain('Test Guest');
      await route.fulfill({
        status: outcome === 'success' ? 200 : 500,
        contentType: 'application/json',
        body: outcome === 'success' ? '\u007b"ok":true\u007d' : '\u007b"error":"Unavailable"\u007d',
      });
    });
    await page.getByRole('button', { name: 'Send request' }).click();
    await expect(page.locator('#form-status')).toContainText(
      outcome === 'success' ? 'Your request has been sent' : 'We could not confirm delivery',
    );
    expect(requests).toBe(1);
    await expect(page.getByRole('button', { name: 'Send request' })).toBeEnabled();
    if (outcome === 'success') {
      await expect(page.locator('#form-status')).toContainText('not yet booked');
      await expect(page.locator('#guest-name')).toHaveValue('');
    } else await expect(page.locator('#guest-name')).toHaveValue('Test Guest');
  });
}
test('map requires explicit action and has an accessible title', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.route('https://maps.google.com/**', (route) =>
    route.fulfill({ body: '<html><body>Map test</body></html>', contentType: 'text/html' }),
  );
  await page.getByRole('button', { name: 'Încarcă harta Google' }).click();
  await expect(page.locator('iframe')).toHaveAttribute('title', 'Harta locației Erra Restaurant');
});

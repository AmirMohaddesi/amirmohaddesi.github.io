const { test, expect } = require('@playwright/test');

/**
 * Desktop + mobile primary navigation (order, hrefs, scroll targets).
 * See also: hyperlinks.spec.js (CTAs, downloads, external rel/target), sections-visible.spec.js.
 */
const DESKTOP_LINKS = [
  { text: 'Introduction', href: '#intro' },
  { text: 'Demo', href: '#hf-space' },
  { text: 'About', href: '#about' },
  { text: 'Technical background', href: '#resume' },
  { text: 'Contact', href: '#contact' }
];

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5500';

async function sectionViewportTop(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.getBoundingClientRect().top : null;
  }, selector);
}

test.describe('Portfolio nav links', () => {
  test('desktop nav order, hrefs, hash updates, and active classes', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);

    const desktopLinks = page.locator('#main-nav-wrap a');
    await expect(desktopLinks).toHaveCount(DESKTOP_LINKS.length);

    for (let i = 0; i < DESKTOP_LINKS.length; i++) {
      await expect(desktopLinks.nth(i)).toHaveText(DESKTOP_LINKS[i].text);
      await expect(desktopLinks.nth(i)).toHaveAttribute('href', DESKTOP_LINKS[i].href);
    }

    await page.waitForTimeout(150);
    await expect(page.locator('#main-nav-wrap li.current > a')).toHaveText('Introduction');

    for (const link of DESKTOP_LINKS) {
      await page.click(`#main-nav-wrap a[href="${link.href}"]`);
      await page.waitForTimeout(900);
      await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    }

    await page.click('#main-nav-wrap a[href="#hf-space"]');
    await page.waitForTimeout(900);
    await expect(page.locator('#main-nav-wrap li.current > a')).toHaveText('Demo');
    await expect(page.locator('#main-nav-wrap li.current > a')).not.toHaveText('About');

    await page.click('#main-nav-wrap a[href="#about"]');
    await page.waitForTimeout(900);
    await expect(page.locator('#main-nav-wrap li.current > a')).toHaveText('About');
  });

  test('desktop: About / Technical background / Contact land at section tops', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(200);

    await page.click('#main-nav-wrap a[href="#about"]');
    await page.waitForTimeout(950);
    let top = await sectionViewportTop(page, '#about');
    expect(top).not.toBeNull();
    expect(Math.abs(top)).toBeLessThanOrEqual(12);

    await page.click('#main-nav-wrap a[href="#resume"]');
    await page.waitForTimeout(950);
    top = await sectionViewportTop(page, '#resume');
    expect(top).not.toBeNull();
    expect(Math.abs(top)).toBeLessThanOrEqual(12);

    await page.click('#main-nav-wrap a[href="#contact"]');
    await page.waitForTimeout(950);
    top = await sectionViewportTop(page, '#contact');
    expect(top).not.toBeNull();
    expect(Math.abs(top)).toBeLessThanOrEqual(12);
  });

  test('mobile drawer: About / resume / Contact clear sticky nav', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(200);

    for (const sel of ['#about', '#resume', '#contact']) {
      await page.click('#mobileNavToggle');
      await page.click(`#mobile-nav-wrap a[href="${sel}"]`);
      await page.waitForTimeout(950);
      const top = await sectionViewportTop(page, sel);
      expect(top).not.toBeNull();
      expect(top).toBeGreaterThanOrEqual(50);
      expect(top).toBeLessThanOrEqual(90);
    }
  });

  test('mobile drawer links mirror desktop links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);

    await page.click('#mobileNavToggle');

    const mobileLinks = page.locator('#mobile-nav-wrap a');
    await expect(mobileLinks).toHaveCount(DESKTOP_LINKS.length);

    for (let i = 0; i < DESKTOP_LINKS.length; i++) {
      await expect(mobileLinks.nth(i)).toHaveText(DESKTOP_LINKS[i].text);
      await expect(mobileLinks.nth(i)).toHaveAttribute('href', DESKTOP_LINKS[i].href);
    }
  });
});

const { test, expect } = require('@playwright/test');

const DESKTOP_LINKS = [
  { text: 'Introduction', href: '#intro' },
  { text: 'Demo', href: '#hf-space' },
  { text: 'About', href: '#about' },
  { text: 'Technical background', href: '#resume' },
  { text: 'Contact', href: '#contact' }
];

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5500';

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

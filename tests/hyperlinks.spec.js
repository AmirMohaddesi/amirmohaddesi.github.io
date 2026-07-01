const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5500';

async function sectionViewportTop(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.getBoundingClientRect().top : null;
  }, selector);
}

/** Major outbound URLs that should open in a new tab with rel hardening */
const EXTERNAL_HREF_FRAGMENTS = [
  'scholar.google.com',
  'ieeexplore.ieee.org',
  'orcid.org',
  'linkedin.com/in/amohaddesi',
  'github.com/AmirMohaddesi',
  'sites.socsci.uci.edu',
  'ics.uci.edu/academics',
  'sharif.ir',
  'nmi-lab.org'
];

test.describe('In-page links, downloads, utility, external hrefs', () => {
  test('flat PSOL outcome rows are visible on page', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);

    const outcomes = page.locator('.psol-outcome');
    await expect(outcomes.first()).toBeVisible();
    expect(await outcomes.count()).toBeGreaterThan(3);
  });

  test('footer Back to Top navigates to #top with intro near viewport top', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(200);

    await page.locator('#main-nav-wrap a[href="#contact"]').click();
    await page.waitForTimeout(900);

    await page.locator('footer #go-top a.smoothscroll[href="#top"]').click();
    await page.waitForTimeout(700);
    await expect(page).toHaveURL(/#top$/);

    const introTop = await sectionViewportTop(page, '#intro');
    expect(introTop).not.toBeNull();
    expect(introTop).toBeLessThanOrEqual(24);
  });

  test('hero resume and GitHub links are present', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);

    const resume = page.locator('#intro a.hero-link.link-cv-download[href="CV_Amirhosein.pdf"]');
    const github = page.locator('#intro a.hero-link.link-external[href*="github.com/AmirMohaddesi"]');
    await expect(resume).toHaveCount(1);
    await expect(github).toHaveCount(1);
    await expect(resume).toHaveAttribute('download');
  });

  test('hero Download CV uses PDF href and download attribute', async ({ page }) => {
    await page.goto(BASE_URL);

    const heroCv = page.locator('#intro a.hero-link.link-cv-download[href="CV_Amirhosein.pdf"]');
    const aboutCv = page.locator('#about .button-section a.link-cv-download[href="CV_Amirhosein.pdf"]');

    await expect(heroCv).toHaveCount(1);
    await expect(aboutCv).toHaveCount(1);
    await expect(heroCv).toHaveAttribute('download');
    await expect(aboutCv).toHaveAttribute('download');
  });

  test('open-popup is a button without smoothscroll (utility action)', async ({ page }) => {
    await page.goto(BASE_URL);
    const btn = page.locator('#open-popup');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('type', 'button');
    const cls = (await btn.getAttribute('class')) || '';
    expect(cls).not.toContain('smoothscroll');
  });

  test('same-site portfolio link is not forced to target _blank', async ({ page }) => {
    await page.goto(BASE_URL);
    const site = page.locator('a.link-external--site[href*="amirmohaddesi.github.io"]');
    await expect(site).toHaveCount(1);
    await expect(site).not.toHaveAttribute('target', '_blank');
  });

  test('major external resources use target=_blank and noopener noreferrer', async ({ page }) => {
    await page.goto(BASE_URL);

    for (const frag of EXTERNAL_HREF_FRAGMENTS) {
      const link = page.locator(`a[href*="${frag}"]`).first();
      await expect(link, `link containing ${frag}`).toBeAttached();
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel || '', `rel for ${frag}`).toMatch(/noopener/);
      expect(rel || '', `rel for ${frag}`).toMatch(/noreferrer/);
    }
  });
});

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5500';

/** Smoke check: section order and presence (layout/regression guard) */
test.describe('Page structure', () => {
  test('main sections exist in document order', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(BASE_URL);

    const ids = ['intro', 'hf-space', 'about', 'selected-work', 'resume', 'contact'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    const order = await page.evaluate(() => {
      const wanted = ['intro', 'hf-space', 'about', 'selected-work', 'resume', 'contact'];
      const sections = Array.from(document.querySelectorAll('main#main-content section[id]'));
      return sections.map((s) => s.id);
    });

    expect(order).toEqual(ids);
  });
});

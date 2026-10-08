import { test as base, expect } from '@playwright/test';

export async function dismissArrivalNotice(page) {
  await page.addLocatorHandler(page.locator('#materials-dialog[open]'), () =>
    page.locator('#materials-continue').click(),
  );
}
export const test = base.extend({
  page: async ({ page }, use) => {
    await dismissArrivalNotice(page);
    await use(page);
  },
});
export { expect };

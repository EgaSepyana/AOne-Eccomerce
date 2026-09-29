import { test, expect } from "@playwright/test";

test.describe("F3: Quick View (desktop)", () => {
  test("hover reveals LIHAT CEPAT button and it opens the product", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "hover-only interaction, not applicable on touch/mobile layout");
    await page.goto("/c/wanita/kaos");

    const card = page
      .locator('a[href*="/p/kaos-katun-supima-crew-neck"]')
      .first();
    await card.hover();

    const quickViewButton = page
      .getByRole("button", { name: "LIHAT CEPAT" })
      .first();
    await expect(quickViewButton).toBeVisible();

    await quickViewButton.click();
    await expect(page).toHaveURL(/\/p\/kaos-katun-supima-crew-neck/);
  });
});

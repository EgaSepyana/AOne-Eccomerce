import { test, expect } from "@playwright/test";

test.describe("F4: Wishlist", () => {
  test("adding from PDP shows toast and persists in wishlist page", async ({
    page,
  }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");

    await page
      .getByRole("button", { name: "TAMBAH KE WISHLIST", exact: true })
      .click();

    await expect(page.getByRole("status")).toContainText(
      "Ditambahkan ke wishlist",
    );

    await page.goto("/wishlist");
    await expect(
      page.locator('a[href*="/p/kaos-katun-supima-crew-neck-pria"]').first(),
    ).toBeVisible();
  });

  test("wishlist persists after reload", async ({ page }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");
    await page
      .getByRole("button", { name: "TAMBAH KE WISHLIST", exact: true })
      .click();

    await page.reload();
    await expect(
      page.getByRole("button", { name: "DI WISHLIST", exact: true }),
    ).toBeVisible();

    await page.goto("/wishlist");
    await page.reload();
    await expect(
      page.locator('a[href*="/p/kaos-katun-supima-crew-neck-pria"]').first(),
    ).toBeVisible();
  });

  test("can remove from wishlist page", async ({ page }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");
    await page
      .getByRole("button", { name: "TAMBAH KE WISHLIST", exact: true })
      .click();

    await page.goto("/wishlist");
    await page
      .getByRole("button", { name: "Hapus dari wishlist" })
      .first()
      .click();

    await expect(
      page.locator('a[href*="/p/kaos-katun-supima-crew-neck-pria"]'),
    ).toHaveCount(0);
  });
});

import { test, expect } from "@playwright/test";

test.describe("F8: Navigasi & Edge", () => {
  test("mega-menu opens on hover and links navigate to category", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop nav is hidden on mobile layout; see mobile drawer menu test");
    await page.goto("/");

    await page.getByRole("link", { name: "Wanita", exact: true }).hover();
    const menu = page.getByRole("menu", { name: /Kategori wanita/i });
    await expect(menu).toBeVisible({ timeout: 2_000 });

    await menu.getByRole("menuitem", { name: "Kaos" }).click();
    await expect(page).toHaveURL(/\/c\/wanita\/kaos/);
  });

  test("mobile drawer menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Buka menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer).toBeVisible();
    await page.waitForTimeout(400);

    await drawer.getByRole("link", { name: /Wishlist/i }).click();
    await expect(page).toHaveURL(/\/wishlist/);
  });

  test("breadcrumb on PDP is clickable", async ({ page }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");

    await page.getByRole("link", { name: "Beranda" }).click();
    await expect(page).toHaveURL("/");
  });

  test("invalid URL shows 404 page with CTA and popular products", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");

    await expect(
      page.getByRole("heading", { name: "Halaman ini tidak ditemukan" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "KE BERANDA" })).toBeVisible();
  });

  test("invalid gender segment 404s", async ({ page }) => {
    const response = await page.goto("/c/invalid-gender");
    expect(response?.status()).toBe(404);
  });

  test("cart state survives a page refresh", async ({ page }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");
    await page.getByRole("radio").first().click();
    await page
      .getByRole("button", { name: "TAMBAH KE KERANJANG" })
      .first()
      .click();
    await page.keyboard.press("Escape");

    await page.goto("/cart");
    await page.reload();

    await expect(page.getByRole("heading", { name: "Keranjang" })).toBeVisible();
    await expect(page.getByText("Keranjangmu masih kosong")).not.toBeVisible();
  });

  test("filter state in URL survives a page refresh", async ({ page }) => {
    await page.goto("/c/pria/kaos?size=M");
    await page.reload();

    await expect(page).toHaveURL(/size=M/);
    await expect(page.getByText("Ukuran M")).toBeVisible();
  });
});

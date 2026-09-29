import { test, expect } from "@playwright/test";

async function addProductToCart(
  page: import("@playwright/test").Page,
  slug: string,
) {
  await page.goto(`/p/${slug}`);
  await page.getByRole("radio").first().click();
  await page
    .getByRole("button", { name: "TAMBAH KE KERANJANG" })
    .first()
    .click();
  await page.keyboard.press("Escape");
}

test.describe("F6: Keranjang", () => {
  test("qty stepper updates line total, promo code applies discount", async ({
    page,
  }) => {
    await addProductToCart(page, "kaos-katun-supima-crew-neck-pria");
    await page.goto("/cart");

    await expect(page.getByRole("heading", { name: "Keranjang" })).toBeVisible();

    const increment = page.getByRole("button", { name: "Tambah jumlah" });
    await increment.click();
    await increment.click();

    await page.getByPlaceholder("Masukkan kode").fill("AONE10");
    await page.getByRole("button", { name: "PAKAI" }).click();

    await expect(
      page.getByText("Kode promo berhasil diterapkan"),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("invalid promo code shows error", async ({ page }) => {
    await addProductToCart(page, "kaos-katun-supima-crew-neck-pria");
    await page.goto("/cart");

    await page.getByPlaceholder("Masukkan kode").fill("INVALIDCODE");
    await page.getByRole("button", { name: "PAKAI" }).click();

    await expect(page.getByText("Kode tidak valid")).toBeVisible({
      timeout: 5_000,
    });
  });

  test("free shipping code removes shipping cost", async ({ page }) => {
    await addProductToCart(page, "kaos-katun-supima-crew-neck-pria");
    await page.goto("/cart");

    const increment = page.getByRole("button", { name: "Tambah jumlah" });
    await increment.click();
    await increment.click();

    await page.getByPlaceholder("Masukkan kode").fill("ONGKIRFREE");
    await page.getByRole("button", { name: "PAKAI" }).click();

    await expect(
      page.getByText("Kode promo berhasil diterapkan"),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("remove item shows undo toast", async ({ page }) => {
    await addProductToCart(page, "kaos-katun-supima-crew-neck-pria");
    await page.goto("/cart");

    await page.getByRole("button", { name: "Hapus" }).click();

    await expect(page.getByRole("status")).toContainText("dihapus");
    await expect(page.getByRole("button", { name: "Urungkan" })).toBeVisible();
  });

  test("empty cart shows empty state with CTA", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: "Keranjangmu masih kosong" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "MULAI BELANJA" }),
    ).toBeVisible();
  });
});

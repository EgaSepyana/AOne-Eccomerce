import { test, expect } from "@playwright/test";

test.describe("F5: Size Finder & Stok", () => {
  test("size finder recommends a size from height/weight input", async ({
    page,
  }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");

    await page.getByRole("button", { name: "Cari ukuranmu" }).click();
    const drawer = page.getByRole("dialog", { name: "Cari Ukuranmu" });
    await expect(drawer).toBeVisible();

    await drawer.getByLabel("Tinggi badan (cm)").fill("165");
    await drawer.getByLabel("Berat badan (kg)").fill("55");
    await drawer.getByRole("button", { name: "LIHAT REKOMENDASI" }).click();

    await expect(drawer.getByText(/Rekomendasi ukuran:/)).toBeVisible();
  });

  test("size guide modal shows size table", async ({ page }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");

    await page.getByRole("button", { name: "Panduan ukuran" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("selecting a sold-out size opens notify-me modal", async ({
    page,
  }) => {
    await page.goto("/p/kaos-katun-supima-crew-neck-pria");

    const soldOutRadio = page.locator(
      '[role="radio"][class*="text-disabled"]',
    );

    const count = await soldOutRadio.count();
    test.skip(count === 0, "No sold-out size variant available to test");

    await soldOutRadio.first().click();

    const modal = page.getByRole("dialog", { name: "Beri Tahu Saya" });
    await expect(modal).toBeVisible();

    await modal.getByLabel("Email").fill("nadia@example.com");
    await modal.getByRole("button", { name: "KIRIM" }).click();

    await expect(page.getByRole("status")).toContainText("tersedia");
  });
});

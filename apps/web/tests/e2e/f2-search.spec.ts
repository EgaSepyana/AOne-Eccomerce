import { test, expect } from "@playwright/test";

test.describe("F2: Search", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(
      isMobile,
      "exercises the desktop search trigger; mobile uses a separate icon button",
    );
  });

  test("overlay shows popular searches and trending products", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();

    await expect(page.getByText("Pencarian populer")).toBeVisible();
    await expect(page.getByText("Sedang tren")).toBeVisible();
  });

  test("typo query still surfaces suggestions via fuzzy search", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();

    const input = page.getByPlaceholder("Cari kaos, kemeja, celana…");
    await input.fill("kemja");

    await expect(page.getByText("Saran")).toBeVisible({ timeout: 5_000 });
    await expect(
      page.getByRole("button", { name: /kemeja/i }).first(),
    ).toBeVisible();
  });

  test("enter navigates to search results page", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();

    const input = page.getByPlaceholder("Cari kaos, kemeja, celana…");
    await input.fill("kaos");
    await input.press("Enter");

    await expect(page).toHaveURL(/\/search\?q=kaos/);
  });

  test("query with no results shows empty state with suggestions", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();

    const input = page.getByPlaceholder("Cari kaos, kemeja, celana…");
    await input.fill("xyzabc");

    await expect(
      page.getByText("Tidak ada hasil untuk “xyzabc”"),
    ).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("Pencarian populer")).toBeVisible();
  });

  test("recent search is saved and can be removed", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();

    const input = page.getByPlaceholder("Cari kaos, kemeja, celana…");
    await input.fill("kaos");
    await input.press("Enter");

    await page
      .getByRole("button", { name: "Cari kaos, kemeja, celana…" })
      .click();
    const recentHeading = page.getByText("Pencarian terakhir");
    await expect(recentHeading).toBeVisible();

    const recentSection = recentHeading.locator("../..");
    await expect(recentSection.getByText("kaos", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Hapus", exact: true }).click();
    await expect(recentHeading).not.toBeVisible();
  });
});

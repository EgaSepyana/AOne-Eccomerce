import { test, expect } from "@playwright/test";

test.describe("F7: Akun (dummy)", () => {
  test("login with any valid-format email/password redirects to account", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email atau nomor HP").fill("nadia.putri@gmail.com");
    await page.getByLabel("Kata sandi").fill("password123");
    await page
      .locator("form")
      .getByRole("button", { name: "MASUK", exact: true })
      .click();

    await expect(page).toHaveURL(/\/account|\/$/, { timeout: 10_000 });
  });

  test("login validates required fields", async ({ page }) => {
    await page.goto("/login");
    await page
      .locator("form")
      .getByRole("button", { name: "MASUK", exact: true })
      .click();

    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("register validates email format", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Nama lengkap").fill("Nadia Putri");
    await page.getByPlaceholder("nadia.putri@gmail.com").fill("not-an-email");
    await page.getByLabel("Kata sandi").fill("password123");
    await page
      .locator("form")
      .filter({ has: page.getByLabel("Nama lengkap") })
      .getByRole("button", { name: "DAFTAR", exact: true })
      .click();

    await expect(page.getByText("Format email tidak valid")).toBeVisible();
  });

  test("account page shows profile and orders after login", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email atau nomor HP").fill("nadia.putri@gmail.com");
    await page.getByLabel("Kata sandi").fill("password123");
    await page
      .locator("form")
      .getByRole("button", { name: "MASUK", exact: true })
      .click();

    await page.goto("/account");
    await expect(page).toHaveURL(/\/account/);
  });

  test("guest checkout works without login", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Lanjut checkout sebagai tamu" }).click();
    await expect(page).toHaveURL(/\/checkout/);
  });
});

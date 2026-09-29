import { test, expect } from "@playwright/test";

test.describe("F1: Browse → Beli (happy path)", () => {
  test("full journey from homepage to order success", async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "exercises desktop nav and mega-menu; mobile navigation covered in F8",
    );
    await page.goto("/");

    await page.getByRole("link", { name: "Pria", exact: true }).click();
    await expect(page).toHaveURL(/\/c\/pria/);

    await page.keyboard.press("Escape");
    await page.mouse.move(700, 500);
    await expect
      .poll(
        async () =>
          page
            .getByRole("menu", { name: /Kategori pria/i })
            .evaluate((el) => (el as HTMLElement).style.height),
        { timeout: 2_000 },
      )
      .toBe("0px");

    await page.getByRole("link", { name: "Kaos", exact: true }).first().click();
    await expect(page).toHaveURL(/\/c\/pria\/kaos/);

    await page
      .getByRole("complementary")
      .getByRole("button", { name: "M", exact: true })
      .click();
    await expect(page).toHaveURL(/size=M/);

    await page
      .getByRole("button", { name: /Urutkan:/ })
      .click();
    await page.getByRole("button", { name: "Harga terendah" }).click();
    await expect(page).toHaveURL(/sort=harga-terendah/);

    await page
      .locator('a[href*="/p/kaos-katun-supima-crew-neck-pria"]')
      .first()
      .click();

    await expect(page).toHaveURL(/\/p\/kaos-katun-supima-crew-neck-pria/);

    await page.getByRole("radio", { name: "L", exact: true }).click();
    await page.getByRole("button", { name: "TAMBAH KE KERANJANG" }).first().click();

    await expect(
      page.getByRole("dialog", { name: "Keranjang" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "CHECKOUT" }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel("Email").fill("nadia.putri@gmail.com");
    await page.getByLabel("Nama lengkap").fill("Nadia Putri");
    await page.getByLabel("Nomor HP").fill("081234567890");
    await page.getByLabel("Alamat lengkap").fill("Jl. Merdeka No. 1, RT01/RW02");
    await page.getByLabel("Provinsi").selectOption({ index: 1 });
    await page.getByLabel("Kota / Kabupaten").selectOption({ index: 1 });
    await page.getByLabel("Kecamatan").selectOption({ index: 1 });
    await page.getByLabel("Kode pos").fill("12345");

    await page.getByRole("button", { name: /Reguler|Express|Instan/ }).first().click();
    await page.getByRole("button", { name: "LANJUT KE PEMBAYARAN" }).click();

    await page.getByRole("button", { name: /^QRIS/ }).click();
    await page.getByRole("button", { name: "LANJUT KE REVIEW" }).click();

    await page
      .getByRole("checkbox", {
        name: "Saya menyetujui syarat dan ketentuan yang berlaku",
      })
      .check();
    await page.getByRole("button", { name: "BUAT PESANAN" }).click();

    await expect(page).toHaveURL(/\/checkout\/success\/.+/, { timeout: 10_000 });
    await expect(
      page.getByRole("heading", { name: "Pesanan Berhasil Dibuat" }),
    ).toBeVisible();
  });
});

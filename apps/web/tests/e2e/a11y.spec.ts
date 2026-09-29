import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { name: "Homepage", path: "/" },
  { name: "PLP", path: "/c/wanita/kaos" },
  { name: "PDP", path: "/p/kaos-katun-supima-crew-neck-pria" },
  { name: "Search results", path: "/search?q=kaos" },
  { name: "Cart", path: "/cart" },
  { name: "Wishlist", path: "/wishlist" },
  { name: "Login", path: "/login" },
  { name: "Checkout", path: "/checkout" },
  { name: "404", path: "/this-route-does-not-exist" },
];

test.describe("Accessibility (WCAG 2.1 AA via axe)", () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no automatically detectable WCAG A/AA violations`, async ({
      page,
    }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(
        results.violations,
        JSON.stringify(results.violations, null, 2),
      ).toEqual([]);
    });
  }
});

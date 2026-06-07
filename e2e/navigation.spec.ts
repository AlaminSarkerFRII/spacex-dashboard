import { test, expect } from "@playwright/test";

const pages = [
  { label: "Launches", url: "/launches", heading: "Past Launches" },
  { label: "Rockets", url: "/rockets", heading: "Rockets" },
  { label: "Launchpads", url: "/launchpads", heading: "Launchpads" },
  { label: "Fleet", url: "/ships", heading: "Fleet" },
];

test.describe("Navigation", () => {
  test("nav links navigate to the correct pages", async ({ page }) => {
    await page.goto("/");

    for (const { label, url, heading } of pages) {
      await page.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("logo link navigates back to home", async ({ page }) => {
    await page.goto("/launches");
    await page.getByRole("link", { name: /SpaceX/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("active nav link is visually highlighted", async ({ page }) => {
    await page.goto("/launches");

    const launchesLink = page.getByRole("link", { name: "Launches" });
    // active link has bg-white/10 class
    await expect(launchesLink).toHaveClass(/bg-white/);
  });
});

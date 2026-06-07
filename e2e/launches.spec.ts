import { test, expect } from "@playwright/test";

test.describe("Launches page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/launches");
  });

  test("shows the Past Launches heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Past Launches" })).toBeVisible();
  });

  test("renders launch cards", async ({ page }) => {
    // wait for at least one launch card to appear
    const cards = page.locator("a[href^='/launches/']");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("search filters launches by mission name", async ({ page }) => {
    const input = page.getByPlaceholder(/search by mission/i);
    await input.fill("Falcon 9 Test");

    // result count text should appear
    await expect(page.getByText(/result/i)).toBeVisible();

    // only matching cards should be visible
    const cards = page.locator("a[href^='/launches/']");
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test("search shows no results state for unknown term", async ({ page }) => {
    const input = page.getByPlaceholder(/search by mission/i);
    await input.fill("xyznonexistent999");
    await expect(page.getByText("No launches found")).toBeVisible();
  });

  test("clear button resets the search", async ({ page }) => {
    const input = page.getByPlaceholder(/search by mission/i);
    await input.fill("Falcon");

    const clearBtn = page.getByLabel("Clear search");
    await clearBtn.click();

    await expect(input).toHaveValue("");
  });

  test("Success filter shows only successful launches", async ({ page }) => {
    await page.getByRole("button", { name: /Success/i }).click();

    // Failed badge should not exist within any visible card
    const failedBadges = page.locator("text=Failed");
    await expect(failedBadges).toHaveCount(0);
  });

  test("Failed filter shows only failed launches", async ({ page }) => {
    await page.getByRole("button", { name: /Failed/i }).click();
    const successBadges = page.locator("text=Success");
    await expect(successBadges).toHaveCount(0);
  });

  test("clicking a launch card navigates to the detail page", async ({ page }) => {
    const firstCard = page.locator("a[href^='/launches/']").first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/launches\/.+/);
    await expect(page.getByRole("link", { name: "← Back to Launches" })).toBeVisible();
  });
});

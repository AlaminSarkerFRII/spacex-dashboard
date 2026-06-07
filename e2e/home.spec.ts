import { test, expect } from "@playwright/test";

test.describe("Home / Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/SpaceX Dashboard/);
  });

  test("shows the hero section with SpaceX branding", async ({ page }) => {
    await expect(page.getByText("Mission Control")).toBeVisible();
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("shows navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Launches" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Rockets" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Launchpads" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Fleet" })).toBeVisible();
  });

  test("shows company stats section", async ({ page }) => {
    await expect(page.getByText("Company Overview")).toBeVisible();
    await expect(page.getByText("Founded")).toBeVisible();
    await expect(page.getByText("Employees")).toBeVisible();
    await expect(page.getByText("Launch Sites")).toBeVisible();
  });

  test("shows leadership section", async ({ page }) => {
    await expect(page.getByText("Leadership")).toBeVisible();
    await expect(page.getByText("CEO")).toBeVisible();
    await expect(page.getByText("Elon Musk")).toBeVisible();
    await expect(page.getByText("Gwynne Shotwell")).toBeVisible();
  });

  test("shows upcoming launches section", async ({ page }) => {
    await expect(page.getByText("Upcoming Launches")).toBeVisible();
  });

  test("View Launches button navigates to /launches", async ({ page }) => {
    await page.getByRole("link", { name: "View Launches" }).click();
    await expect(page).toHaveURL("/launches");
  });

  test("Explore Rockets button navigates to /rockets", async ({ page }) => {
    await page.getByRole("link", { name: "Explore Rockets" }).click();
    await expect(page).toHaveURL("/rockets");
  });
});

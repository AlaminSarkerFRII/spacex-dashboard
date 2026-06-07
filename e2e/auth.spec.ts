import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows Sign in button when logged out", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("opens login modal on Sign in click", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByPlaceholder("admin@gmail.com")).toBeVisible();
  });

  test("shows demo credentials hint in the modal", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("admin@gmail.com")).toBeVisible();
  });

  test("shows error for wrong credentials", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByPlaceholder("admin@gmail.com").fill("wrong@email.com");
    await page.getByPlaceholder("••••••").fill("wrongpass");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
  });

  test("logs in with demo credentials and shows avatar", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByPlaceholder("admin@gmail.com").fill("admin@gmail.com");
    await page.getByPlaceholder("••••••").fill("admin");
    await page.getByRole("button", { name: "Sign in" }).click();

    // modal closes and avatar appears
    await expect(page.getByRole("button", { name: "Open profile" })).toBeVisible();
    await expect(page.getByText("Admin")).toBeVisible();

    // Sign in button is gone
    await expect(page.getByRole("button", { name: "Sign in" })).not.toBeVisible();
  });

  test("opens profile modal on avatar click", async ({ page }) => {
    // log in first
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByPlaceholder("admin@gmail.com").fill("admin@gmail.com");
    await page.getByPlaceholder("••••••").fill("admin");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("button", { name: "Open profile" }).click();

    await expect(page.getByText("Admin User")).toBeVisible();
    await expect(page.getByText("admin@gmail.com")).toBeVisible();
    await expect(page.getByText("Administrator")).toBeVisible();
  });

  test("signs out and returns to logged-out state", async ({ page }) => {
    // log in
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByPlaceholder("admin@gmail.com").fill("admin@gmail.com");
    await page.getByPlaceholder("••••••").fill("admin");
    await page.getByRole("button", { name: "Sign in" }).click();

    // open profile and sign out
    await page.getByRole("button", { name: "Open profile" }).click();
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("closes login modal with Escape key", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Sign in" })).not.toBeVisible();
  });
});

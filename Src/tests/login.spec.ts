// src/tests/login.spec.ts
import { test } from "./baseTest";
import { expect } from "@playwright/test";
import { LoginLocators } from "../pages/interac/locator"; 

test("Login successful", async ({ page }) => {
  await expect(page.locator(LoginLocators.dashboardHeader)).toBeVisible();
});

import { test, expect } from "@playwright/test";

test.describe("Group1", () => {
    test("Test1", async ({ page }) => {
        console.log("This is Test 1");
    });

    test("Test2", async ({ page }) => {
        console.log("This is Test 2");
    });
});

test.describe("Group2", () => {
    test("Test3", async ({ page }) => {
        console.log("This is Test 3");
    });
});

test.describe("Group3", () => {
    test("Test4", async ({ page }) => {
        console.log("This is Test 4");
    });
});

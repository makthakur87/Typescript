import { test, expect } from "@playwright/test";

test.afterAll('After All Hook', async () => {
    console.log("This is the After All Hook");
});


test.beforeEach('Before Each Hook', async () => {
    console.log("This is the Before Each Hook");
});

test.afterEach('After Each Hook', async () => {
    console.log("This is the After Each Hook");
});

test.afterAll('After All Hook', async () => {
    console.log("This is the After All Hook");
});

test("Test1", async ({ page }) => {
    console.log("This is Test 1");
});

test("Test2", async ({ page }) => {
    console.log("This is Test 2");
});

test("Test3", async ({ page }) => {
    console.log("This is Test 3");
});

test("Test4", async ({ page }) => {
    console.log("This is Test 4");
});


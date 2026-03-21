import { test } from "@fixtures/baseTest";

test.describe.configure({ mode: "parallel" }); // Configure the test suite to run tests in parallel

test.describe("Parallel Testing", () => {
    test("Test 1", async ({ page }) => {
        console.log("Running Test 1");

        // Add assertions or interactions for Test 1
    });

    test("Test 2", async ({ page }) => {
        console.log("Running Test 2");
        // Add assertions or interactions for Test 2
    });

    test("Test 3", async ({ page }) => {
        console.log("Running Test 3");
        // Add assertions or interactions for Test 3
        // Add assertions or interactions for Test 3
    });

    test("Test 4", async ({ page }) => {
        console.log("Running Test 4");
        // Add assertions or interactions for Test 4
    });

    test("Test 5", async ({ page }) => {
        console.log("Running Test 5");
        // Add assertions or interactions for Test 5
    });
});
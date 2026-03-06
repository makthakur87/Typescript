// Frames: https://playwright.dev/docs/frames
// Frames: is an HTML document embedded inside another HTML document. 
// The outer document is called the parent page, and the inner document is called a frame or an iframe (inline frame). 
// Frames are commonly used to embed content from another source, such as advertisements, videos, or interactive widgets, within a web page. 
// They can also be used to divide a web page into multiple sections that can be loaded independently.
// In Playwright, you can interact with frames using the Frame class.
// To work with frames in Playwright, you can use the page.frame() method to get a reference to a specific frame by its name, URL, or other attributes. 
// Once you have a reference to the frame, you can perform actions on it just like you would with the main page, such as clicking elements, filling forms, or extracting information.
import { test, expect } from "@playwright/test";

test("I-Frame Interaction", async ({ page }) => {
    await page.goto("https://ui.vision/demo/webtest/frames/");

    // total number of frames/iframes on the page
    const frames = page.frames();
    console.log(`Total number of frames on the page: ${frames.length}`);

    // Approach 1 - using page.frame() to get a reference to the frame by its name or URL
    const frame = page.frame({ url: "https://ui.vision/demo/webtest/frames/frame_1.html"});
    if (frame) {
        frame.locator("[name='mytext1']").fill("Hello from Playwright!"); // interact with element inside the frame
        // frame.fill("[name='mytext1']", "Hello from Playwright!"); // // Interact with the frame
    } else {
        console.log("Frame not found");
    }

    await page.waitForTimeout(3000);

    // Approach 2 - using page.frameLocator() to directly interact with elements inside the frame without needing to get a reference to the frame first
    const frameLocator = page.frameLocator("[src='frame_3.html']").locator("[name='mytext3']");
    await frameLocator.fill("John"); // directly interact with element inside the frame using frameLocator

    await page.waitForTimeout(3000);
});

test.only("Inner/child Frames Interaction", async ({ page }) => {
    await page.goto("https://ui.vision/demo/webtest/frames/");
    const parentFrame3 = page.frame({ url: "https://ui.vision/demo/webtest/frames/frame_3.html"});

    // const frameLocator = parentFrame3?.locator("[name='mytext3']");

    if (parentFrame3) {
        parentFrame3.locator("[name='mytext3']").fill("Welcome");
        const childFrames = parentFrame3.childFrames();
        console.log("Child frames inside the frame3: ", childFrames.length)

        const radio = childFrames[0].getByLabel("I am a human");
        await radio.check();
        await expect(radio).toBeChecked();
    } else {
        console.log("Parent frame3 not found");
    }

    await page.waitForTimeout(3000);
});

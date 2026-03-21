// playwright can be used to test applications for many types of accessibility issues, 
// Examples:
//  - Missing alt text on images
//  - Insufficient color contrast
//  - Missing form labels
//  - Keyboard accessibility issues
//  - ARIA attribute issues
//  - keyboard navigation issues
//  - Focus management issues
//  - Dynamic content accessibility issues

// Every websites should follow WCAG guidelines
    // WCAG (Web Content Accessibility Guidelines) is a set of guidelines for making web content more accessible to people with disabilities.

// Install @axe-core/playwright
// npm install @axe-core/playwright

// https://www.npmjs.com/package/@axe-core/playwright

import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test("Accessibility Testing", async ({ page }, testInfo) => {
    // await page.goto("https://demowebshop.tricentis.com/");
    await page.goto("https://www.w3.org");

    // Scanning detect all types of WCAG violations
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    console.log(accessibilityScanResults);
    console.log(`Number of accessibility violations: ${accessibilityScanResults.violations.length}`);

    // Assert that there are no accessibility violations
    expect.soft(accessibilityScanResults.violations).toEqual([]);

    // verify specific accessibility violation
    const accessibilityScanResultsWithOptions = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag2aaa", "wcag21a", "wcag21aa"]).analyze();
    await testInfo.attach("Accessibility Scan Results with Options", {
        body: JSON.stringify(accessibilityScanResultsWithOptions, null, 2),
        contentType: "application/json",
    });
    console.log(accessibilityScanResultsWithOptions);
    console.log(`Number of accessibility violations with options: ${accessibilityScanResultsWithOptions.violations.length}`);
    
    // Scanning for specific WCAG violations with rules
    const accessibilityScanResultsWithRules = await new AxeBuilder({ page }).withRules(["color-contrast", "image-alt", "label", "aria-allowed-attr", "aria-required-attr"]).analyze();
    await testInfo.attach("Accessibility Scan Results with Rules", {
        body: JSON.stringify(accessibilityScanResultsWithRules, null, 2),
        contentType: "application/json",
    });
    console.log(accessibilityScanResultsWithRules);
    console.log(`Number of accessibility violations with rules: ${accessibilityScanResultsWithRules.violations.length}`);
});
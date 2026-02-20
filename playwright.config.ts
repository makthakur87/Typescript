import { defineConfig, devices } from '@playwright/test';
import { loadEnvironment } from './src/config/utils/envLoader';

// npm install dotenv --save
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envName = process.env.ENV_NAME || 'uat-green'; // Default to 'uat-green' if ENV_NAME is not set, otherwise set  $env:ENV="ist-green"
console.log(`Running tests in ${envName} environment`);

const env = loadEnvironment(envName);

const debugMode = !!process.env.PWDEBUG || !!process.env.DEBUG_PLAYWRIGHT;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  timeout: 1 * 120 * 1000, // 120 seconds 
  testDir: './src/tests', // Specify the test directory.
  testMatch: '**/*.spec.ts', // Only run test files with .spec.ts extension
  // fullyParallel: true, // Run all tests in parallel.
  fullyParallel: debugMode ? false : true, // Disable parallel execution when debugging to simplify the process, otherwise enable it for faster execution
  expect: { timeout: 5000, }, // Expectation timeout of 5 seconds
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code.
  // retries: process.env.CI ? 2 : 0, // Retry on CI only
  retries: debugMode ? 0 : 0, // Disable retries when debugging to speed up the process
  // workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI.
  workers: debugMode ? 1 : 2, // Use a single worker when debugging to simplify the process, otherwise use 2 workers for faster execution
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // minimize duplicate test results in the HTML report when running in parallel
  reporter: [
    ['html', { // Specify the output folder for the HTML report
      outputFolder: './reports/html-report', 
      open: 'never' // change to "always" to auto open, or "on-failure" to open only when tests fail
    }],
    ["json", { // Specify the output file for the JSON report
      outputFile: './reports/json-report/report.json'
    }],
    ["line"], // simple console output without colors or icons, to minimize duplicate test results in the console when running in parallel
    // npm install -D allure-playwright
    ["allure-playwright", {
      resultsDir: './reports/allure-results', // Specify the output directory for Allure results
      detail: true, // Include detailed information in the Allure report
      suiteTitle: false, // Disable suite titles in the Allure report to reduce duplication
      links: {
        issue: {
          urlTemplate: 'https://your-issue-tracker.com/issue/{id}', // Replace with your issue tracker URL pattern
        }
      },
      categories: [ {
        name: "Failed Tests",
        messageRegex:".*"
      }],
      environmentInfo: {
        NODE_VERSION: process.version,
        OS: process.platform,
        Environment: env.name,
        BaseURL: env.web.baseUrl,
      }
    }], // Generate Allure report for better visualization of test results, including screenshots and logs
    ['list'], // simple list reporter to minimize duplicate test results in the console when running in parallel
    ['junit', { outputFile: './reports/junit-report/results.xml' }] // Generate JUnit XML report for CI integration
  ],

  // connect MQ and DB2 once before all tests; close the connections after all tests are done
  // globalSetup: require.resolve('./src/utils/globalSetup'),
  // globalTeardown: require.resolve('./src/utils/globalTeardown'),

  outputDir: './reports/test-results/', // Specify the output directory for test artifacts like screenshots, videos, and traces
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    headless: !debugMode, // Run in headless mode unless debugging to speed up execution
    viewport: { width: 1280, height: 720 }, // Set a consistent viewport size for all tests
    navigationTimeout: 30 * 1000, // Set navigation timeout to 30 seconds to accommodate slower environments
    actionTimeout: 15 * 1000, // Set action timeout to 15 seconds to allow for slower interactions in certain environments
    video: 'off', // Record video for all tests to help with debugging and analysis
    screenshot: 'on', // Capture screenshots on test failure to assist with debugging
    ignoreHTTPSErrors: true, // Ignore HTTPS errors to prevent test failures due to certificate issues
    permissions: ['geolocation'], // Grant geolocation permissions for tests that require location access
    launchOptions: {
      args:[
        '--start-maximized', // Start the browser maximized to ensure consistent viewport size
        '--window-size=1280,720', // Set a specific window size to ensure consistent test conditions
        '--incognito', // Launch the browser in incognito mode to ensure a clean state for each test run
        '--no-sandbox', // Disable sandboxing for better compatibility in certain environments (use with caution)
      ],
    },
    contextOptions: {
      recordVideo: {
        dir: './reports/videos', // Specify the output directory for recorded videos
      },
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: debugMode ? 'on' : 'on-first-retry', // Always collect trace when debugging to assist with troubleshooting, otherwise only collect trace on the first retry to save resources
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Playwright Test Automaion",
      use: {
         ...devices['Desktop Chrome'],
         channel: 'chrome', // Use the latest Chrome browser for testing to ensure compatibility with modern web features and better performance
         navigationTimeout: debugMode ? 30000: 15000, // 
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

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
const aliasName = process.env.LOGIN_USER || "Interac_1";
// const lang = process.env.LANG || "en";
const rawLang = process.env.LANG || "en";
const langLower = rawLang.toLowerCase();
const lang: "en" | "en-US" | "fr" =
  langLower.startsWith("fr") ? "fr" :
  langLower.startsWith("en-us") ? "en-US" :
  langLower.startsWith("en") ? "en" :
  (() => { throw new Error(`Unsupported LANG: ${rawLang}`); })();

// Use global setup only if team sets this
const useGlobalLogin = process.env.USE_GLOBAL_LOGIN === "true";

// 🔥 Dynamic storage file name
const getStorageFile = (env: string, alias: string, lang: string) => `./storage/${env}-${alias}-${lang}.json`;

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
  timeout: 120 * 1000, // 120 seconds test timeout to accommodate slower environments and allow for debugging when needed
  expect: { timeout: 10000, }, // Expectation timeout of 10 seconds
  testDir: './src/Playwright', // Specify the test directory.
  testMatch: '**/*.spec.ts', // Only run test files with .spec.ts extension
  // fullyParallel: true, // Run all tests in parallel.
  fullyParallel: debugMode ? false : false, // Disable parallel execution when debugging to simplify the process, otherwise enable it for faster execution
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code.
  // retries: process.env.CI ? 2 : 0, // Retry on CI only
  retries: debugMode ? 0 : 0, // disable retries when debugging to simplify the process, otherwise set it to 2 for better stability in CI environments while still providing fast feedback during local development
  // workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI.
  workers: debugMode ? 1 : 2, // Use a single worker when debugging to simplify the process, otherwise use 2 workers for faster execution
  // grep: process.env.GREP ? new RegExp(process.env.GREP) : undefined, // Use GREP environment variable to filter tests by name or tag when needed, otherwise run all tests
  // grepInvert: process.env.GREP_INVERT ? new RegExp(process.env.GREP_INVERT) : undefined, // Use GREP_INVERT environment variable to exclude tests by name or tag when needed, otherwise do not exclude any tests
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // minimize duplicate test results in the HTML report when running in parallel by using a simple reporter for the console output, and generating detailed reports (HTML, Allure, JUnit) for CI and debugging purposes
  reporter: [
    ["line"], // simple console output without colors or icons, to minimize duplicate test results in the console when running in parallel
    ['list'], // simple list reporter to minimize duplicate test results in the console when running in parallel
    ['junit', { outputFile: './reports/junit-report/results.xml' }], // Generate JUnit XML report for CI integration
    ['html', { // Specify the output folder for the HTML report
      outputFolder: './reports/html-report', 
      open: 'never' // change to "always" to auto open, or "on-failure" to open only when tests fail
    }],
    ["json", { // Specify the output file for the JSON report
      outputFile: './reports/json-report/report.json'
    }],
    // https://github.com/allure-framework/allure-js/blob/main/packages/allure-playwright/README.md 
    // npm install -D allure-playwright
    // npm install -g allure-commandline // Install Allure commandline globally to generate and open reports using npx allure generate and npx allure open commands, or use it as a dev dependency and run it with npx to avoid global installations
    
    // Generate Allure report for better visualization of test results, including screenshots and logs, with detailed configuration to include environment information and categorize failed tests
    // allure gernerate command: npx allure generate ./reports/allure-results --clean -o ./reports/allure-report
    // open the generated report: npx allure open ./reports/allure-report
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
    ["./src/config/common/customReporter.ts"]
  ],

  // connect MQ and DB2 once before all tests; close the connections after all tests are done
  // globalSetup: require.resolve('./src/utils/globalSetup'),
   globalSetup: useGlobalLogin ? "./src/setup/global-login.setup.ts" : undefined, // Use the global login setup only if USE_GLOBAL_LOGIN is set to true, otherwise skip it to save time when not needed

  // globalTeardown: require.resolve('./src/utils/globalTeardown'),

  outputDir: './reports/test-results/', // Specify the output directory for test artifacts like screenshots, videos, and traces
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.web.baseUrl, // Set the base URL for all tests to simplify navigation and ensure consistency across test cases
    // storageState: useGlobalLogin
    //   ? getStorageFile(env.name, aliasName, lang) // Use a dynamically generated storage state file based on environment, user alias, and language when global login is enabled
    //   : undefined, // Use the dynamically generated storage state file if global login is enabled, 
      // otherwise do not use any storage state to allow for fresh logins in each test
    headless: !debugMode, // Run in headless mode unless debugging to speed up execution
    navigationTimeout: 30 * 1000, // Set navigation timeout to 30 seconds to accommodate slower environments
    actionTimeout: 15 * 1000, // Set action timeout to 15 seconds to allow for slower interactions in certain environments
    video: 'off', // Record videos only when debugging to save resources, otherwise disable video recording for faster execution and to save disk space
    screenshot: 'on', // Capture screenshots for all tests to assist with debugging and reporting, especially when tests fail, to provide visual evidence of the application state at the time of failure
    ignoreHTTPSErrors: true, // Ignore HTTPS errors to prevent test failures due to certificate issues
    permissions: ['geolocation'], // Grant geolocation permissions for tests that require location access
    viewport: null,// { width: 1280, height: 720 }, // Set a consistent viewport size for all tests
    launchOptions: {
      args:[
        '--start-maximized', // Start the browser maximized to ensure all elements are visible and to provide a consistent testing environment across different machines and screen sizes
        // '--window-size=1280,720', // Set a specific window size to ensure consistent test conditions
        // '--incognito', // Launch the browser in incognito mode to ensure a clean state for each test run
        // '--no-sandbox', // Disable sandboxing for better compatibility in certain environments (use with caution)
      ],
    },
    contextOptions: {
      recordVideo: {
        dir: './reports/videos', // Specify the output directory for recorded videos
      },
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: debugMode ? 'on' : 'off', // Enable tracing for all tests when debugging to assist with diagnosing issues, otherwise only enable it on the first retry of a failed test to save resources while still providing valuable information for debugging failures
    testIdAttribute: 'data-pw', // Use a custom attribute for test IDs to improve test stability and maintainability
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "EN",
      testDir: "src/tests",
       metadata: { LANG: "en" },
      use: {
        storageState: useGlobalLogin
          ? getStorageFile(envName, aliasName, "en")
          : undefined
      }
    },
    {
      name: "FR",
      testDir: "src/tests",
      metadata: { LANG: "fr" }, // Add language metadata to the project configuration for better reporting and debugging
      use: {
        storageState: useGlobalLogin
          ? getStorageFile(envName, aliasName, "fr")
          : undefined
      }
    },
    {
      name: "Playwright Test Automaion",
      use: {
         ...devices['Desktop Chrome'],
         channel: 'chrome', // Use the latest Chrome browser for testing to ensure compatibility with modern web features and better performance
         navigationTimeout: debugMode ? 30000: 15000, // 
      }
    }

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
    // {
    //   name: "EN",
    //   use: {
    //     storageState: "./storage/uat-green-abc-en.json"
    //   }
    // },
    // {
    //   name: "FR",
    //   use: {
    //     storageState: "./storage/uat-green-abc-fr.json"
    //   }
    // }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

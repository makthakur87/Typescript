import { test, expect, Locator, Page } from '@playwright/test';

async function selectDate(page: Page, year: string, month: string, day: string, dateType: boolean) {
    while (true) {
        // select the month
        const currentMonth = await page.locator('.ui-datepicker-month').textContent();
        // select the year
        const currentYear = await page.locator('.ui-datepicker-year').textContent();

        if (currentMonth === month && currentYear === year) {
            break;
        }

        if (dateType) {
            // Future dates: click the next button
            await page.locator('.ui-datepicker-next').click();
        } else {
            // Past dates: click the previous button
            await page.locator('.ui-datepicker-prev').click();
        }
    }

    const allDates: Locator[] = await page.locator(`.ui-datepicker-calendar td`).all();
    for (let date of allDates) {
        const dateText = await date.innerText();
        if (dateText === day) {
            await date.click();
            break;
        }
    }
}

test.describe('DatePicker Component', () => {
  let datePicker: Locator;

  test.beforeEach(async ({ page }) => {
    // await page.goto('https://testautomationpractice.blogspot.com/');
    datePicker = page.locator('#datepicker'); // Replace with the actual selector for the date picker
  });

  test('JQuery Date Picker - use input field', async ( { page } ) => {
    expect(datePicker).toBeVisible();

    // using fill() method to enter date in the date picker input field
    datePicker.fill('06/20/2025'); // mm/dd/yyyy format
    await page.waitForTimeout(3000); // Wait for the date to be processed (adjust as needed)
  });

  test('JQuery Date Picker - use Date Picker', async ({ page }) => {
    // target date
    const year = '2022';
    const month = 'June';
    const day = '20';

    // click on the date picker input to open the calendar
    await datePicker.click();

    await selectDate(page, year, month, day, false);
    const expectedDate = `${month} ${day}, ${year}`;
    console.log(`Selected date: ${expectedDate}`);
    // await expect(datePicker).toHaveValue(expectedDate);
    await page.waitForTimeout(3000);
  });

  test.only('JQuery Date Picker - booking.com - use Date Picker', async ({ page }) => {
    await page.goto('https://www.booking.com/');

    await page.waitForTimeout(3000);

    // click on the date picker input to open the calendar
    await page.locator("button[data-testid='searchbox-dates-container']").click();

    // check in date
    let checkInYear = '2026';
    let checkInMonth = 'June';
    let checkInDay = '20';

    // navigate through the calendar to find the desired check-in date
    while (true) {
        const selectCheckInMonthYear = await page.locator("h3[aria-live='polite']").nth(0).innerText();  // February 2026
        const selectCheckInMonth = selectCheckInMonthYear.split(' ')[0]; // February
        const selectCheckInYear = selectCheckInMonthYear.split(' ')[1]; // 2026

        if (selectCheckInMonth === checkInMonth && selectCheckInYear === checkInYear) {
            break;
        } else {
            await page.locator("button[aria-label='Next month']").click();
        }
    }

    // select the specific check-in date
    let allDates = await page.locator("table.b8fcb0c66a tbody").nth(0).locator('td').all();
    let checkInDateSelected = false;

    for (let date of allDates) {
        const dateText = await date.innerText();
        if (dateText === checkInDay) {
            await date.click();
            checkInDateSelected = true;
            break;
        }    
    }

    // Asserstion to verify the selected check-in date
    expect(checkInDateSelected).toBeTruthy();

    // check out date
    let checkOutYear = '2026';
    let checkOutMonth = 'July';
    let checkOutDay = '25';

    // navigate through the calendar to find the desired check-out date
    while (true) {
        const selectCheckOutMonthYear = await page.locator("h3[aria-live='polite']").nth(1).innerText();  // July 2026
        const selectCheckOutMonth = selectCheckOutMonthYear.split(' ')[0]; // July
        const selectCheckOutYear = selectCheckOutMonthYear.split(' ')[1]; // 2026

        if (selectCheckOutMonth === checkOutMonth && selectCheckOutYear === checkOutYear) {
            break;
        } else {
            await page.locator("button[aria-label='Next month']").click();
        }
    }

    // select the specific check-out date
    allDates = await page.locator("table.b8fcb0c66a tbody").nth(1).locator('td').all();
    let checkOutDateSelected = false;

    for (let date of allDates) {
        const dateText = await date.innerText();
        if (dateText === checkOutDay) {
            await date.click();
            checkOutDateSelected = true;
            break;
        }    
    }

    // Asserstion to verify the selected check-out date
    expect(checkOutDateSelected).toBeTruthy();

    await page.waitForTimeout(3000);
  });
});
  
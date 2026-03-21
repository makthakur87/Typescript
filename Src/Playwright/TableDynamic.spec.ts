import {test, expect, Locator} from '@playwright/test';

test("verify chorme cpu load in dynamic table", async ({page}) => {

    await page.goto("https://practice.expandtesting.com/dynamic-table", {
        timeout: 45000,
        waitUntil: "domcontentloaded"
    });


    const table: Locator = page.locator("table.table tbody");
    await expect(table).toBeVisible();

    // select all the rows, then find number of rows in the table
    const rows: Locator[] = await table.locator("tr").all();
    console.log('Number of rows in the table:', rows.length);
    expect(rows.length).toBe(4);

    // step 1: for Chrome process, get value of CPU load
    // read each row to check the presence of Chrome
    let cpuLoad = '';
    for (const row of rows) {
        const processName: string = await row.locator("td").nth(0).innerText();
        if (processName === "Chrome") {
            // const cpuLoad: string = await row.locator("td").nth(2).innerText();
            cpuLoad = await row.locator("td:has-text('%')").innerText(); // css
            // const cpuLoad: string = await row.locator("td", { hasText: '%' }).innerText(); //
            console.log('CPU load for Chrome process:', cpuLoad);
        }
    }

    let yellowTextBox: string = await page.locator("#chrome-cpu").innerText();
    console.log('CPU load in yellow text box:', yellowTextBox);

    if (yellowTextBox.includes(cpuLoad)) {
        console.log('CPU load in yellow text box matches the CPU load for Chrome process in the table.');
    } else {
        console.log('CPU load in yellow text box does NOT match the CPU load for Chrome process in the table.');
    }
    
    expect(yellowTextBox).toContain(cpuLoad);
});

test("verify/read data from pagination table", async ({page}) => {
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');

    // 1. read all the pages
    let hasMorePages = true;

    while (hasMorePages) {
        const rows = await page.locator("#example tbody tr").all();
        
        for (let row of rows) {
            console.log(await row.innerText());
            // const rowData: string[] = await row.locator("td").allInnerTexts();
            // console.log('Row data:', rowData.map(text => text.trim()));
        }

        await page.waitForTimeout(3000);
        // button[aria-label='Next']
        // button[aria-controls='example']:has-text("›")
        // button[aria-controls='example']:nth-child(9)

        const nextButton: Locator = page.locator("button[aria-label='Next']");
        const isDisabled = await nextButton.getAttribute("class");

        if (isDisabled?.includes("disabled")) {
            hasMorePages = false;
            console.log('No more pages to navigate.');
        } else {
            await nextButton.click();
            console.log('Navigated to the next page.');
        }
    }
});

test("Filter the rows and check the rows count", async ({page}) => {
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');

    await page.waitForTimeout(3000);

    const dropdown: Locator = page.locator("#dt-length-0");
    dropdown.selectOption({label: "25"});

    await page.waitForTimeout(3000);

    const rows = await page.locator("#example tbody tr").all();
    expect(rows.length).toBe(25);
    console.log('Number of rows displayed after selecting 25:', rows.length);

    const rows2 = await page.locator("#example tbody tr");
    expect(rows2).toHaveCount(25);
    console.log('Number of rows displayed after selecting 25 with toHaveCount:', await rows2.count());
});

test.only("Search for specific data in the table", async ({page}) => {
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');

    await page.waitForTimeout(3000);

    const searchBox: Locator = page.locator("#dt-search-0");
    await searchBox.fill("Paul Byrd");

    await page.waitForTimeout(3000);

    const rows = await page.locator("#example tbody tr").all();
    
    if (rows.length >= 1) {
        let matchFound = false;
        for (let row of rows) {
            const text: string = await row.innerText();
            if (text.includes("Paul Byrd")) {
                console.log('Row found with the search term "Paul Byrd":', text);
                expect(text).toContain("Paul Byrd");
                matchFound = true;
                break; // stop after finding the first match
            } else {
                console.log('Row does NOT contain the search term "Paul Byrd":', text);
            }
        }

        expect(matchFound).toBeTruthy();
        if (!matchFound) {
            console.log('No rows found with the search term "Paul Byrd".');
        }
    } else {
        console.log('No rows found with the search term "Paul Byrd".');
    }
});
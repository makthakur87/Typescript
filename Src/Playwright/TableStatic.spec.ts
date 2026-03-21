import {test, expect, Locator} from '@playwright/test';

test('StaticTable should render correctly', async ({page}) => {
  await page.goto('https://testautomationpractice.blogspot.com/');

  const table: Locator = page.locator("table[name='BookTable'] tbody");

  // table is visisble or not
    await expect(table).toBeVisible();

    // Verify the number of rows in the table
    const rows: Locator = table.locator("tr");
    await expect(rows).toHaveCount(7);

    console.log('Number of rows in the table:', await rows.count());

    // verify the number of columns in the table
    const columns: Locator = rows.first().locator('th');
    console.log('Number of columns in the table (using th):', await columns.count());
    await expect(columns).toHaveCount(4);

    console.log('Number of columns in the table:', await columns.count());

    // get the data from row except the header row
    for (let i = 1; i < await rows.count(); i++) {
        const cells: Locator = rows.nth(i).locator('td');
        const cellTexts = await cells.allInnerTexts();
        console.log(`Row ${i} data:`, cellTexts.map(text => text.trim()).join('\t'));
    }

    // use map function to get the data from row except the header row
    const rowData = await Promise.all(Array.from({ length: await rows.count() - 1 }, async (_, i) => {
        const cells: Locator = rows.nth(i + 1).locator('td');
        return await cells.allInnerTexts();
    }));
    console.log('Row data (using map function):', rowData.map(row => row.map(text => text.trim())));

    // for each loop to print the data from row except the header row
    rowData.forEach((row, index) => {
        console.log(`Row ${index + 1} data (for each loop):`, row.map(text => text.trim()));
    });

    // for of loop to print the data from row except the header row
    for (const [index, row] of rowData.entries()) {
        console.log(`Row ${index + 1} data (for of loop):`, row.map(text => text.trim()));
    }

    // for in loop to print the data from row except the header row
    for (const index in rowData) {
        console.log(`Row ${parseInt(index) + 1} data (for in loop):`, rowData[index].map(text => text.trim()));
    }

    // read data from specific row
    const rowData3: Locator = rows.nth(3).locator('td');
    const dataRow3: string[] = await rowData3.allInnerTexts();
    console.log('Data from row 3:', dataRow3.map(text => text.trim()));

    await expect(rowData3).toHaveText(['Learn JS', 'Animesh', 'Javascript', '300']);

    // print book names where autohor name is Mukesh
    console.log('Books where author name is Mukesh:');
    for (let row of rowData.slice(1)) {
        const authorName = row[1].trim();
        if (authorName === 'Mukesh') {
            console.log(`- ${row[0].trim()}`);
        }
    }

    for (let i = 1; i < await rows.count(); i++) {
        const authorCell: Locator = rows.nth(i).locator('td').nth(1);
        const authorName: string = (await authorCell.innerText()).trim();
        if (authorName === 'Mukesh') {
            const bookNameCell: Locator = rows.nth(i).locator('td').first();
            const bookName: string = (await bookNameCell.innerText()).trim();
            console.log(`- ${bookName}`);
        }
    }
});
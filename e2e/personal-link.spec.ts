import {expect, test} from "./fixtures";

const TOKEN = "x".repeat(43);

test("a personal link opens the payment request without logging in", async ({browser, mock}) => {
    const context = await browser.newContext({storageState: {cookies: [], origins: []}});
    const page = await context.newPage();

    await page.goto(`/pay/${TOKEN}`);

    await expect(page.getByText("FGV26ABCD")).toBeVisible();
    await expect(page.getByText(/200\s*kr/)).toBeVisible();
    await expect(page.getByText("123-4567")).toBeVisible();

    await page.getByRole("button", {name: "Jag har betalat"}).click();
    await expect(page.getByText(/Tack! Vi bekräftar/)).toBeVisible();
    await page.getByRole("button", {name: "Påminn mig inte igen"}).click();
    await expect(page.getByText("Du kommer inte att påminnas igen.")).toBeVisible();

    const calls = await mock.calls();

    expect(calls.map((call) => call.personal)).toEqual([`/api/personal/${TOKEN}/report`, `/api/personal/${TOKEN}/opt-out`]);
    await context.close();
});

test("a link that is not right says so", async ({browser}) => {
    const context = await browser.newContext({storageState: {cookies: [], origins: []}});
    const page = await context.newPage();

    await page.goto("/pay/short");

    await expect(page.getByRole("heading", {name: "Sidan finns inte"})).toBeVisible();
    await context.close();
});

import {expect, test} from "./fixtures";
import type {Page} from "@playwright/test";

/** Every page a person with all roles can open, and the ones anyone can: none may be wider than a phone's screen. */
const PAGES = [
    "/", "/membership", "/membership/apply", "/membership/pay",
    "/board/members?year=2026", "/board/members/sp-1", "/board/applications", "/board/renewals",
    "/treasurer/payments", "/treasurer/transactions", "/treasurer/import",
    "/admin/fees", "/admin/defaults", "/admin/bank-formats", "/admin/settings", "/admin/maintenance", "/admin/audit", "/admin/users", "/admin/users/u1",
    "/support", "/about",
];
const PUBLIC_PAGES = ["/register", "/register/verify?token=x", `/pay/${"x".repeat(43)}`];

async function overflow(page: Page) {
    return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

for (const path of PAGES) {
    test(`${path} fits the screen`, async ({page}) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        expect(await overflow(page)).toBeLessThanOrEqual(0);
    });
}

for (const path of PUBLIC_PAGES) {
    test(`${path} fits the screen when not logged in`, async ({browser}) => {
        const context = await browser.newContext({...test.info().project.use, storageState: {cookies: [], origins: []}});
        const page = await context.newPage();

        // Cloudflare's Turnstile script cannot be fetched here
        await page.route("https://challenges.cloudflare.com/**", route => route.abort());
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        expect(await overflow(page)).toBeLessThanOrEqual(0);
        await context.close();
    });
}

test("the menu is behind a button that opens it, and closes when a page is chosen", async ({page}) => {
    await page.goto("/");

    const fees = page.getByRole("link", {name: "Avgifter", exact: true});

    await expect(fees).toBeHidden();
    await page.getByRole("button", {name: "Visa menyn"}).click();
    await page.getByRole("button", {name: "Administration", exact: true}).click();
    await fees.click();

    await expect(page.getByRole("heading", {name: "Avgifter", exact: true})).toBeVisible();
    await expect(fees).toBeHidden();
});

test("the controls can be pressed with a thumb", async ({page}) => {
    await page.goto("/admin/settings");

    for (const control of [page.getByRole("button", {name: "Spara"}), page.getByLabel(/^Bankgiro/)]) {
        expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(36);
    }
});

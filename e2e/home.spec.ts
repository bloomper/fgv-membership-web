import {expect, test} from "./fixtures";

test("a visitor who is not logged in is offered to log in or to create an account", async ({browser}) => {
    const context = await browser.newContext({storageState: {cookies: [], origins: []}});
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.getByRole("link", {name: /Logga in|Log in/}).first()).toBeVisible();
    await expect(page.getByRole("link", {name: /Skapa konto|Create account/}).first()).toBeVisible();
    await expect(page.getByRole("link", {name: /Medlemmar|Members/})).toHaveCount(0);
    await context.close();
});

test("a logged-in user with every role sees the links for each of them", async ({page}) => {
    await page.goto("/");

    for (const name of ["Mitt medlemskap", "Medlemmar", "Betalningar", "Avgifter", "Inställningar"]) {
        await expect(page.getByRole("link", {name, exact: true}).first()).toBeVisible();
    }
});

test("the language can be switched", async ({page}) => {
    await page.goto("/");
    await page.getByRole("button", {name: "English"}).click();

    await expect(page.getByRole("link", {name: "My membership"}).first()).toBeVisible();
});

import {expect, test} from "./fixtures";

test("an administrator lists the fees, adds one, and changes the settings", async ({page}) => {
    await page.goto("/admin/fees");

    await expect(page.getByRole("heading", {name: "Avgifter"})).toBeVisible();
    await expect(page.locator('input[name="nameSv"]').first()).toHaveValue("Ordinarie");

    const add = page.locator("section").filter({hasText: "Lägg till avgift"});

    await add.locator('select[name="kind"]').selectOption("SUPPORT");
    await add.locator('input[name="year"]').fill("2027");
    await add.locator('input[name="nameSv"]').fill("Stödmedlem");
    await add.locator('input[name="nameEn"]').fill("Supporter");
    await add.locator('input[name="amount"]').fill("120");
    await add.getByRole("button", {name: "Spara"}).click();
    await page.reload();
    await expect(page.locator('input[name="nameSv"][value="Stödmedlem"]')).toHaveCount(1);

    await page.goto("/admin/settings");
    await page.getByLabel(/^Bankgiro/).fill("555-5555");
    await page.getByLabel(/Påminn betalare/).fill("7");
    await page.getByRole("button", {name: "Spara"}).click();
    await expect(page.getByRole("status")).toHaveText("Sparat.");
});

test("a board member without the administrator role may not administer", async ({page, mock}) => {
    // The access token is made at login: log in again with the other roles
    await mock.roles(["USER", "BOARD"]);
    await page.context().clearCookies();
    await page.goto("/api/auth/login");
    await page.goto("/admin/fees");

    await expect(page.getByText("Du har inte behörighet till den här sidan.")).toBeVisible();
    await expect(page.getByRole("link", {name: "Avgifter", exact: true})).toHaveCount(0);
    await expect(page.getByRole("link", {name: "Medlemmar", exact: true}).first()).toBeVisible();
});

test("the board's list of members shows the counts", async ({page}) => {
    await page.goto("/board/members?year=2026");

    await expect(page.getByRole("heading", {name: "Medlemmar", exact: true})).toBeVisible();
    await expect(page.getByText("2026: 3 medlemmar, 12 på livstid, 1 nya")).toBeVisible();
    await expect(page.getByRole("link", {name: "Greta Test"}).first()).toBeVisible();
});

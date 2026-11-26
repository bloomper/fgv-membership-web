import {expect, test} from "./fixtures";

test("an administrator lists the fees, adds one, and changes the settings", async ({page, mock}) => {
    await page.goto("/admin/fees");

    await expect(page.getByRole("heading", {name: "Avgifter", exact: true})).toBeVisible();
    await expect(page.getByLabel("Namn (svenska)").first()).toHaveValue("Ordinarie");

    const add = page.locator("section").filter({hasText: "Lägg till avgift"});

    await add.getByLabel("Sort").selectOption("SUPPORT");
    await add.getByLabel("År").fill("2027");
    await add.getByLabel("Namn (svenska)").fill("Stödmedlem");
    await add.getByLabel("Namn (engelska)").fill("Supporter");
    await add.getByLabel("Belopp (kr)").fill("120");
    await add.getByRole("button", {name: "Spara"}).click();
    await expect(page.getByText("Avgiften har sparats.")).toBeVisible();

    const saved = (await mock.calls()).find(call => String(call.query).includes("feeLevelSave("));

    expect(saved?.variables).toMatchObject({input: {kind: "SUPPORT", year: 2027, nameSv: "Stödmedlem", nameEn: "Supporter", amount: 120}});

    await page.goto("/admin/settings");
    await page.getByLabel(/^Bankgiro/).fill("555-5555");
    await page.getByLabel(/Påminn betalare/).fill("7");
    await page.getByRole("button", {name: "Spara"}).click();
    await expect(page.getByText("Sparat.")).toBeVisible();
});

test("a fee that is not valid is stopped before it is sent", async ({page, mock}) => {
    await page.goto("/admin/fees");

    const add = page.locator("section").filter({hasText: "Lägg till avgift"});

    await add.getByRole("button", {name: "Spara"}).click();

    await expect(add.getByText("Fyll i det här fältet.").first()).toBeVisible();
    expect((await mock.calls()).some(call => String(call.query).includes("feeLevelSave("))).toBe(false);
});

test("a board member without the administrator role may not administer", async ({page, loginWithRoles}) => {
    await loginWithRoles(["USER", "BOARD"]);
    await page.goto("/admin/fees");

    await expect(page.getByRole("heading", {name: "Du har inte behörighet"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Administration", exact: true})).toHaveCount(0);
    await expect(page.getByRole("button", {name: "Styrelsen", exact: true})).toBeVisible();
});

test("the board's list of members shows the counts", async ({page}) => {
    await page.goto("/board/members?year=2026");

    await expect(page.getByRole("heading", {name: "Medlemmar", exact: true})).toBeVisible();
    await expect(page.getByText("2026: 3 medlemmar, 12 på livstid, 1 nya")).toBeVisible();
    await expect(page.getByRole("link", {name: "Greta Test"}).first()).toBeVisible();
});

test("an administrator finds a user and sees their access", async ({page}) => {
    await page.goto("/admin/users");
    await page.getByRole("link", {name: "Greta Test"}).click();

    await expect(page.getByRole("heading", {name: "Greta Test"})).toBeVisible();
    await expect(page.getByText("Tillgång till applikationer")).toBeVisible();
    await expect(page.getByRole("combobox", {name: "Roll"})).toHaveValue("ADMIN");
});

test("the other administration pages open", async ({page}) => {
    for (const [path, heading] of [["/admin/defaults", "Standardbehörighet"], ["/admin/bank-formats", "Bankformat"], ["/admin/maintenance", "Underhåll"], ["/admin/audit", "Granskningslogg"]]) {
        await page.goto(path);
        await expect(page.getByRole("heading", {name: heading, exact: true})).toBeVisible();
    }
});

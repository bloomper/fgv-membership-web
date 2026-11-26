import {expect, test} from "./fixtures";

test("the treasurer sees the requests that wait and records a payment", async ({page, request, mock}) => {
    // A member has asked to pay and says they have paid
    await page.goto("/membership/pay");
    await page.getByLabel(/Ordinarie 2026/).check();
    await page.getByRole("button", {name: "Gå vidare till betalning"}).click();
    await page.getByRole("button", {name: "Jag har betalat"}).click();
    await expect(page.getByRole("status")).toContainText("Väntar på bekräftelse");

    await page.goto("/treasurer/payments");
    await expect(page.getByRole("heading", {name: "Betalningar"})).toBeVisible();
    await expect(page.getByText("FGV26ABCD")).toBeVisible();
    await expect(page.getByText("Betalaren säger sig ha betalat")).toBeVisible();

    await page.getByRole("button", {name: "Registrera betalning"}).click();
    await expect(page.getByText("Inget väntar på betalning.")).toBeVisible();
    await expect(page.getByText("Registrerade i år")).toBeVisible();
    await expect(page.getByRole("button", {name: "Ångra"})).toBeVisible();

    const calls = await mock.calls();

    expect(calls.some((call) => String(call.query).includes("recordPayment(") && (call.variables as Record<string, unknown>).amount === 200)).toBe(true);
    expect(request).toBeDefined();
});

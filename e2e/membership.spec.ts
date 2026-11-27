import { expect, test } from "./fixtures";

test("my membership lists the memberships and offers to pay", async ({ page }) => {
  await page.goto("/membership");

  await expect(page.getByRole("heading", { name: "Mitt medlemskap" })).toBeVisible();
  await expect(page.getByText("2025")).toBeVisible();
  await expect(page.getByText("Betalt", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Betala medlemsavgift" })).toBeVisible();
});

test("an account that is not linked to a spexare is offered to apply", async ({ page, mock }) => {
  await mock.state({ linked: false });
  await page.goto("/membership");

  await expect(page.getByText("Ansök om medlemskap")).toBeVisible();
  await expect(page.getByLabel("Ditt namn")).toBeVisible();
});

test("paying: choose a fee, get the reference and the ways to pay, and say that you have paid", async ({ page }) => {
  await page.goto("/membership/pay");

  // One fee for each year: standard, family and support are alternatives; the life fee is separate
  await page.getByRole("checkbox", { name: /Ordinarie 2026/ }).click();
  await expect(page.getByText(/Summa: 200\s*kr/)).toBeVisible();
  await page.getByRole("checkbox", { name: /Stöd 2026/ }).click();
  await expect(page.getByText(/Summa: 100\s*kr/)).toBeVisible();
  await page.getByRole("button", { name: "Gå vidare till betalning" }).click();

  await expect(page.getByRole("heading", { name: "Betala din medlemsavgift" })).toBeVisible();
  await expect(page.getByText("FGV26ABCD")).toBeVisible();
  await expect(page.getByText("123-4567")).toBeVisible();
  await expect(page.getByText("Behåll referensen oförändrad")).toBeVisible();

  await page.getByLabel(/Vem betalade/).fill("Min sambo");
  await page.getByRole("button", { name: "Jag har betalat" }).click();
  await expect(page.getByText(/Väntar på bekräftelse/)).toBeVisible();
});

test("choosing the family fee asks who is in the family", async ({ page }) => {
  await page.goto("/membership/pay");

  await expect(page.getByLabel(/Vilka ingår i familjen/)).toHaveCount(0);
  await page.getByRole("checkbox", { name: /Familj 2026/ }).click();
  await expect(page.getByLabel(/Vilka ingår i familjen/)).toBeVisible();
});

test("the life fee can be added to the fee for a year", async ({ page }) => {
  await page.goto("/membership/pay");

  await page.getByRole("checkbox", { name: /Ordinarie 2026/ }).click();
  await page.getByRole("checkbox", { name: /Livstid/ }).click();
  await expect(page.getByText(/Summa: 2\s?200\s*kr/)).toBeVisible();
});

test("nothing is asked for before a fee is chosen", async ({ page }) => {
  await page.goto("/membership/pay");
  await page.getByRole("button", { name: "Gå vidare till betalning" }).click();

  await expect(page.getByText("Välj minst en avgift.")).toBeVisible();
});

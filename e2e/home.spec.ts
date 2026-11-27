import { expect, test } from "./fixtures";

test("a visitor who is not logged in is offered to log in or to create an account", async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.getByRole("button", { name: "Logga in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Skapa konto" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Styrelsen" })).toHaveCount(0);
  await context.close();
});

test("a logged-in user with every role sees a menu for each of them", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Mitt medlemskap" }).first()).toBeVisible();
  for (const group of ["Styrelsen", "Kassör", "Administration"]) {
    await expect(page.getByRole("button", { name: group, exact: true })).toBeVisible();
  }

  await page.getByRole("button", { name: "Administration", exact: true }).click();
  for (const name of ["Användare", "Avgifter", "Inställningar"]) {
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  }
});

test("the language can be switched", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Byt språk" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();

  await expect(page.getByRole("link", { name: "My membership" }).first()).toBeVisible();
});

test("someone without a role on Medlemskap is told so", async ({ page, loginWithRoles }) => {
  await loginWithRoles([]);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Du har inte åtkomst" })).toBeVisible();
  await expect(page.getByText("greta@example.org")).toBeVisible();
});

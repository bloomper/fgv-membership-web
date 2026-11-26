import {expect, test} from "./fixtures";

test("registering sends the details to the API and says to check the email", async ({browser, mock}) => {
    const context = await browser.newContext({storageState: {cookies: [], origins: []}});
    const page = await context.newPage();

    // Cloudflare's Turnstile script cannot be fetched here; the mocked API does not ask for a token
    await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
    await page.goto("/register");
    await page.getByLabel("Förnamn").fill("Ny");
    await page.getByLabel("Efternamn").fill("Användare");
    await page.getByLabel("E-postadress").fill("ny@example.org");
    await page.getByLabel(/Meddelande/).fill("Spexade 1998");
    await page.getByRole("button", {name: "Skapa konto"}).click();

    await expect(page.getByRole("status")).toContainText("länk");
    const calls = await mock.calls();

    expect(calls).toContainEqual({registration: expect.objectContaining({firstName: "Ny", lastName: "Användare", email: "ny@example.org", language: "sv"})});
    await context.close();
});

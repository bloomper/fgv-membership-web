import { expect, test as setup } from "@playwright/test";
import { MOCK_PORT, STORAGE_STATE } from "./constants";
import { dismissCookieNotice } from "./fixtures";

/** Logs in once as a user with every role; each spec that needs another set of roles changes them and logs in again. */
setup("authenticate", async ({ page, request }) => {
  await request.post(`http://localhost:${MOCK_PORT}/__roles`, {
    data: { roles: ["USER", "BOARD", "TREASURER", "ADMIN"] },
  });
  await page.goto("/api/auth/login");

  await expect(page.getByRole("heading", { name: "Välkommen, Greta Test!" })).toBeVisible();
  await dismissCookieNotice(page);
  await page.context().storageState({ path: STORAGE_STATE });
});

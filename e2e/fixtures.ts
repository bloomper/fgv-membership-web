import {expect, type Page, test as base} from "@playwright/test";
import {MOCK_PORT} from "./constants";

const MOCK_URL = `http://localhost:${MOCK_PORT}`;

export const test = base.extend<{ resetBackend: void; mock: Mock; loginWithRoles: (roles: string[]) => Promise<void> }>({
    resetBackend: [async ({request}, provide) => {
        await request.post(`${MOCK_URL}/__reset`);
        await provide();
    }, {auto: true}],
    /** The access token is made at login: log in again with other roles. */
    loginWithRoles: async ({page, request}, provide) => {
        await provide(async (roles: string[]) => {
            await request.post(`${MOCK_URL}/__roles`, {data: {roles}});
            await page.context().clearCookies();
            await page.goto("/api/auth/login");
            await page.waitForURL(url => !url.pathname.startsWith("/api/auth"));
            // c15t also remembers the dismissed notice in local storage, so the notice may not come back
            await page.getByRole("button", {name: "Jag förstår"}).click({timeout: 3000}).catch(() => undefined);
        });
    },
    mock: async ({request}, provide) => {
        await provide({
            roles: async (roles: string[]) => {
                await request.post(`${MOCK_URL}/__roles`, {data: {roles}});
            },
            state: async (state: Record<string, unknown>) => {
                await request.post(`${MOCK_URL}/__state`, {data: state});
            },
            calls: async () => (await request.get(`${MOCK_URL}/__calls`)).json(),
        });
    },
});

type Mock = {
    /** The roles of the logged-in user on Medlemskap; the access token is made at login, so log in again after changing them. */
    roles: (roles: string[]) => Promise<void>;
    /** Replaces parts of what the mocked API holds, e.g. {linked: false}. */
    state: (state: Record<string, unknown>) => Promise<void>;
    /** What the mocked API has been asked, in order. */
    calls: () => Promise<Record<string, unknown>[]>;
};

/**
 * c15t stores the dismissed cookie notice in a cookie after the click, so a page opened right away would show the banner
 * again, over the bottom right corner where the buttons of sheets are.
 */
export async function dismissCookieNotice(page: Page) {
    await page.getByRole("button", {name: "Jag förstår"}).click();
    await expect.poll(async () => (await page.context().cookies()).some(cookie => cookie.name === "c15t-notice")).toBe(true);
}

export {expect} from "@playwright/test";

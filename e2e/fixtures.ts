import {test as base} from "@playwright/test";
import {MOCK_PORT} from "./constants";

const MOCK_URL = `http://localhost:${MOCK_PORT}`;

export const test = base.extend<{ resetBackend: void; mock: Mock }>({
    resetBackend: [async ({request}, provide) => {
        await request.post(`${MOCK_URL}/__reset`);
        await provide();
    }, {auto: true}],
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

export {expect} from "@playwright/test";

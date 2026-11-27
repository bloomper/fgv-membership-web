import {defineConfig, devices} from "@playwright/test";
import {APP_PORT, AUTH_SECRET, BASE_URL, MOCK_PORT, STORAGE_STATE} from "./e2e/constants";

const appEnv: Record<string, string> = {
    // Everything the app reads is set here, or a developer's .env.local (which points at the local stack) would win
    AUTH_SECRET,
    KEYCLOAK_CLIENT_ID: "e2e",
    KEYCLOAK_CLIENT_SECRET: "e2e",
    KEYCLOAK_ISSUER: `http://localhost:${MOCK_PORT}/realms/e2e`,
    API_GRAPHQL_ENDPOINT: `http://localhost:${MOCK_PORT}/api/graphql`,
    SUPPORT_EMAIL: "support.membership@example.org",
    FEEDBACK_EMAIL: "feedback.membership@example.org",
    BETTER_AUTH_URL: BASE_URL,
    TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    SPEXREGISTER_WEB_URL: "https://register.e2e.test",
};

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI
        ? [["github"], ["html", {open: "never"}], ["junit", {outputFile: "test-results/e2e-results.xml"}]]
        : [["list"], ["html", {open: "never"}]],
    timeout: 30_000,
    use: {baseURL: BASE_URL, trace: "on-first-retry"},
    projects: [
        {name: "setup", testMatch: /auth\.setup\.ts/},
        {name: "chromium", testIgnore: /mobile\.spec\.ts/, use: {...devices["Desktop Chrome"], storageState: STORAGE_STATE}, dependencies: ["setup"]},
        // A phone: the pages must fit its screen and the navigation sits behind a menu button
        {name: "mobile", testMatch: /mobile\.spec\.ts/, use: {...devices["Pixel 7"], storageState: STORAGE_STATE}, dependencies: ["setup"]},
    ],
    webServer: [
        {command: "node e2e/mock-backend.mjs", port: MOCK_PORT, env: {MOCK_PORT: String(MOCK_PORT)}, reuseExistingServer: !process.env.CI, stdout: "pipe"},
        {command: `next build && next start -p ${APP_PORT}`, port: APP_PORT, env: {...appEnv, PORT: String(APP_PORT)}, timeout: 240_000, reuseExistingServer: !process.env.CI, stdout: "pipe"},
    ],
});

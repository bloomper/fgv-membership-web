import {beforeEach, describe, expect, it, vi} from "vitest";
import {auth} from "@/auth";
import {Policies} from "@/utils/policy.server";
import {tokenWithRoles} from "@/utils/__tests__/token";

vi.mock("next/headers", () => ({headers: vi.fn(async () => new Headers())}));
vi.mock("react", async (importOriginal) => ({
    ...(await importOriginal<typeof import("react")>()),
    cache: <T, >(fn: T) => fn
}));

function loggedIn(roles: string[]) {
    vi.mocked(auth.api.getSession).mockResolvedValue({user: {id: "1"}} as never);
    vi.mocked(auth.api.getAccessToken).mockResolvedValue({accessToken: tokenWithRoles(roles)} as never);
}

describe("Policies", () => {
    beforeEach(() => vi.resetAllMocks());

    it("app.requireAccess needs a role of the application", async () => {
        loggedIn(["SYNC"]);
        expect((await Policies.app.requireAccess()).ok).toBe(false);
        loggedIn(["USER"]);
        expect((await Policies.app.requireAccess()).ok).toBe(true);
    });

    it("each role includes the ones below it", async () => {
        loggedIn(["USER"]);
        expect((await Policies.board.requireBoard()).ok).toBe(false);
        loggedIn(["BOARD"]);
        expect((await Policies.board.requireBoard()).ok).toBe(true);
        expect((await Policies.treasurer.requireTreasurer()).ok).toBe(false);
        loggedIn(["TREASURER"]);
        expect((await Policies.board.requireBoard()).ok).toBe(true);
        expect((await Policies.treasurer.requireTreasurer()).ok).toBe(true);
        expect((await Policies.admin.requireAdmin()).ok).toBe(false);
        loggedIn(["ADMIN"]);
        expect((await Policies.admin.requireAdmin()).ok).toBe(true);
    });

    it("refuses anyone who is not logged in with 401", async () => {
        vi.mocked(auth.api.getSession).mockResolvedValue(null);
        expect(await Policies.board.requireBoard()).toMatchObject({ok: false, status: 401});
    });
});

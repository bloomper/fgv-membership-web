import "server-only";

import {requireAnyRole} from "@/utils/auth.server";
import {AuthzResult} from "@/types/auth";

/**
 * Page and action guards by role. They only decide which pages to show; the server enforces every rule. Each role
 * includes the ones below it, so a treasurer passes the board's guard too.
 */
export const Policies = {
    app: {
        async requireAccess(): Promise<AuthzResult> {
            return requireAnyRole(["USER"]);
        },
    },
    board: {
        async requireBoard(): Promise<AuthzResult> {
            return requireAnyRole(["BOARD"]);
        },
    },
    treasurer: {
        async requireTreasurer(): Promise<AuthzResult> {
            return requireAnyRole(["TREASURER"]);
        },
    },
    admin: {
        async requireAdmin(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
    },
} as const;

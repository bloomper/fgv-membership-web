import { beforeEach, describe, expect, it, vi } from "vitest";

const members = vi.hoisted(() => ({
  grantWaiver: vi.fn(),
  recordPaymentWithoutRequest: vi.fn(),
  sendPaymentLink: vi.fn(),
  sendRenewals: vi.fn(),
  addFamilyMembers: vi.fn(),
}));
const users = vi.hoisted(() => ({
  rejectUser: vi.fn(),
  resendVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendSetPasswordEmail: vi.fn(),
  setApplicationAccess: vi.fn(),
  setUserEnabled: vi.fn(),
}));
const redirect = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`redirect ${path}`);
  })
);
const revalidatePath = vi.hoisted(() => vi.fn());
const allowed = vi.hoisted(() => ({ value: true }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/members/members.server", () => members);
vi.mock("@/lib/users/users.server", () => users);
// The policy is tested on its own; here it lets the call through or sends the user to log in
vi.mock("@/utils/route.server", () => ({
  withPolicyAction: async (_policy: unknown, handler: () => Promise<unknown>) => {
    if (!allowed.value) {
      redirect("/api/auth/login");
    }
    return handler();
  },
}));
vi.mock("@/utils/policy.server", () => ({
  Policies: {
    app: { requireAccess: vi.fn() },
    board: { requireBoard: vi.fn() },
    treasurer: { requireTreasurer: vi.fn() },
    admin: { requireAdmin: vi.fn() },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  allowed.value = true;
});

describe("the board's actions", () => {
  it("grant a waiver and refresh the member's page", async () => {
    const { grantWaiverAction } = await import("@/app/(app)/board/actions.server");

    expect(await grantWaiverAction("sp-1", { year: 2026, lifetime: true, note: "Hedersmedlem" })).toEqual({
      ok: true,
      data: null,
    });
    expect(members.grantWaiver).toHaveBeenCalledWith("sp-1", 2026, true, "Hedersmedlem");
    expect(revalidatePath).toHaveBeenCalledWith("/board/members/sp-1");
  });

  it("do not call the API with input the schema refuses", async () => {
    const { grantWaiverAction, addFamilyMembersAction } = await import("@/app/(app)/board/actions.server");

    await expect(grantWaiverAction("sp-1", { year: 2026, lifetime: false, note: "" })).rejects.toThrow();
    await expect(addFamilyMembersAction("r1", { spexareIds: [] })).rejects.toThrow();
    expect(members.grantWaiver).not.toHaveBeenCalled();
    expect(members.addFamilyMembers).not.toHaveBeenCalled();
  });

  it("tell whether the payment link could be sent, and report what a refusal says", async () => {
    const { sendLinkAction, recordWithoutRequestAction } = await import("@/app/(app)/board/actions.server");

    members.sendPaymentLink.mockResolvedValue(false);
    expect(await sendLinkAction("sp-1", { fees: ["f1"] })).toEqual({ ok: true, data: false });

    const { GraphQLRequestError } = await import("@/lib/graphql.server");

    members.recordPaymentWithoutRequest.mockRejectedValue(
      new GraphQLRequestError("BAD_REQUEST", "The request is cancelled")
    );
    expect(
      await recordWithoutRequestAction("sp-1", {
        fees: ["f1"],
        paidOn: "2026-03-01",
        amount: 200,
        how: "CASH",
        note: "",
      })
    ).toEqual({ ok: false, code: "BAD_REQUEST", message: "The request is cancelled" });
  });

  it("send the user to log in when the policy says so", async () => {
    const { sendRenewalsAction } = await import("@/app/(app)/board/actions.server");

    allowed.value = false;
    await expect(sendRenewalsAction({ year: 2027, feeLevelId: "f1" })).rejects.toThrow("redirect /api/auth/login");
    expect(members.sendRenewals).not.toHaveBeenCalled();
  });
});

describe("the administrator's actions on a user", () => {
  it("run the one that was asked for and refresh the lists", async () => {
    const { userAction } = await import("@/app/(app)/admin/users/actions.server");

    await userAction("u1", "deactivate");
    await userAction("u1", "activate");
    await userAction("u1", "resendVerification");
    await userAction("u1", "setPassword");
    await userAction("u1", "resetPassword");

    expect(users.setUserEnabled.mock.calls).toEqual([
      ["u1", false],
      ["u1", true],
    ]);
    expect(users.resendVerification).toHaveBeenCalledWith("u1");
    expect(users.sendSetPasswordEmail).toHaveBeenCalledWith("u1");
    expect(users.sendPasswordResetEmail).toHaveBeenCalledWith("u1");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
  });

  it("send an empty role as no access", async () => {
    const { setAccessAction } = await import("@/app/(app)/admin/users/actions.server");

    await setAccessAction("u1", { clientId: "fgv-membership", role: "", notify: false });

    expect(users.setApplicationAccess).toHaveBeenCalledWith("u1", "fgv-membership", null, false);
  });

  it("go back to the waiting list once a user is rejected", async () => {
    const { rejectUserAction } = await import("@/app/(app)/admin/users/actions.server");

    await expect(rejectUserAction("u1", { message: "", notify: true })).rejects.toThrow(
      "redirect /admin/users?status=PENDING"
    );
    expect(users.rejectUser).toHaveBeenCalledWith("u1", null, true);
  });
});

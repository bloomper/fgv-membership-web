import { beforeEach, describe, expect, it, vi } from "vitest";

const runQuery = vi.hoisted(() => vi.fn());
const runMutation = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/lib/graphql.server", () => ({ runQuery, runMutation }));

beforeEach(() => {
  runQuery.mockReset();
  runMutation.mockReset();
});

/** The variables a call sent, from whichever of the two runners it used. */
const sent = () => (runQuery.mock.calls[0] ?? runMutation.mock.calls[0])[1];

describe("members", () => {
  it("asks for a year's members with the filters it has, and for nobody when there is no answer", async () => {
    const { listMembers, getMemberDetail, searchSpexare } = await import("@/lib/members/members.server");

    runQuery.mockResolvedValue(undefined);
    expect(await listMembers(2026, "PENDING", null, true)).toEqual([]);
    expect(sent()).toEqual({ year: 2026, status: "PENDING", how: null, was: true });
    expect(await getMemberDetail("sp-1")).toBeUndefined();
    expect(await searchSpexare("greta")).toEqual([]);
  });

  it("sends the fees, the date and the way a payment without a request was made", async () => {
    const { recordPaymentWithoutRequest, sendPaymentLink, sendRenewals } = await import("@/lib/members/members.server");

    runMutation.mockResolvedValue({ sendPaymentLink: true, sendRenewals: { sent: 2, skipped: 1 } });
    await recordPaymentWithoutRequest("sp-1", ["f1"], "2026-03-01", 200, "CASH", null);
    expect(sent()).toEqual({
      spexareId: "sp-1",
      fees: ["f1"],
      paidOn: "2026-03-01",
      amount: 200,
      how: "CASH",
      note: null,
    });
    expect(await sendPaymentLink("sp-1", ["f1"])).toBe(true);
    expect(await sendRenewals(2027, "f2")).toEqual({ sent: 2, skipped: 1 });
  });
});

describe("membership", () => {
  it("gives the id of the request that was made", async () => {
    const { requestPayment, getFeeLevels } = await import("@/lib/membership/membership.server");

    runMutation.mockResolvedValue({ requestPayment: { id: "req-1" } });
    expect(await requestPayment(["f1", "f2"], "min sambo")).toBe("req-1");
    expect(sent()).toEqual({ feeLevelIds: ["f1", "f2"], familyNote: "min sambo" });
    runQuery.mockResolvedValue(undefined);
    expect(await getFeeLevels()).toEqual([]);
  });
});

describe("users", () => {
  it("sends a search as nothing when it is empty", async () => {
    const { listUsers, setApplicationAccess } = await import("@/lib/users/users.server");

    runQuery.mockResolvedValue({ users: { total: 0, items: [] } });
    await listUsers("", undefined, 0, 25);
    expect(sent()).toEqual({ search: null, status: null, first: 0, max: 25 });
    await setApplicationAccess("u1", "fgv-membership", null, false);
    expect(runMutation.mock.calls[0][1]).toEqual({
      userId: "u1",
      clientId: "fgv-membership",
      role: null,
      notify: false,
    });
  });
});

describe("the rest", () => {
  it("reads and saves bank formats, fees, settings, default access, jobs and the audit log", async () => {
    const bank = await import("@/lib/bank/bank.server");
    const fees = await import("@/lib/fees/fees.server");
    const settings = await import("@/lib/settings/settings.server");
    const defaults = await import("@/lib/defaults/defaults.server");
    const maintenance = await import("@/lib/maintenance/maintenance.server");
    const audit = await import("@/lib/audit/audit.server");
    const payments = await import("@/lib/payments/payments.server");
    const applications = await import("@/lib/applications/applications.server");

    runQuery.mockResolvedValue(undefined);
    runMutation.mockResolvedValue(undefined);
    expect(await bank.getBankFormats()).toEqual([]);
    expect(await bank.getUnmatchedTransactions()).toEqual([]);
    expect(await bank.getTransactionSuggestions("tx")).toEqual([]);
    expect(await fees.getAllFeeLevels()).toEqual([]);
    expect(await settings.getSettings()).toBeUndefined();
    expect(await defaults.getDefaultAccess("SUPPORT")).toEqual([]);
    expect(await maintenance.getMaintenanceJobs()).toEqual([]);
    expect(await audit.getAuditLog(0, audit.AUDIT_PAGE_SIZE)).toEqual([]);
    expect(await payments.getWaitingRequests()).toEqual([]);
    expect(await payments.getPaymentsThisYear()).toEqual([]);
    expect(await applications.getPendingApplications()).toEqual([]);

    await bank.importStatement("bf", "utdrag.csv", "a;b");
    await bank.matchTransaction("tx", ["r1", "r2"]);
    await bank.dismissTransaction("tx");
    await bank.deleteBankFormat("bf");
    await fees.retireFeeLevel("f1", true);
    await defaults.setDefaultAccess("MEMBER", "fgv-membership", "USER");
    await maintenance.runMaintenanceJob("PAYMENT_REMINDERS");
    await payments.recordPayment("r1", "2026-03-01", 200, "SWISH", null);
    await payments.cancelPaymentRequest("r1");
    await payments.undoPayment("p1");
    await applications.acceptApplication("a1", null);
    await applications.rejectApplication("a1", "Tyvärr");

    expect(runMutation).toHaveBeenCalledTimes(12);
    expect(runMutation.mock.calls[1][1]).toEqual({ id: "tx", requestIds: ["r1", "r2"] });
  });
});

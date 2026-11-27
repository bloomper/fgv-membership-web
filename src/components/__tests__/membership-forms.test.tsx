import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PayForm } from "@/components/membership/pay-form.client";
import { ApplyForm } from "@/components/membership/apply-form.client";
import { ReportPaidForm } from "@/components/payment/report-paid-form.client";

const requestPaymentAction = vi.hoisted(() => vi.fn());
const applyAction = vi.hoisted(() => vi.fn());
const push = vi.hoisted(() => vi.fn());
const refresh = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/membership/actions.server", () => ({ requestPaymentAction, applyAction }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const options = [
  { id: "std", group: "2026", label: "Ordinarie 2026", amount: 200, family: false },
  { id: "fam", group: "2026", label: "Familj 2026", amount: 350, family: true },
  { id: "life", group: "life", label: "Livstid", amount: 2000, family: false },
];

describe("PayForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("adds up one fee for each year and the life fee", async () => {
    render(<PayForm options={options} />);

    await userEvent.click(screen.getByRole("checkbox", { name: /Ordinarie/ }));
    await userEvent.click(screen.getByRole("checkbox", { name: /Familj/ }));
    expect(screen.getByText(/total: 350/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox", { name: /Livstid/ }));
    expect(screen.getByText(/total: 2\s?350/)).toBeInTheDocument();
  });

  it("asks who is in the family only for the family fee", async () => {
    render(<PayForm options={options} />);

    expect(screen.queryByLabelText("familyNote")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /Familj/ }));
    expect(screen.getByLabelText("familyNote")).toBeInTheDocument();
  });

  it("asks for nothing before a fee is chosen", async () => {
    render(<PayForm options={options} />);

    await userEvent.click(screen.getByRole("button", { name: "submit" }));

    expect(screen.getByRole("alert")).toHaveTextContent("feeRequired");
    expect(requestPaymentAction).not.toHaveBeenCalled();
  });

  it("goes on to the payment when the request is made", async () => {
    requestPaymentAction.mockResolvedValue({ ok: true, data: "req-1" });
    render(<PayForm options={options} />);

    await userEvent.click(screen.getByRole("checkbox", { name: /Ordinarie/ }));
    await userEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/membership/pay/req-1"));
    expect(requestPaymentAction).toHaveBeenCalledWith({ feeLevelIds: ["std"], familyNote: "" });
  });
});

describe("ApplyForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("needs what the applicant has been part of", async () => {
    render(<ApplyForm defaultName="Greta Test" />);

    await userEvent.click(screen.getByRole("button", { name: "applySubmit" }));

    expect(await screen.findByText("required")).toBeInTheDocument();
    expect(applyAction).not.toHaveBeenCalled();
  });

  it("sends the name and the text", async () => {
    applyAction.mockResolvedValue({ ok: true, data: null });
    render(<ApplyForm defaultName="Greta Test" />);

    await userEvent.type(screen.getByLabelText("applyText"), "Spexade 1998");
    await userEvent.click(screen.getByRole("button", { name: "applySubmit" }));

    await waitFor(() => expect(applyAction).toHaveBeenCalledWith({ name: "Greta Test", text: "Spexade 1998" }));
  });
});

describe("ReportPaidForm", () => {
  it("says who paid when it was someone else", async () => {
    const report = vi.fn().mockResolvedValue({ ok: true, data: null });

    render(<ReportPaidForm report={report} />);
    await userEvent.type(screen.getByLabelText("paidBy"), "Min sambo");
    await userEvent.click(screen.getByRole("button", { name: "iHavePaid" }));

    await waitFor(() => expect(report).toHaveBeenCalledWith({ paidBy: "Min sambo" }));
  });
});

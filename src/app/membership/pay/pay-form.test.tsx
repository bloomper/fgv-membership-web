// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PayForm } from "./pay-form";

vi.mock("../actions", () => ({ startPayment: vi.fn() }));

const options = [
  { id: "std", group: "2026", label: "Ordinarie 2026", amount: 200, family: false },
  { id: "fam", group: "2026", label: "Familj 2026 (familj)", amount: 350, family: true },
  { id: "sup", group: "2026", label: "Stöd 2026", amount: 100, family: false },
  { id: "std27", group: "2027", label: "Ordinarie 2027", amount: 220, family: false },
  { id: "life", group: "life", label: "Livstid (livstid)", amount: 2000, family: false },
];
const labels = { submit: "Gå vidare", total: "Summa", life: "Livstid", familyNote: "Vilka ingår?", familyHint: "T.ex. maken" };

afterEach(cleanup);

describe("PayForm", () => {
  it("adds one fee for each year and the life fee, and nothing is paid for without a choice", async () => {
    render(<PayForm options={options} labels={labels} />);

    expect(screen.getByText("Summa: 0 kr")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Gå vidare" }) as HTMLButtonElement).disabled).toBe(true);

    await userEvent.click(screen.getByLabelText(/Ordinarie 2026/));
    await userEvent.click(screen.getByLabelText(/Ordinarie 2027/));
    expect(screen.getByText("Summa: 420 kr")).toBeTruthy();

    await userEvent.click(screen.getByLabelText(/Livstid \(livstid\)/));
    expect(screen.getByText("Summa: 2420 kr")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Gå vidare" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("lets only one fee count for a year: choosing another replaces the first", async () => {
    render(<PayForm options={options} labels={labels} />);

    await userEvent.click(screen.getByLabelText(/Ordinarie 2026/));
    await userEvent.click(screen.getByLabelText(/Stöd 2026/));

    expect(screen.getByText("Summa: 100 kr")).toBeTruthy();
  });

  it("asks who is in the family only when a family fee is chosen", async () => {
    render(<PayForm options={options} labels={labels} />);

    expect(screen.queryByLabelText(/Vilka ingår/)).toBeNull();
    await userEvent.click(screen.getByLabelText(/Familj 2026/));
    expect(screen.getByLabelText(/Vilka ingår/)).toBeTruthy();

    await userEvent.click(screen.getByLabelText(/Ordinarie 2026/));
    expect(screen.queryByLabelText(/Vilka ingår/)).toBeNull();
  });

  it("lets a chosen fee be taken back by choosing it again", async () => {
    render(<PayForm options={options} labels={labels} />);

    await userEvent.click(screen.getByLabelText(/Ordinarie 2026/));
    await userEvent.click(screen.getByLabelText(/Ordinarie 2026/));

    expect(screen.getByText("Summa: 0 kr")).toBeTruthy();
  });
});

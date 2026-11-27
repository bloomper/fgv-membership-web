import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeeForm } from "@/components/admin/fee-form.client";
import { SettingsForm } from "@/components/admin/settings-form.client";
import { DefaultForm } from "@/components/admin/default-form.client";
import { AccessForm } from "@/components/admin/user-controls.client";
import { ConfirmButton } from "@bloomper/fgv-web-ui/shell/confirm-button";
import { Checklist } from "@/components/checklist.client";

const saveFeeAction = vi.hoisted(() => vi.fn());
const retireFeeAction = vi.hoisted(() => vi.fn());
const saveSettingsAction = vi.hoisted(() => vi.fn());
const setDefaultAccessAction = vi.hoisted(() => vi.fn());
const setAccessAction = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/admin/fees/actions.server", () => ({ saveFeeAction, retireFeeAction }));
vi.mock("@/app/(app)/admin/settings/actions.server", () => ({ saveSettingsAction }));
vi.mock("@/app/(app)/admin/defaults/actions.server", () => ({ setDefaultAccessAction }));
vi.mock("@/app/(app)/admin/users/actions.server", () => ({
  setAccessAction,
  rejectUserAction: vi.fn(),
  userAction: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

describe("FeeForm", () => {
  const fee = {
    id: "f1",
    year: 2026,
    kind: "STANDARD" as const,
    nameSv: "Ordinarie",
    nameEn: "Standard",
    amount: 200,
    retired: false,
  };

  it("saves a change to a fee with the id it has", async () => {
    saveFeeAction.mockResolvedValue({ ok: true, data: null });
    render(<FeeForm fee={fee} />);

    await userEvent.clear(screen.getByLabelText("amount"));
    await userEvent.type(screen.getByLabelText("amount"), "250");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    await waitFor(() =>
      expect(saveFeeAction).toHaveBeenCalledWith(
        "f1",
        expect.objectContaining({ amount: 250, year: 2026, kind: "STANDARD" })
      )
    );
  });

  it("keeps a new fee without a name from being sent", async () => {
    render(<FeeForm fee={null} />);

    await userEvent.click(screen.getByRole("button", { name: "save" }));

    expect((await screen.findAllByText("required")).length).toBeGreaterThan(0);
    expect(saveFeeAction).not.toHaveBeenCalled();
  });

  it("retires and offers a fee again", async () => {
    retireFeeAction.mockResolvedValue({ ok: true, data: null });
    const { rerender } = render(<FeeForm fee={fee} />);

    await userEvent.click(screen.getByRole("button", { name: "retire" }));
    await waitFor(() => expect(retireFeeAction).toHaveBeenCalledWith("f1", true));

    rerender(<FeeForm fee={{ ...fee, retired: true }} />);
    expect(screen.getByRole("button", { name: "restore" })).toBeInTheDocument();
  });
});

describe("SettingsForm", () => {
  const settings = {
    swishNumber: "",
    bankgiro: "123-4567",
    bankAccount: "",
    payeeName: "FGV",
    reminderDays: 3,
    recipients: "a@example.org",
  };

  it("keeps the reminder time between 1 and 60 days", async () => {
    render(<SettingsForm settings={settings} />);

    await userEvent.clear(screen.getByLabelText("days"));
    await userEvent.type(screen.getByLabelText("days"), "90");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    // The browser's own range check stops it first (FormValidation words its message), and the schema is the second line
    expect(screen.getByLabelText("days")).toBeInvalid();
    expect(saveSettingsAction).not.toHaveBeenCalled();
  });

  it("saves what was typed", async () => {
    saveSettingsAction.mockResolvedValue({ ok: true, data: null });
    render(<SettingsForm settings={settings} />);

    await userEvent.type(screen.getByLabelText("swish"), "123 456 78 90");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    await waitFor(() =>
      expect(saveSettingsAction).toHaveBeenCalledWith(
        expect.objectContaining({ swishNumber: "123 456 78 90", reminderDays: 3 })
      )
    );
  });
});

describe("access forms", () => {
  it("sets the highest role of a default access, or none", async () => {
    setDefaultAccessAction.mockResolvedValue({ ok: true, data: null });
    render(
      <DefaultForm
        profile="MEMBER"
        clientId="fgv-membership"
        name="Membership"
        ladder={["USER", "BOARD"]}
        role="USER"
      />
    );

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Membership" }), "");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    await waitFor(() =>
      expect(setDefaultAccessAction).toHaveBeenCalledWith({ profile: "MEMBER", clientId: "fgv-membership", role: "" })
    );
  });

  it("sets a user's role and says whether they are emailed", async () => {
    setAccessAction.mockResolvedValue({ ok: true, data: null });
    render(
      <AccessForm
        userId="u1"
        clientId="fgv-membership"
        ladder={["USER", "BOARD", "ADMIN"]}
        highest="USER"
      />
    );

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "role" }), "BOARD");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    await waitFor(() =>
      expect(setAccessAction).toHaveBeenCalledWith("u1", { clientId: "fgv-membership", role: "BOARD", notify: false })
    );
  });
});

describe("ConfirmButton", () => {
  it("does nothing until it is confirmed", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <ConfirmButton
        label="Ta bort"
        title="Ta bort formatet?"
        onConfirm={onConfirm}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Ta bort" }));
    await userEvent.click(await screen.findByRole("button", { name: "cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Ta bort" }));
    const dialog = await screen.findByRole("alertdialog");

    await userEvent.click(within(dialog).getByRole("button", { name: "confirm" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
  });
});

describe("Checklist", () => {
  it("reports the ids that are ticked", async () => {
    const onChange = vi.fn();

    render(
      <Checklist
        legend="Avgifter"
        options={[
          { id: "a", label: "A" },
          { id: "b", label: "B", hint: "tips" },
        ]}
        value={["a"]}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole("checkbox", { name: /B/ }));

    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
    expect(screen.getByText("tips")).toBeInTheDocument();
  });
});

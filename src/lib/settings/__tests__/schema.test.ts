import {describe, expect, it} from "vitest";
import {settingsSchema, toSettingsInput} from "@/lib/settings/schema";

describe("settings", () => {
    const values = {swishNumber: "", bankgiro: "555-5555", bankAccount: "", payeeName: "FGV", reminderDays: 14, recipients: "a@example.org"};

    it("keeps the reminder time between 1 and 60 days", () => {
        expect(settingsSchema.safeParse(values).success).toBe(true);
        expect(settingsSchema.safeParse({...values, reminderDays: 0}).error?.issues[0].message).toBe("daysInvalid");
        expect(settingsSchema.safeParse({...values, reminderDays: 61}).error?.issues[0].message).toBe("daysInvalid");
    });

    it("sends an empty value as nothing, so that the server falls back to its configuration", () => {
        expect(toSettingsInput(values)).toEqual({
            swishNumber: null, bankgiro: "555-5555", bankAccount: null, payeeName: "FGV", reminderDays: 14, recipients: "a@example.org",
        });
    });
});

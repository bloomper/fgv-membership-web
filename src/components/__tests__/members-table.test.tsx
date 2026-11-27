import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import {MembersTable} from "@/components/members/members-table.client";

const row = (id: string, name: string, extra: object = {}) => ({
    id, spexareId: `sp-${id}`, name, year: 2026, lifetime: false, status: "PAID", how: "SWISH", note: null, optedOut: false, family: false, support: false, ...extra,
});

describe("MembersTable", () => {
    it("links each member to their page and marks life, family and support memberships", () => {
        render(<MembersTable rows={[row("1", "Greta Test", {lifetime: true, family: true}), row("2", "Anna Andersson")]}/>);

        expect(screen.getByRole("link", {name: "Greta Test"})).toHaveAttribute("href", "/board/members/sp-1");
        expect(screen.getByText(/lifetimeFrom/)).toBeInTheDocument();
        expect(screen.getByText(/family/)).toBeInTheDocument();
        expect(screen.getByRole("link", {name: "Anna Andersson"})).toBeInTheDocument();
    });

    it("lists the members by name", () => {
        render(<MembersTable rows={[row("1", "Östen"), row("2", "Anna")]}/>);

        const links = screen.getAllByRole("link").map(link => link.textContent);

        expect(links).toEqual(["Anna", "Östen"]);
    });
});

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type DataTableColumnDef, SortableHeader } from "@/components/data-table.client";

export type MemberRow = {
  id: string;
  spexareId: string;
  name: string;
  year: number;
  lifetime: boolean;
  status: string;
  how: string | null;
  note: string | null;
  optedOut: boolean;
  family: boolean;
  support: boolean;
};

/** The members of a year; sorting and paging happen here, the filters were applied by the server. */
export function MembersTable({ rows }: { rows: MemberRow[] }) {
  const t = useTranslations("Members");
  const columns = useMemo(
    (): DataTableColumnDef<MemberRow>[] => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            sorted={column.getIsSorted()}
            title={t("name")}
          />
        ),
        cell: ({ row }) => {
          const member = row.original;
          const marks = [
            member.lifetime && t("lifetimeFrom", { year: member.year }),
            member.family && t("family"),
            member.support && t("support"),
            member.optedOut && t("optedOut"),
          ].filter(Boolean);

          return (
            <div className="min-w-40 whitespace-normal">
              <Link
                className="text-link hover:text-link/80"
                href={`/board/members/${member.spexareId}`}
              >
                {member.name}
              </Link>
              {marks.length > 0 && <span className="text-muted-foreground"> ({marks.join(", ")})</span>}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            sorted={column.getIsSorted()}
            title={t("status")}
          />
        ),
        cell: ({ row }) => t(`statuses.${row.original.status}`),
      },
      {
        accessorKey: "how",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            sorted={column.getIsSorted()}
            title={t("how")}
          />
        ),
        cell: ({ row }) => (row.original.how ? t(`hows.${row.original.how}`) : ""),
      },
      {
        accessorKey: "note",
        header: t("note"),
        cell: ({ row }) => <span className="whitespace-normal">{row.original.note ?? ""}</span>,
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      initialSorting={[{ id: "name", desc: false }]}
    />
  );
}

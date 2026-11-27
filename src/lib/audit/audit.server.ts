import "server-only";

import { graphql } from "@/gql";
import { runQuery } from "@/lib/graphql.server";

// Who changed what (admin.graphqls).

export const AUDIT_PAGE_SIZE = 50;

const AuditLogQuery = graphql(`
    query AuditLog($first: Int, $max: Int) { auditLog(first: $first, max: $max) { at actor actorName action subject detail } }
`);

export async function getAuditLog(first: number, max: number) {
  return (await runQuery(AuditLogQuery, { first, max }))?.auditLog ?? [];
}

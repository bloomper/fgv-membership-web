"use server";

import { revalidatePath } from "next/cache";
import { graphql } from "@/lib/graphql";
import { adminMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export async function runJob(name: string): Promise<void> {
  const viewer = await requireRole("ADMIN", "/admin/maintenance");

  await graphql(viewer.accessToken, adminMutations.runMaintenanceJob, { name });
  revalidatePath("/admin/maintenance");
}

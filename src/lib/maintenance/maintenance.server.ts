import "server-only";

import {graphql} from "@/gql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// The scheduled jobs, which an administrator can also run now (admin.graphqls).

const MaintenanceJobsQuery = graphql(`
    query MaintenanceJobs { maintenanceJobs { name description lastRun lastResult } }
`);

const RunMaintenanceJobMutation = graphql(`
    mutation RunMaintenanceJob($name: String!) { runMaintenanceJob(name: $name) { name lastResult } }
`);

export async function getMaintenanceJobs() {
    return (await runQuery(MaintenanceJobsQuery, {}))?.maintenanceJobs ?? [];
}

export async function runMaintenanceJob(name: string) {
    return (await runMutation(RunMaintenanceJobMutation, {name}))?.runMaintenanceJob;
}

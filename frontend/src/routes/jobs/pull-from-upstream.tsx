// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SyncReleasesTable } from "../../components/sync-release/SyncReleasesTable";

export const Route = createFileRoute("/jobs/pull-from-upstream")({
  staticData: {
    title: "Sync release upstream jobs",
  },
  component: () => SyncReleasesTable({ job: "pull-from-upstream" }),
});

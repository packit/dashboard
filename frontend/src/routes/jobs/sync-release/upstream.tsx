// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SyncReleasesTable } from "../../../components/sync-release/SyncReleasesTable";

export const Route = createFileRoute("/jobs/sync-release/upstream")({
  staticData: {
    title: "Sync release upstream jobs",
  },
  component: () => SyncReleasesTable({ job: "upstream" }),
});

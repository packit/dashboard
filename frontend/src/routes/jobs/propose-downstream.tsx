// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SyncReleasesTable } from "../../components/sync-release/SyncReleasesTable";

export const Route = createFileRoute("/jobs/propose-downstream")({
  staticData: {
    title: "Sync release downstream jobs",
  },
  component: () => SyncReleasesTable({ job: "propose-downstream" }),
});

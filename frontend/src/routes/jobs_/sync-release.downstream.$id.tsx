// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { syncReleaseDownstreamQueryOptions } from "../../queries/sync-release/syncReleaseDownstreamQuery";
import { SyncRelease } from "../../components/sync-release/SyncRelease";

export const Route = createFileRoute("/jobs/sync-release/downstream/$id")({
  staticData: {
    title: "Sync release downstream job",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(syncReleaseDownstreamQueryOptions({ id })),
  component: () => <SyncRelease job="downstream" />,
});

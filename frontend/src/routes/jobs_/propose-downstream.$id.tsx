// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SyncRelease } from "../../components/sync-release/SyncRelease";
import { syncReleaseDownstreamQueryOptions } from "../../queries/sync-release/syncReleaseDownstreamQuery";

export const Route = createFileRoute("/jobs/propose-downstream/$id")({
  staticData: {
    title: "Sync release downstream job",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(syncReleaseDownstreamQueryOptions({ id })),
  component: () => <SyncRelease job="propose-downstream" />,
});

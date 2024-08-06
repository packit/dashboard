// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SyncRelease } from "../../components/sync-release/SyncRelease";
import { syncReleaseUpstreamQueryOptions } from "../../queries/sync-release/syncReleaseUpstreamQuery";

export const Route = createFileRoute("/jobs/sync-release/upstream/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(syncReleaseUpstreamQueryOptions({ id })),
  component: () => <SyncRelease job="upstream" />,
});

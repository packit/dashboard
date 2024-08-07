// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchSyncRelease, fetchSyncReleaseProps } from "./syncRelease";

type QueryParameters = Pick<fetchSyncReleaseProps, "id">;

export const syncReleaseDownstreamQueryOptions = ({ id }: QueryParameters) =>
  queryOptions({
    queryKey: ["sync-release", { id, job: "propose-downstream" }],
    queryFn: async ({ signal }) =>
      await fetchSyncRelease({ signal, id, job: "propose-downstream" }),
  });

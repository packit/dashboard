// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchSyncRelease, fetchSyncReleaseProps } from "./syncRelease";

type QueryParameters = Omit<fetchSyncReleaseProps, "signal">;

export const syncReleaseQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["sync-release", params],
    queryFn: async ({ signal }) =>
      await fetchSyncRelease({ signal, ...params }),
  });

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchSyncReleases, fetchSyncReleasesProps } from "./syncReleases";

type syncReleasesQueryOptionsProps = Pick<fetchSyncReleasesProps, "job"> & {
  pageParam: number;
  perPage: number;
};

export const syncReleasesQueryOptions = ({
  job,
  pageParam,
  perPage = 20,
}: syncReleasesQueryOptionsProps) =>
  queryOptions({
    queryKey: ["sync-release", { job, pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchSyncReleases({ job, pageParam, perPage, signal }),
  });

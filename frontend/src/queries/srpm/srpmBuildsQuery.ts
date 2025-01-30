// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchSRPMBuilds } from "./srpmBuilds";

export const srpmBuildsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["srpm", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchSRPMBuilds({ pageParam, perPage, signal }),
  });

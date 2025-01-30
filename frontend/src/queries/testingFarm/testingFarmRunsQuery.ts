// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchTestingFarmRuns } from "./testingFarmRuns";

export const testingFarmRunsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["testing-farm-runs", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchTestingFarmRuns({ pageParam, perPage, signal }),
  });

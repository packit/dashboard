// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchTestingFarmRuns } from "./testingFarmRuns";

export const testingFarmRunsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ["testing-farm-runs"],
    queryFn: async ({ pageParam, signal }) =>
      await fetchTestingFarmRuns({ pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });

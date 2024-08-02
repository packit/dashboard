// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchSRPMBuilds } from "./srpmBuilds";

export const srpmBuildsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ["srpm"],
    queryFn: async ({ pageParam, signal }) =>
      await fetchSRPMBuilds({ pageParam, signal }),
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

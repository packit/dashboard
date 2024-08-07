// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchProjects } from "./projects";

export const projectsQueryOptions = (forge?: string, namespace?: string) =>
  infiniteQueryOptions({
    queryKey: ["projects", { forge, namespace }],
    queryFn: async ({ pageParam, signal }) =>
      await fetchProjects({ pageParam, signal, forge, namespace }),
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

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchProjects } from "./projects";

export const projectsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
  forge?: string,
  namespace?: string,
) =>
  queryOptions({
    queryKey: ["projects", { pageParam, perPage, forge, namespace }],
    queryFn: async ({ signal }) =>
      await fetchProjects({ pageParam, perPage, signal, forge, namespace }),
  });

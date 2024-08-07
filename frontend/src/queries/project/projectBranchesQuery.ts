// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { fetchProjectProps } from "./project";
import { queryOptions } from "@tanstack/react-query";
import { fetchProjectBranches } from "./projectBranches";

type QueryParameters = Omit<fetchProjectProps, "signal">;

export const projectBranchesQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["project-branches", params],
    queryFn: async ({ signal }) =>
      await fetchProjectBranches({ signal, ...params }),
  });

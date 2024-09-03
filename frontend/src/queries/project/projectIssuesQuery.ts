// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchProjectProps } from "./project";
import { fetchProjectIssues } from "./projectIssues";

type QueryParameters = Omit<fetchProjectProps, "signal">;

export const projectIssuesQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["project-issues", params],
    queryFn: async ({ signal }) =>
      await fetchProjectIssues({ signal, ...params }),
  });

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { fetchProjectProps } from "./project";
import { queryOptions } from "@tanstack/react-query";
import { fetchProjectPRs } from "./projectPRs";

type QueryParameters = Omit<fetchProjectProps, "signal">;

export const projectPRsQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["project-prs", params],
    queryFn: async ({ signal }) => await fetchProjectPRs({ signal, ...params }),
  });

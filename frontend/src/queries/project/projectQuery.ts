// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchProject, fetchProjectProps } from "./project";

type QueryParameters = Omit<fetchProjectProps, "signal">;

export const projectQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["project", params],
    queryFn: async ({ signal }) => await fetchProject({ signal, ...params }),
  });

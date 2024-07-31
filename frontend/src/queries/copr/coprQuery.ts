// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchCoprBuild, fetchCoprBuildProps } from "./copr";

type QueryParameters = Omit<fetchCoprBuildProps, "signal">;

export const coprBuildQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["copr", params],
    queryFn: async ({ signal }) => await fetchCoprBuild({ signal, ...params }),
  });

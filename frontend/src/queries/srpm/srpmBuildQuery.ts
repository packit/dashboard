// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchSRPMBuild, fetchSRPMBuildProps } from "./srpmBuild";

type QueryParameters = Omit<fetchSRPMBuildProps, "signal">;

export const srpmBuildQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["koji", params],
    queryFn: async ({ signal }) => await fetchSRPMBuild({ signal, ...params }),
  });

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchKojiBuild, fetchKojiBuildProps } from "./kojiBuild";

type QueryParameters = Omit<fetchKojiBuildProps, "signal">;

export const kojiBuildQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["koji", params],
    queryFn: async ({ signal }) => await fetchKojiBuild({ signal, ...params }),
  });

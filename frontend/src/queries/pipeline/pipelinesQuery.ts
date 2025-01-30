// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchPipelines } from "./pipelines";

export const pipelinesQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["pipeline", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchPipelines({ pageParam, perPage, signal }),
  });

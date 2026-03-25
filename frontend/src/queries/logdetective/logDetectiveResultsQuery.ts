// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchLogDetectiveResults } from "./logDetectiveResults";

export const logDetectiveResultsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["log-detective-results", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchLogDetectiveResults({ pageParam, perPage, signal }),
  });

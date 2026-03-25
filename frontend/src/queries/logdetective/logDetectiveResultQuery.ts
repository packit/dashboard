// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import {
  fetchLogDetectiveResult,
  fetchLogDetectiveResultProps,
} from "./logDetectiveResult";

type QueryParameters = Omit<fetchLogDetectiveResultProps, "signal">;

export const logDetectiveResultQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["log-detective-results", params],
    queryFn: async ({ signal }) =>
      await fetchLogDetectiveResult({ signal, ...params }),
  });

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import {
  fetchLogDetectiveGroup,
  fetchLogDetectiveGroupProps,
} from "./logDetectiveGroup";

type QueryParameters = Omit<fetchLogDetectiveGroupProps, "signal">;

export const logDetectiveGroupQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["log-detective-group", params],
    queryFn: async ({ signal }) =>
      await fetchLogDetectiveGroup({ signal, ...params }),
  });

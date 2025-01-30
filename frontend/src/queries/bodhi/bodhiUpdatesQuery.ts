// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchBodhiUpdates } from "./bodhiUpdates";

export const bodhiUpdatesQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["bodhi", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchBodhiUpdates({ pageParam, perPage, signal }),
  });

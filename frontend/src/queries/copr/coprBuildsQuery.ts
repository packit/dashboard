// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchCoprBuilds } from "./coprBuilds";

export const coprBuildsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["copr", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchCoprBuilds({ pageParam, perPage, signal }),
  });

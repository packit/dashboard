// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchKojiTagRequests } from "./kojiTagRequests";

export const kojiTagRequestsQueryOptions = (
  pageParam: number,
  perPage: number = 20,
) =>
  queryOptions({
    queryKey: ["koji_tag", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchKojiTagRequests({ pageParam, perPage, signal }),
  });

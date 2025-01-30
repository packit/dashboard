// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchScans } from "./oshScans";

export const oshScansQueryOptions = (pageParam: number, perPage: number = 20) =>
  queryOptions({
    queryKey: ["openscanhub", { pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchScans({ pageParam, perPage, signal }),
  });

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import {
  fetchKojiTagRequest,
  fetchKojiTagRequestProps,
} from "./kojiTagRequest";

type QueryParameters = Omit<fetchKojiTagRequestProps, "signal">;

export const kojiTagRequestQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["koji", params],
    queryFn: async ({ signal }) =>
      await fetchKojiTagRequest({ signal, ...params }),
  });

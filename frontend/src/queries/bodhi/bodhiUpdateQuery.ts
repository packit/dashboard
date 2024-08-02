// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchBodhiUpdate, fetchBodhiUpdateProps } from "./bodhiUpdate";

type QueryParameters = Omit<fetchBodhiUpdateProps, "signal">;

export const bodhiUpdateQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["bodhi", params],
    queryFn: async ({ signal }) =>
      await fetchBodhiUpdate({ signal, ...params }),
  });

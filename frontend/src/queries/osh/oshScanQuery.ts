// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchOSHScan, fetchOSHScanProps } from "./oshScan";

type QueryParameters = Omit<fetchOSHScanProps, "signal">;

export const oshScanQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["bodhi", params],
    queryFn: async ({ signal }) => await fetchOSHScan({ signal, ...params }),
  });

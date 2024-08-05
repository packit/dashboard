// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import {
  fetchTestingFarmRun,
  fetchTestingFarmRunProps,
} from "./testingFarmRun";

type QueryParameters = Omit<fetchTestingFarmRunProps, "signal">;

export const testingFarmRunQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["testing-farm-runs", params],
    queryFn: async ({ signal }) =>
      await fetchTestingFarmRun({ signal, ...params }),
  });

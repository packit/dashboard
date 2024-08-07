// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchPipeline, fetchPipelineProps } from "./pipeline";

type QueryParameters = Omit<fetchPipelineProps, "signal">;

export const pipelineQueryOptions = (params: QueryParameters) => {
  return queryOptions({
    queryKey: ["pipeline", params],
    queryFn: async ({ signal }) => await fetchPipeline({ signal, ...params }),
  });
};

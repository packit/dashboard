// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { PipelineRun } from "../../apiDefinitions";

export interface fetchPipelinesProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchPipelines = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchPipelinesProps): Promise<PipelineRun[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/runs?page=${pageParam}&per_page=${perPage}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Pipeline runs not found!`);
      }
      throw err;
    });
  return data;
};

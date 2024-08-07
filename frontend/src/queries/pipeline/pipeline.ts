// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { PipelineRun } from "../../apiDefinitions";

export interface fetchPipelineProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchPipeline = async ({
  id,
  signal,
}: fetchPipelineProps): Promise<PipelineRun> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/runs/merged/${id}`,
    {
      signal,
    },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Pipeline ${id} not found!`);
      }
      throw err;
    });
  return data;
};

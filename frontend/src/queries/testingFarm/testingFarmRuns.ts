// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { TestingFarmRunGroup } from "../../apiDefinitions";

export interface fetchTestingFarmRunsProps {
  pageParam: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchTestingFarmRuns = async ({
  pageParam = 1,
  signal,
}: fetchTestingFarmRunsProps): Promise<TestingFarmRunGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/testing-farm/results?page=${pageParam}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Testing farm runs not found!`);
      }
      throw err;
    });
  return data;
};

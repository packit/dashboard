// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { TestingFarmRun } from "../../apiDefinitions";

export interface fetchTestingFarmRunProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchTestingFarmRun = async ({
  id,
  signal,
}: fetchTestingFarmRunProps): Promise<TestingFarmRun> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/testing-farm/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Testing farm run ${id} not found!`);
      }
      throw err;
    });
  return data;
};

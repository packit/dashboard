// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { LogDetectiveResultGroup } from "../../apiDefinitions";

export interface fetchLogDetectiveResultProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchLogDetectiveResults = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchLogDetectiveResultProps): Promise<LogDetectiveResultGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/log-detective?page=${pageParam}&per_page=${perPage}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Log Detective results not found!`);
      }
      throw err;
    });
  return data;
};

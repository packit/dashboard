// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { LogDetectiveResult } from "../../apiDefinitions";

export interface fetchLogDetectiveResultProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchLogDetectiveResult = async ({
  id,
  signal,
}: fetchLogDetectiveResultProps): Promise<LogDetectiveResult> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/log-detective/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Log Detective run ${id} not found!`);
      }
      throw err;
    });
  return data;
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { LogDetectiveGroup } from "../../apiDefinitions";

export interface fetchLogDetectiveGroupProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchLogDetectiveGroup = async ({
  id,
  signal,
}: fetchLogDetectiveGroupProps): Promise<LogDetectiveGroup> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/log-detective/groups/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Log Detective group ${id} not found!`);
      }
      throw err;
    });
  return data;
};

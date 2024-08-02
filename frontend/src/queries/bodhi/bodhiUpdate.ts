// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { BodhiUpdate } from "../../apiDefinitions";

export interface fetchBodhiUpdateProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchBodhiUpdate = async ({
  id,
  signal,
}: fetchBodhiUpdateProps): Promise<BodhiUpdate> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/bodhi-updates/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`SRPM build ${id} not found!`);
      }
      throw err;
    });
  return data;
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { KojiBuild } from "../../apiDefinitions";

export interface fetchKojiBuildProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchKojiBuild = async ({
  id,
  signal,
}: fetchKojiBuildProps): Promise<KojiBuild> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/koji-builds/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Koji build ${id} not found!`);
      }
      throw err;
    });
  return data;
};

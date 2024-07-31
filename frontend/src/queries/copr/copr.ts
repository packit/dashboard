// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { CoprBuild } from "../../apiDefinitions";

export interface fetchCoprBuildProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchCoprBuild = async ({
  id,
  signal,
}: fetchCoprBuildProps): Promise<CoprBuild[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/copr-builds/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Copr build ${id} not found!`);
      }
      throw err;
    });
  return data;
};

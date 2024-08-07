// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { KojiBuildGroup } from "../../apiDefinitions";

export interface fetchKojiBuildsProps {
  pageParam: number;
  scratch?: boolean;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchKojiBuilds = async ({
  pageParam = 1,
  scratch = false,
  signal,
}: fetchKojiBuildsProps): Promise<KojiBuildGroup[]> => {
  const data = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/koji-builds?page=${pageParam}&scratch=${scratch.toString()}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Koji builds not found!`);
      }
      throw err;
    });
  return data;
};

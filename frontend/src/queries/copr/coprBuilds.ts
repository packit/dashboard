// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { CoprBuildGroup } from "../../apiDefinitions";

interface fetchCoprBuildsProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchCoprBuilds = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchCoprBuildsProps): Promise<CoprBuildGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/copr-builds?page=${pageParam}&per_page=${perPage}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Copr builds not found!`);
      }
      throw err;
    });
  return data;
};

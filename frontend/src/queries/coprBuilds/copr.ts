// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Project } from "../apiDefinitions";

interface fetchCoprBuildsProps {
  pageParam: number;
  signal?: AbortSignal;
  forge?: string;
  namespace?: string;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchCoprBuilds = async ({
  pageParam = 1,
  signal,
}: fetchCoprBuildsProps): Promise<Project[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/copr-builds?page=${pageParam}`,
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

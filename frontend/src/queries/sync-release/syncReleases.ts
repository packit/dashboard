// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { SyncReleaseJobGroup } from "../../apiDefinitions";

export interface fetchSyncReleasesProps {
  job: "propose-downstream" | "pull-from-upstream";
  pageParam: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchSyncReleases = async ({
  job,
  pageParam = 1,
  signal,
}: fetchSyncReleasesProps): Promise<SyncReleaseJobGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/${job}?page=${pageParam}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Sync releases not found!`);
      }
      throw err;
    });
  return data;
};

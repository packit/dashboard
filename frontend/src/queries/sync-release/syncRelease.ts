// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { SyncReleaseJob } from "../../apiDefinitions";

export interface fetchSyncReleaseProps {
  job: "propose-downstream" | "pull-from-upstream";
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchSyncRelease = async ({
  job,
  id,
  signal,
}: fetchSyncReleaseProps): Promise<SyncReleaseJob> => {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/${job}/${id}`, {
    signal,
  })
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Sync release ${id} not found!`);
      }
      throw err;
    });
  return data;
};

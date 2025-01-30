// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { SRPMBuildGroup } from "../../apiDefinitions";

export interface fetchSRPMBuildsProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchSRPMBuilds = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchSRPMBuildsProps): Promise<SRPMBuildGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/srpm-builds?page=${pageParam}&per_page=${perPage}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`SRPM builds not found!`);
      }
      throw err;
    });
  return data;
};

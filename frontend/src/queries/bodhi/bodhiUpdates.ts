// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { BodhiUpdateGroup } from "../../apiDefinitions";

export interface fetchBodhiUpdatesProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchBodhiUpdates = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchBodhiUpdatesProps): Promise<BodhiUpdateGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/bodhi-updates?page=${pageParam}&per_page=${perPage}`,
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

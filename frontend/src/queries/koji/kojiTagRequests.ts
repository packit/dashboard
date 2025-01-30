// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { KojiTagRequestGroup } from "../../apiDefinitions";

export interface fetchKojiTagRequestsProps {
  pageParam: number;
  perPage: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchKojiTagRequests = async ({
  pageParam = 1,
  perPage,
  signal,
}: fetchKojiTagRequestsProps): Promise<KojiTagRequestGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/koji-tag-requests?page=${pageParam}&per_page=${perPage}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Koji tag requests not found!`);
      }
      throw err;
    });
  return data;
};

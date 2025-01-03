// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { KojiTagRequest } from "../../apiDefinitions";

export interface fetchKojiTagRequestProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchKojiTagRequest = async ({
  id,
  signal,
}: fetchKojiTagRequestProps): Promise<KojiTagRequest> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/koji-tag-requests/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Koji tagging request ${id} not found!`);
      }
      throw err;
    });
  return data;
};

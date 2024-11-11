// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { OSHScanGroup } from "../../apiDefinitions";

export interface fetchScansProps {
  pageParam: number;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchScans = async ({
  pageParam = 1,
  signal,
}: fetchScansProps): Promise<OSHScanGroup[]> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/osh-scans?page=${pageParam}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`OSH scans not found!`);
      }
      throw err;
    });
  return data;
};

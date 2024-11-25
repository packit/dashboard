// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { OSHScan } from "../../apiDefinitions";

export interface fetchOSHScanProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchOSHScan = async ({
  id,
  signal,
}: fetchOSHScanProps): Promise<OSHScan> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/openscanhub-scans/${id}`,
    {
      signal,
    },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`OSH scan ${id} not found!`);
      }
      throw err;
    });
  return data;
};

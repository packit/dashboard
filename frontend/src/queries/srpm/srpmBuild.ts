// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { SRPMBuild } from "../../apiDefinitions";

export interface fetchSRPMBuildProps {
  id: string;
  signal?: AbortSignal;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchSRPMBuild = async ({
  id,
  signal,
}: fetchSRPMBuildProps): Promise<SRPMBuild> => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL}/srpm-builds/${id}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`SRPM build ${id} not found!`);
      }
      throw err;
    });
  return data;
};

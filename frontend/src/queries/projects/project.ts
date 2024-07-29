// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Project } from "../../apiDefinitions";

export interface fetchProjectProps {
  forge: string;
  namespace: string;
  repo: string;
  signal?: AbortSignal;
}

export const fetchProject = async ({
  forge,
  namespace,
  repo,
  signal,
}: fetchProjectProps): Promise<Project> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/projects/${forge}/${namespace}/${repo}`,
    { signal },
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Project not found!`);
      }
      throw err;
    });
  return await response;
};

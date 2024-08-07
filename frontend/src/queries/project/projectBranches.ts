// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { ProjectBranch } from "../../apiDefinitions";
import { fetchProjectProps } from "./project";

export const fetchProjectBranches = async ({
  forge,
  namespace,
  repo,
  signal,
}: fetchProjectProps): Promise<ProjectBranch[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repo}/branches`,
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

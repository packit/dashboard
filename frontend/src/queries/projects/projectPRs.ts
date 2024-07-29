// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { ProjectPRs } from "../../apiDefinitions";
import { fetchProjectProps } from "./project";

export const fetchProjectPRs = async ({
  forge,
  namespace,
  repo,
  signal,
}: fetchProjectProps): Promise<ProjectPRs[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repo}/prs`,
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

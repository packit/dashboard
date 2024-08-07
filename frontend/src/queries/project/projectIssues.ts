// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { ProjectIssue } from "../../apiDefinitions";
import { fetchProjectProps } from "./project";

export const fetchProjectIssues = async ({
  forge,
  namespace,
  repo,
  signal,
}: fetchProjectProps): Promise<ProjectIssue[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repo}/issues`,
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

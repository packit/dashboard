// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { ProjectRelease } from "../../apiDefinitions";
import { fetchProjectProps } from "./project";

export const fetchProjectReleases = async ({
  forge,
  namespace,
  repo,
  signal,
}: fetchProjectProps): Promise<ProjectRelease[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repo}/releases`,
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

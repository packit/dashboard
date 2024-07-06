// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Project } from "../apiDefinitions";

interface fetchProjectsProps {
  pageParam: number;
  signal?: AbortSignal;
  forge?: string;
  namespace?: string;
}

// Fetch data from dashboard backend (or if we want, directly from the API)
export const fetchProjects = async ({
  pageParam = 1,
  signal,
  forge,
  namespace,
}: fetchProjectsProps): Promise<Project> => {
  const projects = await fetch(
    `${import.meta.env.VITE_API_URL}/projects${forge ? "/" + forge : ""}${
      namespace ? "/" + namespace : ""
    }?page=${pageParam}`,
  )
    .then((response) => response.json())
    .catch((err) => {
      if (err.status === 404) {
        throw new Error(`Projects not found!`);
      }
      throw err;
    });
  return projects;
};

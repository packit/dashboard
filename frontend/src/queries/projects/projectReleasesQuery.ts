// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { fetchProjectProps } from "./project";
import { queryOptions } from "@tanstack/react-query";
import { fetchProjectReleases } from "./projectReleases";

type QueryParameters = Omit<fetchProjectProps, "signal">;

export const projectReleasesQueryOptions = (params: QueryParameters) =>
  queryOptions({
    queryKey: ["project-releases", params],
    queryFn: async ({ signal }) =>
      await fetchProjectReleases({ signal, ...params }),
  });

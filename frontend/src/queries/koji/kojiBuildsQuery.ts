// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { queryOptions } from "@tanstack/react-query";
import { fetchKojiBuilds, fetchKojiBuildsProps } from "./kojiBuilds";

type kojiBuildsQueryOptionsProps = Required<
  Pick<fetchKojiBuildsProps, "scratch">
> & {
  pageParam: number;
  perPage?: number;
};

export const kojiBuildsQueryOptions = ({
  scratch,
  pageParam,
  perPage = 20,
}: kojiBuildsQueryOptionsProps) =>
  queryOptions({
    queryKey: ["koji", { scratch, pageParam, perPage }],
    queryFn: async ({ signal }) =>
      await fetchKojiBuilds({ scratch, pageParam, perPage, signal }),
  });

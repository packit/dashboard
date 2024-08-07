// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchKojiBuilds, fetchKojiBuildsProps } from "./kojiBuilds";

type kojiBuildsQueryOptionsProps = Required<
  Pick<fetchKojiBuildsProps, "scratch">
>;

export const kojiBuildsQueryOptions = ({
  scratch,
}: kojiBuildsQueryOptionsProps) =>
  infiniteQueryOptions({
    queryKey: ["koji", { scratch }],
    queryFn: async ({ pageParam, signal }) =>
      await fetchKojiBuilds({ pageParam, scratch, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });

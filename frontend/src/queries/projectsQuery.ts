// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchProjects } from "./projects";

export const postQueryOptions = (forge?: string, namespace?: string) =>
  infiniteQueryOptions({
    queryKey: ["posts", forge, namespace],
    queryFn: ({ pageParam, signal }) =>
      fetchProjects({ pageParam, signal, forge, namespace }),
    initialPageParam: 1,
    getPreviousPageParam: (_, allPages) => allPages.length - 1,
    getNextPageParam: (_, allPages) => allPages.length + 1,
  });

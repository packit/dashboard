// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { kojiBuildQueryOptions } from "../../queries/koji/kojiBuildQuery";
import { KojiBuild } from "../../components/koji/KojiBuild";

export const Route = createFileRoute("/jobs/koji/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(kojiBuildQueryOptions({ id })),
  component: KojiBuild,
});

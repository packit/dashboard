// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { KojiBuild } from "../../components/koji/KojiBuild";
import { kojiBuildQueryOptions } from "../../queries/koji/kojiBuildQuery";

export const Route = createFileRoute("/jobs/koji-downstream/$id")({
  staticData: {
    title: "Downstream Koji build detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(kojiBuildQueryOptions({ id })),
  component: KojiBuild,
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { CoprBuild } from "../../components/copr/CoprBuild";
import { coprBuildQueryOptions } from "../../queries/copr/coprQuery";

export const Route = createFileRoute("/jobs/copr/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(coprBuildQueryOptions({ id })),
  component: CoprBuild,
});

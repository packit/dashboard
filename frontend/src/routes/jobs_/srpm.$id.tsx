// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SRPMBuild } from "../../components/srpm/SRPMBuild";
import { srpmBuildQueryOptions } from "../../queries/srpm/srpmBuildQuery";

export const Route = createFileRoute("/jobs/srpm/$id")({
  staticData: {
    title: "SRPM Build detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(srpmBuildQueryOptions({ id })),
  component: SRPMBuild,
});

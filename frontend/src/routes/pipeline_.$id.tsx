// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { Pipeline } from "../components/pipeline/Pipeline";
import { pipelineQueryOptions } from "../queries/pipeline/pipelineQuery";

export const Route = createFileRoute("/pipeline/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(pipelineQueryOptions({ id })),
  component: Pipeline,
  staticData: {
    title: "Pipeline",
  },
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { LogDetectiveResult } from "../../components/logdetective/LogDetectiveResult";
import { logDetectiveResultQueryOptions } from "../../queries/logdetective/logDetectiveResultQuery";

export const Route = createFileRoute("/jobs/log-detective/$id")({
  staticData: {
    title: "Log Detective result detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(logDetectiveResultQueryOptions({ id })),
  component: LogDetectiveResult,
});

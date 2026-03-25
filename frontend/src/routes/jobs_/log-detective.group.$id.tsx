// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { LogDetectiveGroup } from "../../components/logdetective/LogDetectiveGroup";
import { logDetectiveGroupQueryOptions } from "../../queries/logdetective/logDetectiveGroupQuery";

export const Route = createFileRoute("/jobs/log-detective/group/$id")({
  staticData: {
    title: "Log Detective group detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(logDetectiveGroupQueryOptions({ id })),
  component: LogDetectiveGroup,
});

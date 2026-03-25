// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { LogDetectiveResultsTable } from "../../components/logdetective/LogDetectiveResultsTable";

export const Route = createFileRoute("/jobs/log-detective")({
  staticData: {
    title: "Log Detective results",
  },
  component: () => LogDetectiveResultsTable(),
});

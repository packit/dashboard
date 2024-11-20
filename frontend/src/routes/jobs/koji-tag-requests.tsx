// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { KojiTagRequestsTable } from "../../components/koji/KojiTagRequestsTable";

export const Route = createFileRoute("/jobs/koji-tag-requests")({
  component: () => KojiTagRequestsTable(),
});

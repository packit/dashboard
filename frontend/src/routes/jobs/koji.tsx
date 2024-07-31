// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { KojiBuildsTable } from "../../components/koji/KojiBuildsTable";

export const Route = createFileRoute("/jobs/koji")({
  component: () => KojiBuildsTable({ scratch: true }),
});

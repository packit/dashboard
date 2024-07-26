// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { Jobs } from "../../components/jobs/Jobs";

export const Route = createFileRoute("/jobs")({
  component: Jobs,
});

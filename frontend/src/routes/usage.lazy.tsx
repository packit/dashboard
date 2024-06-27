// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
import { Usage } from "../components/usage/Usage";

export const Route = createLazyFileRoute("/usage")({
  component: Usage,
});

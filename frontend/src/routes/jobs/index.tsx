// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { Jobs } from "../../components/jobs/Jobs";

export const Route = createFileRoute("/jobs/")({
  loader: () => {
    throw redirect({
      to: "/jobs/copr-builds",
      replace: true,
    });
  },
});

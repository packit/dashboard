// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { RouteObject } from "react-router-dom";

import { AppLayout } from "./AppLayout/AppLayout";
import { Dashboard } from "./Dashboard/Dashboard";
import { Forge } from "./Projects/Forge";
import { Jobs } from "./Jobs/Jobs";
import { Namespace } from "./Projects/Namespace";
import { NotFound } from "./NotFound/NotFound";
import { Pipelines } from "./Pipelines/Pipelines";
import { Projects } from "./Projects/Projects";
import { ProjectInfo } from "../components/projects/ProjectDetail";
import { ResultsPageCopr } from "./Results/ResultsPageCopr";
import { ResultsPageKoji } from "./Results/ResultsPageKoji";
import { ResultsPageSyncReleaseRuns } from "./Results/ResultsPageSyncReleaseRuns";
import { ResultsPageSRPM } from "./Results/ResultsPageSRPM";
import { ResultsPageTestingFarm } from "./Results/ResultsPageTestingFarm";
import { ResultsPageBodhiUpdate } from "./Results/ResultsPageBodhiUpdate";
import { CoprBuildsTable } from "./Jobs/CoprBuildsTable";
import { KojiBuildsTable } from "./Jobs/KojiBuildsTable";
import { SyncReleaseTable } from "./Jobs/SyncReleaseStatuses";
import { SRPMBuildsTable } from "./Jobs/SRPMBuildsTable";
import { TestingFarmResultsTable } from "./Jobs/TestingFarmResultsTable";
import { BodhiUpdatesTable } from "./Jobs/BodhiUpdatesTable";
import { Usage } from "../components/usage/Usage";
import { ErrorApp } from "./Errors/ErrorApp";
import { PipelineDetail } from "./Pipelines/PipelineDetail";

// App routes
// Those with labels indicate they should be in sidebar
const routes: RouteObject[] = [
  {
    Component: AppLayout,
    path: "/",
    errorElement: <ErrorApp />,
    children: [
      {
        Component: Dashboard,
        index: true,
        path: "/",
        handle: {
          label: "Home",
        },
      },
      {
        element: <Projects />,
        path: "/projects",
        handle: {
          divider: true,
          label: "Projects",
          category: "Dashboards",
        },
      },
      {
        Component: Jobs,
        id: "jobs",
        path: "/jobs",
        handle: {
          category: "Dashboards",
          label: "Jobs",
        },
        children: [
          {
            element: <CoprBuildsTable />,
            index: true,
            id: "copr-builds",
            path: "copr-builds",
            handle: {
              label: "Copr Builds",
            },
          },
          {
            element: <KojiBuildsTable scratch="true" />,
            id: "koji-builds",
            path: "koji-builds",
            handle: {
              label: "Upstream Koji Builds",
            },
          },
          {
            element: <SRPMBuildsTable />,
            id: "srpm-builds",
            path: "srpm-builds",
            handle: {
              label: "SRPM Builds",
            },
          },
          {
            element: <TestingFarmResultsTable />,
            id: "testing-farm-runs",
            path: "testing-farm-runs",
            handle: {
              label: "Testing Farm Runs",
            },
          },
          {
            element: <SyncReleaseTable job="propose-downstream" />,
            id: "propose-downstreams",
            path: "propose-downstreams",
            handle: {
              label: "Propose Downstreams",
            },
          },
          {
            element: <SyncReleaseTable job="pull-from-upstream" />,
            id: "pull-from-upstreams",
            path: "pull-from-upstreams",
            handle: {
              label: "Pull From Upstreams",
            },
          },
          {
            element: <KojiBuildsTable scratch="false" />,
            id: "downstream-koji-builds",
            path: "downstream-koji-builds",
            handle: {
              label: "Downstream (production) Koji builds",
            },
          },
          {
            element: <BodhiUpdatesTable />,
            id: "bodhi-updates",
            path: "bodhi-updates",
            handle: {
              label: "Bodhi Updates",
            },
          },
        ],
      },
      {
        element: <Pipelines />,
        path: "/pipelines",
        handle: {
          category: "Dashboards",
          label: "Pipelines",
        },
      },
      {
        element: <PipelineDetail />,
        path: "/pipelines/:id",
      },
      {
        path: "/projects/:forge",
        element: <Forge />,
      },
      {
        path: "/projects/:forge/:namespace",
        element: <Namespace />,
      },
      {
        path: "/projects/:forge/:namespace/:repoName",
        element: <ProjectInfo />,
      },
      {
        path: "/results/srpm-builds/:id",
        element: <ResultsPageSRPM />,
      },
      {
        path: "/results/copr-builds/:id",
        element: <ResultsPageCopr />,
      },
      {
        path: "/results/koji-builds/:id",
        element: <ResultsPageKoji />,
      },
      {
        path: "/results/testing-farm/:id",
        element: <ResultsPageTestingFarm />,
      },
      {
        path: "/results/propose-downstream/:id",
        element: <ResultsPageSyncReleaseRuns job="propose-downstream" />,
      },
      {
        path: "/results/pull-from-upstream/:id",
        element: <ResultsPageSyncReleaseRuns job="pull-from-upstream" />,
      },
      {
        path: "/results/bodhi-updates/:id",
        element: <ResultsPageBodhiUpdate />,
      },
      {
        element: <Usage />,
        path: "/usage",
        handle: {
          label: "Usage",
        },
      },
      {
        element: <NotFound />,
        path: "*",
      },
    ],
  },
];

export { routes };

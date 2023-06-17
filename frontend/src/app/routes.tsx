import { RouteObject } from "react-router-dom";

import { AppLayout } from "./AppLayout/AppLayout";
import { Dashboard } from "./Dashboard/Dashboard";
import { Forge } from "./Forge/Forge";
import { Jobs } from "./Jobs/Jobs";
import { Namespace } from "./Projects/Namespace";
import { NotFound } from "./NotFound/NotFound";
import { Pipelines } from "./Pipelines/Pipelines";
import { Projects } from "./Projects/Projects";
import { ProjectInfo } from "./Projects/ProjectInfo";
import { ResultsPageCopr } from "./Results/ResultsPageCopr";
import { ResultsPageKoji } from "./Results/ResultsPageKoji";
import { ResultsPageSyncReleaseRuns } from "./Results/ResultsPageSyncReleaseRuns";
import { ResultsPageSRPM } from "./Results/ResultsPageSRPM";
import { ResultsPageTestingFarm } from "./Results/ResultsPageTestingFarm";
import { CoprBuildsTable } from "./Jobs/CoprBuildsTable";
import { KojiBuildsTable } from "./Jobs/KojiBuildsTable";
import { SyncReleaseTable } from "./Jobs/SyncReleaseStatuses";
import { SRPMBuildsTable } from "./Jobs/SRPMBuildsTable";
import { TestingFarmResultsTable } from "./Jobs/TestingFarmResultsTable";
import { Usage } from "./Usage/Usage";
import { ErrorApp } from "./Errors/ErrorApp";

// App routes
// Those with labels indicate they should be in sidebar
const routes: RouteObject[] = [
    {
        element: <AppLayout />,
        path: "/",
        errorElement: <ErrorApp />,
        children: [
            {
                element: <Dashboard />,
                index: true,
                path: "/",
                handle: {
                    label: "Home",
                },
            },
            {
                element: <Jobs />,
                path: "/jobs",
                handle: {
                    label: "Jobs",
                },
                children: [
                    {
                        element: <CoprBuildsTable />,
                        index: true,
                        path: "copr-builds",
                        handle: {
                            label: "Copr Builds",
                        },
                    },
                    {
                        element: <KojiBuildsTable />,
                        path: "koji-builds",
                        handle: {
                            label: "Koji Builds",
                        },
                    },
                    {
                        element: <SRPMBuildsTable />,
                        path: "srpm-builds",
                        handle: {
                            label: "SRPM Builds",
                        },
                    },
                    {
                        element: <TestingFarmResultsTable />,
                        path: "testing-farm-runs",
                        handle: {
                            label: "Testing Farm Runs",
                        },
                    },
                    {
                        element: <SyncReleaseTable job="propose-downstream" />,
                        path: "propose-downstreams",
                        handle: {
                            label: "Propose Downstreams",
                        },
                    },
                    {
                        element: <SyncReleaseTable job="pull-from-upstream" />,
                        path: "pull-from-upstreams",
                        handle: {
                            label: "Pull From Upstreams",
                        },
                    },
                ],
            },
            {
                element: <Pipelines />,
                path: "/pipelines",
                handle: {
                    label: "Pipelines",
                },
            },
            {
                element: <Projects />,
                path: "/projects",
                handle: {
                    label: "Projects",
                },
            },
            {
                path: "/projects/:forge/",
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
                element: (
                    <ResultsPageSyncReleaseRuns job="propose-downstream" />
                ),
            },
            {
                path: "/results/pull-from-upstream/:id",
                element: (
                    <ResultsPageSyncReleaseRuns job="pull-from-upstream" />
                ),
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

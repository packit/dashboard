import * as React from "react";
import { Route, Routes } from "react-router-dom";

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

// Main Menu routes
const routes = [
    {
        element: <AppLayout />,
        label: "Home",
        path: "/",
        title: "Packit Service",
        errorElement: <ErrorApp />,
        children: [
            {
                element: <Dashboard />,
                index: true,
                label: "Home",
                path: "/",
            },
            {
                element: <Jobs />,
                label: "Jobs",
                path: "/jobs",
                title: "Jobs | Packit Service",
                children: [
                    {
                        element: <CoprBuildsTable />,
                        index: true,
                        label: "Copr Builds",
                        path: "copr-builds",
                    },
                    {
                        element: <KojiBuildsTable />,
                        label: "Koji Builds",
                        path: "koji-builds",
                    },
                    {
                        element: <SRPMBuildsTable />,
                        label: "SRPM Builds",
                        path: "srpm-builds",
                    },
                    {
                        element: <TestingFarmResultsTable />,
                        label: "Testing Farm Runs",
                        path: "testing-farm-runs",
                    },
                    {
                        element: <SyncReleaseTable job="propose-downstream" />,
                        label: "Propose Downstreams",
                        path: "propose-downstreams",
                    },
                    {
                        element: <SyncReleaseTable job="pull-from-upstream" />,
                        label: "Pull From Upstreams",
                        path: "pull-from-upstreams",
                    },
                ],
            },
            {
                element: <Pipelines />,
                label: "Pipelines",
                path: "/pipelines",
                title: "Pipelines | Packit Service",
            },
            {
                element: <Projects />,
                label: "Projects",
                path: "/projects",
                title: "Projects | Packit Service",
            },
            {
                path: "/projects/:forge/",
                element: <Forge />,
                title: "Project Forge | Packit Service",
            },
            {
                path: "/projects/:forge/:namespace",
                element: <Namespace />,
                title: "Project Namespace | Packit Service",
            },
            {
                path: "/projects/:forge/:namespace/:repoName",
                element: <ProjectInfo />,
                title: "Project | Packit Service",
            },
            {
                path: "/results/srpm-builds/:id",
                element: <ResultsPageSRPM />,
                title: "SRPM Results | Packit Service",
            },
            {
                path: "/results/copr-builds/:id",
                element: <ResultsPageCopr />,
                title: "Copr Results | Packit Service",
            },
            {
                path: "/results/koji-builds/:id",
                element: <ResultsPageKoji />,
                title: "Koji Results | Packit Service",
            },
            {
                path: "/results/testing-farm/:id",
                element: <ResultsPageTestingFarm />,
                title: "Testing Farm Results | Packit Service",
            },
            {
                path: "/results/propose-downstream/:id",
                element: (
                    <ResultsPageSyncReleaseRuns job="propose-downstream" />
                ),
                title: "Propose Results | Packit Service",
            },
            {
                path: "/results/pull-from-upstream/:id",
                element: (
                    <ResultsPageSyncReleaseRuns job="pull-from-upstream" />
                ),
                title: "Pull From Upstream Results | Packit Service",
            },
            {
                element: <Usage />,
                exact: true,
                label: "Usage",
                path: "/usage",
                title: "Usage | Packit Service",
            },
        ],
    },
];

const AppRoutes = () => (
    <Routes>
        {routes.map(({ path, exact, element, title }, idx) => (
            <Route
                path={path}
                title={title}
                exact={exact}
                element={element}
                key={idx}
            />
        ))}
        <Route
            path="/projects/:forge/:namespace/:repoName"
            element={<ProjectInfo />}
            exact
            title="Project"
        />
        <Route
            path="/projects/:forge/:namespace"
            element={<Namespace />}
            exact
            title="Namespace"
        />
        <Route
            path="/projects/:forge/"
            element={<Forge />}
            exact
            title="Forge"
        />
        <Route
            path="/results/srpm-builds/:id"
            element={<ResultsPageSRPM />}
            exact
            title="SRPM Results"
        />
        <Route
            path="/results/copr-builds/:id"
            element={<ResultsPageCopr />}
            exact
            title="Copr Results"
        />
        <Route
            path="/results/koji-builds/:id"
            element={<ResultsPageKoji />}
            exact
            title="Koji Results"
        />
        <Route
            path="/results/testing-farm/:id"
            element={<ResultsPageTestingFarm />}
            exact
            title="Testing Farm Results"
        />
        <Route
            path="/results/propose-downstream/:id"
            element={<ResultsPageSyncReleaseRuns job="propose-downstream" />}
            exact
            title="Propose Results"
        />
        <Route
            path="/results/pull-from-upstream/:id"
            element={<ResultsPageSyncReleaseRuns job="pull-from-upstream" />}
            exact
            title="Pull From Upstream Results"
        />
        <Route path="/" element={<NotFound />} title="404 Page Not Found" />
    </Routes>
);

export { AppRoutes, routes };

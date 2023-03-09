import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/app_layout";
import { Dashboard } from "./components/dashboard";
import { Forge } from "./components/forge";
import { Jobs } from "./components/jobs";
import { Namespace } from "./components/namespace";
import { NotFound } from "./components/not_found";
import Pipelines from "./components/pipelines";
import { Projects } from "./components/projects";
import { ProjectInfo } from "./components/project_info";
import { ResultsPageCopr } from "./components/results/copr";
import { ResultsPageKoji } from "./components/results/koji";
import { ResultsPageSyncReleaseRuns } from "./components/results/sync_release";
import { ResultsPageSRPM } from "./components/results/srpm";
import { ResultsPageTestingFarm } from "./components/results/testing_farm";
import CoprBuildsTable from "./components/tables/copr";
import KojiBuildsTable from "./components/tables/koji";
import SyncReleaseTable from "./components/tables/sync_release";
import SRPMBuildsTable from "./components/tables/srpm";
import TestingFarmResultsTable from "./components/tables/testing_farm";
import Usage from "./components/usage";
import AppError from "./components/error_app";

// Main Menu routes
const routes = [
    {
        element: <AppLayout />,
        label: "Home",
        path: "/",
        title: "Packit Service",
        errorElement: <AppError />,
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

import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { Dashboard } from "./components/dashboard";
import { Jobs } from "./components/jobs";
import { Projects } from "./components/projects";
import { Namespace } from "./components/namespace";
import { ProjectInfo } from "./components/project_info";
import { NotFound } from "./components/not_found";
import { ResultsPageSRPM } from "./components/results/srpm";
import { ResultsPageCopr } from "./components/results/copr";
import { ResultsPageKoji } from "./components/results/koji";
import { ResultsPageTestingFarm } from "./components/results/testing_farm";
import { ResultsPageProposeDownstream } from "./components/results/propose_downstream";
import { Forge } from "./components/forge";
import Pipelines from "./components/pipelines";

// Main Menu routes
const routes = [
    {
        element: <Dashboard />,
        exact: true,
        label: "Home",
        path: "/",
        title: "Home | Packit Service",
    },
    {
        element: <Jobs />,
        exact: true,
        label: "Jobs",
        path: "/jobs",
        title: "Jobs | Packit Service",
    },
    {
        element: <Pipelines />,
        exact: true,
        label: "Pipelines",
        path: "/pipelines",
        title: "Pipelines | Packit Service",
    },
    {
        element: <Projects />,
        exact: true,
        label: "Projects",
        path: "/projects",
        title: "Projects | Packit Service",
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
            element={<ResultsPageProposeDownstream />}
            exact
            title="Propose Results"
        />
        <Route path="/" element={<NotFound />} title="404 Page Not Found" />
    </Routes>
);

export { AppRoutes, routes };

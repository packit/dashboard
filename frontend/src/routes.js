import * as React from "react";
import { Route, Switch } from "react-router-dom";

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
import { Forge } from "./components/forge";
import Pipelines from "./components/pipelines";

// Main Menu routes
const routes = [
    {
        component: Dashboard,
        exact: true,
        label: "Home",
        path: "/",
        title: "Home | Packit Service",
    },
    {
        component: Jobs,
        exact: true,
        label: "Jobs",
        path: "/jobs",
        title: "Jobs | Packit Service",
    },
    {
        component: Pipelines,
        exact: true,
        label: "Pipelines (beta)",
        path: "/pipelines",
        title: "Pipelines (beta) | Packit Service",
    },
    {
        component: Projects,
        exact: true,
        label: "Projects",
        path: "/projects",
        title: "Projects | Packit Service",
    },
];

const AppRoutes = () => (
    <Switch>
        {routes.map(({ path, exact, component, title }, idx) => (
            <Route
                path={path}
                title={title}
                exact={exact}
                component={component}
                key={idx}
            />
        ))}
        <Route
            path="/projects/:forge/:namespace/:repoName"
            component={ProjectInfo}
            exact
            title="Project"
        />
        <Route
            path="/projects/:forge/:namespace"
            component={Namespace}
            exact
            title="Namespace"
        />
        <Route path="/projects/:forge/" component={Forge} exact title="Forge" />
        <Route
            path="/results/srpm-builds/:id"
            component={ResultsPageSRPM}
            exact
            title="SRPM Results"
        />
        <Route
            path="/results/copr-builds/:id"
            component={ResultsPageCopr}
            exact
            title="Copr Results"
        />
        <Route
            path="/results/koji-builds/:id"
            component={ResultsPageKoji}
            exact
            title="Koji Results"
        />
        <Route
            path="/results/testing-farm/:id"
            component={ResultsPageTestingFarm}
            exact
            title="Testing Farm Results"
        />
        <Route path="/" component={NotFound} title="404 Page Not Found" />
    </Switch>
);

export { AppRoutes, routes };

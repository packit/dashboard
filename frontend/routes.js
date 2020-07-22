import * as React from "react";
import { Route, Switch } from "react-router-dom";

import { Dashboard } from "./components/dashboard";
import { Jobs } from "./components/jobs";
import { Projects } from "./components/projects";
import { ProjectInfo } from "./components/project_info";
import { Support } from "./components/support";
import { NotFound } from "./components/not_found";

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
        component: Projects,
        exact: true,
        label: "Projects",
        path: "/projects",
        title: "Projects | Packit Service",
    },
    {
        component: Support,
        exact: true,
        label: "Installations",
        path: "/installations",
        title: "Installations | Packit Service",
    },
    {
        component: Support,
        exact: true,
        label: "FAQ",
        path: "/faq",
        title: "FAQ | Packit Service",
    },
    {
        component: Support,
        exact: true,
        label: "Status",
        path: "/status",
        title: "Status | Packit Service",
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
        <Route path="/" component={NotFound} title="404 Page Not Found" />
    </Switch>
);

export { AppRoutes, routes };

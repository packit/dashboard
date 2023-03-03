import {
    Nav,
    NavItem,
    NavList,
    PageGroup,
    PageNavigation,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
} from "@patternfly/react-core";
import { useEffect } from "react";
import {
    matchRoutes,
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { routes } from "../routes";
const JOBS_ROUTE = "/jobs";
const Jobs = () => {
    const location = useLocation();
    const currentRouteTree = matchRoutes(routes, location);
    const jobRoutes = currentRouteTree.find((r) => r.pathname === JOBS_ROUTE)
        .route.children;
    const activeJobRoute = currentRouteTree.find((r) =>
        r.pathname.includes(JOBS_ROUTE + "/")
    );

    // if we're not inside a specific route, default to copr-builds and redirect
    const navigate = useNavigate();
    useEffect(() => {
        if (!activeJobRoute) {
            navigate("/jobs/copr-builds");
        }
    }, [activeJobRoute, navigate]);

    return (
        <PageGroup>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Jobs</Text>
                    <Text component="p">List of jobs by Packit Service</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <PageNavigation>
                    <Nav aria-label="Job types" variant="tertiary">
                        <NavList>
                            {jobRoutes.map((route) => (
                                <NavItem
                                    key={route.path}
                                    isActive={
                                        route.path ===
                                        activeJobRoute?.route.path
                                    }
                                >
                                    <NavLink to={"/jobs/" + route.path}>
                                        {route.label}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </NavList>
                    </Nav>
                </PageNavigation>
                <Outlet />
            </PageSection>
        </PageGroup>
    );
};

export { Jobs };

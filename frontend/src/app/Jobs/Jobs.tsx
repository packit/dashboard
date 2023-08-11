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
    NavLink,
    Outlet,
    useLocation,
    useMatches,
    useNavigate,
} from "react-router-dom";
import { useTitle } from "../utils/useTitle";

const Jobs = () => {
    useTitle("Jobs");
    const location = useLocation();
    const matches = useMatches();
    const currentMatch = matches.find(
        (match) => match.pathname === location.pathname,
    );

    // if we're not inside a specific route, default to copr-builds and redirect
    const navigate = useNavigate();
    useEffect(() => {
        if (matches[matches.length - 1].id === "jobs") {
            navigate("/jobs/copr-builds");
        }
    }, [navigate]);

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
                            <NavItem
                                isActive={currentMatch?.id === "copr-builds"}
                            >
                                <NavLink to={"copr-builds"}>
                                    Copr Builds
                                </NavLink>
                            </NavItem>
                            <NavItem
                                isActive={currentMatch?.id === "koji-builds"}
                            >
                                <NavLink to={"koji-builds"}>
                                    Upstream Koji Builds
                                </NavLink>
                            </NavItem>
                            <NavItem
                                isActive={currentMatch?.id === "srpm-builds"}
                            >
                                <NavLink to={"srpm-builds"}>
                                    SRPM Builds
                                </NavLink>
                            </NavItem>
                            <NavItem
                                isActive={
                                    currentMatch?.id === "testing-farm-runs"
                                }
                            >
                                <NavLink to={"testing-farm-runs"}>
                                    Testing Farm Runs
                                </NavLink>
                            </NavItem>
                            <NavItem
                                isActive={
                                    currentMatch?.id === "propose-downstreams"
                                }
                            >
                                <NavLink to={"propose-downstreams"}>
                                    Propose Downstreams
                                </NavLink>
                            </NavItem>
                            <NavItem
                                isActive={
                                    currentMatch?.id === "pull-from-upstreams"
                                }
                            >
                                <NavLink to={"pull-from-upstreams"}>
                                    Pull From Upstreams
                                </NavLink>
                            </NavItem>
                        </NavList>
                    </Nav>
                </PageNavigation>
                <Outlet />
            </PageSection>
        </PageGroup>
    );
};

export { Jobs };

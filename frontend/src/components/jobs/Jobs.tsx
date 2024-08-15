// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

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
import { Link, Outlet, useMatchRoute } from "@tanstack/react-router";

const Jobs = () => {
  const matchRoute = useMatchRoute();

  const jobTypeObject = (jobType: string) => {
    return {
      to: `/jobs/${jobType}`,
    };
  };

  return (
    <PageGroup>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Jobs</Text>
          <Text component="p">List of jobs by Packit Service</Text>
        </TextContent>
      </PageSection>
      <PageNavigation>
        <Nav aria-label="Job types" variant="tertiary">
          <NavList>
            <NavItem isActive={!!matchRoute(jobTypeObject("copr"))}>
              <Link {...jobTypeObject("copr")}>Copr Builds</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute(jobTypeObject("koji"))}>
              <Link {...jobTypeObject("koji")}>Upstream Koji Builds</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute(jobTypeObject("srpm"))}>
              <Link {...jobTypeObject("srpm")}>SRPM Builds</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute(jobTypeObject("testing-farm"))}>
              <Link {...jobTypeObject("testing-farm")}>Testing Farm Runs</Link>
            </NavItem>
            <NavItem
              isActive={!!matchRoute(jobTypeObject("propose-downstream"))}
            >
              <Link {...jobTypeObject("propose-downstream")}>
                Propose Downstreams
              </Link>
            </NavItem>
            <NavItem
              isActive={!!matchRoute(jobTypeObject("pull-from-upstream"))}
            >
              <Link {...jobTypeObject("pull-from-upstream")}>
                Pull From Upstreams
              </Link>
            </NavItem>
            <NavItem isActive={!!matchRoute(jobTypeObject("koji-downstream"))}>
              <Link {...jobTypeObject("koji-downstream")}>
                Downstream Koji Builds
              </Link>
            </NavItem>
            <NavItem isActive={!!matchRoute(jobTypeObject("bodhi"))}>
              <Link {...jobTypeObject("bodhi")}>Bodhi Updates</Link>
            </NavItem>
          </NavList>
        </Nav>
      </PageNavigation>
      <PageSection>
        <Outlet />
      </PageSection>
    </PageGroup>
  );
};

export { Jobs };

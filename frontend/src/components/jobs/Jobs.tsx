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
            <NavItem
              isActive={!!matchRoute(jobTypeObject("testing-farm-runs"))}
            >
              <Link {...jobTypeObject("testing-farm-runs")}>
                Testing Farm Runs
              </Link>
            </NavItem>
            <NavItem
              isActive={!!matchRoute(jobTypeObject("propose-downstreams"))}
            >
              <Link {...jobTypeObject("propose-downstreams")}>
                Propose Downstreams
              </Link>
            </NavItem>
            <NavItem
              isActive={!!matchRoute(jobTypeObject("pull-from-upstreams"))}
            >
              <Link {...jobTypeObject("pull-from-upstreams")}>
                Pull From Upstreams
              </Link>
            </NavItem>
            <NavItem
              isActive={!!matchRoute(jobTypeObject("downstream-koji-builds"))}
            >
              <Link {...jobTypeObject("downstream-koji-builds")}>
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

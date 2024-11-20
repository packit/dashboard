// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Content,
  Nav,
  NavItem,
  NavList,
  PageGroup,
  PageSection,
} from "@patternfly/react-core";
import { Link, Outlet, useMatchRoute } from "@tanstack/react-router";

const Jobs = () => {
  const matchRoute = useMatchRoute();

  const jobTypeObject = (jobType: string) => {
    return {
      id: `/jobs/${jobType}`,
      to: `/jobs/${jobType}`,
    };
  };

  return (
    <PageGroup>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Jobs</Content>
          <Content component="p">List of jobs by Packit Service</Content>
        </Content>
      </PageSection>
      <Nav aria-label="Job types" variant="horizontal-subnav">
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
          <NavItem isActive={!!matchRoute(jobTypeObject("propose-downstream"))}>
            <Link {...jobTypeObject("propose-downstream")}>
              Propose Downstreams
            </Link>
          </NavItem>
          <NavItem isActive={!!matchRoute(jobTypeObject("pull-from-upstream"))}>
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
          <NavItem isActive={!!matchRoute(jobTypeObject("openscanhub"))}>
            <Link {...jobTypeObject("openscanhub")}>OpenScanHub</Link>
          </NavItem>
          <NavItem isActive={!!matchRoute(jobTypeObject("koji-tag-requests"))}>
            <Link {...jobTypeObject("koji-tag-requests")}>
              Koji Tagging Requests
            </Link>
          </NavItem>
        </NavList>
      </Nav>
      <PageSection hasBodyWrapper={false}>
        <Outlet />
      </PageSection>
    </PageGroup>
  );
};

export { Jobs };

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Nav,
  NavList,
  NavItem,
  Page,
  PageSidebar,
  Button,
  SkipToContent,
  Text,
  TextContent,
  Popover,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  NavExpandable,
  PageSidebarBody,
} from "@patternfly/react-core";
import packitLogo from "../static/logo.png";
import React, { useState } from "react";
import {
  ExternalLinkAltIcon,
  CodeBranchIcon,
  BarsIcon,
} from "@patternfly/react-icons";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useMatchRoute,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [isMobileView, setIsMobileView] = useState(true);
    const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);

    const matchRoute = useMatchRoute();

    const onNavToggleMobile = () => {
      setIsNavOpenMobile(!isNavOpenMobile);
    };
    const onNavToggle = () => {
      setIsNavOpen(!isNavOpen);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPageResize = (props: any) => {
      // eslint-disable-next-line react/prop-types
      if (Object.hasOwn(props, "mobileView")) setIsMobileView(props.mobileView);
    };

    const headerToolbar = (
      <Toolbar id="header-toolbar">
        <ToolbarContent>
          <ToolbarItem align={{ default: "alignRight" }}>
            <Popover
              headerContent={"About open source"}
              flipBehavior={["bottom-end"]}
              bodyContent={
                <TextContent>
                  <Text>
                    This service is open source, so all of its code is
                    inspectable. Explore repositories to view and contribute to
                    the source code.
                  </Text>
                  <Button
                    component="a"
                    target="_blank"
                    variant="link"
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    isInline
                    href={`https://github.com/packit/dashboard/commit/${
                      import.meta.env.VITE_GIT_SHA
                    }`}
                  >
                    Source code
                  </Button>
                </TextContent>
              }
            >
              <Button variant="plain" aria-label="About Open Services">
                <CodeBranchIcon />
              </Button>
            </Popover>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    );

    const Header = (
      <Masthead>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isNavOpen}
            onSidebarToggle={isMobileView ? onNavToggleMobile : onNavToggle}
            id="vertical-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadMain>
          <MastheadBrand component="a" href="/">
            <img
              src={packitLogo}
              style={{ height: "60px" }}
              alt="Packit Logo"
            />
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>{headerToolbar}</MastheadContent>
      </Masthead>
    );
    const Navigation = (
      <Nav id="nav-primary-simple" theme="dark">
        <NavList id="nav-list-simple">
          <NavItem isActive={!!matchRoute({ to: "/" })}>
            <Link to={"/"}>Home</Link>
          </NavItem>
          <NavExpandable
            isActive={
              !!matchRoute({ to: "/projects", fuzzy: true }) ||
              !!matchRoute({ to: "/jobs", fuzzy: true }) ||
              !!matchRoute({ to: "/pipelines", fuzzy: true })
            }
            title="Dashboards"
            groupId="nav-expandable-group-dashboards"
            isExpanded
          >
            <NavItem isActive={!!matchRoute({ to: "/projects", fuzzy: true })}>
              <Link to={"/projects"}>Projects</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute({ to: "/jobs", fuzzy: true })}>
              <Link to={"/jobs"}>Jobs</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute({ to: "/pipelines", fuzzy: true })}>
              <Link to={"/pipelines"}>Pipelines</Link>
            </NavItem>
          </NavExpandable>
          <NavItem isActive={!!matchRoute({ to: "/usage" })}>
            <Link to={"/usage"}>Usage</Link>
          </NavItem>
          <NavExpandable
            title="External links"
            groupId="nav-expandable-group-external"
            isExpanded
          >
            <NavItem key="status" id="status">
              <a href="https://status.packit.dev">Status</a>
            </NavItem>
            <NavItem key="blog-posts" id="blog-posts">
              <a href="https://packit.dev/posts">Blog posts</a>
            </NavItem>
            <NavItem key="faq-page" id="faq-page">
              <a
                target="_blank"
                href="https://packit.dev/docs/faq"
                rel="noreferrer"
              >
                FAQ
              </a>
            </NavItem>
          </NavExpandable>
        </NavList>
      </Nav>
    );
    const Sidebar = (
      <PageSidebar
        theme="dark"
        isSidebarOpen={isMobileView ? isNavOpenMobile : isNavOpen}
      >
        <PageSidebarBody>{Navigation}</PageSidebarBody>
      </PageSidebar>
    );
    const PageSkipToContent = (
      <SkipToContent href="#primary-app-container">
        Skip to Content
      </SkipToContent>
    );
    return (
      <Page
        mainContainerId="primary-app-container"
        header={Header}
        sidebar={Sidebar}
        onPageResize={(_event, props: unknown) => onPageResize(props)}
        skipToContent={PageSkipToContent}
      >
        <Outlet />
      </Page>
    );
  },
});

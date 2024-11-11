// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Button,
  Content,
  Grid,
  GridItem,
  List,
  ListItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageBody,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Popover,
  SkipToContent,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  BarsIcon,
  BookOpenIcon,
  CodeBranchIcon,
  DesktopIcon,
  ExternalLinkAltIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
} from "@patternfly/react-icons";
import { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useMatchRoute,
  useMatches,
} from "@tanstack/react-router";
import React, { useState } from "react";
import { useTitle } from "../components/shared/useTitle";
import packitLogo from "../static/logo.png";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  staticData: {
    title: "",
  },
  component: () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [isMobileView, setIsMobileView] = useState(true);
    const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);

    const toggleDarkTheme = (_evt, selected: boolean) => {
      const darkThemeToggleClicked = !selected === isDarkTheme;
      const htmlRoot = document.querySelector("html");
      if (htmlRoot) {
        htmlRoot.classList.toggle("pf-v6-theme-dark", darkThemeToggleClicked);
        setIsDarkTheme(darkThemeToggleClicked);
      }
    };

    const matchRoute = useMatchRoute();
    const matches = useMatches();

    const title = matches.at(-1)?.staticData.title;
    useTitle(title ? title : "");

    const onNavToggleMobile = () => {
      setIsNavOpenMobile(!isNavOpenMobile);
    };
    const onNavToggle = () => {
      setIsNavOpen(!isNavOpen);
    };
    // biome-ignore lint/suspicious/noExplicitAny: Not checked what it should be
    const onPageResize = (props: any) => {
      if (Object.hasOwn(props, "mobileView")) setIsMobileView(props.mobileView);
    };

    const headerToolbar = (
      <Toolbar id="header-toolbar">
        <ToolbarContent>
          <ToolbarGroup align={{ default: "alignEnd" }}>
            <ToolbarItem>
              <ToggleGroup aria-label="Dark theme toggle group">
                <ToggleGroupItem
                  aria-label="light theme toggle"
                  icon={<SunIcon />}
                  isSelected={!isDarkTheme}
                  onChange={toggleDarkTheme}
                />
                <ToggleGroupItem
                  aria-label="dark theme toggle"
                  icon={<MoonIcon />}
                  isSelected={isDarkTheme}
                  onChange={toggleDarkTheme}
                />
              </ToggleGroup>
            </ToolbarItem>
            <ToolbarItem>
              <Popover
                headerContent={"About open source"}
                flipBehavior={["bottom-end"]}
                bodyContent={
                  <Content>
                    <Content component="p">
                      This service is open source, so all of its code is
                      inspectable. Explore repositories to view and contribute
                      to the source code.
                    </Content>
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
                  </Content>
                }
              >
                <Button
                  icon={<CodeBranchIcon />}
                  variant="plain"
                  aria-label="About Open Services"
                />
              </Popover>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
    );

    const Header = (
      <Masthead>
        <MastheadMain>
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
          <MastheadBrand data-codemods>
            <MastheadLogo data-codemods component="a" href="/">
              <img
                src={packitLogo}
                style={{ height: "60px" }}
                alt="Packit Logo"
              />
            </MastheadLogo>
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>{headerToolbar}</MastheadContent>
      </Masthead>
    );
    const Navigation = (
      <Nav id="nav-primary-simple">
        <NavList id="nav-list-simple">
          <NavItem isActive={!!matchRoute({ to: "/" })}>
            <Link to={"/"}>Home</Link>
          </NavItem>
          <NavExpandable
            isActive={
              !!matchRoute({ to: "/projects", fuzzy: true }) ||
              !!matchRoute({ to: "/jobs", fuzzy: true }) ||
              !!matchRoute({ to: "/pipeline", fuzzy: true })
            }
            title="Dashboards"
            groupId="nav-expandable-group-dashboards"
            isExpanded
          >
            <NavItem isActive={!!matchRoute({ to: "/projects", fuzzy: true })}>
              <Link to={"/projects"}>Projects</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute({ to: "/jobs", fuzzy: true })}>
              <Link to={"/jobs/copr"}>Jobs</Link>
            </NavItem>
            <NavItem isActive={!!matchRoute({ to: "/pipeline", fuzzy: true })}>
              <Link to={"/pipeline"}>Pipelines</Link>
            </NavItem>
          </NavExpandable>
          <NavItem isActive={!!matchRoute({ to: "/usage" })}>
            <Link to={"/usage"}>Usage</Link>
          </NavItem>
        </NavList>
      </Nav>
    );
    const Sidebar = (
      <PageSidebar isSidebarOpen={isMobileView ? isNavOpenMobile : isNavOpen}>
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
        masthead={Header}
        sidebar={Sidebar}
        onPageResize={(_event, props: unknown) => onPageResize(props)}
        skipToContent={PageSkipToContent}
      >
        <Outlet />
        <PageSection component="footer" variant="secondary">
          <Grid hasGutter className="pf-v6-u-py-xl">
            <GridItem md={4} mdOffset={1} sm={12}>
              <Title headingLevel="h3" className="packit-footer-header">
                Packit
              </Title>
              <List isPlain>
                <ListItem>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://status.packit.dev"
                  >
                    Status
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://packit.dev/posts"
                  >
                    Blog posts
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    target="_blank"
                    href="https://packit.dev/docs/faq"
                    rel="noreferrer"
                  >
                    FAQ
                  </a>
                </ListItem>
              </List>
            </GridItem>
            <GridItem md={3} sm={12}>
              <Title headingLevel="h3" className="packit-footer-header">
                GitHub
              </Title>
              <List isPlain>
                <ListItem>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/packit/dashboard"
                  >
                    Dashboard
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/packit/dashboard"
                  >
                    Service
                  </a>
                </ListItem>
              </List>
            </GridItem>
          </Grid>
        </PageSection>
      </Page>
    );
  },
});

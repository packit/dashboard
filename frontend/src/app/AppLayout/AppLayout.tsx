// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  NavLink,
  Outlet,
  RouteObject,
  matchRoutes,
  useLocation,
} from "react-router-dom";
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
import { routes } from "../routes";
import packitLogo from "../../static/logo.png";
import React, { useState, useEffect } from "react";
import {
  ExternalLinkAltIcon,
  CodeBranchIcon,
  BarsIcon,
} from "@patternfly/react-icons";

const AppLayout = () => {
  const location = useLocation();
  const [activeLocationLabel, setActiveLocationLabel] = useState("");
  const [activeLocationCategory, setActiveLocationCategory] = useState("");
  const currentRouteTree = matchRoutes(routes, location);
  // Dynamically set page title and update currently active page in sidebar
  useEffect(() => {
    if (!currentRouteTree) {
      return;
    }
    // it matches everything that has to do with the current URL. Start from the leaf and work up to set title if at all.
    for (let index = currentRouteTree.length - 1; index >= 0; index--) {
      const element = currentRouteTree[index];
      if (element.route.handle?.label) {
        setActiveLocationLabel(element.route.handle.label);
        setActiveLocationCategory(element.route.handle.category || "");
      }
    }
  }, [currentRouteTree]);

  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(true);
  const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);
  const onNavToggleMobile = () => {
    setIsNavOpenMobile(!isNavOpenMobile);
  };
  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageResize = (props: any) => {
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
          <img src={packitLogo} style={{ height: "60px" }} alt="Packit Logo" />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
    </Masthead>
  );

  const NavigationRoute: React.FC<{ route: RouteObject; index: string }> = ({
    route,
    index,
  }) => (
    <NavItem
      key={route.handle.label}
      isActive={activeLocationLabel === route.handle.label}
    >
      <NavLink itemID={index.toString()} to={route.path ?? ""}>
        {route.handle.label}
      </NavLink>
    </NavItem>
  );
  const addedCategories: string[] = [];
  const Navigation = (
    <Nav id="nav-primary-simple" theme="dark">
      <NavList id="nav-list-simple">
        {routes[0].children?.map((route, index) => {
          if (route.handle?.category) {
            if (addedCategories.includes(route.handle.category)) return;
            const categoryRoutes = routes[0].children?.filter(
              (r) => r.handle?.category === route.handle.category,
            );
            addedCategories.push(route.handle.category);
            return (
              <NavExpandable
                key={route.handle.category}
                title={route.handle.category}
                groupId={`nav-expandable-group-${route.handle.category}`}
                isActive={activeLocationCategory === route.handle.category}
                isExpanded
              >
                {categoryRoutes?.map((r, i) => (
                  <NavigationRoute
                    key={r.id}
                    route={r}
                    index={r.path || index.toString() + i.toString()}
                  />
                ))}
              </NavExpandable>
            );
          }
          return (
            route.handle?.label && (
              <NavigationRoute route={route} index={index.toString()} />
            )
          );
        })}
        <NavExpandable
          title="External links"
          groupId="nav-expandable-group-external"
          // isActive={
          //     activeGroup === "nav-expandable-group-1"
          // }
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
    <SkipToContent href="#primary-app-container">Skip to Content</SkipToContent>
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
};

export { AppLayout };

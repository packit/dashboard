import { NavLink, Outlet, matchRoutes, useLocation } from "react-router-dom";
import {
    Brand,
    Nav,
    NavList,
    NavItem,
    Page,
    PageHeaderTools,
    PageHeader,
    PageSidebar,
    Button,
    SkipToContent,
    Text,
    TextContent,
    Popover,
} from "@patternfly/react-core";
import { routes } from "../routes";
import packitLogo from "../../static/logo.png";
import { useState, useEffect } from "react";
import {
    ExternalLinkSquareAltIcon,
    ExternalLinkAltIcon,
    CodeBranchIcon,
} from "@patternfly/react-icons";

const AppLayout = () => {
    const location = useLocation();
    const [activeLocationLabel, setActiveLocationLabel] = useState("");
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
            }
        }
    }, [currentRouteTree]);

    const logoProps = {
        href: "/",
    };
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [isMobileView, setIsMobileView] = useState(true);
    const [isNavOpenMobile, setIsNavOpenMobile] = useState(false);
    const onNavToggleMobile = () => {
        setIsNavOpenMobile(!isNavOpenMobile);
    };
    const onNavToggle = () => {
        setIsNavOpen(!isNavOpen);
    };
    const onPageResize = (props: any) => {
        setIsMobileView(props.mobileView);
    };

    const HeaderTools = (
        <PageHeaderTools>
            <Popover
                headerContent={"About open source"}
                flipBehavior={["bottom-end"]}
                bodyContent={
                    <TextContent>
                        <Text>
                            This service is open source, so all of its code is
                            inspectable. Explore repositories to view and
                            contribute to the source code.
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
                <Button
                    variant="plain"
                    aria-label="About Open Services"
                    className="pf-u-pl-sm header-button"
                >
                    <CodeBranchIcon />
                </Button>
            </Popover>
        </PageHeaderTools>
    );
    const Header = (
        <PageHeader
            logo={<Brand src={packitLogo} alt="Packit Logo" />}
            logoProps={logoProps}
            showNavToggle
            isNavOpen={isNavOpen}
            onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
            headerTools={HeaderTools}
        />
    );
    const Navigation = (
        <Nav id="nav-primary-simple" theme="dark">
            <NavList id="nav-list-simple">
                {routes[0].children?.map(
                    (route, index) =>
                        route.handle?.label && (
                            <NavItem
                                key={route.handle.label}
                                isActive={
                                    activeLocationLabel === route.handle.label
                                }
                            >
                                <NavLink
                                    itemID={index.toString()}
                                    to={route.path ?? ""}
                                >
                                    {route.handle.label}
                                </NavLink>
                            </NavItem>
                        ),
                )}
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
            </NavList>
        </Nav>
    );
    const Sidebar = (
        <PageSidebar
            theme="dark"
            nav={Navigation}
            isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen}
        />
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
            onPageResize={onPageResize}
            skipToContent={PageSkipToContent}
        >
            <Outlet />
        </Page>
    );
};

export { AppLayout };

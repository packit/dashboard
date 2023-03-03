import { NavLink, Outlet, matchRoutes, useLocation } from "react-router-dom";
import {
    Brand,
    Nav,
    NavList,
    NavItem,
    Page,
    PageHeader,
    PageSidebar,
    SkipToContent,
} from "@patternfly/react-core";
import { routes } from "../routes";
import packitLogo from "../static/logo.png";
import { useState, useEffect } from "react";

const AppLayout = () => {
    const location = useLocation();
    const [activeLocationLabel, setActiveLocationLabel] = useState("");
    const currentRouteTree = matchRoutes(routes, location);
    // Dynamically set page title and update currently active page in sidebar
    useEffect(() => {
        // it matches everything that has to do with the current URL. Start from the leaf and work up to set title if at all.
        for (let index = currentRouteTree.length - 1; index >= 0; index--) {
            const element = currentRouteTree[index];
            if (element.route.label) {
                setActiveLocationLabel(element.route.label);
            }
            if (element.route?.title) {
                document.title = element.route.title;
                break;
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
    const onPageResize = (props) => {
        setIsMobileView(props.mobileView);
    };
    const Header = (
        <PageHeader
            logo={<Brand src={packitLogo} alt="Packit Logo" />}
            logoProps={logoProps}
            showNavToggle
            isNavOpen={isNavOpen}
            onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
        />
    );
    const Navigation = (
        <Nav id="nav-primary-simple" theme="dark">
            <NavList id="nav-list-simple">
                {routes[0].children.map(
                    (route, index) =>
                        route.label && (
                            <NavItem
                                key={route.label}
                                isActive={activeLocationLabel === route.label}
                            >
                                <NavLink itemID={index} to={route.path}>
                                    {route.label}
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

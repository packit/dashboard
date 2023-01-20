import * as React from "react";
import { NavLink } from "react-router-dom";
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

const AppLayout = ({ children }) => {
    const logoProps = {
        href: "/",
    };
    const [isNavOpen, setIsNavOpen] = React.useState(true);
    const [isMobileView, setIsMobileView] = React.useState(true);
    const [isNavOpenMobile, setIsNavOpenMobile] = React.useState(false);
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
                {routes.map(
                    (route, idx) =>
                        route.label && (
                            <NavItem
                                key={`${route.label}-${idx}`}
                                id={`${route.label}-${idx}`}
                            >
                                <NavLink
                                    exact="true"
                                    to={route.path}
                                    className={({ isActive }) =>
                                        isActive ? "pf-m-current" : ""
                                    }
                                >
                                    {route.label}
                                </NavLink>
                            </NavItem>
                        )
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
            {children}
        </Page>
    );
};

export { AppLayout };

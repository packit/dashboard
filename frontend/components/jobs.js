import * as React from "react";
import {
    PageSection,
    PageSectionVariants,
    Title,
    Tabs,
    Tab,
    TabTitleText,
    Checkbox,
    TextContent,
    Card,
    CardBody,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbHeading,
} from "@patternfly/react-core";
import { render } from "react-dom";
import TestingFarmResultsTable from "./tf_results_table";
import CoprBuildsTable from "./copr_builds_table";

const SimpleBreadcrumbs = () => (
    <Breadcrumb>
        <BreadcrumbItem to="#">Home</BreadcrumbItem>
        <BreadcrumbItem to="#" isActive>
            Jobs
        </BreadcrumbItem>
    </Breadcrumb>
);

const Jobs = () => {
    // state = {
    //     activeTabKey: 0,
    // };
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex)
    };
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                {/* <SimpleBreadcrumbs /> */}

                <TextContent>
                    <Text component="h1">Jobs</Text>
                    <Text component="p">List of jobs by Packit Service</Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        <Tabs
                            isFilled
                            activeKey={activeTabKey}
                            onSelect={handleTabClick}
                            isBox={true}
                        >
                            <Tab
                                eventKey={0}
                                title={<TabTitleText>Copr Builds</TabTitleText>}
                            >
                                <CoprBuildsTable/>
                            </Tab>
                            <Tab
                                eventKey={1}
                                title={<TabTitleText>Koji Builds</TabTitleText>}
                            >
                                Koji Builds
                            </Tab>
                            <Tab
                                eventKey={2}
                                title={<TabTitleText>Test Runs</TabTitleText>}
                            >
                                <TestingFarmResultsTable/>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { Jobs };

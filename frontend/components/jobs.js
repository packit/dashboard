import * as React from "react";
import {
    PageSection,
    PageSectionVariants,
    Tabs,
    Tab,
    TabTitleText,
    TextContent,
    Card,
    CardBody,
    Text,
} from "@patternfly/react-core";
import TestingFarmResultsTable from "./tf_results_table";
import CoprBuildsTable from "./copr_builds_table";

const Jobs = () => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
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
                                <CoprBuildsTable />
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
                                <TestingFarmResultsTable />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { Jobs };

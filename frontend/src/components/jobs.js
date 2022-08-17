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
import TestingFarmResultsTable from "./tables/testing_farm";
import CoprBuildsTable from "./tables/copr";
import KojiBuildsTable from "./tables/koji";
import SRPMBuildsTable from "./tables/srpm";
import ProposeDownstreamTable from "./tables/propose_downstream";

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
                            mountOnEnter
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
                                <KojiBuildsTable />
                            </Tab>
                            <Tab
                                eventKey={2}
                                title={<TabTitleText>SRPM Builds</TabTitleText>}
                            >
                                <SRPMBuildsTable />
                            </Tab>
                            <Tab
                                eventKey={3}
                                title={<TabTitleText>Test Runs</TabTitleText>}
                            >
                                <TestingFarmResultsTable />
                            </Tab>
                            <Tab
                                eventKey={4}
                                title={
                                    <TabTitleText>
                                        Propose Downstreams
                                    </TabTitleText>
                                }
                            >
                                <ProposeDownstreamTable />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { Jobs };

import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    Tabs,
    Tab,
    Card,
    CardBody,
} from "@patternfly/react-core";

import UsageComponent from "./tables/usage";

const Usage = () => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Usage</Text>
                    <Text component="p">Usage of Packit Service.</Text>
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
                            <Tab eventKey={0} title="Last day">
                                <UsageComponent what="last-day" />
                            </Tab>
                            <Tab eventKey={1} title="Last week">
                                <UsageComponent what="last-week" />
                            </Tab>
                            <Tab eventKey={2} title="Last month">
                                <UsageComponent what="last-month" />
                            </Tab>
                            <Tab eventKey={3} title="Last year">
                                <UsageComponent what="last-year" />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export default Usage;

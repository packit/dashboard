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
                            <Tab eventKey={0} title="Past day">
                                <UsageComponent what="past-day" />
                            </Tab>
                            <Tab eventKey={1} title="Past week">
                                <UsageComponent what="past-week" />
                            </Tab>
                            <Tab eventKey={2} title="Past month">
                                <UsageComponent what="past-month" />
                            </Tab>
                            <Tab eventKey={3} title="Past year">
                                <UsageComponent what="past-year" />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export default Usage;

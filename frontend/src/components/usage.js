import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
} from "@patternfly/react-core";

import UsageComponent from "./tables/usage";

const Usage = () => {
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Usage</Text>
                    <Text component="p">Usage of Packit Service.</Text>
                </TextContent>
            </PageSection>
            <UsageComponent />
        </div>
    );
};

export default Usage;

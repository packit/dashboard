import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
} from "@patternfly/react-core";

import UsageTable from "./tables/usage";

const Usage = () => {
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Usage</Text>
                    <Text component="p">Usage of Packit Service.</Text>
                </TextContent>
            </PageSection>
            <UsageTable />
        </div>
    );
};

export default Usage;

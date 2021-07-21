import React, { useState } from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    Label,
} from "@patternfly/react-core";

import ProjectsList from "./projects_list";
import ForgeIcon from "./forge_icon";

const Forge = (props) => {
    let forge = props.match.params.forge;

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="p">
                        <ForgeIcon url={`https://${forge}`} /> {forge}
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <ProjectsList forge={forge} />
            </PageSection>
        </div>
    );
};

export { Forge };

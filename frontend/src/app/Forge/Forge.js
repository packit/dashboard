import {
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
} from "@patternfly/react-core";
import React from "react";

import { useParams } from "react-router-dom";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { ProjectsList } from "../Projects/ProjectsList";

const Forge = () => {
    let { forge } = useParams();

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

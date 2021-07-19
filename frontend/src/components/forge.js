import React, { useState } from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    Label,
} from "@patternfly/react-core";

import { GithubIcon } from "@patternfly/react-icons";

import ProjectsList from "./projects_list";

const Forge = (props) => {
    let forge = props.match.params.forge;

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="p">
                        <Label color="blue" icon={<GithubIcon />}>
                            {forge}
                        </Label>
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

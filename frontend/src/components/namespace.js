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

const Namespace = (props) => {
    let forge = props.match.params.forge;
    let namespace = props.match.params.namespace;

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">{namespace}</Text>
                    <Text component="p">
                        <Label color="blue" icon={<GithubIcon />}>
                            {forge}
                        </Label>
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <ProjectsList forge={forge} namespace={namespace} />
            </PageSection>
        </div>
    );
};

export { Namespace };

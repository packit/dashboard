import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
} from "@patternfly/react-core";

import { ProjectSearch } from "./ProjectSearch";
import { ProjectsList } from "./ProjectsList";

const Projects = () => {
    return (
        <>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Projects</Text>
                    <Text component="p">
                        List of repos with Packit Service enabled
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <ProjectSearch />
            </PageSection>
            <PageSection>
                <ProjectsList />
            </PageSection>
        </>
    );
};

export { Projects };

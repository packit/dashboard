import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
} from "@patternfly/react-core";

import SearchProject from "./search_project";
import ProjectsList from "./projects_list";
const Projects = () => {
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Projects</Text>
                    <Text component="p">
                        List of repos with Packit Service enabled
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <SearchProject />
            </PageSection>
            <PageSection>
                <ProjectsList />
            </PageSection>
        </div>
    );
};

export { Projects };

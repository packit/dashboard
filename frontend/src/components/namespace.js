import React from "react";
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    Label,
} from "@patternfly/react-core";

import ForgeIcon from "./forge_icon";
import ProjectsList from "./projects_list";
import { useParams } from "react-router-dom";

const Namespace = () => {
    let { forge, namespace } = useParams();

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">{namespace}</Text>
                    <Text component="p">
                        <Label
                            color="blue"
                            icon={<ForgeIcon url={`https://${forge}`} />}
                        >
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

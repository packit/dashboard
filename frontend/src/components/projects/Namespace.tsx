// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Label,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { Route as NamespaceRoute } from "../../routes/projects/$forge.$namespace_.lazy";
import { ForgeIcon } from "../icons/ForgeIcon";
import { ProjectsList } from "./ProjectsList";

const Namespace = () => {
  const { forge, namespace } = NamespaceRoute.useParams();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{namespace}</Text>
          <Text component="p">
            <Label color="blue" icon={<ForgeIcon url={`https://${forge}`} />}>
              {forge}
            </Label>
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <ProjectsList forge={forge} namespace={namespace} />
      </PageSection>
    </>
  );
};

export { Namespace };

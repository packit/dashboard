// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Content, Label, PageSection } from "@patternfly/react-core";

import { Route as NamespaceRoute } from "../../routes/projects/$forge.$namespace_.lazy";
import { ForgeIcon } from "../icons/ForgeIcon";
import { ProjectsList } from "./ProjectsList";

const Namespace = () => {
  const { forge, namespace } = NamespaceRoute.useParams();

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">{namespace}</Content>
          <Content component="p">
            <Label color="blue" icon={<ForgeIcon url={`https://${forge}`} />}>
              {forge}
            </Label>
          </Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <ProjectsList forge={forge} namespace={namespace} />
      </PageSection>
    </>
  );
};

export { Namespace };

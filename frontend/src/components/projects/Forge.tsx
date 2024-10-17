// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Content, PageSection } from "@patternfly/react-core";
import { Route as ForgeRoute } from "../../routes/projects/$forge_.lazy";
import { ForgeIcon } from "../icons/ForgeIcon";
import { ProjectsList } from "./ProjectsList";

const Forge = () => {
  const { forge } = ForgeRoute.useParams();

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="p">
            <ForgeIcon url={`https://${forge}`} /> {forge}
          </Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <ProjectsList forge={forge} />
      </PageSection>
    </>
  );
};

export { Forge };

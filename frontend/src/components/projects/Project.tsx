// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Card, CardBody, Content, PageSection } from "@patternfly/react-core";
import React from "react";

import { Route as ProjectRoute } from "../../routes/projects/$forge.$namespace.$repo.lazy";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectForgeLink } from "./ProjectForgeLink";

export const Project = () => {
  const params = ProjectRoute.useParams();

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">{`${params.namespace}/${params.repo}`}</Content>
          <Content component="p">
            <ProjectForgeLink {...params} />
          </Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <ProjectDetail {...params} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

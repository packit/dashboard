// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  Card,
  CardBody,
  TextContent,
} from "@patternfly/react-core";

import { Route as ProjectRoute } from "../../routes/projects/$forge.$namespace.$repo.lazy";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectForgeLink } from "./ProjectForgeLink";

export const Project = () => {
  const params = ProjectRoute.useParams();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{`${params.namespace}/${params.repo}`}</Text>
          <Text component="p">
            <ProjectForgeLink {...params} />
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <ProjectDetail {...params} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

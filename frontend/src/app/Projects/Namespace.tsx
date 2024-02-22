// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Label,
} from "@patternfly/react-core";

import { ForgeIcon } from "../Forge/ForgeIcon";
import { ProjectsList } from "./ProjectsList";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";

const Namespace = () => {
  useTitle("Project Namespace");

  let { forge, namespace } = useParams();

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

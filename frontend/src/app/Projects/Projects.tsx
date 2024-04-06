// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  PageGroup,
} from "@patternfly/react-core";

import { ProjectSearch } from "./ProjectSearch";
import { ProjectsList } from "./ProjectsList";
import { useTitle } from "../utils/useTitle";

const Projects = () => {
  useTitle("Projects");
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Projects</Text>
          <Text component="p">
            List of repositories with Packit Service enabled
          </Text>
        </TextContent>
      </PageSection>
      <PageGroup>
        <PageSection>
          <ProjectSearch />
          <ProjectsList />
        </PageSection>
      </PageGroup>
    </>
  );
};

export { Projects };

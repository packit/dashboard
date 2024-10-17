// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Content, PageGroup, PageSection } from "@patternfly/react-core";

import { ProjectSearch } from "./ProjectSearch";
import { ProjectsList } from "./ProjectsList";

const Projects = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Projects</Content>
          <Content component="p">
            List of repositories with Packit Service enabled
          </Content>
        </Content>
      </PageSection>
      <PageGroup>
        <PageSection hasBodyWrapper={false}>
          <ProjectSearch />
          <ProjectsList />
        </PageSection>
      </PageGroup>
    </>
  );
};

export { Projects };

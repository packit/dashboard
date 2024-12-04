// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Content, PageGroup, PageSection } from "@patternfly/react-core";

import { useState } from "react";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectsList } from "./ProjectsList";

const Projects = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  return (
    <PackitPaginationContext.Provider value={value}>
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
          <PackitPagination />
          <ProjectsList />
        </PageSection>
      </PageGroup>
    </PackitPaginationContext.Provider>
  );
};

export { Projects };

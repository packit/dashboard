// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useContext, useMemo, useState } from "react";

import {
  BlueprintIcon,
  BuildIcon,
  CodeBranchIcon,
  SecurityIcon,
} from "@patternfly/react-icons";

import { SkeletonTable } from "@patternfly/react-component-groups";
import {
  Table /* data-codemods */,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Project } from "../../apiDefinitions";
import { projectsQueryOptions } from "../../queries/project/projectsQuery";
import { LoadMore } from "../shared/LoadMore";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";

function getProjectInfoURL(project: Project) {
  const urlArray = project.project_url?.split("/");
  const forge = urlArray[2];
  return `/projects/${forge}/${project.namespace}/${project.repo_name}`;
}

interface ProjectsListProps {
  forge?: string;
  namespace?: string;
  project_url?: string;
  repo_name?: string;
}

const columnNames = {
  name: "Repositories",
  branches: "Branches",
  issues: "Issues",
  releases: "Releases",
  prs: "Pull requests",
  workspaces: "Workspaces",
  lastCommit: "Last commit",
};

type ColumnKey = keyof typeof columnNames;

const ProjectsList: React.FC<ProjectsListProps> = ({ forge, namespace }) => {
  const { page, perPage } = useContext(PackitPaginationContext);
  const queryOptions = projectsQueryOptions(page, perPage, forge, namespace);
  const { data, isLoading } = useQuery(queryOptions);
  const expandedCells: Record<string, ColumnKey> = {};

  // Headings
  const columnNames = {
    repositories: "Repositories",
    branchesHandled: "Branches Handled",
    issuesHandled: "Issues Handled",
    releasesHandled: "Releases Handled",
    prsHandled: "Pull Requests Handled",
    externalProjectLink: "External Project Link",
  };

  const TableHeads = [
    <Th width={25} key={columnNames.repositories}>
      {columnNames.repositories}
    </Th>,
    <Th width={10} key={columnNames.branchesHandled}>
      {columnNames.branchesHandled}
    </Th>,
    <Th width={10} key={columnNames.issuesHandled}>
      {columnNames.issuesHandled}
    </Th>,
    <Th width={10} key={columnNames.releasesHandled}>
      {columnNames.releasesHandled}
    </Th>,
    <Th width={15} key={columnNames.prsHandled}>
      {columnNames.prsHandled}
    </Th>,
    <Th width={10} key={columnNames.externalProjectLink}>
      <span className="pf-v6-u-screen-reader">
        {columnNames.externalProjectLink}
      </span>
    </Th>,
  ];

  if (isLoading) {
    return <SkeletonTable rowsCount={perPage} columns={TableHeads} />;
  }

  return (
    <>
      <Table aria-label="Projects">
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        {data?.map((project) => {
          const expandedCellKey = expandedCells
            ? expandedCells[project.repo_name]
            : null;
          const isRowExpanded = !!expandedCellKey;
          return (
            <Tbody key={project.repo_name} isExpanded={isRowExpanded}>
              <Tr>
                <Td
                  width={25}
                  dataLabel={columnNames.repositories}
                  component="th"
                >
                  <Link to={getProjectInfoURL(project)}>
                    {`${project.namespace}/${project.repo_name}`}
                  </Link>
                </Td>
                <Td
                  width={10}
                  dataLabel={columnNames.branchesHandled}
                  // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                >
                  <span>
                    <CodeBranchIcon key="icon" />
                    &nbsp;
                    {project.branches_handled}
                  </span>
                </Td>
                <Td
                  width={10}
                  dataLabel={columnNames.issuesHandled}
                  // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                >
                  <span>
                    <SecurityIcon key="icon" />
                    &nbsp;
                    {project.issues_handled}
                  </span>
                </Td>
                <Td
                  width={10}
                  dataLabel={columnNames.releasesHandled}
                  // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                >
                  <span>
                    <BuildIcon key="icon" />
                    &nbsp;
                    {project.releases_handled}
                  </span>
                </Td>
                <Td
                  width={15}
                  dataLabel={columnNames.prsHandled}
                  // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                >
                  <span>
                    <BlueprintIcon key="icon" />
                    &nbsp;
                    {project.prs_handled}
                  </span>
                </Td>
                <Td dataLabel={columnNames.externalProjectLink}>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`External link to ${project.namespace}/${project.repo_name}`}
                  >
                    Open external link
                  </a>
                </Td>
              </Tr>
            </Tbody>
          );
        })}
      </Table>
    </>
  );
};

export { ProjectsList };

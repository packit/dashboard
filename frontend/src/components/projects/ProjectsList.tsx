// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@patternfly/react-core";

import {
  CodeBranchIcon,
  SecurityIcon,
  BuildIcon,
  BlueprintIcon,
} from "@patternfly/react-icons";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  Table /* data-codemods */,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { projectQueryOptions } from "../../queries/projectsQuery";
import { Link } from "@tanstack/react-router";
import { Project } from "../../apiDefinitions";

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
  const projectsQuery = useSuspenseInfiniteQuery(
    projectQueryOptions(forge, namespace),
  );
  const projectsPages = projectsQuery.data;
  const expandedCells: Record<string, ColumnKey> = {};

  function fetchNextPage() {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Table aria-label="Projects">
        <Thead>
          <Tr>
            <Th>Repositories</Th>
            <Th>Branches Handled</Th>
            <Th>Issues Handled</Th>
            <Th>Releases Handled</Th>
            <Th>Pull Requests Handled</Th>
            <Th />
          </Tr>
        </Thead>
        {projectsPages?.pages ? (
          [...projectsPages.pages].map((projects) =>
            [...projects].map((project) => {
              const expandedCellKey = expandedCells
                ? expandedCells[project.repo_name]
                : null;
              const isRowExpanded = !!expandedCellKey;
              return (
                <Tbody key={project.repo_name} isExpanded={isRowExpanded}>
                  <Tr>
                    <Td width={25} dataLabel={columnNames.name} component="th">
                      <Link to={getProjectInfoURL(project)}>
                        {`${project.namespace}/${project.repo_name}`}
                      </Link>
                    </Td>
                    <Td
                      width={10}
                      dataLabel={columnNames.branches}
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
                      dataLabel={columnNames.issues}
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
                      dataLabel={columnNames.releases}
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
                      dataLabel={columnNames.prs}
                      // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                    >
                      <span>
                        <BlueprintIcon key="icon" />
                        &nbsp;
                        {project.prs_handled}
                      </span>
                    </Td>
                    <Td dataLabel="External">
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="External link to project"
                      >
                        Open external link
                      </a>
                    </Td>
                  </Tr>
                </Tbody>
              );
            }),
          )
        ) : (
          <>No pages</>
        )}
      </Table>
      <center>
        <br />
        <Button variant="control" onClick={() => void fetchNextPage()}>
          Load More
        </Button>
      </center>
    </>
  );
};

export { ProjectsList };

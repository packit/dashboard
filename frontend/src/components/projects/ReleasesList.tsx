// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getReleaseLink, getCommitLink } from "../forgeUrls";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { projectReleasesQueryOptions } from "../../queries/project/projectReleasesQuery";

interface ReleasesListProps {
  forge: string;
  namespace: string;
  repo: string;
}

const ReleasesList: React.FC<ReleasesListProps> = (props) => {
  const { data } = useQuery(projectReleasesQueryOptions(props));

  return (
    <Table variant="compact">
      <Thead>
        <Tr>
          <Th>Tag</Th>
          <Th>Commit Hash</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((release, index) => (
          <Tr key={index}>
            <Td role="cell" data-label="Tag">
              <a
                href={getReleaseLink(
                  `https://${props.forge}/${props.namespace}/${props.repo}`,
                  release.tag_name,
                )}
                rel="noreferrer"
                target="_blank"
              >
                {release.tag_name}
              </a>
            </Td>
            <Td role="cell" data-label="Commit Hash">
              <a
                href={getCommitLink(
                  `https://${props.forge}/${props.namespace}/${props.repo}`,
                  release.commit_hash,
                )}
                rel="noreferrer"
                target="_blank"
              >
                {release.commit_hash}
              </a>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export { ReleasesList };

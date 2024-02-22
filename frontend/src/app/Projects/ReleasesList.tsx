// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { useQuery } from "@tanstack/react-query";
import { getReleaseLink, getCommitLink } from "../utils/forgeUrls";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

// Fetch data from dashboard backend (or if we want, directly from the API)
async function fetchData(URL: string): Promise<ProjectRelease[]> {
  return fetch(URL).then((response) => response.json());
}

interface ProjectRelease {
  commit_hash: string;
  tag_name: string;
}

interface ReleasesListProps {
  forge: string;
  namespace: string;
  repoName: string;
}

const ReleasesList: React.FC<ReleasesListProps> = ({
  forge,
  namespace,
  repoName,
}) => {
  const URL = `${
    import.meta.env.VITE_API_URL
  }/projects/${forge}/${namespace}/${repoName}/releases`;
  const { data, isError, isInitialLoading } = useQuery([URL], () =>
    fetchData(URL),
  );

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isInitialLoading) {
    return <Preloader />;
  }

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
                  `https://${forge}/${namespace}/${repoName}`,
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
                  `https://${forge}/${namespace}/${repoName}`,
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

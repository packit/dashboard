// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo, useState } from "react";

import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Preloader } from "../../components/Preloader";
import { TriggerInfo } from "../Trigger/TriggerInfo";

import {
  Button,
  DataList,
  DataListToggle,
  DataListCell,
  DataListItem,
  DataListContent,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { getPRLink } from "../utils/forgeUrls";
import { useInfiniteQuery } from "@tanstack/react-query";

interface CoprBuild {
  build_id: string;
  chroot: string;
  status: string;
  web_url: string;
}
interface SRPMBuild {
  srpm_build_id: number;
  status: string;
  log_url: string;
}
interface TestingFarmRun {
  pipeline_id: string;
  chroot: string;
  status: string;
  web_url: string;
}
interface PullRequestInfo {
  pr_id: number;
  builds: CoprBuild[];
  koji_builds: []; // TODO
  srpm_builds: SRPMBuild[];
  tests: TestingFarmRun[];
}

async function fetchData(
  URL: string,
  page: string,
): Promise<PullRequestInfo[]> {
  const response = await fetch(`${URL}?page=${page}&per_page=10`);
  return await response.json();
}
interface PullRequestListProps {
  forge: string;
  namespace: string;
  repoName: string;
}

const PullRequestList: React.FC<PullRequestListProps> = ({
  forge,
  namespace,
  repoName,
}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const URL = `${
    import.meta.env.VITE_API_URL
  }/projects/${forge}/${namespace}/${repoName}/prs`;
  // Fetch data from dashboard backend (or if we want, directly from the API)
  const { data, isInitialLoading, isError, fetchNextPage } = useInfiniteQuery(
    [URL],
    ({ pageParam = 1 }) => fetchData(URL, pageParam),
    {
      getNextPageParam: (_, allPages) => allPages.length + 1,
      keepPreviousData: true,
    },
  );

  const flatPages = useMemo(() => data?.pages.flat(), [data?.pages]);

  function onToggle(prID: number) {
    // We cant just invert the previous state here
    // because its undefined for the first time
    if (expanded[prID]) {
      const copyExpanded = { ...expanded };
      copyExpanded[prID] = false;
      setExpanded(copyExpanded);
    } else {
      const copyExpanded = { ...expanded };
      copyExpanded[prID] = true;
      setExpanded(copyExpanded);
    }
  }

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isInitialLoading) {
    return <Preloader />;
  }

  return (
    <>
      <DataList aria-label="PR List" isCompact>
        {flatPages?.map((pr, index) => (
          <DataListItem
            aria-labelledby="PR List Item"
            key={index}
            isExpanded={expanded[pr.pr_id]}
          >
            <DataListItemRow>
              <DataListToggle
                onClick={() => onToggle(pr.pr_id)}
                isExpanded={expanded[pr.pr_id]}
                id={`pull-request-${pr.pr_id}`}
                aria-controls="ex-expand1"
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="data-list-title-pr">
                    <a
                      href={getPRLink(
                        `https://${forge}/${namespace}/${repoName}`,
                        pr.pr_id,
                      )}
                      rel="noreferrer"
                      target="_blank"
                    >
                      #{pr.pr_id}
                    </a>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
            <DataListContent
              aria-label="PR Content"
              id="ex-expand1"
              isHidden={!expanded[pr.pr_id]}
            >
              <TriggerInfo trigger={pr} />
            </DataListContent>
          </DataListItem>
        ))}
      </DataList>
      <center>
        <br />
        <Button variant="control" onClick={() => void fetchNextPage()}>
          Load More
        </Button>
      </center>
    </>
  );
};

export { PullRequestList };

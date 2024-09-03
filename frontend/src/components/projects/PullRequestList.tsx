// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState } from "react";

import { TriggerInfo } from "../trigger/TriggerInfo";

import {
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { projectPRsQueryOptions } from "../../queries/project/projectPRsQuery";
import { getPRLink } from "../forgeUrls";

interface PullRequestListProps {
  forge: string;
  namespace: string;
  repo: string;
}

const PullRequestList: React.FC<PullRequestListProps> = (props) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // Fetch data from dashboard backend (or if we want, directly from the API)
  const { data } = useQuery(projectPRsQueryOptions(props));

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

  return (
    <DataList aria-label="PR List" isCompact>
      {data?.map((pr) => (
        <DataListItem
          aria-labelledby="PR List Item"
          key={pr.pr_id}
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
                      `https://${props.forge}/${props.namespace}/${props.repo}`,
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
  );
};

export { PullRequestList };

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState, useId } from "react";

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
import { projectBranchesQueryOptions } from "../../queries/project/projectBranchesQuery";
import { getBranchLink } from "../forgeUrls";
import { TriggerInfo } from "../trigger/TriggerInfo";

interface BranchListProps {
  forge: string;
  namespace: string;
  repo: string;
}

const BranchList: React.FC<BranchListProps> = (props) => {
  // Local State
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const id = useId();

  const { data } = useQuery(projectBranchesQueryOptions(props));

  function onToggle(branchName: string) {
    // We cant just invert the previous state here
    // because its undefined for the first time
    if (expanded[branchName]) {
      const copyExpanded = { ...expanded };
      copyExpanded[branchName] = false;
      setExpanded(copyExpanded);
    } else {
      const copyExpanded = { ...expanded };
      copyExpanded[branchName] = true;
      setExpanded(copyExpanded);
    }
  }

  return (
    <>
      <DataList aria-label="Branch List" isCompact>
        {data?.map((branch, index) => (
          <DataListItem
            aria-label={`Branch ${branch.branch}`}
            key={index}
            isExpanded={expanded[branch.branch]}
          >
            <DataListItemRow>
              <DataListToggle
                onClick={() => onToggle(branch.branch)}
                isExpanded={expanded[branch.branch]}
                id={`${id}-branch-${branch.branch}`}
                aria-controls={`${id}-ex-expand-${branch.branch}`}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="Branch Name">
                    <a
                      href={getBranchLink(
                        `https://${props.forge}/${props.namespace}/${props.repo}`,
                        branch.branch,
                      )}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {branch.branch}
                    </a>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
            <DataListContent
              aria-label={`Branch ${branch.branch}`}
              id={`${id}-ex-expand-${branch.branch}`}
              isHidden={!expanded[branch.branch]}
            >
              <TriggerInfo trigger={branch} />
            </DataListContent>
          </DataListItem>
        ))}
      </DataList>
    </>
  );
};

export { BranchList };

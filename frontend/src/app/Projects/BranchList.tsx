import React, { useState, useId } from "react";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerInfo } from "../Trigger/TriggerInfo";

import {
  DataList,
  DataListToggle,
  DataListCell,
  DataListItem,
  DataListContent,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { getBranchLink } from "../utils/forgeUrls";

interface CoprBuild {
  build_id: string;
  chroot: string;
  status: string;
  web_url: string;
}
interface KojiBuild {
  build_id: string;
  status: string;
  chroot: string;
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
interface ProjectBranchInfo {
  branch: string;
  builds: CoprBuild[];
  koji_builds: KojiBuild[];
  srpm_builds: SRPMBuild[];
  tests: TestingFarmRun[];
}

const fetchBranchList = async (url: string): Promise<ProjectBranchInfo[]> => {
  const res = await fetch(url);
  return await res.json();
};

interface BranchListProps {
  forge: string;
  namespace: string;
  repoName: string;
}

const BranchList: React.FC<BranchListProps> = (props) => {
  // Local State
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const id = useId();

  // Repo Info
  const forge = props.forge;
  const namespace = props.namespace;
  const repoName = props.repoName;
  const URL = `${
    import.meta.env.VITE_API_URL
  }/projects/${forge}/${namespace}/${repoName}/branches`;

  const { data, isError, isInitialLoading } = useQuery([URL], () =>
    fetchBranchList(URL),
  );

  function onToggle(branchName: string) {
    // We cant just invert the previous state here
    // because its undefined for the first time
    if (expanded[branchName]) {
      let copyExpanded = { ...expanded };
      copyExpanded[branchName] = false;
      setExpanded(copyExpanded);
    } else {
      let copyExpanded = { ...expanded };
      copyExpanded[branchName] = true;
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
    <div>
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
                        `https://${forge}/${namespace}/${repoName}`,
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
    </div>
  );
};

export { BranchList };

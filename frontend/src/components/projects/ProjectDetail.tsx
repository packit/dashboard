// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";

import { IssuesList } from "./IssuesList";
import { PullRequestList } from "./PullRequestList";
import { ReleasesList } from "./ReleasesList";
import { BranchList } from "./BranchList";

export const ProjectDetail: React.FC<{
  forge: string;
  namespace: string;
  repo: string;
}> = ({ forge, namespace, repo }) => {
  // TODO: Change tabs around so we can update URL instead with Outlet
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string,
  ) => {
    setActiveTabKey(eventKey);
  };

  // TODO: Project URL from response?
  return (
    <>
      <Tabs
        isFilled
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        isBox={true}
      >
        <Tab eventKey={0} title={<TabTitleText>PRs Handled</TabTitleText>}>
          <PullRequestList repo={repo} namespace={namespace} forge={forge} />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Releases Handled</TabTitleText>}>
          <ReleasesList repo={repo} namespace={namespace} forge={forge} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Branches Handled</TabTitleText>}>
          <BranchList repo={repo} namespace={namespace} forge={forge} />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Issues Handled</TabTitleText>}>
          <IssuesList repo={repo} namespace={namespace} forge={forge} />
        </Tab>
      </Tabs>
    </>
  );
};

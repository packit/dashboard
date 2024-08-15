// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import {
  getPRLink,
  getBranchLink,
  getIssueLink,
  getReleaseLink,
} from "../forgeUrls";

interface TriggerLinkProps {
  trigger: {
    project_url?: string;
    pr_id?: number | null;
    issue_id?: number | null;
    branch_name?: string | null;
    release?: string | null;
  };
  children?: React.ReactNode;
}

const TriggerLink: React.FC<TriggerLinkProps> = ({ trigger, children }) => {
  let link = "";
  const gitRepo = trigger.project_url ? trigger.project_url : "";

  if (trigger.pr_id) {
    link = getPRLink(gitRepo, trigger.pr_id);
  } else if (trigger.issue_id) {
    link = getIssueLink(gitRepo, trigger.issue_id);
  } else if (trigger.branch_name) {
    link = getBranchLink(gitRepo, trigger.branch_name);
  } else if (trigger.release) {
    link = getReleaseLink(gitRepo, trigger.release);
  }

  if (link) {
    return (
      <a target="_blank" href={link} rel="noreferrer">
        {children}
      </a>
    );
  }
  return children;
};

interface TriggerSuffixProps {
  trigger: {
    branch_name?: string | null;
    issue_id?: number | null;
    pr_id?: number | null;
    release?: string | null;
    repo_name: string;
    repo_namespace: string;
  };
}

const TriggerSuffix: React.FC<TriggerSuffixProps> = ({ trigger }) => {
  // set suffix to be either PR ID or Branch Name depending on trigger
  let jobSuffix = "";

  if (trigger.pr_id) {
    jobSuffix = `#${trigger.pr_id}`;
  } else if (trigger.issue_id) {
    jobSuffix = `#${trigger.issue_id}`;
  } else if (trigger.branch_name) {
    jobSuffix = `:${trigger.branch_name}`;
  } else if (trigger.release) {
    jobSuffix = `#release:${trigger.release}`;
  }

  return (
    <>
      {trigger.repo_namespace}/{trigger.repo_name}
      {jobSuffix}
    </>
  );
};

export { TriggerLink, TriggerSuffix };

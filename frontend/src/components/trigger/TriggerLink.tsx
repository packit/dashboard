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
    project_url?: string | null;
    git_repo?: string | null;
    pr_id?: number | null;
    issue_id?: number | null;
    branch_name?: string | null;
    release?: string | null;
  };
  children?: React.ReactNode;
}

const TriggerLink: React.FC<TriggerLinkProps> = ({ trigger, children }) => {
  let link = "";
  // different endpoints use "git_repo" or "project_url" to refer to the same thing
  let gitRepo = "";
  if (trigger.project_url) {
    gitRepo = trigger.project_url;
  } else if (trigger.git_repo) {
    gitRepo = trigger.git_repo;
  }

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
    repo_namespace: string;
    repo_name: string;
    pr_id?: number | null;
    issue_id?: number | null;
    branch_name?: string | null;
    release?: string | null;
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

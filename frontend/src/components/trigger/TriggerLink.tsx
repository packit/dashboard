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
    anitya_project_name?: string | null;
    anitya_version?: string | null;
    anitya_package?: string | null;
  };
  children?: React.ReactNode;
}

const TriggerLink: React.FC<TriggerLinkProps> = ({ trigger, children }) => {
  let link = "";
  const projectUrl = trigger.project_url ? trigger.project_url : "";

  if (trigger.pr_id) {
    link = getPRLink(projectUrl, trigger.pr_id);
  } else if (trigger.issue_id) {
    link = getIssueLink(projectUrl, trigger.issue_id);
  } else if (trigger.branch_name) {
    link = getBranchLink(projectUrl, trigger.branch_name);
  } else if (trigger.release) {
    link = getReleaseLink(projectUrl, trigger.release);
  } else if (trigger.anitya_version) {
    // there is no link to the particular version, just the whole project
    link = projectUrl;
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

interface TriggerSuffixInterface {
  branch_name?: string | null;
  issue_id?: number | null;
  pr_id?: number | null;
  release?: string | null;
}

interface TriggerSuffixGitRepo extends TriggerSuffixInterface {
  repo_name: string;
  repo_namespace: string;
  anitya_project_name?: string | null;
  anitya_version?: string | null;
  anitya_package?: string | null;
}

interface TriggerSuffixAnityaProject extends TriggerSuffixInterface {
  anitya_project_name: string;
  anitya_version: string;
  anitya_package: string;
  repo_name?: string | null;
  repo_namespace?: string | null;
}

type TriggerSuffixProps = {
  trigger: TriggerSuffixGitRepo | TriggerSuffixAnityaProject;
};

const TriggerSuffix: React.FC<TriggerSuffixProps> = ({ trigger }) => {
  let jobSuffix = "";

  if (isAnityaTrigger(trigger)) {
    jobSuffix = `#version:${trigger.anitya_version}`;
    return (
      <>
        {trigger.anitya_project_name}
        {jobSuffix}
      </>
    );
  } else if (trigger.pr_id) {
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

function isAnityaTrigger(
  trigger: TriggerSuffixProps["trigger"],
): trigger is TriggerSuffixAnityaProject {
  return (
    typeof trigger.anitya_version === "string" &&
    trigger.anitya_version.length > 0
  );
}
export { TriggerLink, TriggerSuffix };

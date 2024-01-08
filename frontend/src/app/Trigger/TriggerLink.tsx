import React from "react";
import {
  getPRLink,
  getBranchLink,
  getIssueLink,
  getReleaseLink,
} from "../utils/forgeUrls";

interface TriggerLinkProps {
  builds: {
    project_url?: string | null;
    repo_namespace: string;
    repo_name: string;
    git_repo?: string | null;
    pr_id?: number | null;
    issue_id?: number | null;
    branch_name?: string | null;
    release?: string | null;
  };
}

const TriggerLink: React.FC<TriggerLinkProps> = (props) => {
  let link = "";
  // set suffix to be either PR ID or Branch Name depending on trigger
  let jobSuffix = "";

  // different endpoints use "git_repo" or "project_url" to refer to the same thing
  let gitRepo = "";
  if (props.builds.project_url) {
    gitRepo = props.builds.project_url;
  } else if (props.builds.git_repo) {
    gitRepo = props.builds.git_repo;
  }

  if (props.builds.pr_id) {
    jobSuffix = `#${props.builds.pr_id}`;

    link = getPRLink(gitRepo, props.builds.pr_id);
  } else if (props.builds.issue_id) {
    jobSuffix = `#${props.builds.issue_id}`;

    link = getIssueLink(gitRepo, props.builds.issue_id);
  } else if (props.builds.branch_name) {
    jobSuffix = `:${props.builds.branch_name}`;

    link = getBranchLink(gitRepo, props.builds.branch_name);
  } else if (props.builds.release) {
    jobSuffix = `#release:${props.builds.release}`;

    link = getReleaseLink(gitRepo, props.builds.release);
  }

  if (link !== "") {
    return (
      <a target="_blank" href={link} rel="noreferrer">
        {props.builds.repo_namespace}/{props.builds.repo_name}
        {jobSuffix}
      </a>
    );
  } else {
    return (
      <>
        {props.builds.repo_namespace}/{props.builds.repo_name}
        {jobSuffix}
      </>
    );
  }
};

export { TriggerLink };

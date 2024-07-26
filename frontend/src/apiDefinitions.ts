// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

/**
 * This is a list of items from the Packit API
 */

// /api/project
export interface Project {
  namespace: string;
  repo_name: string;
  project_url: string;
  prs_handled: number;
  branches_handled: number;
  releases_handled: number;
  issues_handled: number;
}

// /api/project/$forge/$namespace/$repo
export interface ProjectDetails {
  namespace: string;
  repo_name: string;
  project_url: string;
  prs_handled: number;
  branches_handled: number;
  releases_handled: number;
  issues_handled: number;
}

// /api/copr-builds
export interface CoprBuild {
  packit_id: number;
  project: string;
  build_id: number;
  status_per_chroot: {
    [key: string]: string;
  };
  packit_id_per_chroot: {
    [key: string]: number;
  };
  build_submitted_time: number;
  web_url: string;
  ref: string;
  // TODO(SpyTec): change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  branch_name: string | null;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
}

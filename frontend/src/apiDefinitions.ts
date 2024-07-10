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

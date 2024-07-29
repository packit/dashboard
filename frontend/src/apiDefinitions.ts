// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

/**
 * This is a list of items from the Packit API
 */

// /api/project/$forge/$namespace/$repo
export interface Project {
  namespace: string;
  repo_name: string;
  project_url: string;
  prs_handled: number;
  branches_handled: number;
  releases_handled: number;
  issues_handled: number;
}

// /api/project/$forge/$namespace/$repo/issues
export type ProjectIssue = number;

// /api/project/$forge/$namespace/$repo/releases
export interface ProjectRelease {
  commit_hash: string;
  tag_name: string;
}

export interface CoprBuildShort {
  build_id: string;
  chroot: string;
  status: string;
  web_url: string;
}
export interface KojiBuildShort {
  build_id: string;
  status: string;
  chroot: string;
  web_url: string;
}
export interface SRPMBuildShort {
  srpm_build_id: number;
  status: string;
  log_url: string;
}

export interface TestingFarmRunShort {
  pipeline_id: string;
  chroot: string;
  status: string;
  web_url: string;
}

// /api/project/$forge/$namespace/$repo/branches
export interface ProjectBranch {
  branch: string;
  builds: CoprBuildShort[];
  koji_builds: KojiBuildShort[];
  srpm_builds: SRPMBuildShort[];
  tests: TestingFarmRunShort[];
}

// /api/project/$forge/$namespace/$repo/prs
export interface ProjectPRs {
  pr_id: number;
  builds: CoprBuildShort[];
  koji_builds: KojiBuildShort[];
  srpm_builds: SRPMBuildShort[];
  tests: TestingFarmRunShort[];
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
  // TODO - @Venefilyn: change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  branch_name: string | null;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
}

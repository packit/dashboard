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
export interface CoprBuildGroup {
  packit_id: number;
  project: string;
  build_id: number;
  status_per_chroot: {
    [key: string]: string; // TODO: @Venefilyn: Probably an enum right? Change to be one if so
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

export interface CoprBuildPackage {
  arch: string;
  epoch: number;
  name: string;
  release: string;
  version: string;
}

// /api/copr-builds/$id
export interface CoprBuild {
  build_id: string;
  status: string; // TODO: @Venefilyn: Probably an enum right? Change to be one if so
  chroot: string;
  build_submitted_time: number;
  build_start_time: number;
  build_finished_time: number;
  commit_sha: string;
  web_url: string;
  build_logs_url: string;
  copr_project: string;
  copr_owner: string;
  srpm_build_id: number;
  run_ids: number[];
  built_packages: CoprBuildPackage[];
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

// /api/koji-builds
export interface KojiBuildGroup {
  packit_id: number;
  task_id: string;
  status: string; // TODO: @Venefilyn: Probably an enum right? Change to be one if so
  build_submitted_time: number;
  chroot: string;
  web_url: string;
  build_logs_urls: string;
  // TODO: @Venefilyn: change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  branch_name: string | null;
  release: string | null;
  project_url: string;
  repo_namespace: string;
  repo_name: string;
}

// /api/koji-builds/$id
export interface KojiBuild {
  scratch: boolean;
  task_id: string;
  status: string; // TODO: @Venefilyn: Probably an enum right? Change to be one if so
  chroot: string;
  build_start_time: number;
  build_finished_time: number;
  build_submitted_time: number;
  commit_sha: string;
  web_url: string;
  build_logs_urls: string;
  srpm_build_id: number;
  run_ids: number[];
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  // TODO: @Venefilyn: change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

// /api/srpm-builds
export interface SRPMBuildGroup {
  srpm_build_id: number;
  status: string; // TODO: @Venefilyn: Probably an enum right? Change to be one if so
  log_url: string;
  build_submitted_time: number;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
  // TODO: @Venefilyn: change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  branch_name: string | null;
}

// /api/srpm-builds/$id
export interface SRPMBuild {
  status: string;
  build_start_time: number;
  build_finished_time: number;
  build_submitted_time: number;
  url: string;
  logs: string | null;
  logs_url: string;
  copr_build_id: string;
  copr_web_url: string;
  run_ids: number[];
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

// /api/bodhi-updates
export interface BodhiUpdateGroup {
  packit_id: number;
  status: string;
  alias: string | null;
  web_url: string | null;
  branch: string;
  submitted_time: number;
  update_creation_time: number | null;
  pr_id: number | null;
  branch_name: string | null;
  release: string | null;
  project_url: string;
  repo_namespace: string;
  repo_name: string;
}

// /api/bodhi-updates/$id
export interface BodhiUpdate {
  packit_id: number;
  status: string;
  alias: string | null;
  web_url: string | null;
  koji_nvrs: string;
  branch: string;
  submitted_time: number;
  update_creation_time: number | null;
  pr_id: number | null;
  branch_name: string | null;
  release: string | null;
  project_url: string;
  repo_namespace: string;
  repo_name: string;
}

// /api/testing-farm/results
export interface TestingFarmRunGroup {
  packit_id: number;
  pipeline_id: string;
  ref: string;
  status: string;
  target: string;
  web_url: string;
  pr_id: number;
  submitted_time: number;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
}

// /api/testing-farm/$id
export interface TestingFarmRun {
  pipeline_id: string; // UUID
  status: string;
  chroot: string;
  commit_sha: string;
  web_url: string;
  copr_build_ids: number[];
  run_ids: number[];
  submitted_time: number;
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

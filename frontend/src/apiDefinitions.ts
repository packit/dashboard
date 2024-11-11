// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

/**
 * This is a list of items from the Packit API
 */

// /api/projects/$forge/$namespace/$repo
export interface Project {
  namespace: string;
  repo_name: string;
  project_url: string;
  prs_handled: number;
  branches_handled: number;
  releases_handled: number;
  issues_handled: number;
}

// /api/projects/$forge/$namespace/$repo/issues
export type ProjectIssue = number;

// /api/projects/$forge/$namespace/$repo/releases
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
  branch_name: string | null;
  build_id: number;
  build_submitted_time: number;
  packit_id: number;
  packit_id_per_chroot: {
    [key: string]: number;
  };
  // TODO - @Venefilyn - change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  project: string;
  project_url: string;
  ref: string;
  repo_namespace: string;
  repo_name: string;
  status_per_chroot: {
    [key: string]: string; // TODO - @Venefilyn - Probably an enum right? Change to be one if so
  };
  web_url: string;
}

// Used within CoprBuild interface below
export interface CoprBuildPackage {
  arch: string;
  epoch: number;
  name: string;
  release: string;
  version: string;
}

// /api/copr-builds/$id
export interface CoprBuild {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  build_finished_time: number;
  build_id: string;
  build_logs_url: string;
  build_start_time: number;
  build_submitted_time: number;
  built_packages: CoprBuildPackage[];
  chroot: string;
  commit_sha: string;
  copr_owner: string;
  copr_project: string;
  issue_id: number | null;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  run_ids: number[];
  srpm_build_id: number;
  status: string; // TODO - @Venefilyn - Probably an enum right? Change to be one if so
  web_url: string;
}

// /api/koji-builds
export interface KojiBuildGroup {
  branch_name: string | null;
  build_logs_urls: string;
  build_submitted_time: number;
  chroot: string;
  packit_id: number;
  // TODO: @Venefilyn - change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  scratch: boolean;
  status: string; // TODO - @Venefilyn - Probably an enum right? Change to be one if so
  task_id: string | null;
  web_url: string;
}

// /api/koji-builds/$id
export interface KojiBuild {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  build_finished_time: number;
  build_logs_urls: [string: string];
  build_start_time: number;
  build_submitted_time: number;
  chroot: string;
  commit_sha: string;
  issue_id: number | null;
  non_git_upstream: boolean;
  // TODO: @Venefilyn - change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  run_ids: number[];
  scratch: boolean;
  srpm_build_id: number;
  status: string; // TODO: @Venefilyn - Probably an enum right? Change to be one if so
  task_id: string;
  web_url: string;
}

// /api/srpm-builds
export interface SRPMBuildGroup {
  branch_name: string | null;
  build_submitted_time: number;
  log_url: string;
  // TODO: @Venefilyn - change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  project_url: string;
  repo_name: string;
  repo_namespace: string;
  srpm_build_id: number;
  status: string; // TODO: @Venefilyn - Probably an enum right? Change to be one if so
}

// /api/srpm-builds/$id
export interface SRPMBuild {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  build_finished_time: number;
  build_start_time: number;
  build_submitted_time: number;
  copr_build_id: string;
  copr_web_url: string;
  issue_id: number | null;
  logs: string | null;
  logs_url: string;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  run_ids: number[];
  status: string;
  url: string;
}

// /api/bodhi-updates
export interface BodhiUpdateGroup {
  alias: string | null;
  branch: string;
  branch_name: string | null;
  koji_nvrs: string;
  packit_id: number;
  pr_id: number | null;
  project_url?: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  status: string;
  submitted_time: number;
  update_creation_time: number | null;
  web_url: string | null;
}

// /api/bodhi-updates/$id
export interface BodhiUpdate {
  alias: string | null;
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch: string;
  branch_name: string | null;
  issue_id: number | null;
  koji_nvrs: string;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  run_ids: number[];
  status: string;
  submitted_time: number;
  update_creation_time: number | null;
  web_url: string | null;
}

// /api/testing-farm/results
export interface TestingFarmRunGroup {
  packit_id: number;
  pipeline_id: string;
  pr_id: number;
  project_url: string;
  ref: string;
  repo_name: string;
  repo_namespace: string;
  status: string;
  submitted_time: number;
  target: string;
  web_url: string;
}

// /api/testing-farm/$id
export interface TestingFarmRun {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  chroot: string;
  commit_sha: string;
  copr_build_ids: number[];
  issue_id: number | null;
  non_git_upstream: boolean;
  pipeline_id: string; // UUID
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  run_ids: number[];
  status: string;
  submitted_time: number;
  web_url: string;
}

// /api/propose-downstream
// /api/pull-from-upstream
export interface SyncReleaseJobGroup {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  issue_id: number | null;
  non_git_upstream: boolean;
  packit_id: number;
  packit_id_per_downstream_pr: { [key: string]: number };
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  status: string;
  status_per_downstream_pr: { [key: string]: string }; //TODO - @Venefilyn Can probably be an enum
  submitted_time: number;
}

// /api/propose-downstream/$id
// /api/pull-from-upstream/$id
export interface SyncReleaseJob {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch: string;
  branch_name: string | null;
  downstream_pr_id: number | null;
  downstream_pr_project: string | null;
  downstream_pr_url: string;
  finished_time: number;
  issue_id: number | null;
  logs: string;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  start_time: number;
  status: string; //TODO - @Venefilyn Can probably be an enum
  submitted_time: number;
}

export interface PipelineItem {
  packit_id: number;
  status: string;
  target: string;
}

// /api/runs
// /api/runs/merged/$id
export interface PipelineRun {
  bodhi_update: PipelineItem[];
  copr: PipelineItem[];
  koji: PipelineItem[];
  merged_run_id: number;
  propose_downstream: PipelineItem[];
  pull_from_upstream: PipelineItem[];
  srpm: {
    packit_id: number;
    status: string;
  };
  test_run: PipelineItem[];
  time_submitted: number;
  trigger:
    | {
        anitya_package: string | null;
        anitya_project_id: number | null;
        anitya_project_name: string | null;
        anitya_version: string | null;
        branch_name: string | null;
        issue_id: number | null;
        non_git_upstream: boolean;
        pr_id: number | null;
        project_url: string;
        release: string | null;
        repo_name: string;
        repo_namespace: string;
      }
    | Record<never, never>
    | null;
  vm_image_build: unknown[]; //TODO - @Venefilyn - No clue what it should be
}

// /api/osh-scans
export interface OSHScanGroup {
  packit_id: number;
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  commit_sha: string;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  copr_build_target_id: number;
  status: string;
  task_id: number;
  url: string;
  issues_added_url: string;
  issues_fixed_url: string;
  scan_results_url: string;
}

// /api/osh-scans/$id
export interface OSHScan {
  anitya_package: string | null;
  anitya_project_id: number | null;
  anitya_project_name: string | null;
  anitya_version: string | null;
  branch_name: string | null;
  commit_sha: string;
  non_git_upstream: boolean;
  pr_id: number | null;
  project_url: string;
  release: string | null;
  repo_name: string;
  repo_namespace: string;
  copr_build_target_id: number;
  status: string;
  task_id: number;
  url: string;
  issues_added_url: string;
  issues_fixed_url: string;
  scan_results_url: string;
}

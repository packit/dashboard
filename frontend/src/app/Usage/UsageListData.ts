type TopProjectJobRuns = {
    job_runs: number;
    top_projects_by_job_runs: {
        [key: string]: number;
    };
};
type JobBuildGroup = TopProjectJobRuns & {
    per_event: {
        branch_push: TopProjectJobRuns;
        issue: TopProjectJobRuns;
        pull_request: TopProjectJobRuns;
        release: TopProjectJobRuns;
    };
};

export interface UsageListData {
    all_projects: {
        project_count: number;
        instances: {
            [key: string]: number;
        };
    };
    active_projects: {
        project_count: number;
        instances: {
            [key: string]: number;
        };
        top_projects_by_events_handled: {
            [key: string]: number;
        };
    };
    events: {
        branch_push: {
            events_handled: number;
            top_projects: {
                [key: string]: number;
            };
        };
        issue: {
            events_handled: number;
            top_projects: {
                [key: string]: number;
            };
        };
        pull_request: {
            events_handled: number;
            top_projects: {
                [key: string]: number;
            };
        };
        release: {
            events_handled: number;
            top_projects: {
                [key: string]: number;
            };
        };
    };
    jobs: {
        copr_build_groups: JobBuildGroup;
        koji_build_groups: JobBuildGroup;
        srpm_builds: JobBuildGroup;
        sync_release_runs: JobBuildGroup;
        tft_test_run_groups: JobBuildGroup;
        vm_image_build_targets: JobBuildGroup;
        [key: string]: JobBuildGroup;
    };
}

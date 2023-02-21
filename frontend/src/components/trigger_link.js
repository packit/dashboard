import React from "react";
import {
    getPRLink,
    getHostName,
    getBranchLink,
    getIssueLink,
    getReleaseLink,
} from "../utils/forge_urls";

const TriggerLink = (props) => {
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

        link = getPRLink(
            getHostName(gitRepo),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.pr_id,
        );
    } else if (props.builds.issue_id) {
        jobSuffix = `#${props.builds.issue_id}`;

        link = getIssueLink(
            getHostName(gitRepo),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.issue_id,
        );
    } else if (props.builds.branch_name) {
        jobSuffix = `:${props.builds.branch_name}`;

        link = getBranchLink(
            getHostName(gitRepo),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.branch_name,
        );
    } else if (props.builds.release) {
        jobSuffix = `#release:${props.builds.release}`;

        link = getReleaseLink(
            getHostName(gitRepo),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.release,
        );
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

export default TriggerLink;

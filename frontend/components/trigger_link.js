import React from "react";
import { getPRLink, getHostName, getBranchLink } from "../utils/forge_urls";

const TriggerLink = (props) => {
    let link = "";
    // set suffix to be either PR ID or Branch Name depending on trigger
    let jobSuffix = "";
    if (props.builds.pr_id) {
        jobSuffix = `#${props.builds.pr_id}`;

        link = getPRLink(
            getHostName(props.builds.project_url),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.pr_id
        );
    } else if (props.builds.branch_name) {
        jobSuffix = `:${props.builds.branch_name}`;

        link = getBranchLink(
            getHostName(props.builds.project_url),
            props.builds.repo_namespace,
            props.builds.repo_name,
            props.builds.branch_name
        );
    }

    if (link !== "") {
        return (
            <a target="_blank" href={link}>
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

// getHostName - returns the hostname if possible, otherwise an empty string
function getHostName(url) {
    let hostname = "";
    try {
        hostname = new URL(url).hostname;
    } catch (error) {
        console.log("Invalid URL");
        console.error(error);
    }
    return hostname;
}

// getPRLink - returns the PR link if possible otherwise an empty string
function getPRLink(forge, namespace, repoName, prID) {
    let prLink = "";
    switch (forge) {
        case "github.com":
            prLink = `https://github.com/${namespace}/${repoName}/pull/${prID}`;
            break;
        case "gitlab.com":
            prLink = `https://gitlab.com/${namespace}/${repoName}/-/merge_requests/${prID}`;
            break;
        default:
            break;
    }
    return prLink;
}

// getBranchLink - returns the branch link if possible otherwise an empty string
function getBranchLink(forge, namespace, repoName, branchName) {
    let branchLink = "";
    switch (forge) {
        case "github.com":
            branchLink = `https://github.com/${namespace}/${repoName}/tree/${branchName}`;
            break;
        case "gitlab.com":
            branchLink = `https://gitlab.com/${namespace}/${repoName}/-/tree/${branchName}`;
            break;
        default:
            break;
    }
    return branchLink;
}

// getIssueLink - returns the issue link if possible otherwise an empty string
function getIssueLink(forge, namespace, repoName, issueID) {
    let issueLink = "";
    switch (forge) {
        case "github.com":
            issueLink = `https://github.com/${namespace}/${repoName}/issues/${issueID}`;
            break;
        case "gitlab.com":
            issueLink = `https://gitlab.com/${namespace}/${repoName}/issues/-/${issueID}`;
            break;
        default:
            break;
    }
    return issueLink;
}

// getReleaseLink - returns the link to release if possible otherwise an empty string
function getReleaseLink(forge, namespace, repoName, release) {
    let releaseLink = "";
    switch (forge) {
        case "github.com":
            releaseLink = `https://github.com/${namespace}/${repoName}/releases/tag/${release}`;
            break;
        case "gitlab.com":
            releaseLink = `https://gitlab.com/${namespace}/${repoName}/-/tags/${release}`;
            break;
        default:
            break;
    }
    return releaseLink;
}

export { getHostName, getPRLink, getBranchLink, getIssueLink, getReleaseLink };

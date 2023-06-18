// getHostName - returns the hostname if possible, otherwise an empty string
function getHostName(url: string | URL) {
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
function getPRLink(
    forge: string,
    namespace: string,
    repoName: string,
    prID: number,
) {
    let prLink = `https://${forge}/${namespace}/${repoName}`;
    switch (forge) {
        case "github.com":
            prLink = `${prLink}/pull/${prID}`;
            break;
        case "gitlab.com":
            prLink = `${prLink}/-/merge_requests/${prID}`;
            break;
        default: // various Gitlab instances
            prLink = `${prLink}/-/merge_requests/${prID}`;
            break;
    }
    return prLink;
}

// getBranchLink - returns the branch link if possible otherwise an empty string
function getBranchLink(
    forge: string,
    namespace: string,
    repoName: string,
    branchName: string,
) {
    let branchLink = `https://${forge}/${namespace}/${repoName}`;
    switch (forge) {
        case "github.com":
            branchLink = `${branchLink}/tree/${branchName}`;
            break;
        case "gitlab.com":
            branchLink = `${branchLink}/-/tree/${branchName}`;
            break;
        default: // various Gitlab instances
            branchLink = `${branchLink}/-/tree/${branchName}`;
            break;
    }
    return branchLink;
}

// getIssueLink - returns the issue link if possible otherwise an empty string
function getIssueLink(
    forge: string,
    namespace: string,
    repoName: string,
    issueID: number,
) {
    let issueLink = `https://${forge}/${namespace}/${repoName}`;
    switch (forge) {
        case "github.com":
            issueLink = `${issueLink}/issues/${issueID}`;
            break;
        case "gitlab.com":
            issueLink = `${issueLink}/issues/-/${issueID}`;
            break;
        default: // various Gitlab instances
            issueLink = `${issueLink}/issues/-/${issueID}`;
            break;
    }
    return issueLink;
}

// getReleaseLink - returns the link to release if possible otherwise an empty string
function getReleaseLink(
    forge: string,
    namespace: string,
    repoName: string,
    release: string,
) {
    let releaseLink = `https://${forge}/${namespace}/${repoName}`;
    switch (forge) {
        case "github.com":
            releaseLink = `${releaseLink}/releases/tag/${release}`;
            break;
        case "gitlab.com":
            releaseLink = `${releaseLink}/-/tags/${release}`;
            break;
        default: // various Gitlab instances
            releaseLink = `${releaseLink}/-/tags/${release}`;
            break;
    }
    return releaseLink;
}

// getCommitLink - returns a link to the commit
function getCommitLink(
    forge: string,
    namespace: string,
    repoName: string,
    commit_hash: string,
) {
    let commitLink = `https://${forge}/${namespace}/${repoName}`;
    switch (forge) {
        case "github.com":
            commitLink += `/commit/${commit_hash}`;
            break;
        case "src.fedoraproject.org":
            commitLink += `/c/${commit_hash}`;
            break;
        default: // various Gitlab instances
            commitLink += `/-/commit/${commit_hash}`;
            break;
    }
    return commitLink;
}

export {
    getHostName,
    getPRLink,
    getBranchLink,
    getIssueLink,
    getReleaseLink,
    getCommitLink,
};

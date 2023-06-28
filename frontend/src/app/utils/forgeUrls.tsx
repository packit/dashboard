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
function getPRLink(gitRepo: string, prID: number) {
    const forge = getHostName(gitRepo);
    switch (forge) {
        case "github.com":
            return `${gitRepo}/pull/${prID}`;
        case "src.fedoraproject.org":
        case "pagure.io":
            return `${gitRepo}/pull-request/${prID}`;
        default: // various Gitlab instances
            return `${gitRepo}/-/merge_requests/${prID}`;
    }
}

// getBranchLink - returns the branch link if possible otherwise an empty string
function getBranchLink(gitRepo: string, branchName: string) {
    const forge = getHostName(gitRepo);
    switch (forge) {
        case "github.com":
            return `${gitRepo}/tree/${branchName}`;
        case "src.fedoraproject.org":
        case "pagure.io":
            return `${gitRepo}/tree/${branchName}`;
        default: // various Gitlab instances
            return `${gitRepo}/-/tree/${branchName}`;
    }
}

// getIssueLink - returns the issue link if possible otherwise an empty string
function getIssueLink(gitRepo: string, issueID: number) {
    const forge = getHostName(gitRepo);
    switch (forge) {
        case "github.com":
            return `${gitRepo}/issues/${issueID}`;
        case "src.fedoraproject.org":
        case "pagure.io":
            return `${gitRepo}/issue/${issueID}`;
        default: // various Gitlab instances
            return `${gitRepo}/issues/-/${issueID}`;
    }
}

// getReleaseLink - returns the link to release if possible otherwise an empty string
function getReleaseLink(gitRepo: string, release: string) {
    const forge = getHostName(gitRepo);
    switch (forge) {
        case "github.com":
            return `${gitRepo}/releases/tag/${release}`;
        case "gitlab.com":
            return `${gitRepo}/-/tags/${release}`;
        default: // various Gitlab instances
            return `${gitRepo}/-/tags/${release}`;
    }
}

// getCommitLink - returns a link to the commit
function getCommitLink(gitRepo: string, commit_hash: string) {
    const forge = getHostName(gitRepo);
    switch (forge) {
        case "github.com":
            return `${gitRepo}/commit/${commit_hash}`;
        case "src.fedoraproject.org":
        case "pagure.io":
            return `${gitRepo}/c/${commit_hash}`;
        default: // various Gitlab instances
            return `${gitRepo}/-/commit/${commit_hash}`;
    }
}

export {
    getHostName,
    getPRLink,
    getBranchLink,
    getIssueLink,
    getReleaseLink,
    getCommitLink,
};

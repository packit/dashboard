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
    }
    return branchLink;
}

export { getHostName, getPRLink, getBranchLink };

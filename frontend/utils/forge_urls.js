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

export { getHostName, getPRLink };

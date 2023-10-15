import { ClipboardCopy } from "@patternfly/react-core";
import React from "react";
import { getCommitLink } from "./forgeUrls";

export interface SHACopyInterface {
    git_repo: string;
    commit_sha: string;
}

export const SHACopy: React.FC<SHACopyInterface> = ({
    git_repo,
    commit_sha,
}) => {
    if (!git_repo || !commit_sha) {
        return <></>;
    }
    const onCopyHash = () => {
        navigator.clipboard.writeText(commit_sha);
    };

    return (
        <ClipboardCopy
            style={{
                marginLeft: "var(--pf-v5-global--spacer--xs)",
            }}
            hoverTip="Copy commit SHA"
            variant="inline-compact"
            onCopy={onCopyHash}
        >
            <a
                href={getCommitLink(git_repo, commit_sha)}
                rel="noreferrer"
                target="_blank"
            >
                {commit_sha.substring(0, 7)}
            </a>
        </ClipboardCopy>
    );
};

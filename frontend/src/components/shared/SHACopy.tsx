// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { ClipboardCopy } from "@patternfly/react-core";
import React from "react";
import { getCommitLink } from "../forgeUrls";

export interface SHACopyInterface {
  project_url: string;
  commit_sha: string;
}

export const SHACopy: React.FC<SHACopyInterface> = ({
  project_url,
  commit_sha,
}) => {
  if (!project_url || !commit_sha) {
    return <></>;
  }
  const onCopyHash = () => {
    void navigator.clipboard.writeText(commit_sha);
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
        href={getCommitLink(project_url, commit_sha)}
        rel="noreferrer"
        target="_blank"
      >
        {commit_sha.substring(0, 7)}
      </a>
    </ClipboardCopy>
  );
};

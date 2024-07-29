// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";

import { Tooltip } from "@patternfly/react-core";

import { getHostName } from "../../components/forgeUrls";
import { GithubIcon, GitlabIcon, GitIcon } from "@patternfly/react-icons";

export interface ForgeIconProps {
  url: string;
}

export const ForgeIcon: React.FC<ForgeIconProps> = ({ url }) => {
  const forge = getHostName(url);
  return ForgeIconByForge({ forge });
};

export const ForgeIconByForge: React.FC<{ forge: string }> = ({ forge }) => {
  let forgeIcon;
  switch (forge) {
    case "github.com":
      forgeIcon = <GithubIcon />;
      break;
    case "gitlab.com":
      forgeIcon = <GitlabIcon />;
      break;
    default:
      // patternfly doesn't have an icon for pagure
      forgeIcon = <GitIcon />;
      break;
  }

  return (
    <Tooltip position="top" content={forge} aria="labelledby">
      {forgeIcon}
    </Tooltip>
  );
};

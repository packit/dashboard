import React from "react";

import { Tooltip } from "@patternfly/react-core";

import { getHostName } from "../utils/forgeUrls";
import { GithubIcon, GitlabIcon, GitIcon } from "@patternfly/react-icons";

export interface ForgeIconProps {
  url: string;
}

export const ForgeIcon: React.FC<ForgeIconProps> = ({ url }) => {
  const forge = getHostName(url);

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

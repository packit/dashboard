import React from "react";

import { Tooltip } from "@patternfly/react-core";

import { getHostName } from "../utils/forge_urls";
import { GithubIcon, GitlabIcon, GitIcon } from "@patternfly/react-icons";

const ForgeIcon = (props) => {
    const forge = getHostName(props.url);

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

export default ForgeIcon;

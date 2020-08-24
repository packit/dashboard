import React from "react";

import { Tooltip } from "@patternfly/react-core";

import { getHostName } from "../utils/forge_urls";
import { GithubIcon, GitlabIcon, CodeIcon } from "@patternfly/react-icons";

const ForgeIcon = (props) => {
    const forge = getHostName(props.projectURL);

    let forgeIcon;
    switch (forge) {
        case "github.com":
            forgeIcon = <GithubIcon />;
            break;
        case "gitlab.com":
            forgeIcon = <GitlabIcon />;
            break;
        default:
            // patternfly doesnt have an icon for pagure
            forgeIcon = <CodeIcon />;
            break;
    }

    return (
        <Tooltip position="top" content={<span>{forge}</span>}>
            {forgeIcon}
        </Tooltip>
    );
};

export default ForgeIcon;

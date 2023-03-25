import React from "react";
import { Spinner } from "@patternfly/react-core";
import PropTypes from "prop-types";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InfoCircleIcon,
    RedoIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel } from "./BaseStatusLabel";

/**
 *  Status label that handles SyncReleaseTarget labels, since they have different
 *  naming convention and meaning for each SyncReleaseTarget.
 */
class SyncReleaseTargetStatusLabel extends BaseStatusLabel {
    static propTypes = {
        link: PropTypes.string,
        status: PropTypes.string,
        target: PropTypes.string,
    };

    /**
     * Creates SyncReleaseTarget status label. Label is set to target.
     *
     * @param {*} props Properties of the status label, minimal requirements are:
     *  status and target.
     */
    constructor(props) {
        super(props);

        this.label = props.target;
        switch (props.status) {
            case "running":
                this.color = "blue";
                this.icon = <Spinner isSVG diameter="15px" />;
                break;
            case "error":
                this.color = "red";
                this.icon = <ExclamationCircleIcon />;
                break;
            case "retry":
                this.color = "orange";
                this.icon = <RedoIcon />;
                break;
            case "submitted":
                this.color = "green";
                this.icon = <CheckCircleIcon />;
                break;
            default:
                this.color = "purple";
                this.icon = <InfoCircleIcon />;
                break;
        }
    }
}

export { SyncReleaseTargetStatusLabel };

import React from "react";
import PropTypes from "prop-types";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InfoCircleIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel } from "./BaseStatusLabel";

/**
 * Status label component that is used from other components.
 */
class StatusLabel extends BaseStatusLabel {
    static propTypes = {
        link: PropTypes.string,
        status: PropTypes.string,
        target: PropTypes.string,
    };

    /**
     * Constructs status label. Handles basic matching of the color of the label
     * to the status. Label is set to target, if not given falls back to status.
     *
     * @param {*} props Properties of the status label, minimal requirements are:
     *  link and status.
     */
    constructor(props) {
        super(props);

        this.label = props.target || props.status;
        switch (props.status) {
            case "success":
                this.icon = <CheckCircleIcon />;
                this.color = "green";
                break;
            case "failure":
                this.icon = <ExclamationCircleIcon />;
                this.color = "red";
                break;
            default:
                this.icon = <InfoCircleIcon />;
                this.color = "purple";
                break;
        }
    }
}

export { StatusLabel };

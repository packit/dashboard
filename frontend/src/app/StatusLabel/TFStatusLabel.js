import React from "react";
import PropTypes from "prop-types";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel } from "./BaseStatusLabel";

/**
 * Status label that handles TF (testing farm) labels, since they have multiple
 * outcomes and use different naming convention for chroot/target.
 */
class TFStatusLabel extends BaseStatusLabel {
    static propTypes = {
        link: PropTypes.string,
        status: PropTypes.string,
        target: PropTypes.string,
    };

    /**
     * Creates testing farm status label. Label is set to the target.
     *
     * @param {*} props Properties of the status label, minimal requirements are:
     *  target and status.
     */
    constructor(props) {
        super(props);

        this.label = props.target;
        switch (props.status) {
            case "failed":
                this.color = "red";
                this.icon = <ExclamationCircleIcon />;
                break;
            case "passed":
                this.color = "green";
                this.icon = <CheckCircleIcon />;
                break;
            case "error":
                this.color = "orange";
                this.icon = <ExclamationTriangleIcon />;
                break;
            default:
                this.color = "purple";
                this.icon = <InfoCircleIcon />;
                break;
        }
    }
}

export { TFStatusLabel };

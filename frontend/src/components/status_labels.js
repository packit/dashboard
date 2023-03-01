import React from "react";
import { Label, Tooltip, Spinner } from "@patternfly/react-core";

import PropTypes from "prop-types";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
    RedoIcon,
} from "@patternfly/react-icons";
import { Link } from "react-router-dom";

/**
 * Represents an internal base class for status labels. Handles rendering and basic
 * properties that are given to almost every status label, e.g. link and tooltip.
 */
class BaseStatusLabel extends React.Component {
    static propTypes = {
        link: PropTypes.string,
        status: PropTypes.string,
    };

    /**
     * Constructs basic status label. Tooltip text defaults to status.
     *
     * @param {*} props Properties of the status label, minimal requirements are:
     *  link and status.
     */
    constructor(props) {
        super(props);
        this.link = props.link;
        this.isExternalLink = props.link.startsWith("http");
        this.tooltipText = props.status;
    }

    render() {
        return (
            <Tooltip content={this.tooltipText}>
                <span style={{ padding: "2px" }}>
                    <Label
                        icon={this.icon}
                        color={this.color}
                        render={({ className, content, componentRef }) => {
                            return this.isExternalLink ? (
                                <a
                                    href={this.link}
                                    className={className}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {content}
                                </a>
                            ) : (
                                <Link
                                    to={this.link}
                                    className={className}
                                    innerRef={componentRef}
                                >
                                    {content}
                                </Link>
                            );
                        }}
                    >
                        {this.label}
                        <span className="pf-u-screen-reader">
                            {this.tooltipText}
                        </span>
                    </Label>
                </span>
            </Tooltip>
        );
    }
}

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

/**
 * Provides basic mapping of `boolean` result of SRPM build to the `string`
 * representation that can be used by classes above.
 *
 * @param {boolean} success Denotes result of the SRPM build.
 * @returns string representation of the SRPM build status.
 */
function toSRPMStatus(success) {
    return success ? "success" : "failure";
}

export {
    StatusLabel,
    TFStatusLabel,
    SyncReleaseTargetStatusLabel,
    toSRPMStatus,
};

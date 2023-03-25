import React from "react";
import { Label, Tooltip } from "@patternfly/react-core";

import PropTypes from "prop-types";
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
     *  status.
     */
    constructor(props) {
        super(props);
        this.link = props.link;
        this.isExternalLink = props.link && props.link.startsWith("http");
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

export { BaseStatusLabel };

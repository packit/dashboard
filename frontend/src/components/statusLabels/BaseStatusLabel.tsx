// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Label, Tooltip } from "@patternfly/react-core";
import { Link } from "@tanstack/react-router";
import React from "react";

export interface BaseStatusLabelProps {
  link?: string;
  tooltipText: string;
  icon: React.ReactNode;
  color:
    | "blue"
    | "cyan"
    | "green"
    | "orange"
    | "purple"
    | "red"
    | "grey"
    | "gold"
    | undefined;
  label: React.ReactNode;
}

/**
 * Represents an internal base class for status labels. Handles rendering and basic
 * properties that are given to almost every status label, e.g. link and tooltip.
 */
export const BaseStatusLabel: React.FC<BaseStatusLabelProps> = (props) => {
  return (
    <Tooltip content={props.tooltipText}>
      <span style={{ padding: "2px" }}>
        <Label
          icon={props.icon}
          color={props.color}
          render={({ className, content, componentRef }) => {
            // the `downstream_pr_url` can be undefined if
            // looking at propose downstream job details
            if (!props.link) return <>{content}</>;
            return props.link.startsWith("http") ? (
              <a
                href={props.link}
                className={className}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            ) : (
              <Link to={props.link} className={className} ref={componentRef}>
                {content}
              </Link>
            );
          }}
        >
          {props.label}
          <span className="pf-v6-u-screen-reader">{props.tooltipText}</span>
        </Label>
      </span>
    </Tooltip>
  );
};

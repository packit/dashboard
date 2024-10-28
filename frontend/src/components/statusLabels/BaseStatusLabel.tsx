// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Label, LabelProps, Tooltip } from "@patternfly/react-core";
import { Link } from "@tanstack/react-router";
import React from "react";

export interface BaseStatusLabelProps {
  link?: string;
  tooltipText: string;
  icon: React.ReactNode;
  color: LabelProps["color"];
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
          // To get the class we just have a temporary
          href={props.link ? "#" : undefined}
          render={({ className, content, componentRef }) => {
            // the `downstream_pr_url` can be undefined if
            // looking at propose downstream job details
            if (!props.link)
              return (
                <span className={className} ref={componentRef}>
                  {content}
                </span>
              );
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

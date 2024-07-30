// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Label } from "@patternfly/react-core";
import { Link } from "@tanstack/react-router";
import React from "react";

export interface LabelLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

export const LabelLink: React.FC<LabelLinkProps> = ({
  to,
  className = "",
  children = null,
}) => (
  <Label
    className={className}
    render={({ className, content, componentRef }) => (
      <Link to={to} className={className} ref={componentRef}>
        {content}
      </Link>
    )}
  >
    {children}
  </Label>
);

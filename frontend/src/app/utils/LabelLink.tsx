import { Label } from "@patternfly/react-core";
import React from "react";
import { Link } from "react-router-dom";

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

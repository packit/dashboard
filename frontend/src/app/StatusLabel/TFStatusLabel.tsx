import React, { useEffect, useState } from "react";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel, BaseStatusLabelProps } from "./BaseStatusLabel";
import { StatusLabelProps } from "./StatusLabel";

/**
 * Status label that handles TF (testing farm) labels, since they have multiple
 * outcomes and use different naming convention for chroot/target.
 */
export const TFStatusLabel: React.FC<StatusLabelProps> = (props) => {
    const [color, setColor] = useState<BaseStatusLabelProps["color"]>("purple");
    const [icon, setIcon] = useState(<InfoCircleIcon />);

    useEffect(() => {
        switch (props.status) {
            case "failed":
                setColor("red");
                setIcon(<ExclamationCircleIcon />);
                break;
            case "passed":
                setColor("green");
                setIcon(<CheckCircleIcon />);
                break;
            case "error":
                setColor("orange");
                setIcon(<ExclamationTriangleIcon />);
                break;
        }
    }, [props.status]);

    return (
        <BaseStatusLabel
            link={props.link}
            icon={icon}
            color={color}
            label={props.target}
            tooltipText={props.status}
        />
    );
};

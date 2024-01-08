import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel, BaseStatusLabelProps } from "./BaseStatusLabel";

export interface StatusLabelProps {
  link: string;
  target?: string;
  status: string;
}

/**
 * Status label component that is used from other components.
 */
export const StatusLabel: React.FC<StatusLabelProps> = (props) => {
  const [color, setColor] = useState<BaseStatusLabelProps["color"]>("purple");
  const [icon, setIcon] = useState(<InfoCircleIcon />);

  useEffect(() => {
    switch (props.status) {
      case "success":
      case "passed":
        setColor("green");
        setIcon(<CheckCircleIcon />);
        break;
      case "failure":
      case "failed":
        setColor("red");
        setIcon(<ExclamationCircleIcon />);
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
      label={props.target || props.status}
      tooltipText={props.status}
    />
  );
};

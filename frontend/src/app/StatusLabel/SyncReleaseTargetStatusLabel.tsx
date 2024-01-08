import React, { useEffect, useState } from "react";
import { Spinner } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  RedoIcon,
} from "@patternfly/react-icons";
import { BaseStatusLabel, BaseStatusLabelProps } from "./BaseStatusLabel";
import { StatusLabelProps } from "./StatusLabel";

/**
 *  Status label that handles SyncReleaseTarget labels, since they have different
 *  naming convention and meaning for each SyncReleaseTarget.
 */

export const SyncReleaseTargetStatusLabel: React.FC<StatusLabelProps> = (
  props,
) => {
  const [color, setColor] = useState<BaseStatusLabelProps["color"]>("purple");
  const [icon, setIcon] = useState(<InfoCircleIcon />);

  useEffect(() => {
    switch (props.status) {
      case "running":
        setColor("blue");
        setIcon(<Spinner diameter="15px" />);
        break;
      case "error":
        setColor("red");
        setIcon(<ExclamationCircleIcon />);
        break;
      case "retry":
        setColor("orange");
        setIcon(<RedoIcon />);
        break;
      case "submitted":
        setColor("green");
        setIcon(<CheckCircleIcon />);
        break;
      case "skipped":
        setColor("gray");
        setIcon(<CheckCircleIcon />);
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

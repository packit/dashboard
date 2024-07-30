// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";
import {
  ProgressStepper,
  ProgressStep,
  Tooltip,
  ProgressStepProps,
} from "@patternfly/react-core";
import { Timestamp } from "./Timestamp";
import { prettyFormat } from "@imranbarbhuiya/duration";
import {
  AngleDoubleRightIcon,
  BanIcon,
  QuestionCircleIcon,
} from "@patternfly/react-icons";

/**
 * Different statuses that we should map within the component
 */
export type AcceptedStatuses =
  | "success"
  | "fail"
  | "skipped"
  | "cancelled"
  | "unknown";

/**
 * The icon and name that we will display to the user. Icon is taken from
 * PatternFly's ProgressStep directly and is thus inherited. Name is always a
 * lowercase word
 */
type StepStatus = {
  // Inherited from PatternFly
  variant: NonNullable<ProgressStepProps["variant"]>;
  // Always lowercase and current-tense, such as "[the build] Failed"
  name: Lowercase<string>;
  icon?: React.ReactNode;
};

/**
 * Key-value mapping of the accepted statuses that we will map within the
 * component, as well as an object value to contain the wording we will use and
 * the icon
 */
export const ResultProgressStepStatus: Record<AcceptedStatuses, StepStatus> = {
  success: {
    variant: "success",
    name: "successful",
  },
  fail: {
    variant: "danger",
    name: "failed",
  },
  skipped: {
    variant: "pending",
    name: "skipped",
    icon: <AngleDoubleRightIcon />,
  },
  cancelled: {
    variant: "danger",
    name: "cancelled",
    icon: <BanIcon />,
  },
  unknown: {
    variant: "info",
    name: "unknown",
    icon: <QuestionCircleIcon />,
  },
};

export interface ResultProgressStepProps {
  submittedTime: number;
  startTime?: number;
  finishedTime?: number;
  noun?: string;
  status?: keyof typeof ResultProgressStepStatus;
}

/**
 * This is for the results pages specifically
 * At the moment it has a fixed step count of 2, for submitted and
 * build itself. However, this can be more versatile if need be
 * as we can change to a higher level component and use React contexts
 *
 * @author Freya Gustavsson <freya@venefilyn.se>
 */
export const ResultProgressStep: React.FC<ResultProgressStepProps> = ({
  noun = "Build",
  submittedTime,
  startTime,
  finishedTime,
  status = "success",
}) => {
  const submittedStep = useMemo(() => {
    const isCurrent = !startTime;
    return (
      <ProgressStep
        isCurrent={isCurrent}
        variant={isCurrent ? "info" : "success"}
        id="step-submitted"
        description={<Timestamp stamp={submittedTime} />}
        titleId="step-submitted-title"
        aria-label="has been submitted"
      >
        Submitted
      </ProgressStep>
    );
  }, [startTime, submittedTime]);

  const startStep = useMemo(() => {
    const isPending = !startTime;
    const isCurrent = !isPending && !finishedTime;

    // Convert UNIX timestamp into date object, Date gets passed **milliseconds**
    // since Epoch.
    const startedTimeEpoch = startTime
      ? new Date(1000 * startTime).toLocaleString()
      : "";

    const finishedTimeEpoch = finishedTime
      ? new Date(1000 * finishedTime).toLocaleString()
      : "";

    return (
      <ProgressStep
        isCurrent={isCurrent}
        variant={
          isPending
            ? "pending"
            : isCurrent
              ? "info"
              : ResultProgressStepStatus[status].variant
        }
        icon={
          finishedTimeEpoch ? ResultProgressStepStatus[status].icon : undefined
        }
        id="step-submitted"
        description={
          startTime && finishedTime ? (
            <Tooltip
              content={
                <span>
                  Started {startedTimeEpoch}
                  <br />
                  Ended {finishedTimeEpoch}
                </span>
              }
            >
              <span>
                Took {prettyFormat((finishedTime - startTime) * 1000)}
              </span>
            </Tooltip>
          ) : startTime ? (
            startTime && (
              <>
                Started <Timestamp stamp={startTime} />
              </>
            )
          ) : (
            ""
          )
        }
        titleId="step-submitted-title"
        aria-label="has been submitted"
      >
        {noun}{" "}
        {isPending
          ? "Pending"
          : isCurrent
            ? "In Progress"
            : ResultProgressStepStatus[status].name}
      </ProgressStep>
    );
  }, [startTime, finishedTime, noun]);

  return (
    <ProgressStepper aria-label={`Current ${noun.toLowerCase()} status`}>
      {submittedStep}
      {startStep}
    </ProgressStepper>
  );
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";
import { ProgressStepper, ProgressStep, Tooltip } from "@patternfly/react-core";
import { Timestamp } from "../utils/Timestamp";
import { prettyFormat } from "@imranbarbhuiya/duration";

export interface ResultProgressStepProps {
  submittedTime: number;
  startTime?: number;
  finishedTime?: number;
  noun?: string;
}

/**
 * This is for the results pages specifically
 * At the moment it has a fixed step count of 2, for submitted and
 * build itself. However, this can be more versatile if need be
 * as we can change to a higher level component and use React contexts
 *
 * TODO (spytec): When/If we have consolidated the list of different
 * statuses between our results, such as a Results utility to help
 * us decide if a build/run is successful, in progress, failed, or
 * has warnings. Then we can incorporate that into this component to indicate where the failure is.
 *
 * @author Freya Gustavsson <freya@spytec.se>
 */
export const ResultProgressStep: React.FC<ResultProgressStepProps> = ({
  noun = "Build",
  submittedTime,
  startTime,
  finishedTime,
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
        variant={isPending ? "pending" : isCurrent ? "info" : "success"}
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
                Took {prettyFormat((finishedTime - startTime) * 6000)}
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
        {noun} {isPending ? "Pending" : isCurrent ? "In Progress" : "Done"}
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

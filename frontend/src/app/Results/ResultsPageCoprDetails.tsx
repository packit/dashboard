// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { CoprResult } from "./ResultsPageCopr";
import React from "react";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { LabelLink } from "../utils/LabelLink";
import { AcceptedStatuses, ResultProgressStep } from "./ResultProgressStep";

export interface ResultsPageCoprDetailsProps {
  data: CoprResult;
}

export const ResultsPageCoprDetails: React.FC<ResultsPageCoprDetailsProps> = ({
  data,
}) => {
  const buildLogsLink = data.build_logs_url ? (
    <a href={data.build_logs_url} rel="noreferrer" target={"_blank"}>
      Logs
    </a>
  ) : (
    "Logs not available"
  );

  /**
   * Map the different statuses of Copr builds to the visual aspect
   *
   * TODO (@Venefilyn): change the statuses to match API
   *
   * @param {string} status - list of statuses from Copr builds
   * @return {*}  {AcceptedStatuses}
   */
  function getCoprBuildStatus(status: string): AcceptedStatuses {
    switch (status) {
      case "error":
      case "failure":
        return "fail";
      case "success":
        return "success";
      default:
        return "unknown";
    }
  }

  return (
    <DescriptionList
      columnModifier={{
        default: "1Col",
        sm: "2Col",
      }}
    >
      <DescriptionListGroup>
        <DescriptionListTerm>SRPM Build</DescriptionListTerm>
        <DescriptionListDescription>
          <LabelLink to={`/results/srpm-builds/${data.srpm_build_id}`}>
            Details
          </LabelLink>
        </DescriptionListDescription>
        <DescriptionListTerm>Copr build</DescriptionListTerm>
        <DescriptionListDescription>
          <StatusLabel
            target={data.chroot}
            status={data.status}
            link={data.web_url}
          />
          ({buildLogsLink})
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          <span className="pf-v5-u-screen-reader">Copr build timeline</span>
        </DescriptionListTerm>
        <DescriptionListDescription>
          <ResultProgressStep
            submittedTime={data.build_submitted_time}
            startTime={data.build_start_time}
            finishedTime={data.build_finished_time}
            status={getCoprBuildStatus(data.status)}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

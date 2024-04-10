// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Label,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { Timestamp } from "../utils/Timestamp";
import { getCommitLink } from "../utils/forgeUrls";
import { CoprResult } from "./ResultsPageCopr";
import React from "react";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Link, NavLink } from "react-router-dom";
import { LabelLink } from "../utils/LabelLink";
import { ResultProgressStep } from "./ResultProgressStep";

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
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

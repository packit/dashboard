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

export interface ResultsPageCoprDetailsProps {
  data: CoprResult;
}

export const ResultsPageCoprDetails: React.FC<ResultsPageCoprDetailsProps> = ({
  data,
}) => {
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
          (
          <a href={data.build_logs_url} rel="noreferrer" target={"_blank"}>
            Logs
          </a>
          )
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Build Submitted Time</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp stamp={data.build_submitted_time} verbose={true} />
        </DescriptionListDescription>
        <DescriptionListTerm>Build Start Time</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp stamp={data.build_start_time} verbose={true} />
        </DescriptionListDescription>
        <DescriptionListTerm>Build Finish Time</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp stamp={data.build_finished_time} verbose={true} />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

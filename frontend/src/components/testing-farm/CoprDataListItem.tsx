// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Button,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Skeleton,
} from "@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "@patternfly/react-icons";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import React from "react";
import { coprBuildQueryOptions } from "../../queries/copr/coprBuildQuery";
import { CoprBuildDetail } from "../copr/CoprBuildDetail";
import { StatusLabel } from "../statusLabels/StatusLabel";

interface CoprDataListItemProps {
  id: number;
}

export const CoprDataListItem: React.FC<CoprDataListItemProps> = ({ id }) => {
  const { data, isError, isLoading } = useQuery(
    queryOptions({
      ...coprBuildQueryOptions({ id: id.toString() }),
    }),
  );

  if (isError) {
    return <></>;
  }

  return (
    <DataListItem key={`copr-${id}-item`}>
      <DataListItemRow key={`copr-${id}-row`}>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={1}>
              <StatusLabel
                target={data?.chroot}
                status={data ? data.status : "unknown"}
                link={`/jobs/copr/${id}`}
              />
              <Button
                component="a"
                variant="link"
                isLoading={isLoading}
                href={data?.build_logs_url}
                rel="noreferrer"
                target={"_blank"}
                icon={<ExternalLinkSquareAltIcon />}
                iconPosition="end"
              >
                Logs
              </Button>
            </DataListCell>,
          ]}
        ></DataListItemCells>
      </DataListItemRow>
    </DataListItem>
  );
};

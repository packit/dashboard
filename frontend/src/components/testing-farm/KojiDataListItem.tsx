// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { queryOptions, useQuery } from "@tanstack/react-query";
import React from "react";
import { kojiBuildQueryOptions } from "../../queries/koji/kojiBuildQuery";
import { StatusLabel } from "../statusLabels/StatusLabel";

interface KojiDataListItemProps {
  id: number;
}

export const KojiDataListItem: React.FC<KojiDataListItemProps> = ({ id }) => {
  const { data, isError } = useQuery(
    queryOptions({
      ...kojiBuildQueryOptions({ id: id.toString() }),
    }),
  );

  if (isError) {
    return <></>;
  }

  return (
    <DataListItem key={`koji-${id}-item`}>
      <DataListItemRow key={`koji-${id}-row`}>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={1}>
              <StatusLabel
                target={data?.chroot}
                status={data ? data.status : "unknown"}
                link={`/jobs/koji/${id}`}
              />
            </DataListCell>,
          ]}
        ></DataListItemCells>
      </DataListItemRow>
    </DataListItem>
  );
};

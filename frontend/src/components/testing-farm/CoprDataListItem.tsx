// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  DataListItem,
  DataListItemRow,
  DataListToggle,
  DataListItemCells,
  DataListCell,
  Skeleton,
  DataListContent,
} from "@patternfly/react-core";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { coprBuildQueryOptions } from "../../queries/copr/coprBuildQuery";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CoprBuildDetail } from "../copr/CoprBuildDetail";

interface CoprDataListItemProps {
  id: number;
}

export const CoprDataListItem: React.FC<CoprDataListItemProps> = ({ id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isError } = useQuery(
    queryOptions({
      ...coprBuildQueryOptions({ id: id.toString() }),
    }),
  );

  if (isError) {
    return <></>;
  }

  return (
    <DataListItem key={`copr-${id}-item`} isExpanded={isExpanded}>
      <DataListItemRow key={`copr-${id}-row`}>
        <DataListToggle
          isExpanded={isExpanded}
          id={`copr-build-toggle${id}`}
          aria-controls={`copr-build-expand${id}`}
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={1}>
              <Link to={`/jobs/copr/${id}`}>{id}</Link>
            </DataListCell>,
          ]}
        ></DataListItemCells>
      </DataListItemRow>
      <DataListContent
        key={id + "content"}
        aria-label="Copr build detail"
        isHidden={!isExpanded}
        id={`copr-build-expand-${id}`}
      >
        {data ? <CoprBuildDetail data={data} /> : <Skeleton height="5rem" />}
      </DataListContent>
    </DataListItem>
  );
};

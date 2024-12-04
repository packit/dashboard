// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Pagination } from "@patternfly/react-core";
import React, { useContext } from "react";
import { PackitPaginationContext } from "./PackitPaginationContext";

interface PackitPaginationProps {
  itemCount?: number;
}

export const PackitPagination: React.FC<PackitPaginationProps> = ({
  itemCount,
}) => {
  const { page, perPage, setPage, setPerPage } = useContext(
    PackitPaginationContext,
  );

  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  return (
    <Pagination
      isCompact
      toggleTemplate={({ firstIndex, lastIndex, itemCount }) => (
        <>
          <b>
            {firstIndex} - {lastIndex}
          </b>{" "}
          of <b>{itemCount ? itemCount : "many"}</b>
        </>
      )}
      perPageOptions={[
        { title: "10", value: 10 },
        { title: "20", value: 20 },
        { title: "50", value: 50 },
      ]}
      isSticky
      itemCount={itemCount}
      widgetId="indeterminate-loading"
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
    />
  );
};

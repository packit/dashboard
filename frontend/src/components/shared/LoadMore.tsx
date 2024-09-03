// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Button } from "@patternfly/react-core";
import React from "react";

interface LoadMoreProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export const LoadMore: React.FC<LoadMoreProps> = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => (
  <center>
    <br />
    <Button
      variant="control"
      onClick={() => void fetchNextPage()}
      isDisabled={!hasNextPage || isFetchingNextPage}
    >
      {isFetchingNextPage
        ? "Loading more..."
        : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
    </Button>
  </center>
);

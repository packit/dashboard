// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createContext } from "react";

// set the defaults
export const PackitPaginationContext = createContext({
  page: 1, // sane defaults
  perPage: 10, // sane defaults
  setPage: (_page: number) => {
    // Implement when using context
  },
  setPerPage: (_perPage: number) => {
    // Implement when using context
  },
});

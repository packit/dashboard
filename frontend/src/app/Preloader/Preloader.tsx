// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import { Spinner } from "@patternfly/react-core";

const Preloader = () => (
  <center>
    <br />
    <Spinner size="xl" />
    <br />
  </center>
);

export { Preloader };

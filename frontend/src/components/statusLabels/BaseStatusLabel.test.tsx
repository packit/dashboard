// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { IceCreamIcon } from "@patternfly/react-icons";
import { render } from "@testing-library/react";
import { test } from "vitest";
import { BaseStatusLabel } from "./BaseStatusLabel";

test("default label", async ({ expect }) => {
  const { baseElement } = render(
    <BaseStatusLabel
      color="blue"
      tooltipText="tooltipText"
      icon={<IceCreamIcon />}
      label="Label fsdf"
    />,
  );
  expect(baseElement).toMatchSnapshot("default label");
});

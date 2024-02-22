// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NotFound } from "./NotFound";

const meta: Meta<typeof NotFound> = {
  title: "NotFound",
  component: NotFound,
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Primary: Story = {};

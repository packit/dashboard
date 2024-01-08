import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorConnection } from "./ErrorConnection";

const meta: Meta<typeof ErrorConnection> = {
  title: "Error/Connection",
  component: ErrorConnection,
};

export default meta;
type Story = StoryObj<typeof ErrorConnection>;

export const Primary: Story = {};

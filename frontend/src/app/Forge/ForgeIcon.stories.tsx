import { rest } from "msw";
import { withQueryClient } from "../utils/storybook/withQueryClient";
import { withRouter } from "storybook-addon-react-router-v6";
import type { Meta, StoryObj } from "@storybook/react";
import { ForgeIcon } from "./ForgeIcon";

const meta: Meta<typeof ForgeIcon> = {
  title: "Forge",
  component: ForgeIcon,
  tags: ["autodocs"],
  decorators: [withRouter, withQueryClient],
};

export default meta;
type Story = StoryObj<typeof ForgeIcon>;

export const Primary: Story = {
  args: {
    url: "https://pagure.io",
  },
};
export const Github: Story = {
  args: {
    url: "https://github.com",
  },
};

export const Gitlab: Story = {
  args: {
    url: "https://gitlab.com",
  },
};

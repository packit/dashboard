// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { rest } from "msw";
import { withQueryClient } from "../utils/storybook/withQueryClient";
import { withRouter } from "storybook-addon-react-router-v6";
import type { Meta, StoryObj } from "@storybook/react";
import { Forge } from "./Forge";

const meta: Meta<typeof Forge> = {
  title: "Projects/Forge",
  component: Forge,
  decorators: [withRouter, withQueryClient],
  parameters: {
    reactRouter: {
      routePath: "/projects/:forge",
      routeParams: {
        forge: "github.com",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Forge>;

export const ResultsFound: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get("*/projects", (req, res, ctx) => {
          return res(ctx.status(503));
        }),
      ],
    },
  },
};

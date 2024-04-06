// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { CoprBuildsTable } from "./CoprBuildsTable";
import { rest } from "msw";
import { withQueryClient } from "../utils/storybook/withQueryClient";
import { withRouter } from "storybook-addon-react-router-v6";
import { CoprBuildData } from "./.fixtures/CoprBuildsData.fixture";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CoprBuildsTable> = {
  title: "Jobs/CoprBuildsTable",
  component: CoprBuildsTable,
  decorators: [withRouter, withQueryClient],
  parameters: {
    msw: {
      handlers: {
        common: rest.get("*/copr-builds", (_req, res, ctx) => {
          return res(ctx.json(CoprBuildData));
        }),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoprBuildsTable>;

export const ResultsFound: Story = {};

export const ServerFails: Story = {
  parameters: {
    msw: {
      handlers: {
        common: rest.get("*/copr-builds", (_req, res, ctx) => {
          return res(ctx.delay(800), ctx.status(503));
        }),
      },
    },
  },
};

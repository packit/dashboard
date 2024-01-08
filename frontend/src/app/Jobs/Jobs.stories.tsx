import { rest } from "msw";
import { withQueryClient } from "../utils/storybook/withQueryClient";
import { withRouter } from "storybook-addon-react-router-v6";
import type { Meta, StoryObj } from "@storybook/react";
import { Jobs } from "./Jobs";
import { CoprBuildsTable } from "./CoprBuildsTable";

const meta: Meta<typeof Jobs> = {
  title: "Jobs",
  component: Jobs,
  decorators: [withRouter, withQueryClient],
};

export default meta;
type Story = StoryObj<typeof Jobs>;

export const ResultsFound: Story = {
  parameters: {
    reactRouter: {
      routePath: "/jobs/copr-builds",
      outlet: {
        element: <CoprBuildsTable />,
        handle: "Copr Builds",
        path: "copr-builds",
      },
    },
  },
};

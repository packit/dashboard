import { withRouter } from "storybook-addon-react-router-v6";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorApp } from "./ErrorApp";

const meta: Meta<typeof ErrorApp> = {
    title: "Error/App",
    component: ErrorApp,
    decorators: [withRouter],
};

export default meta;
type Story = StoryObj<typeof ErrorApp>;

export const Primary: Story = {};

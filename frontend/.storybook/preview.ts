// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { initialize, mswLoader } from "msw-storybook-addon";
// To get PatternFly style to work out of the box we need to import the CSS here
import "@patternfly/react-core/dist/styles/base.css";
// MSW allows us to mock out async requests and return whatever we want
initialize();

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
  loaders: [mswLoader],
};
// Provide the MSW addon decorator globally so it works for every Storybook
export default preview;

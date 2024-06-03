# Contributing Guidelines

Please follow common guidelines for our projects [here](https://github.com/packit/contributing).

## Reporting Bugs

- [List of known issues](https://github.com/packit-service/dashboard/issues) and
  in case you need to create a new issue, you can do so [here](https://github.com/packit-service/dashboard/issues/new).

## Guidelines for Developers

### Naming Scheme

- `camelCase` for variable names.
- Indentation: 4 Spaces.
- Regular JS functions are defined like `function someFunction()`
- React components are defined using the arrow syntax.
- [React Hooks](https://reactjs.org/docs/hooks-intro.html) style syntax is used, wherever possible, over [the old Class based](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines) syntax.

### Running packit-service/dashboard locally on Docker

1. Build docker image

```
make build-stg
```

2. Generate private key

```
openssl genrsa -des3 -out secrets/privkey.pem 1024
```

3. Generate Certificate Signing Request

```
openssl req -new -key secrets/privkey.pem -out secrets/signing-request.csr
```

4. Remove Passphrase from Key

```
openssl rsa -in secrets/privkey.pem -out secrets/privkey.pem
```

5. Generate self signed certificate

```
openssl x509 -req -days 365 -in secrets/signing-request.csr -signkey secrets/privkey.pem -out secrets/fullchain.pem
```

6. Start dashboard container

```
make run-container-stg
```

7. Install CA (optional)

```
cp secrets/fullchain.pem /usr/local/share/ca-certificates/dashboard-fullchain.crt
sudo update-ca-certificates
```

### Increase System Limit for File Watchers

While transpiling and packing code, Vite continuously watches all dependencies for changes. It's not uncommon to encounter a system limit on the number of files you can monitor.

Increase it with

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

[Technical details](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details)

## Developing frontend with Storybook

For the dashboard's frontend, we make use of Storybook to test out different scenarios that each component can be in. For example, testing that everything looks fine from an accessibility point-of-view, or that network errors are displayed correctly.

Storybook allows us to isolate individual React components and display them in different scenarios that we can view with minimal interference. Allowing us to do a proper integration test.

However, Storybook itself is not a replacement for making sure the code works correctly. The API endpoints being used might change in the future, which is why it is good to test your PRs out against stage before production deployment.

## Getting started

You can explore existing stories by looking at the local Storybook dev instance. All the stories listed here belong to a `.stories.jsx` file somewhere in the codebase.

```
make storybook
```

### Writing a story

We isolate components in a stories file, this will show up as a dedicated page when running Storybook. For up-to-date information consult the [Storybook docs](https://storybook.js.org/docs/react/writing-stories/introduction).

Storybook's recommended way of writing component stories is to use their [Component Story Format](https://storybook.js.org/docs/react/api/csf). With that we can easily test out a small component like the `NotFound` one.

```jsx
// Import React, it's necessary for JSX
import React from "react";
// Importing the component we want to write a story about
import { NotFound } from "./NotFound";

// Default export is the actual story page itself, it sets things up for the actual stories - which are the named exports down below
export default {
  title: "NotFound",
  component: NotFound,
};

// Here we initialize the component with default args from Storybook
// If we wanted to add some parameter ourselves that the viewer of the Story cannot change we would do so here
// Note: It's recommended to allow the user to change the variables through the Storybook website unless it's critical to the story
const Template = (args) => <NotFound {...args} />;

// Next we call bind, this allows us to use `this` properly within the component
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
export const Default = Template.bind({});
```

#### Network usage

Most of our components need to use some sort of network activity, likely an API call to Packit service. For those stories, we are using a library called [MSW](https://mswjs.io/).

To use this, we can add some parameters to the named export to tell `msw` on how to intercept the network call. In this example we have a story that successfully recieve data instantly and displays it. The `CoprBuildData` here is from a local data file containing an example output from the API endpoint.

> [!NOTE]
>
> `msw` will output into the browser console if it detects a network call it did not intercept, which is helpful for debugging why it is not working.

```jsx
export const ResultsFound = Template.bind({});
// Adding parameters to the story
ResultsFound.parameters = {
  msw: {
    handlers: [
      // all requests to the API ending with copr-builds are catched
      rest.get("*/copr-builds", (req, res, ctx) => {
        // Returning the JSON from the variable containing the data of the Copr build API response
        return res(ctx.json(CoprBuildData));
      }),
    ],
  },
};
```

#### Using React Router and React Query

Other things to consider is our usage of React Router and React Query. If the component is making use of these in any way, such as `useParams` from React Router, or `useQuery` from React Query, we need to add those to the default export. Take `CoprBuildsTable` component here which has both.

Here we need to import both `withRouter` to allow us to use hooks from React Router, and use our own `withQueryClient` so that React Query doesn't freak out due to not having a [React Context](https://react.dev/learn/passing-data-deeply-with-context)

```jsx
import React from "react";
import { CoprBuildsTable } from "./CoprBuildsTable";
import { withQueryClient } from "../../utils/storybook/withQueryClient";
import { withRouter } from "storybook-addon-react-router-v6";

export default {
  title: "CoprBuildsTable",
  component: CoprBuildsTable,
  decorators: [withRouter, withQueryClient],
};
```

---

Thank you for your interest!

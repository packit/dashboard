# Contributing Guidelines

Please follow common guidelines for our projects [here](https://github.com/packit/contributing).

## Reporting Bugs

- [List of known issues](https://github.com/packit-service/dashboard/issues) and
  in case you need to create a new issue, you can do so [here](https://github.com/packit-service/dashboard/issues/new).

## Guidelines for Developers

### Dependencies

`make install-dependencies` automatically installs python dependencies and `pnpm`.
In case the `pnpm` installation fails, follow [this](https://pnpm.io/installation) guide for
different installation options.

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
openssl genrsa -des3 -out secrets/privkey.pem 2048
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

#### Using React Router and React Query

Other things to consider is our usage of React Router and React Query. If the component is making use of these in any way, such as `useParams` from React Router, or `useQuery` from React Query, we need to add those to the default export. Take `CoprBuildsTable` component here which has both.

Here we need to import both `withRouter` to allow us to use hooks from React Router, and use our own `withQueryClient` so that React Query doesn't freak out due to not having a [React Context](https://react.dev/learn/passing-data-deeply-with-context)

```jsx
import React from "react";
import { CoprBuildsTable } from "./CoprBuildsTable";

export default {
  title: "CoprBuildsTable",
  component: CoprBuildsTable,
};
```

---

Thank you for your interest!

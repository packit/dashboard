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

While transpiling and packing code, webpack continuously watches all dependencies for changes. It's not uncommon to encounter a system limit on the number of files you can monitor.

Increase it with

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

[Technical details](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details)

---

Thank you for your interest!

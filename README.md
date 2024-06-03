# Dashboard for Packit

[dashboard.packit.dev](https://dashboard.packit.dev)

<img src="./files/logos/prod.png" alt="Packit logo" width="200"/>

Dashboard for [Packit Service](https://github.com/packit-service).

Uses [Packit Service API](https://prod.packit.dev/api) (or the [staging API](https://stg.packit.dev/api)
for [the staging instance](https://dashboard.stg.packit.dev)).

## Local Development

### Running the dashboard locally

```bash
# install dependencies
:~/dashboard $ make install-dependencies
```

```bash
# this will start the flask development server
:~/dashboard $ make run-dev-flask
# in another terminal
:~/dashboard $ make run-dev-frontend

# use the frontend application for development
# it will proxy non react requests to flask during dev
# read the Makefile for details
```

(you make have to use modify the make command if you want to run flask in a virtulenv instead of using `python3-flask` from the fedora repos.)

```bash
# to create a production build of react and/or any other javascript libs
:~/dashboard $ make transpile-prod
# now forget everything about npm, deploy flask the usual way
```

### Running the dashboard in a container

```bash
:~/dashboard $ make run-container-stg
```

For more details, see the [contribution guide](CONTRIBUTING.md).

### Pre-commit

> [!NOTE]
>
> For more details on `pre-commit` see https://github.com/packit/contributing#pre-commit

Running `pre-commit` is recommended for development, this will run a few tasks that are helpful

```bash
# install pre-commit on your system
:~/dashboard $ pip3 install pre-commit
# add pre-commit to git hooks for committing and pushing
:~/dashboard $ pre-commit install -t pre-commit -t pre-push
```

## More Info

If you'd like to know more about [packit](https://github.com/packit-service), please check:

- Our website: [packit.dev](https://packit.dev/)
- [Packit Service](https://github.com/packit-service/packit-service)
- [Packit](https://github.com/packit-service/packit)

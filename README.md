# Dashboard for Packit

[dashboard.packit.dev](https://dashboard.packit.dev)

<img src="./static/logo.png" alt="packit" width="200"/>

Dashboard for [Packit Service](https://github.com/packit-service).

## Local Development

```bash
# install dependencies
:~/dashboard $ make install-dependencies
```

```bash
# this will start the flask development server and webpack's --watch mode.
# flask and react debug logs will be shown in the same terminal window
:~/dashboard $ make run-dev
```

(you make have to use modify the make command if you want to run flask in a virtulenv instead of using `python3-flask` from the fedora repos.)

```bash
# to create a production build of react and/or any other javascript libs
:~/dashboard $ make transpile-prod
# now forget everything about npm, deploy flask the usual way
```

## More Info

If you'd like to know more about [packit](https://github.com/packit-service), please check:

- Our website: [packit.dev](https://packit.dev/)
- [Packit Service](https://github.com/packit-service/packit-service)
- [Packit](https://github.com/packit-service/packit)

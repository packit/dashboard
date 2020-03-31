# dashboard

Packit-service web UI dashboard is dashboard for packit. Packit provides tooling and automation to integrate upstream open source projects into Fedora operating systems. Packit project is composed of two main components.
It aims to make things easy and right.


# About

Repository containing the [dashboard](https://github.com/packit-service/dashboard) of [Packit-service](https://github.com/packit-service) application.

## Requirements

#### For Ubuntu:

[dashboard](https://github.com/packit-service/dashboard) is written in **python3** and it support only on 3.6 or later. Always try to use the latest version.

```bash
   $ sudo apt-get update && sudo apt-get upgrade
   $ sudo apt-get install python3.7
   $ python3 --version
     Python 3.7.3
```

### Installation

```bash
   :~/dashboard $ export FLASK_ENV=development
   :~/dashboard $ export FLASK_APP=packit_dashboard.app
   :~/dashboard $ flask run
```

- You should see your app is running under localhost.

### More info

If you'd like to know more about [packit](https://github.com/packit-service), please check:

- Our website: [Packit.dev](https://packit.dev/)


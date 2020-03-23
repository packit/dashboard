# dashboard

# About
 Repository containing the [dashboard](https://github.com/packit-service/dashboard) of [Packit](https://github.com/packit-service) application.

 # Requirements
 [dashboard](https://github.com/packit-service/dashboard) is written in python3 and is support only on 3.6 or later. Always try to use the latest version.
 ``` bash
    $ sudo apt-get update && sudo apt-get upgrade
    $ sudo apt-get install python3.7
    $ python3 --version
      Python 3.7.3
 ```
 # Installation
 At first go to the [dashboard](https://github.com/packit-service/dashboard) repository and clone it into your local machine with the https key.
 ``` bash
    $ git clone https://github.com/csayaan/dashboard.git
 ```
 Go to the top directory
 ``` bash
 cd dashboard/
 ``` 
 On Ubuntu:
 ``` bash
    :~/dashboard $ export FLASK_ENV=development
    :~/dashboard $ export FLASK_APP=packit_dashboard.app
    :~/dashboard $ flask run
 ```
 You should see your app is running under localhost. 

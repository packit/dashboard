#!/usr/bin/bash

set -eux

if [[ "${DEPLOYMENT:=dev}" == "dev" ]]; then
    SERVER_NAME="dashboard.localhost"
elif [[ "${DEPLOYMENT}" == "prod" ]]; then
    SERVER_NAME="dashboard.packit.dev"
else
    SERVER_NAME="dashboard.${DEPLOYMENT}.packit.dev"
fi

# See "mod_wsgi-express-3 start-server --help" for details on
# these options, and the configuration documentation of mod_wsgi:
# https://modwsgi.readthedocs.io/en/master/configuration.html
# For the HSTS policy see
# https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
exec hypercorn \
    --access-logfile - \
    --ca-certs /secrets/fullchain.pem \
    --certfile /secrets/privkey.pem \
    --bind '0.0.0.0:8443' \
    --bind '[::]:8443' \
    --server-name ${SERVER_NAME} \
    -w 2 \
    /usr/share/packit_dashboard/packit_dashboard:app

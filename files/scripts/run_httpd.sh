#!/usr/bin/bash

set -eux

if [[ "${DEPLOYMENT:=dev}" == "dev" ]]; then
    SERVER_NAME="dashboard.localhost"
elif [[ "${DEPLOYMENT}" == "prod" ]]; then
    SERVER_NAME="dashboard.packit.dev"
else
    SERVER_NAME="dashboard.${DEPLOYMENT}.packit.dev"
fi

# [FIXME] This is a dirty hack to workaround 403 by the httpd server itself when
# open HTTP/2 connection gets reused
API_SERVER_NAME="${DEPLOYMENT}.packit.dev"

# Pre-warm the usage cache at startup and schedule daily refresh at 00:01
PYTHONPATH=/src python3 -m packit_dashboard.usage.warm_cache || true
(while true; do
    seconds_until_midnight=$(( $(date -d "tomorrow 00:01" +%s) - $(date +%s) ))
    sleep "${seconds_until_midnight}"
    PYTHONPATH=/src python3 -m packit_dashboard.usage.warm_cache || true
done) &

# See "mod_wsgi-express-3 start-server --help" for details on
# these options, and the configuration documentation of mod_wsgi:
# https://modwsgi.readthedocs.io/en/master/configuration.html
exec mod_wsgi-express-3 start-server \
    --access-log \
    --log-to-terminal \
    --http2 \
    --https-port 8443 \
    --ssl-certificate-file /secrets/fullchain.pem \
    --ssl-certificate-key-file /secrets/privkey.pem \
    --server-name ${SERVER_NAME} \
    --server-alias ${API_SERVER_NAME} \
    --processes 2 \
    --locale "C.UTF-8" \
    /usr/share/packit_dashboard/packit_dashboard.wsgi

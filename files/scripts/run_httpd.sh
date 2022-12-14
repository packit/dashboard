#!/usr/bin/bash

set -eux

INSTANCE=
if [ -n "${DEPLOYMENT}" ] && [ "${DEPLOYMENT}" != "prod" ]; then
    INSTANCE=".${DEPLOYMENT}"
fi

# See "mod_wsgi-express-3 start-server --help" for details on
# these options, and the configuration documentation of mod_wsgi:
# https://modwsgi.readthedocs.io/en/master/configuration.html
# For the HSTS policy see
# https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
exec mod_wsgi-express-3 start-server \
    --access-log \
    --log-to-terminal \
    --https-port 8443 \
    --https-only \
    --hsts-policy "max-age=31536000;includeSubDomains" \
    --ssl-certificate-file /secrets/fullchain.pem \
    --ssl-certificate-key-file /secrets/privkey.pem \
    --server-name dashboard${INSTANCE}.packit.dev \
    --processes 2 \
    --locale "C.UTF-8" \
    /usr/share/packit_dashboard/packit_dashboard.wsgi

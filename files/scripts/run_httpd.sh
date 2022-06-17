#!/usr/bin/bash

set -eux

exec mod_wsgi-express-3 start-server \
    --https-port 8443 \
    --access-log \
    --log-to-terminal \
    --ssl-certificate-file /secrets/fullchain.pem \
    --ssl-certificate-key-file /secrets/privkey.pem \
    --server-name dashboard.${DEPLOYMENT}.packit.dev \
    --processes 2 \
    --locale "C.UTF-8" \
    /usr/share/packit_dashboard/packit_dashboard.wsgi

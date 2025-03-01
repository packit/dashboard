# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from os import getenv

from flask import Flask
from flask_talisman import Talisman

from packit_dashboard.api.routes import api
from packit_dashboard.home.routes import home

app = Flask(
    "Packit Service Dashboard",
    static_folder="frontend/dist/assets",
)

# Note: Declare any other flask blueprints or routes above this.
# Routes declared below this will be rendered by React
app.register_blueprint(home)
app.register_blueprint(api)


# Enable CSP and HSTS
#
# For the HSTS policy see
# https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
csp = {
    "default-src": ["'self'", "*.packit.dev"],
    "object-src": "'none'",
    "style-src": ["'unsafe-inline'", "'self'"],
}
Talisman(app, content_security_policy=csp)

if __name__ == "__main__":
    app.run(debug=getenv("DEPLOYMENT") != "prod")

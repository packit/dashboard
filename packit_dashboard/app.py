# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from os import getenv

from flask import Flask
from flask_talisman import Talisman

from packit_dashboard.home.routes import home

app = Flask(
    "Packit Service Dashboard",
    static_folder="frontend/dist/assets",
)

# Note: Declare any other flask blueprints or routes above this.
# Routes declared below this will be rendered by React
app.register_blueprint(home)


csp = {
    "default-src": ["'self'", "*.packit.dev"],
    "object-src": "'none'",
    "style-src": ["'unsafe-inline'", "'self'"],
}
Talisman(app, content_security_policy=csp)

if __name__ == "__main__":
    app.run(debug=getenv("DEPLOYMENT") != "prod")

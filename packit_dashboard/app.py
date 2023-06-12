from os import getenv

from flask import Flask

from packit_dashboard.api.routes import api
from packit_dashboard.home.routes import home

app = Flask(
    "Packit Service Dashboard",
    static_folder="frontend/dist/assets",
)

app.register_blueprint(api)
# Note: Declare any other flask blueprints or routes above this.
# Routes declared below this will be rendered by React
app.register_blueprint(home)


if __name__ == "__main__":
    app.run(debug=getenv("DEPLOYMENT") != "prod")

from flask import Flask
from packit_dashboard.cache import cache
from packit_dashboard.home.routes import home
from packit_dashboard.api.routes import api

app = Flask("Packit Service Dashboard")
cache.init_app(app)

app.register_blueprint(api)
# Note: Declare any other flask blueprints or routes above this
# Routes declared below this will be rendered by React
app.register_blueprint(home)


if __name__ == "__main__":
    app.run(debug=True)

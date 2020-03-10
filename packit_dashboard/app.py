from flask import Flask, send_from_directory
from packit_dashboard.home.routes import home
from packit_dashboard.about.routes import about
from packit_dashboard.builds.routes import builds
from packit_dashboard.projects.routes import projects

app = Flask("Packit Service Dashboard")


@app.route("/node_modules/<path:filename>")
def node_modules(filename):
    return send_from_directory(f"node_modules", filename)


app.register_blueprint(home)
app.register_blueprint(about)
app.register_blueprint(builds)
app.register_blueprint(projects)


if __name__ == "__main__":
    app.run(debug=True)

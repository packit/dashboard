from flask import Blueprint, render_template
from packit_dashboard.config import API_URL

home = Blueprint("home", __name__)

# Catch All URLs. Send to JS.


@home.route("/")
def main():
    return render_template("index.html", api_url=API_URL)


@home.route("/<path:path>")
def catch_all(path):
    return render_template("index.html", api_url=API_URL)

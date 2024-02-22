# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from flask import Blueprint, render_template

home = Blueprint("home", __name__, template_folder="../../frontend/dist")

# Catch All URLs. Send to JS.


@home.route("/")
def main():
    return render_template("index.html")


@home.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

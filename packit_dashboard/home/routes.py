from flask import Blueprint, render_template

home = Blueprint("home", __name__)


@home.route("/")
def main():
    return render_template(
        "main_frame.html",
        header="Information",
        content=render_template("information.html"),
    )

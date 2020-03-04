import json
import socket
from os import getenv

import requests
from flask import Flask, render_template, send_from_directory

deployment = getenv("DEPLOYMENT", "stg")
app = Flask("Packit Service Dashboard")

API_URL = f"https://{deployment}.packit.dev/api"
PASS_ICON = "fa-check-circle"
FAIL_ICON = "fa-exclamation-circle"
WARN_ICON = "fa-exclamation-triangle"


@app.route("/node_modules/<path:filename>")
def node_modules(filename):
    return send_from_directory(f"node_modules", filename)


@app.route("/")
def main():
    return render_template(
        "main_frame.html",
        header="Information",
        content=render_template("information.html"),
    )


def check_service(server, port, ip_type=socket.SOCK_STREAM):
    sock = socket.socket(socket.AF_INET, ip_type)
    result = sock.connect_ex((server, port))
    sock.close()
    return result == 0


def return_json(url, method="GET", **kwargs):
    response = requests.request(method=method, url=url, **kwargs)
    output = None
    try:
        output = json.loads(response.content)
    except Exception:
        pass
    return output


@app.route("/status/")
def status():
    content = render_template(
        "status.html",
        header="Service API",
        icon=PASS_ICON if return_json(url=f"{API_URL}/swagger.json") else FAIL_ICON,
        text="JSON service API server",
    )
    return render_template(
        "main_frame.html", header="Status of packit service", content=content
    )


def all_from(url, method="GET", **kwargs):
    counter = 0
    while True:
        counter += 1
        url_ = f"{url}?page={counter}&per_page=50"
        page = return_json(url_, method, **kwargs)
        if not page:
            break
        for item in page:
            yield item


@app.route("/projects/")
def projects():
    all_projects = set()
    successful_projects = set()

    for build in all_from(f"{API_URL}/copr-builds"):
        if not isinstance(build, dict) or not all(
            [build.get("project"), build.get("status")]
        ):
            continue
        name = build["project"]
        # rstrip -stg
        if name.endswith("-stg"):
            name = name[: -len("-stg")]
        # rstrip the PR number
        name = name[: name.rfind("-")]

        all_projects.add(name)
        if build["status"] == "success":
            successful_projects.add(name)

    content = render_template(
        "projects.html",
        counter=len(all_projects),
        all_projects=all_projects,
        counter_s=len(successful_projects),
        successful_projects=successful_projects,
    )
    return render_template("main_frame.html", header="Project", content=content)


@app.route("/builds/")
def builds():
    # Only display recent builds for now
    # Fetching everything takes too long
    # TODO Add button/table navigation to load more
    json_url = f"{API_URL}/copr-builds?page=1&per_page=20"
    api_data = requests.get(url=json_url).json()
    content = render_template("builds.html", builds_list=api_data)
    return render_template("main_frame.html", header="Builds", content=content)


if __name__ == "__main__":
    app.run(debug=True)

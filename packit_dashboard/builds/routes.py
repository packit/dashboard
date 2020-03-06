from flask import Blueprint, render_template
from packit_dashboard.config import API_URL
import requests

builds = Blueprint("builds", __name__)


@builds.route("/builds/")
def builds_page():
    # Only display recent builds for now
    # Fetching everything takes too long
    # TODO Add button/table navigation to load more
    json_url = f"{API_URL}/copr-builds?page=1&per_page=20"
    api_data = requests.get(url=json_url).json()
    content = render_template("builds.html", builds_list=api_data)
    return render_template("main_frame.html", header="Builds", content=content)


# Routes like /builds/<int:build_id> (to be added later) will also come here

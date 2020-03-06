from flask import Blueprint, render_template
from packit_dashboard.packagewide_utils import return_json
from packit_dashboard.config import API_URL

about = Blueprint("about", __name__)

# The about page, status page and other meta pages will come here

PASS_ICON = "fa-check-circle"
FAIL_ICON = "fa-exclamation-circle"
WARN_ICON = "fa-exclamation-triangle"


@about.route("/status/")
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

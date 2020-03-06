from flask import Blueprint, render_template
from packit_dashboard.projects.utils import all_from
from packit_dashboard.config import API_URL


projects = Blueprint("projects", __name__)


@projects.route("/projects/")
def projects_page():
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


# packit-service github app installations related routes (to be added later) will also come here

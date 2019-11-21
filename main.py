from flask import Flask, render_template, send_from_directory
import socket
import requests
import json

app = Flask("Packit Service Dashboard")
API_URL = "https://stg.packit.dev/api"
PASS_ICON = "fa-check-circle"
FAIL_ICON = "fa-exclamation-circle"
WARN_ICON = "fa-exclamation-triangle"

@app.route('/node_modules/<path:filename>')
def node_modules(filename):
    return send_from_directory(f"node_modules", filename)


@app.route("/")
def main():
    return render_template('main_frame.html', header="Information", content=render_template('information.html'))


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


def return_json_all_pages(url, limit=10, method="GET", **kwargs):
    output = []
    for counter in range(1, limit):
        url += f"?page={counter}&per_page=10"
        tmp_output = return_json(url, method, **kwargs)
        if not tmp_output:
            break
        output += tmp_output
    return output




@app.route("/status/")
def status():
    content = render_template('status.html', header="Sevice API", icon=PASS_ICON if return_json(url=f"{API_URL}/swagger.json") else FAIL_ICON, text="JSON service API server")
    content += render_template('status.html', header="Redis database", icon=FAIL_ICON, text="Redis database server")
    return render_template('main_frame.html', header="Status of packit service", content=content)

@app.route("/projects/")
def projects():

    copr_packages_json = return_json_all_pages(f"{API_URL}/copr-builds")
    summary_dict = {}
    for item in copr_packages_json:
        if isinstance(item, dict):
            project_name = item.get("project")

        if project_name not in summary_dict:
            summary_dict[project_name] = {"owner": item.get("owner"), "last_status": item.get("status"), "builds": [item]}
        else:
            summary_dict[project_name]["builds"] += item
    content_projects = ""
    for k, v in summary_dict.items():
        content_projects += render_template('project.html',
                                            header=f"{k} ({len(v['builds'])}) owned by {v['owner']}",
                                            icon=PASS_ICON if v["last_status"] else FAIL_ICON,
                                            text="",
                                            copr_link=f"https://copr.fedorainfracloud.org/coprs/packit/{k}/builds/"
                                            )
    content = render_template('projects.html', counter=len(summary_dict.keys()), projects=content_projects)
    return render_template('main_frame.html', header="Project", content=content)


@app.route("/logs/")
def logs():
    return render_template('main_frame.html', header="Logs", content="nic")




if __name__ == "__main__":
    app.run(debug=True)

from flask import Blueprint, jsonify, request
from packit_dashboard.utils import return_json
from packit_dashboard.config import API_URL

api = Blueprint("api", __name__)

# The react frontend will request information here instead of fetching directly
# from the main API.
# This is because it will be easier to implement caching API requests here.
# (Flask-Caching etc)
# However if you want to do this client side, just delete these, send the API URL from jinja to JS
# via a window.Variable and use that everywhere to fetch from packit-service


@api.route("/api/copr-builds/")
def copr_builds():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/copr-builds?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/testing-farm/")
def testing_farm():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/testing-farm/results?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/")
def projects():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/projects?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/prs/")
def project_prs(forge, namespace, repo_name):
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/prs?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/releases/")
def project_releases(forge, namespace, repo_name):
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/releases"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/issues/")
def project_issues(forge, namespace, repo_name):
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/issues"
    return jsonify(return_json(url))

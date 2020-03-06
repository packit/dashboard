import requests
import json

# Common utility functions used in multiple files in the packit_dashboard package


def return_json(url, method="GET", **kwargs):
    response = requests.request(method=method, url=url, **kwargs)
    output = None
    try:
        output = json.loads(response.content)
    except Exception:
        pass
    return output

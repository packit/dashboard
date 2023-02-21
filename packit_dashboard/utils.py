import requests
import json


# Common utility functions used in multiple files in the packit_dashboard package
# Returns python parsable json object from URL
def return_json(url, method="GET", **kwargs):
    output = None

    tries = 6
    for i in range(tries):
        try:
            response = requests.request(method=method, url=url, **kwargs)
            output = json.loads(response.content)
        except Exception:
            if i < tries - 1:
                continue
            else:
                output = None
                raise
        break

    return output

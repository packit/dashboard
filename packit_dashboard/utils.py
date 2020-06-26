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
            print(f"Try-{i}")
        except Exception:
            if i < tries - 1:
                continue
            else:
                output = None
                raise
        break

    return output


# Takes a base url, and gets json files from multiple pages from that url
# and returns a generator of every item
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

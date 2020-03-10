from packit_dashboard.packagewide_utils import return_json


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

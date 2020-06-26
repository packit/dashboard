from flask_caching import Cache

cache = Cache(
    config={
        "CACHE_TYPE": "filesystem",
        "CACHE_DEFAULT_TIMEOUT": 120,
        "CACHE_DIR": "/tmp",
    }
)

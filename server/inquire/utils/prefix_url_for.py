from flask import url_for

def better_url_for(request_base, resource, missing_prefix="", external=True):
    s = url_for(resource, _external=external)
    resource_path = s.replace(request_base, "")

    return request_base + missing_prefix + resource_path
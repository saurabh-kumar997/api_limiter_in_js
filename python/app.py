import json
import base64
import requests
from functools import wraps
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask, jsonify, make_response, request


def my_cusyom(authorization_header):
    return authorization_header["username"]


app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    headers_enabled=True,
)

# password verify


def check(authorization_header):
    if authorization_header["username"] == "username" and authorization_header["password"] == "password":
        return True
    if authorization_header["username"] == "saurabh" and authorization_header["password"] == "password":
        return True


# login
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        authorization_header = request.authorization
        if authorization_header and check(authorization_header):
            return f(*args, **kwargs)
        else:
            return make_response("Authorization failed!!", 403)
        return f(*args, **kwargs)
    return decorated


@app.route("/call_api")
@limiter.limit("5/minute")
@login_required
def get_random_number():
    response = requests.get("http://127.0.0.1:8000/get_number")
    return response.json()


@app.route("/see_remaining_limit")
@login_required
def remaining_limit():
    response = requests.get('http://127.0.0.1:5000/call_api')
    headers_json = json.loads(json.dumps(dict(response.headers)))
    if int(headers_json["X-RateLimit-Remaining"]) != 0:
        return make_response({
            "Total Calls": headers_json['X-RateLimit-Limit'],
            "Remaining calls": headers_json["X-RateLimit-Remaining"]
        })
    else:
        return make_response(f"You have exhausted your limit,Please try after {headers_json['Retry-After']} seconds", 403)


if __name__ == "__main__":
    app.run(debug=True)

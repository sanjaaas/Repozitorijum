# utils/auth.py

from functools import wraps
from flask import request, jsonify
import jwt
from models import User
import datetime

SECRET_KEY = "tajna_kljuc"

# 🔐 Generiši JWT token
def generate_token(user):
    payload = {
        "user_id": user.id,
        "is_admin": user.is_admin,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# 🔐 Dekorator za zaštitu ruta
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token nije prosleđen"}), 401

        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user = User.query.get(decoded["user_id"])
            if not user:
                return jsonify({"error": "Korisnik ne postoji"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token je istekao"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Neispravan token"}), 401

        return f(current_user=user, *args, **kwargs)
    return decorated
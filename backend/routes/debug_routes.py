from flask import Blueprint, request, jsonify
from utils.auth import token_required
from models import User

debug_bp = Blueprint('debug_bp', __name__)


@debug_bp.route('/token-check', methods=['GET'])
@token_required
def token_check(current_user):
    print("Token validan")
    print("ID:", current_user.id)
    print("Email:", current_user.email)
    print("Ime:", current_user.first_name)
    print("Prezime:", current_user.last_name)
    print("Admin:", current_user.is_admin)

    return jsonify({
        "status": "Token validan",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "is_admin": current_user.is_admin
        }
    }), 200
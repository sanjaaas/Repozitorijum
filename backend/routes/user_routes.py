from flask import Blueprint, request, jsonify
from models import db, User
from utils.auth import token_required  # moraš imati utils/auth.py sa token_required dekoratorom

user_bp = Blueprint('user_bp', __name__)

# ✅ Prikaz svih korisnika (admin može koristiti)
@user_bp.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

# ✅ Prikaz jednog korisnika po ID-u
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Korisnik nije pronađen"}), 404
    return jsonify(user.to_dict()), 200

# ✅ Brisanje korisnika (opciono, za testiranje)
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Korisnik nije pronađen"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Korisnik obrisan"}), 200

# ✅ Prikaz profila prijavljenog korisnika
@user_bp.route('/me', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict()), 200
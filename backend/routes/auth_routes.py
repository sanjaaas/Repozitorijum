from flask import Blueprint, request, jsonify
from models import db, User, PasswordResetToken, Order
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import datetime

from utils.auth import generate_token, token_required

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nema podataka"}), 400

    required_fields = ["first_name", "last_name", "email", "password"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Nedostaju obavezni podaci"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email već postoji"}), 409

    hashed_password = generate_password_hash(data["password"])
    user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        password=hashed_password,
        is_admin=data.get("is_admin", False)
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user)

    return jsonify({
        "message": "Uspešna registracija",
        "token": token,
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_admin": user.is_admin
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nema podataka"}), 400

    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Pogrešan email ili lozinka"}), 401

    token = generate_token(user)

    return jsonify({
        "message": "Uspešna prijava",
        "token": token,
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_admin": user.is_admin
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()

    total_orders = len(orders)
    total_spent = sum(order.total_price for order in orders)
    max_order = max((order.total_price for order in orders), default=0)

    orders_data = [
        {
            "order_id": order.id,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "status": order.status,
            "total_price": order.total_price,
            "items": [
                {
                    "book_id": item.book.id,
                    "title": item.book.title,
                    "image_url": item.book.image_url,
                    "price": item.book.price,
                    "quantity": item.quantity
                }
                for item in order.items
            ]
        }
        for order in orders
    ]

    return jsonify({
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "stats": {
            "total_orders": total_orders,
            "total_spent": total_spent,
            "max_order": max_order
        },
        "orders": orders_data
    }), 200


@auth_bp.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nema podataka"}), 400

    current_user.first_name = data.get("first_name", current_user.first_name)
    current_user.last_name = data.get("last_name", current_user.last_name)
    current_user.email = data.get("email", current_user.email)

    db.session.commit()

    return jsonify({"message": "Profil uspešno ažuriran"}), 200


@auth_bp.route('/change-password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nema podataka"}), 400

    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({"error": "Obe lozinke su obavezne"}), 400

    if not check_password_hash(current_user.password, current_password):
        return jsonify({"error": "Trenutna lozinka nije tačna"}), 401

    current_user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Lozinka uspešno promenjena"}), 200


@auth_bp.route('/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({"message": "Nalog je uspešno obrisan"}), 200


@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email je obavezan"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Korisnik ne postoji"}), 404

    PasswordResetToken.query.filter_by(user_id=user.id).delete()

    token = secrets.token_urlsafe(32)
    reset_entry = PasswordResetToken(token=token, user_id=user.id)
    db.session.add(reset_entry)
    db.session.commit()

    return jsonify({
        "message": "Zahtev za reset lozinke je primljen",
        "reset_token": token
    }), 200


@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('new_password')
    if not new_password:
        return jsonify({"error": "Nova lozinka je obavezna"}), 400

    entry = PasswordResetToken.query.filter_by(token=token).first()
    if not entry or entry.expires_at < datetime.datetime.utcnow():
        return jsonify({"error": "Token nije validan ili je istekao"}), 400

    user = entry.user
    user.password = generate_password_hash(new_password)
    db.session.delete(entry)
    db.session.commit()

    return jsonify({"message": "Lozinka je uspešno resetovana"}), 200
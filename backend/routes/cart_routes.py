from flask import Blueprint, request, jsonify
from models import db, CartItem, Book
import jwt

cart_bp = Blueprint('cart_bp', __name__)
SECRET_KEY = "tajna_kljuc"  # mora da se poklapa sa auth.py i utils.auth.py

# ✅ Test ruta za dekodiranje tokena
@cart_bp.route('/test-token', methods=['GET'])
def test_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"decoded": decoded}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# ✅ Dodavanje knjige u korpu (sabira količine)
@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token je istekao"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Neispravan token"}), 401

    data = request.get_json()
    book_id = data.get("book_id")

    try:
        quantity = int(data.get("quantity", 1))
    except (ValueError, TypeError):
        quantity = 1

    if not book_id:
        return jsonify({"error": "Nedostaje book_id"}), 400

    existing_item = CartItem.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(user_id=user_id, book_id=book_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"message": "Knjiga dodata u korpu"}), 201

# ✅ Prikaz korpe sa detaljima knjiga
@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token je istekao"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Neispravan token"}), 401

    items = CartItem.query.filter_by(user_id=user_id).all()
    result = []
    for item in items:
        book = Book.query.get(item.book_id)
        if book:
            result.append({
                "cart_id": item.id,
                "book_id": book.id,
                "title": book.title,
                "author": book.author,
                "price": book.price,
                "final_price": book.sale_price if book.sale_price else book.price,
                "quantity": item.quantity,
                "image_url": book.image_url
            })
    return jsonify(result), 200

# ✅ Smanjenje ili povećanje količine jedne stavke u korpi
@cart_bp.route('/cart/<int:item_id>', methods=['PATCH'])
def update_cart_item(item_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token je istekao"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Neispravan token"}), 401

    data = request.get_json()
    action = data.get("action")

    item = CartItem.query.get(item_id)
    if not item or item.user_id != user_id:
        return jsonify({"error": "Stavka nije pronađena"}), 404

    if action == "decrease":
        item.quantity -= 1
        if item.quantity <= 0:
            db.session.delete(item)
        else:
            db.session.add(item)
    elif action == "increase":
        item.quantity += 1
        db.session.add(item)

    db.session.commit()

    # Vrati ažuriranu listu stavki u korpi
    items = CartItem.query.filter_by(user_id=user_id).all()
    result = []
    for i in items:
        book = Book.query.get(i.book_id)
        if book:
            result.append({
                "cart_id": book.id,
                "book_id": book.id,
                "title": book.title,
                "author": book.author,
                "price": book.price,
                "final_price": book.sale_price if book.sale_price else book.price,
                "quantity": book.quantity,
                "image_url": book.image_url
            })
    return jsonify(result), 200

# ✅ Brisanje jedne stavke iz korpe
@cart_bp.route('/cart/<int:item_id>', methods=['DELETE'])
def delete_cart_item(item_id):
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Stavka nije pronađena"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Stavka obrisana iz korpe"}), 200

# ✅ Brisanje svih stavki iz korpe
@cart_bp.route('/cart/all', methods=['DELETE'])
def delete_all_cart_items():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token je istekao"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Neispravan token"}), 401

    items = CartItem.query.filter_by(user_id=user_id).all()
    for item in items:
        db.session.delete(item)

    db.session.commit()
    return jsonify({"message": "Sve stavke su obrisane iz korpe"}), 200
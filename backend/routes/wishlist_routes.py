from flask import Blueprint, request, jsonify
from models import db, WishlistItem, Book
import jwt

wishlist_bp = Blueprint('wishlist_bp', __name__)
SECRET_KEY = "tajna_kljuc"  # mora da se poklapa sa onim u auth_routes.py

# ✅ Dodavanje knjige u listu želja
@wishlist_bp.route('/wishlist', methods=['POST'])
def add_to_wishlist():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
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
    if not book_id:
        return jsonify({"error": "Nedostaje book_id"}), 400

    # ✅ Ako knjiga već postoji u listi želja, ne dodaj ponovo
    existing_item = WishlistItem.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_item:
        return jsonify({"message": "Knjiga je već u listi želja"}), 200

    new_item = WishlistItem(user_id=user_id, book_id=book_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Knjiga dodata u listu želja"}), 201

# ✅ Prikaz korisničke liste želja sa detaljima knjiga
@wishlist_bp.route('/wishlist', methods=['GET'])
def get_wishlist():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Token nije prosleđen"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token je istekao"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Neispravan token"}), 401

    items = WishlistItem.query.filter_by(user_id=user_id).all()
    result = []
    for item in items:
        book = Book.query.get(item.book_id)
        if book:
            result.append({
                "wishlist_id": item.id,
                "book_id": book.id,
                "title": book.title,
                "author": book.author,
                "price": book.price,
                "image_url": book.image_url
            })
    return jsonify(result), 200

# ✅ Brisanje stavke iz liste želja
@wishlist_bp.route('/wishlist/<int:item_id>', methods=['DELETE'])
def delete_wishlist_item(item_id):
    item = WishlistItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Stavka nije pronađena"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Stavka obrisana iz liste želja"}), 200
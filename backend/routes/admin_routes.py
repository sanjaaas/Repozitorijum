from flask import Blueprint, request, jsonify
from models import db, Book

admin_bp = Blueprint('admin_bp', __name__)


@admin_bp.route('/books/add', methods=['POST'])
def add_book():
    data = request.get_json()
    required_fields = ["title", "author", "description", "publisher", "price", "category", "image_url"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Nedostaju obavezni podaci"}), 400

    book = Book(
        title=data["title"],
        author=data["author"],
        description=data["description"],
        publisher=data["publisher"],
        price=data["price"],
        category=data["category"],
        image_url=data["image_url"],
        is_on_sale=data.get("is_on_sale", False),
        is_recommended=data.get("is_recommended", False)
    )

    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Knjiga dodata", "book_id": book.id}), 201


@admin_bp.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    for field in ["title", "author", "description", "publisher", "price", "category", "image_url"]:
        if field in data:
            setattr(book, field, data[field])

    db.session.commit()
    return jsonify({"message": "Knjiga izmenjena", "book_id": book.id}), 200


@admin_bp.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Knjiga obrisana", "book_id": book_id}), 200


@admin_bp.route('/books/<int:book_id>/sale', methods=['PUT'])
def set_sale_price(book_id):
    data = request.get_json()
    if not data or "new_price" not in data:
        return jsonify({"error": "Nema nove cene"}), 400

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    book.price = data["new_price"]
    book.is_on_sale = True
    db.session.commit()

    return jsonify({"message": "Knjiga je postavljena na akciju", "book_id": book.id}), 200


@admin_bp.route('/books/<int:book_id>/sale/remove', methods=['PUT'])
def remove_sale(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    book.is_on_sale = False
    db.session.commit()
    return jsonify({"message": "Akcija uklonjena", "book_id": book.id}), 200

@admin_bp.route('/books/<int:book_id>/recommend', methods=['PUT'])
def recommend_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    book.is_recommended = True
    db.session.commit()
    return jsonify({"message": "Knjiga je preporučena", "book_id": book.id}), 200


@admin_bp.route('/books/<int:book_id>/recommend/remove', methods=['PUT'])
def remove_recommendation(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Knjiga nije pronađena"}), 404

    book.is_recommended = False
    db.session.commit()
    return jsonify({"message": "Preporuka uklonjena", "book_id": book.id}), 200
from models import User, Order, OrderItem, Book
from sqlalchemy import func

@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    user_count = User.query.count()
    order_count = Order.query.count()
    total_revenue = db.session.query(func.sum(Order.total_price)).scalar() or 0

    
    top_books = db.session.query(
        Book.title,
        func.sum(OrderItem.quantity).label('total_sold')
    ).join(OrderItem).group_by(Book.id).order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()

    return jsonify({
        "user_count": user_count,
        "order_count": order_count,
        "total_revenue": round(total_revenue, 2),
        "top_books": [{"title": b[0], "sold": b[1]} for b in top_books]
    })
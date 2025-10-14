from flask import Blueprint, request, jsonify
from models import db, Book
from sqlalchemy import or_

book_bp = Blueprint('book_bp', __name__)

# ✅ Prikaz svih knjiga sa filtrima
@book_bp.route('/books', methods=['GET'])
def get_books():
    query = Book.query

    # Pretraga po naslovu ili autoru
    query_param = request.args.get('query')
    if query_param:
        query = query.filter(
            or_(
                Book.title.ilike(f"%{query_param}%"),
                Book.author.ilike(f"%{query_param}%")
            )
        )

    # Filtriranje po kategorijama (OR logika)
    categories = request.args.getlist('category')
    if categories:
        query = query.filter(Book.category.in_(categories))

    # Filtriranje po akciji i preporuci (AND logika)
    on_sale = request.args.get('on_sale') == 'true'
    recommended = request.args.get('recommended') == 'true'

    if on_sale and recommended:
        query = query.filter(
            Book.is_on_sale == True,
            Book.is_recommended == True
        )
    elif on_sale:
        query = query.filter(Book.is_on_sale == True)
    elif recommended:
        query = query.filter(Book.is_recommended == True)

    # Filtriranje po maksimalnoj ceni
    max_price = request.args.get('max_price')
    if max_price:
        try:
            query = query.filter(Book.price <= float(max_price))
        except ValueError:
            return jsonify({"error": "Neispravna vrednost za cenu"}), 400

    books = query.all()
    return jsonify([b.to_dict() for b in books]), 200

# ✅ Dodavanje nove knjige
@book_bp.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nema podataka"}), 400

    book = Book(
        title=data.get('title'),
        author=data.get('author'),
        description=data.get('description'),
        publisher=data.get('publisher'),
        price=data.get('price'),
        category=data.get('category'),
        is_recommended=data.get('is_recommended', False),
        is_on_sale=data.get('is_on_sale', False),
        image_url=data.get('image_url'),
        sale_price=data.get('sale_price')
    )
    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Knjiga uspešno dodata", "book_id": book.id}), 201

# ✅ Prikaz jedne knjige po ID-u
@book_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())

# ✅ Ažuriranje knjige po ID-u
@book_bp.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    book = Book.query.get_or_404(book_id)

    if 'title' in data:
        book.title = data['title']
    if 'author' in data:
        book.author = data['author']
    if 'price' in data:
        book.price = data['price']
    if 'sale_price' in data:
        book.sale_price = data['sale_price']
    if 'is_on_sale' in data:
        book.is_on_sale = data['is_on_sale']
    if 'description' in data:
        book.description = data['description']
    if 'image_url' in data:
        book.image_url = data['image_url']
    if 'publisher' in data:
        book.publisher = data['publisher']
    if 'category' in data:
        book.category = data['category']
    if 'is_recommended' in data:
        book.is_recommended = data['is_recommended']

    db.session.commit()
    return jsonify({'message': 'Knjiga uspešno ažurirana'}), 200
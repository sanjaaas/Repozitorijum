from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()

# 👤 Korisnik
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    wishlist_items = db.relationship('WishlistItem', backref='user', lazy=True)
    cart_items = db.relationship('CartItem', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)
    reset_tokens = db.relationship('PasswordResetToken', backref='user', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "is_admin": self.is_admin
        }

# 📚 Knjiga
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    publisher = db.Column(db.String(100))
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100))
    is_recommended = db.Column(db.Boolean, default=False)
    is_on_sale = db.Column(db.Boolean, default=False)
    sale_price = db.Column(db.Float)
    image_url = db.Column(db.String(300))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "publisher": self.publisher,
            "price": self.price,
            "sale_price": self.sale_price,
            "category": self.category,
            "is_recommended": self.is_recommended,
            "is_on_sale": self.is_on_sale,
            "image_url": self.image_url
        }

# 💖 Lista želja
class WishlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

    book = db.relationship('Book')

    def to_dict(self):
        return {
            "id": self.id,
            "book": self.book.to_dict()
        }

# 🛒 Korpa
class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    book = db.relationship('Book')

    def to_dict(self):
        return {
            "id": self.id,
            "book": self.book.to_dict(),
            "quantity": self.quantity
        }

# 💳 Porudžbina
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='Na čekanju')
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # 📦 Shipping info
    full_name = db.Column(db.String(100))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    phone = db.Column(db.String(30))

    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            "order_id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "total_price": self.total_price,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "full_name": self.full_name,
            "address": self.address,
            "city": self.city,
            "postal_code": self.postal_code,
            "phone": self.phone
        }

# 📦 Stavka porudžbine
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    book = db.relationship('Book')

    def to_dict(self):
        return {
            "book_id": self.book_id,
            "title": self.book.title,
            "quantity": self.quantity,
            "unit_price": self.book.price,
            "item_total": self.book.price * self.quantity
        }

# 🔐 Token za reset lozinke
class PasswordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(64), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(hours=1))

    def is_valid(self):
        return self.expires_at > datetime.utcnow()
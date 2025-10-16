from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.book_routes import book_bp
from routes.cart_routes import cart_bp
from routes.wishlist_routes import wishlist_bp
from routes.order_routes import order_bp
from routes.admin_routes import admin_bp
from routes.debug_routes import debug_bp
import os

app = Flask(__name__)

@app.route('/')
def index():
    return 'Backend radi!'

migrate = Migrate(app, db)

CORS(app, supports_credentials=True)

@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin == "http://localhost:3000":
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS, PATCH"
    return response


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(book_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(wishlist_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(debug_bp, url_prefix="/api")


with app.app_context():
    os.makedirs("instance", exist_ok=True)
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
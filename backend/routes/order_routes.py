from flask import Blueprint, request, jsonify
from models import db, Order, OrderItem, CartItem, Book
from utils.auth import token_required
from datetime import datetime

order_bp = Blueprint('order_bp', __name__)


@order_bp.route('/order/create', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()

    name = data.get("name")
    address = data.get("address")
    phone = data.get("phone")
   
    if not name or not address or not phone:
        return jsonify({"error": "Nedostaju podaci za dostavu"}), 400

    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        return jsonify({"error": "Korpa je prazna"}), 400

    total_price = sum(item.book.price * item.quantity for item in cart_items)

    order = Order(
        user_id=current_user.id,
        total_price=total_price,
        status="Na čekanju",
        created_at=datetime.utcnow(),
        full_name=name,
        address=address,
        phone=phone
    )
    db.session.add(order)
    db.session.flush()

    for item in cart_items:
        db.session.add(OrderItem(
            order_id=order.id,
            book_id=item.book_id,
            quantity=item.quantity
        ))

    CartItem.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()

    return jsonify({
        "message": "Porudžbina uspešno kreirana",
        "order_id": order.id,
        "total_price": total_price
    }), 201


@order_bp.route('/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            **o.to_dict(),
            "items": [item.to_dict() for item in o.items]
        } for o in orders
    ]), 200


@order_bp.route('/admin/orders', methods=['GET'])
def admin_get_all_orders():
    orders = Order.query.all()
    return jsonify([
        {
            **o.to_dict(),
            "items": [item.to_dict() for item in o.items]
        } for o in orders
    ]), 200


@order_bp.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Nedostaje novi status"}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Porudžbina nije pronađena"}), 404

    order.status = new_status
    db.session.commit()
    return jsonify({
        "message": "Status porudžbine ažuriran",
        "order_id": order.id,
        "new_status": new_status
    }), 200
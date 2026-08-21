from flask import Blueprint, request, jsonify

from database.db import db
from models.cart import Cart
from models.product import Product
from models.order import Order
from models.order_item import OrderItem


checkout_routes = Blueprint(
    "checkout_routes",
    __name__
)


# ==========================================
# CHECKOUT
# ==========================================

@checkout_routes.route("/checkout", methods=["POST"])
def checkout():

    try:
        data = request.json or {}

        user_id = data.get("user_id")

        # ==========================================
        # VALIDASI USER
        # ==========================================

        if not user_id or user_id == "undefined":
            return jsonify({
                "message": "User ID tidak valid!"
            }), 400

        user_id = int(user_id)

        # ==========================================
        # AMBIL CART USER
        # ==========================================

        cart_items = Cart.query.filter_by(
            user_id=user_id
        ).all()

        if not cart_items:
            return jsonify({
                "message": "Keranjang masih kosong!"
            }), 400

        # ==========================================
        # HITUNG TOTAL & CEK STOK
        # ==========================================

        total_price = 0

        checkout_items = []

        for cart_item in cart_items:

            product = Product.query.get(
                cart_item.product_id
            )

            if not product:
                return jsonify({
                    "message": (
                        f"Produk ID {cart_item.product_id} "
                        "tidak ditemukan!"
                    )
                }), 404

            if product.stock < cart_item.quantity:
                return jsonify({
                    "message": (
                        f"Stok produk "
                        f"{product.name} tidak mencukupi!"
                    )
                }), 400

            subtotal = (
                product.price *
                cart_item.quantity
            )

            total_price += subtotal

            checkout_items.append({
                "cart": cart_item,
                "product": product
            })

        # ==========================================
        # BUAT ORDER
        # ==========================================

        new_order = Order(
            user_id=user_id,
            total_price=total_price,
            status="pending"
        )

        db.session.add(new_order)

        # Supaya new_order.id langsung tersedia
        db.session.flush()

        # ==========================================
        # BUAT ORDER ITEMS
        # ==========================================

        for item in checkout_items:

            cart_item = item["cart"]
            product = item["product"]

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=cart_item.quantity,
                price=product.price
            )

            db.session.add(order_item)

            # Kurangi stok produk
            product.stock -= cart_item.quantity

            # Hapus produk dari cart
            db.session.delete(cart_item)

        # ==========================================
        # SIMPAN
        # ==========================================

        db.session.commit()

        return jsonify({
            "message": "Checkout berhasil!",
            "order_id": new_order.id,
            "total_price": total_price,
            "status": new_order.status
        }), 201

    except ValueError:
        return jsonify({
            "message": "User ID harus berupa angka!"
        }), 400

    except Exception as e:

        db.session.rollback()

        print(
            "Error checkout:",
            str(e)
        )

        return jsonify({
            "message": f"Checkout error: {str(e)}"
        }), 500
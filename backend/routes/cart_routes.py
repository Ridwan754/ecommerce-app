from flask import Blueprint, request, jsonify

from database.db import db
from models.cart import Cart
from models.product import Product


cart_routes = Blueprint(
    "cart_routes",
    __name__
)


# ==========================================
# GET KERANJANG BELANJA
# ==========================================

@cart_routes.route("/cart", methods=["GET"])
def get_cart():

    try:

        user_id = request.args.get("user_id")

        if not user_id or user_id == "undefined":
            return jsonify([]), 200

        cart_items = (
            db.session
            .query(Cart, Product)
            .join(
                Product,
                Cart.product_id == Product.id
            )
            .filter(
                Cart.user_id == int(user_id)
            )
            .all()
        )

        results = []

        for cart, product in cart_items:

            results.append({
                "cart_id": cart.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": cart.quantity,
                "subtotal": (
                    product.price * cart.quantity
                ),
                "image_url": product.image_url
            })

        return jsonify(results), 200

    except Exception as e:

        return jsonify({
            "message": f"Error fetch cart: {str(e)}"
        }), 500


# ==========================================
# POST TAMBAH ITEM KE KERANJANG
# ==========================================

@cart_routes.route("/cart", methods=["POST"])
def add_to_cart():

    try:

        data = request.json or {}

        user_id = data.get("user_id")
        product_id = data.get("product_id")

        # ==========================================
        # VALIDASI
        # ==========================================

        if (
            not user_id
            or not product_id
            or user_id == "undefined"
        ):

            return jsonify({
                "message": (
                    "Data user_id atau "
                    "product_id tidak valid"
                )
            }), 400

        # ==========================================
        # CEK PRODUK
        # ==========================================

        product = Product.query.get(product_id)

        if not product or product.stock < 1:

            return jsonify({
                "message": "Stok produk tidak mencukupi!"
            }), 400

        # ==========================================
        # CEK ITEM DI CART
        # ==========================================

        cart_item = Cart.query.filter_by(
            user_id=int(user_id),
            product_id=int(product_id)
        ).first()

        # Kalau sudah ada → quantity + 1
        if cart_item:

            cart_item.quantity += 1

        # Kalau belum ada → buat item baru
        else:

            cart_item = Cart(
                user_id=int(user_id),
                product_id=int(product_id),
                quantity=1
            )

            db.session.add(cart_item)

        # ==========================================
        # SIMPAN
        # ==========================================

        db.session.commit()

        return jsonify({
            "message": (
                "Berhasil ditambahkan "
                "ke keranjang"
            )
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "message": f"Error cart: {str(e)}"
        }), 500
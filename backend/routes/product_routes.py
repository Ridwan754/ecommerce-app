import os

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from database.db import db
from models.user import User
from models.product import Product


product_routes = Blueprint(
    "product_routes",
    __name__
)


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ==========================================
# GET SEMUA PRODUK
# ==========================================

@product_routes.route("/products", methods=["GET"])
def get_products():

    try:

        products = Product.query.all()

        results = []

        for p in products:

            results.append({
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "stock": p.stock,
                "image_url": p.image_url,
                "seller_id": p.seller_id
            })

        return jsonify(results), 200

    except Exception as e:

        print(
            "Error GET /products:",
            str(e)
        )

        return jsonify({
            "message": f"Database Error: {str(e)}"
        }), 500


# ==========================================
# POST TAMBAH PRODUK
# ==========================================

@product_routes.route("/products", methods=["POST"])
def add_product():

    try:

        # ==========================================
        # AMBIL DATA DARI JSON
        # ==========================================

        data = request.get_json() or {}

        name = data.get("name")
        price = data.get("price")
        stock = data.get("stock")
        user_id = data.get("user_id")
        image_url = data.get("image_url")


        # ==========================================
        # VALIDASI
        # ==========================================

        if not name:
            return jsonify({
                "message": "Nama produk wajib diisi!"
            }), 400

        if price is None:
            return jsonify({
                "message": "Harga produk wajib diisi!"
            }), 400

        if stock is None:
            return jsonify({
                "message": "Stock produk wajib diisi!"
            }), 400

        if user_id is None:
            return jsonify({
                "message": "User ID wajib diisi!"
            }), 400


        # ==========================================
        # KONVERSI DATA
        # ==========================================

        try:

            price = float(price)
            stock = int(stock)
            user_id = int(user_id)

        except (ValueError, TypeError):

            return jsonify({
                "message": "Price, stock, atau user_id tidak valid!"
            }), 400


        # ==========================================
        # CEK USER
        # ==========================================

        user = User.query.get(user_id)

        if not user:

            return jsonify({
                "message": "User tidak ditemukan. Silakan Re-login."
            }), 404


        # ==========================================
        # SIMPAN PRODUK
        # ==========================================

        new_product = Product(
            name=name,
            price=price,
            stock=stock,
            seller_id=user_id,
            image_url=image_url
        )


        db.session.add(new_product)

        db.session.commit()


        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({

            "message": "Produk berhasil ditambahkan!",

            "product": {
                "id": new_product.id,
                "name": new_product.name,
                "price": new_product.price,
                "stock": new_product.stock,
                "image_url": new_product.image_url,
                "seller_id": new_product.seller_id
            }

        }), 201


    except Exception as e:

        db.session.rollback()

        print(
            "Error POST /products:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500


# ==========================================
# GET DETAIL PRODUK
# ==========================================

@product_routes.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    try:

        product = Product.query.get(product_id)

        if not product:

            return jsonify({
                "message": "Produk tidak ditemukan!"
            }), 404


        return jsonify({

            "id": product.id,
            "name": product.name,
            "price": product.price,
            "stock": product.stock,
            "image_url": product.image_url,
            "seller_id": product.seller_id

        }), 200


    except Exception as e:

        print(
            "Error GET product:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500
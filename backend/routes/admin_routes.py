from flask import Blueprint, request, jsonify

from database.db import db

from models.user import User
from models.product import Product
from models.order import Order


admin_routes = Blueprint(
    "admin_routes",
    __name__
)


# ==========================================
# GET SEMUA USER
# ==========================================

@admin_routes.route("/admin/users", methods=["GET"])
def get_all_users():

    try:

        users = User.query.all()

        results = []

        for user in users:

            results.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            })

        return jsonify(results), 200

    except Exception as e:

        print(
            "Error GET /admin/users:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500


# ==========================================
# UBAH ROLE USER
# ==========================================

@admin_routes.route("/admin/change-role", methods=["POST"])
def change_user_role():

    try:

        data = request.get_json() or {}

        user_id = data.get("user_id")
        new_role = data.get("role")


        # ==========================================
        # VALIDASI DATA
        # ==========================================

        if not user_id:

            return jsonify({
                "message": "User ID wajib diisi!"
            }), 400


        if not new_role:

            return jsonify({
                "message": "Role wajib diisi!"
            }), 400


        # ==========================================
        # VALIDASI ROLE
        # ==========================================

        allowed_roles = [
            "admin",
            "seller",
            "buyer"
        ]

        if new_role not in allowed_roles:

            return jsonify({
                "message": (
                    "Role tidak valid! "
                    "Gunakan admin, seller, atau buyer."
                )
            }), 400


        # ==========================================
        # CARI USER
        # ==========================================

        user = User.query.get(int(user_id))

        if not user:

            return jsonify({
                "message": "User tidak ditemukan!"
            }), 404


        # ==========================================
        # UBAH ROLE
        # ==========================================

        user.role = new_role

        db.session.commit()


        return jsonify({

            "message": (
                f"Role user {user.username} "
                f"berhasil diubah menjadi {new_role}"
            ),

            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            }

        }), 200


    except ValueError:

        return jsonify({
            "message": "User ID harus berupa angka!"
        }), 400


    except Exception as e:

        db.session.rollback()

        print(
            "Error POST /admin/change-role:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500


# ==========================================
# GET SEMUA PRODUK UNTUK ADMIN
# ==========================================

@admin_routes.route("/admin/products", methods=["GET"])
def get_all_products():

    try:

        products = Product.query.all()

        results = []

        for product in products:

            seller = User.query.get(
                product.seller_id
            )

            results.append({

                "id": product.id,

                "name": product.name,

                "price": product.price,

                "stock": product.stock,

                "image_url": product.image_url,

                "seller_id": product.seller_id,

                "seller_name": (
                    seller.username
                    if seller
                    else None
                )

            })

        return jsonify(results), 200


    except Exception as e:

        print(
            "Error GET /admin/products:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500


# ==========================================
# GET SEMUA ORDER UNTUK ADMIN
# ==========================================

@admin_routes.route("/admin/orders", methods=["GET"])
def get_all_orders():

    try:

        orders = (
            Order.query
            .order_by(Order.created_at.desc())
            .all()
        )

        results = []

        for order in orders:

            items = []

            for item in order.items:

                items.append({

                    "id": item.id,

                    "product_id": item.product_id,

                    "product_name": (
                        item.product.name
                        if item.product
                        else None
                    ),

                    "quantity": item.quantity,

                    "price": item.price,

                    "subtotal": (
                        item.price * item.quantity
                    )

                })


            # ==========================================
            # CARI USER PEMBELI
            # ==========================================

            user = User.query.get(
                order.user_id
            )


            # ==========================================
            # HASIL ORDER
            # ==========================================

            results.append({

                "id": order.id,

                "user_id": order.user_id,

                "username": (
                    user.username
                    if user
                    else None
                ),

                "email": (
                    user.email
                    if user
                    else None
                ),

                "total_price": order.total_price,

                "status": order.status,

                "created_at": (
                    order.created_at.isoformat()
                    if order.created_at
                    else None
                ),

                "items": items

            })


        return jsonify(results), 200


    except Exception as e:

        print(
            "Error GET /admin/orders:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500
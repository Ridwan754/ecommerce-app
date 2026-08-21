from flask import Blueprint, request, jsonify

from models.order import Order


order_routes = Blueprint(
    "order_routes",
    __name__
)


# ==========================================
# GET RIWAYAT ORDER USER
# ==========================================

@order_routes.route("/orders", methods=["GET"])
def get_orders():

    try:
        user_id = request.args.get("user_id")

        if not user_id or user_id == "undefined":
            return jsonify({
                "message": "User ID tidak valid!"
            }), 400

        user_id = int(user_id)

        orders = (
            Order.query
            .filter_by(user_id=user_id)
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

            results.append({
                "id": order.id,
                "user_id": order.user_id,
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

    except ValueError:

        return jsonify({
            "message": "User ID harus berupa angka!"
        }), 400

    except Exception as e:

        print(
            "Error get orders:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500
import jwt

from flask import Blueprint, request, jsonify

from database.db import db
from models.user import User


auth_routes = Blueprint(
    "auth_routes",
    __name__
)


# ==========================================
# GOOGLE LOGIN
# ==========================================

@auth_routes.route("/google-login", methods=["POST"])
def google_login():

    try:
        data = request.json or {}

        token = data.get("token")

        if not token:
            return jsonify({
                "message": "Token tidak ditemukan!"
            }), 400

        # Decode token JWT dari Google
        # Untuk environment development, signature
        # belum diverifikasi seperti pada kode lama.
        decoded = jwt.decode(
            token,
            options={
                "verify_signature": False
            }
        )

        email = decoded.get("email")
        google_id = decoded.get("sub")
        name = decoded.get(
            "name",
            email.split("@")[0] if email else "User"
        )

        if not email:
            return jsonify({
                "message": "Email tidak valid di token Google!"
            }), 400

        # ==========================================
        # CARI USER
        # ==========================================

        user = User.query.filter_by(
            email=email
        ).first()

        # ==========================================
        # BUAT USER BARU JIKA BELUM ADA
        # ==========================================

        if not user:

            user = User(
                username=name,
                email=email,
                google_id=google_id
            )

            db.session.add(user)
            db.session.commit()

        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "google_id": user.google_id
        }), 200

    except Exception as e:

        print(
            "Error Google Login:",
            str(e)
        )

        return jsonify({
            "message": f"Server Error: {str(e)}"
        }), 500
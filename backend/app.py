import os

from flask import Flask
from flask_cors import CORS

from database.db import db

# Import semua model
from models import User, Product, Cart


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# CONFIGURATION
# ==========================================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + os.path.join(BASE_DIR, "database.db")
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# ==========================================
# UPLOAD CONFIGURATION
# ==========================================

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ==========================================
# CORS
# ==========================================

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    }
)


# ==========================================
# DATABASE
# ==========================================

db.init_app(app)


# ==========================================
# CREATE DATABASE
# ==========================================

with app.app_context():
    db.create_all()


# ==========================================
# TEST ROUTE
# ==========================================

@app.route("/")
def home():
    return {
        "message": "Backend Ecommerce berhasil berjalan!"
    }


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
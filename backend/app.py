import os

from flask import Flask
from flask_cors import CORS

from database.db import db

# ==========================================
# IMPORT MODELS
# ==========================================

from models import User, Product, Cart


# ==========================================
# IMPORT ROUTES
# ==========================================

from routes.auth_routes import auth_routes
from routes.product_routes import product_routes
from routes.cart_routes import cart_routes
from routes.checkout_routes import checkout_routes
from routes.order_routes import order_routes
from routes.admin_routes import admin_routes
from routes.upload_routes import upload_routes


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# CONFIGURATION
# ==========================================

BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///"
    + os.path.join(
        BASE_DIR,
        "database.db"
    )
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# ==========================================
# UPLOAD CONFIGURATION
# ==========================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

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
# REGISTER ROUTES
# ==========================================

app.register_blueprint(auth_routes)
app.register_blueprint(product_routes)
app.register_blueprint(cart_routes)
app.register_blueprint(checkout_routes)
app.register_blueprint(order_routes)
app.register_blueprint(admin_routes)
app.register_blueprint(upload_routes)


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
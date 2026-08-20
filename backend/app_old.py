import os
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

load_dotenv()

app = Flask(__name__)

# ---------------------------------------------------------------------------
# KONFIGURASI APLIKASI & DATABASE
# ---------------------------------------------------------------------------
# 1. Konfigurasi CORS agar Frontend (localhost:5173) diizinkan akses full
CORS(app, resources={r"/*": {"origins": "*"}})

# 2. Konfigurasi SQLite Database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 3. Konfigurasi Folder Upload Gambar
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

db = SQLAlchemy(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------------------------------------------------------------------
# MODEL DATABASE (ORM)
# ---------------------------------------------------------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Role: 'admin', 'seller', 'buyer' (Default otomatis jadi 'buyer')
    role = db.Column(db.String(20), nullable=False, default='buyer')

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    # Produk harus terhubung ke Seller yang membuatnya
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)

# Inisialisasi Database
with app.app_context():
    db.create_all()

# ---------------------------------------------------------------------------
# ENDPOINT / ROUTE API
# ---------------------------------------------------------------------------

# Route untuk mengakses file gambar statis dari browser
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 1. AUTHENTICATION / GOOGLE LOGIN SIMULATION
import jwt  # Pastikan di-import di bagian paling atas app.py

# Route khusus Admin: Melihat semua user
@app.route('/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    results = [{"id": u.id, "username": u.username, "email": u.email, "role": u.role} for u in users]
    return jsonify(results), 200

# Route khusus Admin: Mengubah Role User
@app.route('/admin/change-role', methods=['POST'])
def change_user_role():
    data = request.json or {}
    user_id = data.get('user_id')
    new_role = data.get('role')

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User tidak ditemukan"}), 404

    user.role = new_role
    db.session.commit()
    return jsonify({"message": f"Role berhasil diubah menjadi {new_role}"}), 200

@app.route('/google-login', methods=['POST'])
def google_login():
    try:
        data = request.json or {}
        token = data.get('token')

        if not token:
            return jsonify({"message": "Token tidak ditemukan!"}), 400

        # Decode token JWT dari Google tanpa verifikasi signature untuk lingkungan dev
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        email = decoded.get('email')
        google_id = decoded.get('sub')
        name = decoded.get('name', email.split('@')[0])

        if not email:
            return jsonify({"message": "Email tidak valid di token Google!"}), 400

        # Cari user di database SQLite atau buat baru jika belum ada
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(username=name, email=email, google_id=google_id)
            db.session.add(user)
            db.session.commit()

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "google_id": user.google_id
        }), 200

    except Exception as e:
        print("Error Google Login:", str(e))
        return jsonify({"message": f"Server Error: {str(e)}"}), 500

# 2. GET SEMUA PRODUK (KATALOG)
@app.route('/products', methods=['GET'])
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
        print("Error GET /products:", str(e))
        return jsonify({"message": f"Database Error: {str(e)}"}), 500

# 3. POST TAMBAH PRODUK BARU (WITH FILE UPLOAD)
@app.route('/products', methods=['POST'])
def add_product():
    try:
        name = request.form.get('name')
        price = request.form.get('price')
        stock = request.form.get('stock')
        user_id = request.form.get('user_id')

        # Validasi Input
        if not name or not price or not stock or not user_id or user_id == 'undefined':
            return jsonify({"message": "Data tidak lengkap atau User ID tidak valid!"}), 400

        # Cek ketersediaan user di database
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({"message": "User tidak ditemukan. Silakan Re-login."}), 404

        # Upload Gambar jika ada
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Tambahkan prefix unik agar nama file tidak terbentrok
                unique_filename = f"{user_id}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)
                image_url = f"http://localhost:5000/uploads/{unique_filename}"

        # Simpan Produk Baru ke SQLite
        new_product = Product(
            name=name,
            price=float(price),
            stock=int(stock),
            user_id=int(user_id),
            image_url=image_url
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Produk berhasil ditambahkan!", "product_id": new_product.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server Error: {str(e)}"}), 500

# 4. GET KERANJANG BELANJA
@app.route('/cart', methods=['GET'])
def get_cart():
    try:
        user_id = request.args.get('user_id')
        if not user_id or user_id == 'undefined':
            return jsonify([]), 200

        cart_items = db.session.query(Cart, Product).join(Product, Cart.product_id == Product.id).filter(Cart.user_id == int(user_id)).all()

        results = []
        for cart, product in cart_items:
            results.append({
                "cart_id": cart.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": cart.quantity,
                "subtotal": product.price * cart.quantity,
                "image_url": product.image_url
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": f"Error fetch cart: {str(e)}"}), 500

# 5. POST TAMBAH ITEM KE KERANJANG
@app.route('/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.json or {}
        user_id = data.get('user_id')
        product_id = data.get('product_id')

        if not user_id or not product_id or user_id == 'undefined':
            return jsonify({"message": "Data user_id atau product_id tidak valid"}), 400

        product = Product.query.get(product_id)
        if not product or product.stock < 1:
            return jsonify({"message": "Stok produk tidak mencukupi!"}), 400

        cart_item = Cart.query.filter_by(user_id=int(user_id), product_id=int(product_id)).first()

        if cart_item:
            cart_item.quantity += 1
        else:
            cart_item = Cart(user_id=int(user_id), product_id=int(product_id), quantity=1)
            db.session.add(cart_item)

        db.session.commit()
        return jsonify({"message": "Berhasil ditambahkan ke keranjang"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error cart: {str(e)}"}), 500

# 6. POST CHECKOUT
@app.route('/checkout', methods=['POST'])
def checkout():
    try:
        data = request.json or {}
        user_id = data.get('user_id')

        if not user_id or user_id == 'undefined':
            return jsonify({"message": "User ID tidak valid!"}), 400

        cart_items = Cart.query.filter_by(user_id=int(user_id)).all()
        if not cart_items:
            return jsonify({"message": "Keranjang belanja kosong!"}), 400

        # Pengurangan stok produk
        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                product.stock = max(0, product.stock - item.quantity)
            db.session.delete(item)

        db.session.commit()
        return jsonify({"message": "Checkout berhasil!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error checkout: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
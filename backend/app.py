import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit, join_room
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Load environment variables dari .env
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Konfigurasi Database Lokal (Ganti default sesuai database lokal Anda)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'postgresql://postgres:Ridwan123@localhost:5432/ecommerce_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'rahasia-super-ecom-2026')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

# Konfigurasi Folder Penyimpanan Gambar Produk Lokal
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Otomatis buat folder jika belum ada
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Inisialisasi Database, JWT, dan SocketIO
db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# --- MODEL DATABASE ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'seller', 'buyer'

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)

# Otomatis buat tabel di database lokal jika belum ada
with app.app_context():
    db.create_all()

# --- ROUTE UNTUK MENAMPILKAN GAMBAR ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- ROUTES & CONTROLLERS ---

@app.route('/')
def index():
    return jsonify({"message": "API Backend Ecommerce Berjalan!"})

# Route Tambah Produk (Upload Gambar ke Folder Lokal)
@app.route('/products', methods=['POST'])
def add_product():
    name = request.form.get('name')
    price = request.form.get('price')
    image_file = request.files.get('image')

    image_url = None

    if image_file:
        # Amankan nama file dan simpan ke folder static/uploads
        filename = secure_filename(image_file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(file_path)

        # Buat URL lokal gambar yang bisa diakses frontend
        image_url = f"http://localhost:5000/uploads/{filename}"

    new_product = Product(name=name, price=float(price), image_url=image_url)
    db.session.add(new_product)
    db.session.commit()

    return jsonify({
        "message": "Produk berhasil ditambahkan!", 
        "product": {
            "id": new_product.id,
            "name": name, 
            "price": price, 
            "image_url": image_url
        }
    }), 201

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
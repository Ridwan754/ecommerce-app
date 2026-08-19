from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit, join_room
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Konfigurasi Database PostgreSQL 18 & JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Ridwan123@127.0.0.1:5432/ecommerce_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'rahasia-super-ecom-2026'
GOOGLE_CLIENT_ID = "644147848430-pv2j9s9v77b8fnh0b21rglpfsqj4snru.apps.googleusercontent.com"
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
    stock = db.Column(db.Integer, default=1)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(30), default='PENDING') # PENDING, PAID, WAITING_VERIFICATION, SHIPPED, REJECTED
    payment_method = db.Column(db.String(20)) # GATEWAY, COD, MANUAL_TF
    payment_proof = db.Column(db.String(200), nullable=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(50), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

# --- AUTH ENDPOINTS ---
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'message': 'Username sudah digunakan'}), 400
    
    hashed_pw = generate_password_hash(data.get('password'))
    new_user = User(username=data.get('username'), password=hashed_pw, role=data.get('role', 'buyer'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': f'Akun {data.get("role", "buyer")} berhasil dibuat'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'message': 'Username/password salah'}), 401

    token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify({'token': token, 'user': {'id': user.id, 'username': user.username, 'role': user.role}}), 200

# --- ADMIN ENDPOINT (MEMBUAT SELLER / BUYER) ---
@app.route('/admin/create-user', methods=['POST'])
@jwt_required()
def admin_create_user():
    curr = get_jwt_identity()
    if curr['role'] != 'admin':
        return jsonify({'message': 'Hanya Admin'}), 403
    
    data = request.json
    hashed_pw = generate_password_hash(data.get('password'))
    new_user = User(username=data.get('username'), password=hashed_pw, role=data.get('role'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': f'Admin berhasil membuat user {data.get("role")}'}), 201

# --- PRODUCT ENDPOINTS ---
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'price': p.price, 'stock': p.stock, 'seller_id': p.seller_id} for p in products]), 200

@app.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    curr = get_jwt_identity()
    if curr['role'] != 'seller':
        return jsonify({'message': 'Hanya Seller yang bisa tambah barang'}), 403
    
    data = request.json
    p = Product(name=data['name'], price=float(data['price']), stock=int(data['stock']), seller_id=curr['id'])
    db.session.add(p)
    db.session.commit()
    return jsonify({'message': 'Produk berhasil diterbitkan'}), 201

# --- CHECKOUT WITH CONCURRENCY LOCK (ROW LEVEL LOCKING) ---
@app.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    curr = get_jwt_identity()
    data = request.json
    product_id = data.get('product_id')
    payment_method = data.get('payment_method')

    try:
        # Mengunci baris produk ini. Jika 4 orang checkout bersamaan,
        # pembeli 2, 3, dan 4 akan mengantre hingga transaksi pembeli 1 selesai.
        product = Product.query.with_for_update().filter_by(id=product_id).first()

        if not product:
            return jsonify({'message': 'Produk tidak ditemukan'}), 404

        if product.stock < 1:
            return jsonify({'message': 'Stok habis! Anda kalah cepat/masuk antrean'}), 400

        product.stock -= 1

        order = Order(
            buyer_id=curr['id'],
            product_id=product.id,
            payment_method=payment_method,
            status='PAID' if payment_method == 'GATEWAY' else ('SHIPPED' if payment_method == 'COD' else 'PENDING')
        )
        db.session.add(order)
        db.session.commit()

        return jsonify({'message': 'Checkout Berhasil!', 'order_id': order.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Terjadi kesalahan sistem', 'error': str(e)}), 500

# --- WEBSOCKET REALTIME CHAT ---
@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)

@socketio.on('send_message')
def handle_message(data):
    room = data['room']
    msg = Message(room=room, sender_id=data['sender_id'], content=data['content'])
    db.session.add(msg)
    db.session.commit()
    emit('receive_message', {'sender_id': data['sender_id'], 'content': data['content']}, room=room)


@app.route('/google-login', methods=['POST'])
def google_login():
    data = request.json
    token = data.get('credential')
    selected_role = data.get('role', 'buyer')

    try:
        # Verifikasi token dari frontend dengan Google
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info['email']

        # Cek apakah user sudah ada di database
        user = User.query.filter_by(username=email).first()

        if not user:
            # Jika belum ada, buat akun baru secara otomatis
            random_pw = generate_password_hash('google_oauth_default_password')
            user = User(username=email, password=random_pw, role=selected_role)
            db.session.add(user)
            db.session.commit()

        # Buatkan token akses JWT
        access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
        return jsonify({
            'token': access_token,
            'user': {'id': user.id, 'username': user.username, 'role': user.role}
        }), 200

    except Exception as e:
        print("Google Auth Error:", str(e))
        return jsonify({'message': f'Gagal Login via Google: {str(e)}'}), 400
    
if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
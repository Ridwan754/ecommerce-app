import os
from app import app, db, User, Product

with app.app_context():
    # 1. Hapus & buat ulang semua tabel secara bersih
    db.drop_all()
    db.create_all()
    print("1. Tabel Database berhasil diperbarui!")

    # 2. Buat User Pertama (Sebagai Admin & Seller)
    user = User(
        username="putra puts",
        email="putra.puts@gmail.com",  # Sesuaikan dengan email google Anda jika berbeda
        role="seller"  # Langsung dijadikan Seller agar Form Tambah Produk muncul
    )
    db.session.add(user)
    db.session.commit()
    print(f"2. User {user.username} berhasil dibuat dengan Role: {user.role}")

    # 3. Buat 1 Produk Contoh
    sample_product = Product(
        name="Sepatu Sneakers Cool",
        price=250000,
        stock=15,
        seller_id=user.id,
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    )
    db.session.add(sample_product)
    db.session.commit()
    print("3. Produk contoh berhasil ditambahkan ke katalog!")
from app import app, db, User, Product

with app.app_context():
    # 1. Cari user pertama di database dan ubah rolenya menjadi seller
    user = User.query.first()
    if user:
        user.role = 'seller'
        print(f"✅ Role {user.username} ({user.email}) berhasil diubah menjadi: {user.role}")
    else:
        print("⚠️ Belum ada user di database. Login dulu di website!")

    # 2. Tambahkan 1 produk dummy jika belum ada produk sama sekali
    if Product.query.count() == 0 and user:
        sample_product = Product(
            name="Sepatu Sneakers Cool",
            price=250000,
            stock=15,
            seller_id=user.id,
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        )
        db.session.add(sample_product)
        print("✅ Produk contoh berhasil ditambahkan ke katalog!")

    db.session.commit()
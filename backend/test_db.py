import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

db_url = os.getenv('DATABASE_URL')
print(f"Mencoba koneksi ke: {db_url}")

try:
    conn = psycopg2.connect(db_url)
    print("✅ KONEKSI BERHASIL! Database Supabase terhubung tanpa masalah.")
    conn.close()
except Exception as e:
    print("❌ KONEKSI GAGAL!")
    print(f"Detail Error: {e}")
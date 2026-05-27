import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "hospital.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Số bảng:", len(tables))
print("Danh sách bảng:")

for t in tables:
    print("-", t[0])

conn.close()
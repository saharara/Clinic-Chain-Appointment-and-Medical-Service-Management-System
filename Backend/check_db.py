# database.py

import aiosqlite
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "hospital.db"


async def get_connection():
    conn = await aiosqlite.connect(DB_PATH)
    conn.row_factory = aiosqlite.Row

    await conn.execute("PRAGMA foreign_keys = ON;")

    return conn
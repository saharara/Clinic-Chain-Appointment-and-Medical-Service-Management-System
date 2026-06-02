import os
import aiomysql
from dotenv import load_dotenv

load_dotenv("Backend/.env")

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


async def get_connection():
    try:
        conn = await aiomysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_NAME,
            autocommit=True
        )

        print("Connected to MySQL successfully")
        return conn

    except Exception as e:
        print(f"Failed to connect to MySQL: {e}")
        raise
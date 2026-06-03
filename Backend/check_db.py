import os
from pathlib import Path
from typing import Any, Optional, Sequence

import aiomysql
from dotenv import load_dotenv


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)

_pool: Optional[aiomysql.Pool] = None


def _get_required_env(name: str) -> str:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        raise RuntimeError(f"Missing required database environment variable: {name}")
    return value.strip()


async def get_pool() -> aiomysql.Pool:
    global _pool

    if _pool is None:
        _pool = await aiomysql.create_pool(
            host=_get_required_env("DB_HOST"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=_get_required_env("DB_USER"),
            password=_get_required_env("DB_PASSWORD"),
            db=_get_required_env("DB_NAME"),
            charset="utf8mb4",
            autocommit=False,
            minsize=1,
            maxsize=10,
            cursorclass=aiomysql.DictCursor,
        )

    return _pool


class MySQLConnection:
    def __init__(self, pool: aiomysql.Pool, connection: aiomysql.Connection):
        self._pool = pool
        self._connection = connection

    async def execute(self, sql: str, params: Optional[Sequence[Any]] = None):
        cursor = await self._connection.cursor()
        await cursor.execute(sql, params or ())
        return cursor

    async def commit(self) -> None:
        await self._connection.commit()

    async def rollback(self) -> None:
        await self._connection.rollback()

    async def close(self) -> None:
        self._pool.release(self._connection)


async def get_connection() -> MySQLConnection:
    pool = await get_pool()
    connection = await pool.acquire()
    return MySQLConnection(pool, connection)


async def close_pool() -> None:
    global _pool

    if _pool is not None:
        _pool.close()
        await _pool.wait_closed()
        _pool = None

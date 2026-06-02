from database import get_connection

from entities.bacsi import BacSi
from entities.benh_nhan import BenhNhan
from entities.le_tan import LeTan
from entities.xet_nghiem import XetNghiemVien
from aiomysql import DictCursor

async def login_doctor(
    MaBacSi: str,
    password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM BAC_SI
                WHERE MaBacSi = %s
            """, (MaBacSi,))

            row = await cursor.fetchone()

            if not row:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            bacsi = BacSi.from_dict(dict(row))

            if bacsi.MatKhau != password:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            return {
                "success": True,
                "message": "Đăng nhập thành công",
                "data": {
                    "MaBacSi": bacsi.MaBacSi,
                    "HoTen": bacsi.HoTen,
                    "ChuyenKhoa": bacsi.ChuyenKhoa
                }
            }

    finally:
        conn.close()

async def login_patient(
    MaBenhAn: str,
    password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM BENH_NHAN
                WHERE MaBenhAn = %s
            """, (MaBenhAn,))

            row = await cursor.fetchone()

            if not row:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            benhnhan = BenhNhan.from_dict(dict(row))

            if benhnhan.MatKhau != password:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            return {
                "success": True,
                "message": "Đăng nhập thành công",
                "data": {
                    "MaBenhAn": benhnhan.MaBenhAn,
                    "HoTen": benhnhan.HoTen
                }
            }

    finally:
        conn.close()


async def login_le_tan(
    MaLeTan: str,
    password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM LE_TAN
                WHERE MaLeTan = %s
            """, (MaLeTan,))

            row = await cursor.fetchone()

            if not row:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            letan = LeTan.from_dict(dict(row))

            if letan.MatKhau != password:
                return {
                    "success": False,
                    "message": "Tài khoản hoặc mật khẩu sai.",
                    "data": None
                }

            return {
                "success": True,
                "message": "Đăng nhập thành công",
                "data": {
                    "MaLeTan": letan.MaLeTan,
                    "HoTen": letan.HoTen
                }
            }

    finally:
        conn.close()


async def login_xet_nghiemVien(
    MaXetNghiemVien: str,
    password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM XET_NGHIEM_VIEN
                WHERE MaXNV = ?
            """, (MaXetNghiemVien,))

        row = await cursor.fetchone()

        if not row:
            return {
                "success": False,
                "message": "Tài khoản hoặc mật khẩu sai.",
                "data": None
            }

        xnv = XetNghiemVien.from_dict(dict(row))

        if xnv.MatKhau != password:
            return {
                "success": False,
                "message": "Tài khoản hoặc mật khẩu sai.",
                "data": None
            }

        return {
            "success": True,
            "message": "Đăng nhập thành công",
            "data": {
                "MaXNV": xnv.MaXNV,
                "HoTen": xnv.HoTen
            }
        }

    finally:
        conn.close()


async def logout_service():

    return {
        "success": True,
        "message": "Đăng xuất thành công",
        "data": None
    }


async def login_admin(
    username: str,
    password: str
):

    if username == "admin" and password == "admin":

        return {
            "success": True,
            "message": "Đăng nhập thành công",
            "data": {
                "username": username
            }
        }

    return {
        "success": False,
        "message": "Tài khoản hoặc mật khẩu sai.",
        "data": None
    }


async def create_doctor_account(
    name: str,
    MaBacSi: str,
    chuyen_khoa: str,
    sdt: str,
    password: str,
    MaChiNhanh: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM BAC_SI
                WHERE MaBacSi = %s
            """, (MaBacSi,))

            existed = await cursor.fetchone()

            if existed:
                return {
                    "success": False,
                    "message": "Tài khoản đã tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                INSERT INTO BAC_SI (
                    MaBacSi,
                    HoTen,
                    ChuyenKhoa,
                    SDT,
                    MatKhau,
                    MaChiNhanh
                )
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                MaBacSi,
                name,
                chuyen_khoa,
                sdt,
                password,
                MaChiNhanh
            ))

        await conn.commit()

        return {
            "success": True,
            "message": "Tạo tài khoản bác sĩ thành công",
            "data": {
                "MaBacSi": MaBacSi
            }
        }

    except Exception as e:

        await conn.rollback()

        return {
            "success": False,
            "message": str(e),
            "data": None
        }

    finally:
        conn.close()
        
async def delete_doctor_account(
    MaBacSi: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM BAC_SI
                WHERE MaBacSi = %s
            """, (MaBacSi,))

            doctor = await cursor.fetchone()

            if not doctor:
                return {
                    "success": False,
                    "message": "Tài khoản không tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                DELETE FROM BAC_SI
                WHERE MaBacSi = %s
            """, (MaBacSi,))

        await conn.commit()

        return {
            "success": True,
            "message": "Xóa tài khoản bác sĩ thành công",
            "data": None
        }

    finally:
        conn.close()


async def create_xnv_account(
    name: str,
    MaXNV: str,
    sdt: str,
    password: str,
    MaChiNhanh: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM XET_NGHIEM_VIEN
                WHERE MaXNV = %s
            """, (MaXNV,))

            existed = await cursor.fetchone()

            if existed:
                return {
                    "success": False,
                    "message": "Tài khoản đã tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                INSERT INTO XET_NGHIEM_VIEN (
                    MaXNV,
                    HoTen,
                    SDT,
                    MatKhau,
                    MaChiNhanh
                )
                VALUES (%s, %s, %s, %s, %s)
            """, (
                MaXNV,
                name,
                sdt,
                password,
                MaChiNhanh
            ))

        await conn.commit()

        return {
            "success": True,
            "message": "Tạo tài khoản xét nghiệm viên thành công",
            "data": {
                "MaXNV": MaXNV
            }
        }

    finally:
        conn.close()


async def delete_xnv_account(
    MaXNV: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM XET_NGHIEM_VIEN
                WHERE MaXNV = %s
            """, (MaXNV,))

            xnv = await cursor.fetchone()

            if not xnv:
                return {
                    "success": False,
                    "message": "Tài khoản không tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                DELETE FROM XET_NGHIEM_VIEN
                WHERE MaXNV = %s
            """, (MaXNV,))

        await conn.commit()

        return {
            "success": True,
            "message": "Xóa tài khoản xét nghiệm viên thành công",
            "data": None
        }

    finally:
        conn.close()


async def change_doctor_password(
    MaBacSi: str,
    new_password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM BAC_SI
                WHERE MaBacSi = %s
            """, (MaBacSi,))

            doctor = await cursor.fetchone()

            if not doctor:
                return {
                    "success": False,
                    "message": "Tài khoản không tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                UPDATE BAC_SI
                SET MatKhau = %s
                WHERE MaBacSi = %s
            """, (
                new_password,
                MaBacSi
            ))

        await conn.commit()

        return {
            "success": True,
            "message": "Đổi mật khẩu bác sĩ thành công",
            "data": None
        }

    finally:
        conn.close()


async def change_xnv_password(
    MaXNV: str,
    new_password: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM XET_NGHIEM_VIEN
                WHERE MaXNV = %s
            """, (MaXNV,))

            xnv = await cursor.fetchone()

            if not xnv:
                return {
                    "success": False,
                    "message": "Tài khoản không tồn tại.",
                    "data": None
                }

            await cursor.execute("""
                UPDATE XET_NGHIEM_VIEN
                SET MatKhau = %s
                WHERE MaXNV = %s
            """, (
                new_password,
                MaXNV
            ))

        await conn.commit()

        return {
            "success": True,
            "message": "Đổi mật khẩu xét nghiệm viên thành công",
            "data": None
        }

    finally:
        conn.close()

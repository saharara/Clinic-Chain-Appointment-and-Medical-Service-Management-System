from check_db import get_connection

from entities.bacsi import BacSi
from entities.benh_nhan import BenhNhan
from entities.le_tan import LeTan
from entities.xet_nghiem import XetNghiemVien

async def login_doctor(
    MaBacSi: str,
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM BAC_SI
            WHERE MaBacSi = ?
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
        await conn.close()

async def login_patient(
    MaBenhAn: str,
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM BENH_NHAN
            WHERE MaBenhAn = ?
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
        await conn.close()


async def login_le_tan(
    MaLeTan: str,
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM LE_TAN
            WHERE MaLeTan = ?
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
        await conn.close()


async def login_xet_nghiemVien(
    MaXetNghiemVien: str,
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
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
        await conn.close()


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
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM BAC_SI
            WHERE MaBacSi = ?
        """, (MaBacSi,))

        existed = await cursor.fetchone()

        if existed:
            return {
                "success": False,
                "message": "Tài khoản đã tồn tại.",
                "data": None
            }

        await conn.execute("""
            INSERT INTO BAC_SI (
                MaBacSi,
                HoTen,
                ChuyenKhoa,
                SDT,
                MatKhau
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            MaBacSi,
            name,
            chuyen_khoa,
            sdt,
            password
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
        await conn.close()
        
async def delete_doctor_account(
    MaBacSi: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM BAC_SI
            WHERE MaBacSi = ?
        """, (MaBacSi,))

        doctor = await cursor.fetchone()

        if not doctor:
            return {
                "success": False,
                "message": "Tài khoản không tồn tại.",
                "data": None
            }

        await conn.execute("""
            DELETE FROM BAC_SI
            WHERE MaBacSi = ?
        """, (MaBacSi,))

        await conn.commit()

        return {
            "success": True,
            "message": "Xóa tài khoản bác sĩ thành công",
            "data": None
        }

    finally:
        await conn.close()


async def create_xnv_account(
    name: str,
    MaXNV: str,
    sdt: str,
    password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM XET_NGHIEM_VIEN
            WHERE MaXNV = ?
        """, (MaXNV,))

        existed = await cursor.fetchone()

        if existed:
            return {
                "success": False,
                "message": "Tài khoản đã tồn tại.",
                "data": None
            }

        await conn.execute("""
            INSERT INTO XET_NGHIEM_VIEN (
                MaXNV,
                HoTen,
                SDT,
                MatKhau
            )
            VALUES (?, ?, ?, ?)
        """, (
            MaXNV,
            name,
            sdt,
            password
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
        await conn.close()


async def delete_xnv_account(
    MaXNV: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM XET_NGHIEM_VIEN
            WHERE MaXNV = ?
        """, (MaXNV,))

        xnv = await cursor.fetchone()

        if not xnv:
            return {
                "success": False,
                "message": "Tài khoản không tồn tại.",
                "data": None
            }

        await conn.execute("""
            DELETE FROM XET_NGHIEM_VIEN
            WHERE MaXNV = ?
        """, (MaXNV,))

        await conn.commit()

        return {
            "success": True,
            "message": "Xóa tài khoản xét nghiệm viên thành công",
            "data": None
        }

    finally:
        await conn.close()


async def change_doctor_password(
    MaBacSi: str,
    new_password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM BAC_SI
            WHERE MaBacSi = ?
        """, (MaBacSi,))

        doctor = await cursor.fetchone()

        if not doctor:
            return {
                "success": False,
                "message": "Tài khoản không tồn tại.",
                "data": None
            }

        await conn.execute("""
            UPDATE BAC_SI
            SET MatKhau = ?
            WHERE MaBacSi = ?
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
        await conn.close()


async def change_xnv_password(
    MaXNV: str,
    new_password: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM XET_NGHIEM_VIEN
            WHERE MaXNV = ?
        """, (MaXNV,))

        xnv = await cursor.fetchone()

        if not xnv:
            return {
                "success": False,
                "message": "Tài khoản không tồn tại.",
                "data": None
            }

        await conn.execute("""
            UPDATE XET_NGHIEM_VIEN
            SET MatKhau = ?
            WHERE MaXNV = ?
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
        await conn.close()

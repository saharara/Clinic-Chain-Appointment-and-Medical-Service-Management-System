from entities.bacsi import BacSi
from entities.benh_nhan import BenhNhan
from entities.le_tan import LeTan
from entities.xet_nghiem import XetNghiemVien


async def login_doctor(MaBacSi: str, password: str):
    bacsi = await BacSi.query.where(BacSi.MaBacSi == MaBacSi).gino.first()
    if not bacsi:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    if bacsi.MatKhau != password:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    return {
        "success": True,
        "message": "Đăng nhập thành công",
        "data": bacsi
    }

async def login_patient(MaBenhNhan: str, password: str):
    benhnhan = await BenhNhan.query.where(BenhNhan.MaBenhNhan == MaBenhNhan).gino.first()
    if not benhnhan:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    if benhnhan.MatKhau != password:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    return {
        "success": True,
        "message": "Đăng nhập thành công",
        "data": benhnhan
    }

async def login_le_tan(MaLeTan: str, password: str):
    le_tan = await LeTan.query.where(LeTan.MaLeTan == MaLeTan).gino.first()
    if not le_tan:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    if le_tan.MatKhau != password:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    return {
        "success": True,
        "message": "Đăng nhập thành công",
        "data": le_tan
    }

async def login_xet_nghiemVien(MaXetNghiemVien: str, password: str):
    xet_nghiem_vien = await XetNghiemVien.query.where(XetNghiemVien.MaXetNghiemVien == MaXetNghiemVien).gino.first()
    if not xet_nghiem_vien:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    if xet_nghiem_vien.MatKhau != password:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }
    return {
        "success": True,
        "message": "Đăng nhập thành công",
        "data": xet_nghiem_vien
    }

async def logout_service():
    return {
        "success": True,
        "message": "Đăng xuất thành công",
        "data": None
    }
    
async def login_admin(username: str, password: str):
    if username == "admin" and password == "admin":
        return {
            "success": True,
            "message": "Đăng nhập thành công",
            "data": {
                "username": username
            }
        }
    else:
        return {
            "success": False,
            "message": "Tài khoản hoặc mật khẩu sai.",
            "data": None
        }


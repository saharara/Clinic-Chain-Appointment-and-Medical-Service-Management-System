from typing import Any, Optional

from fastapi import APIRouter, Form, Request
from pydantic import BaseModel

from service.auth_service import (
    change_doctor_password,
    change_xnv_password,
    create_doctor_account,
    create_xnv_account,
    delete_doctor_account,
    delete_xnv_account,
    get_session_user,
    login_admin,
    login_doctor,
    login_le_tan,
    login_patient,
    login_xet_nghiemVien,
    logout_service,
)

router = APIRouter()


class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


class SessionUserRequest(BaseModel):
    role: str
    userId: str


async def read_request_data(request: Request) -> dict:
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        return await request.json()

    form = await request.form()
    return dict(form)


@router.post("/login-doctor", response_model=ResponseModel)
async def login_doctor_api(request: Request):
    data = await read_request_data(request)
    ma_bac_si = data.get("MaBacSi") or data.get("ma_bac_si") or data.get("username")
    return await login_doctor(ma_bac_si, data.get("password"))


@router.post("/login-patient", response_model=ResponseModel)
async def login_patient_api(request: Request):
    data = await read_request_data(request)
    cccd = data.get("cccd") or data.get("CCCD") or data.get("username") or data.get("MaBenhNhan")
    return await login_patient(cccd, data.get("password"))


@router.post("/login-le-tan", response_model=ResponseModel)
async def login_le_tan_api(request: Request):
    data = await read_request_data(request)
    ma_le_tan = data.get("MaLeTan") or data.get("ma_le_tan") or data.get("username")
    return await login_le_tan(ma_le_tan, data.get("password"))


@router.post("/logout", response_model=ResponseModel)
async def logout():
    return await logout_service()


@router.post("/login_xet_nghiem_vien", response_model=ResponseModel)
async def login_xet_nghiem_vien_api(request: Request):
    data = await read_request_data(request)
    ma_xet_nghiem_vien = (
        data.get("MaXetNghiemVien")
        or data.get("MaXNV")
        or data.get("ma_xnv")
        or data.get("username")
    )
    return await login_xet_nghiemVien(ma_xet_nghiem_vien, data.get("password"))


@router.post("/login_admin", response_model=ResponseModel)
async def login_admin_api(request: Request):
    data = await read_request_data(request)
    return await login_admin(data.get("username"), data.get("password"))


@router.post("/session-user", response_model=ResponseModel)
async def get_session_user_api(request: SessionUserRequest):
    return await get_session_user(request.role, request.userId)


@router.post("/create-doctor-account", response_model=ResponseModel)
async def create_doctor_account_endpoint(
    name: str = Form(...),
    MaBacSi: str = Form(...),
    chuyen_khoa: str = Form(...),
    sdt: str = Form(...),
    password: str = Form(...),
):
    return await create_doctor_account(name, MaBacSi, chuyen_khoa, sdt, password)


@router.delete("/delete-doctor-account", response_model=ResponseModel)
async def delete_doctor_account_endpoint(MaBacSi: str = Form(...)):
    return await delete_doctor_account(MaBacSi)


@router.post("/change-doctor-password", response_model=ResponseModel)
async def change_doctor_password_endpoint(
    MaBacSi: str = Form(...),
    new_password: str = Form(...),
):
    return await change_doctor_password(MaBacSi, new_password)


@router.post("/create-xet-nghiem-vien-account", response_model=ResponseModel)
async def create_xet_nghiem_vien_account_endpoint(
    name: str = Form(...),
    MaXetNghiemVien: str = Form(...),
    sdt: str = Form(...),
    password: str = Form(...),
    ma_chi_nhanh: str = Form(...),
):
    return await create_xnv_account(
        name,
        MaXetNghiemVien,
        sdt,
        password,
        ma_chi_nhanh,
    )


@router.delete("/delete-xet-nghiem-vien-account", response_model=ResponseModel)
async def delete_xet_nghiem_vien_account_endpoint(
    MaXetNghiemVien: str = Form(...),
):
    return await delete_xnv_account(MaXetNghiemVien)


@router.post("/change-xet-nghiem-vien-password", response_model=ResponseModel)
async def change_xet_nghiem_vien_password_endpoint(
    MaXetNghiemVien: str = Form(...),
    new_password: str = Form(...),
):
    return await change_xnv_password(MaXetNghiemVien, new_password)

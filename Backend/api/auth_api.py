from fastapi import APIRouter, HTTPException , Form
from pydantic import BaseModel
from typing import Optional, Any, List
from service.auth_service import *

router = APIRouter()
class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
@router.post("/login-doctor", response_model=ResponseModel)
async def login_doctor_api(MaBacSi: str = Form(...), password: str = Form(...)):
    return await login_doctor(MaBacSi, password)
@router.post("/login-patient", response_model=ResponseModel)
async def login_patient_api(MaBenhNhan: str = Form(...), password: str = Form(...)):
    return await login_patient(MaBenhNhan, password)
@router.post("/login-le-tan", response_model=ResponseModel)
async def login_le_tan_api(MaLeTan: str = Form(...), password: str = Form(...)):
    return await login_le_tan(MaLeTan, password)
@router.post("/logout",response_model=  ResponseModel)
async def logout():
    return await logout_service()
@router.post("/login_xet_nghiem_vien", response_model=ResponseModel)
async def login_xet_nghiem_vien_api(MaXetNghiemVien: str = Form(...), password: str = Form(...)):
    return await login_xet_nghiemVien(MaXetNghiemVien, password)
@router.post("/login_admin", response_model=ResponseModel)
async def login_admin_api(username: str = Form(...), password: str = Form(...)):
    return await login_admin(username, password)
@router.post("/create-doctor-account", response_model=ResponseModel)
async def create_doctor_account_endpoint(
    name: str = Form(...),
    MaBacSi: str = Form(...),
    chuyen_khoa: str = Form(...),
    sdt: str = Form(...),
    password: str = Form(...)
):
    return await create_doctor_account(name, MaBacSi, chuyen_khoa, sdt, password)

@router.delete("/delete-doctor-account", response_model=ResponseModel)
async def delete_doctor_account_endpoint(MaBacSi: str = Form(...)):
    return await delete_doctor_account(MaBacSi)

@router.post("/change-doctor-password", response_model=ResponseModel)
async def change_doctor_password_endpoint(MaBacSi: str = Form(...), new_password: str = Form(...)):
    return await change_doctor_password(MaBacSi, new_password)

@router.post("/create-xet-nghiem-vien-account", response_model=ResponseModel)
async def create_xet_nghiem_vien_account_endpoint(
    name: str = Form(...),
    MaXetNghiemVien: str = Form(...),
    sdt: str = Form(...),
    password: str = Form(...)
):
    return await create_xnv_account(name, MaXetNghiemVien, sdt, password)
@router.delete("/delete-xet-nghiem-vien-account", response_model=ResponseModel)
async def delete_xet_nghiem_vien_account_endpoint(MaXetNghiemVien: str = Form(...)):
    return await delete_xnv_account(MaXetNghiemVien)
@router.post("/change-xet-nghiem-vien-password", response_model=ResponseModel)
async def change_xet_nghiem_vien_password_endpoint(MaXetNghiemVien: str = Form(...), new_password: str = Form(...)):
    return await change_xnv_password(MaXetNghiemVien, new_password)
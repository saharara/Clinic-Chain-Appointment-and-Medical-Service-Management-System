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
async def login_doctor(MaBacSi: str = Form(...), password: str = Form(...)):
    return await login_doctor(MaBacSi, password)
@router.post("/login-patient", response_model=ResponseModel)
async def login_patient(MaBenhNhan: str = Form(...), password: str = Form(...)):
    return await login_patient(MaBenhNhan, password)
@router.post("/login-le-tan", response_model=ResponseModel)
async def login_le_tan(MaLeTan: str = Form(...), password: str = Form(...)):
    return await login_le_tan(MaLeTan, password)
@router.post("/logout",response_model=  ResponseModel)
async def logout():
    return await logout_service()
@router.post("/login_xet_nghiem_vien", response_model=ResponseModel)
async def login_xet_nghiem_vien(MaXetNghiemVien: str = Form(...), password: str = Form(...)):
    return await login_xet_nghiem_vien(MaXetNghiemVien, password)
@router.post("/login_admin", response_model=ResponseModel)
async def login_admin(username: str = Form(...), password: str = Form(...)):
    return await login_admin(username, password)
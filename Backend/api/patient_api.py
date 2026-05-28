from fastapi import APIRouter, Form
from pydantic import BaseModel
from typing import Optional, Any, List
from service.patient_service import *

router = APIRouter()

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


@router.post("/register-account", response_model=ResponseModel)
async def register_account_api(
    hoten: str = Form(...),
    ngaysinh: str = Form(...),
    gioitinh: str = Form(...),
    sdt: str = Form(...),
    matkhau: str = Form(...),
    diachi: str = Form(...),
    ma_so_bhyt: Optional[str] = Form(None),
    ky_tu_bhyt: Optional[str] = Form(None)
):
    return await register_account({
        "hoten": hoten,
        "ngaysinh": ngaysinh,
        "gioitinh": gioitinh,
        "sdt": sdt,
        "matkhau": matkhau,
        "diachi": diachi,
        "ma_so_bhyt": ma_so_bhyt,
        "ky_tu_bhyt": ky_tu_bhyt,
    })


@router.post("/search-available-slots", response_model=ResponseModel)
async def search_available_slots_api(
    ma_chi_nhanh: str = Form(...),
    chuyen_khoa: str = Form(...),
    ngay_kham: str = Form(...)
):
    return await search_available_slots(ma_chi_nhanh, chuyen_khoa, ngay_kham)


@router.post("/book-and-pay", response_model=ResponseModel)
async def book_and_pay_api(
    ma_benh_an: str = Form(...),
    ma_cau_hinh: str = Form(...),
    ngay_kham: str = Form(...),
    ca_kham: int = Form(...)
):
    return await book_and_pay(ma_benh_an, ma_cau_hinh, ngay_kham, ca_kham)


@router.post("/book-treatment", response_model=ResponseModel)
async def book_treatment_api(
    ma_lich_trinh: str = Form(...),
    ma_benh_an: str = Form(...),
    ngay: str = Form(...),
    ca: int = Form(...)
):
    return await book_treatment(ma_lich_trinh, ma_benh_an, ngay, ca)


@router.post("/request-refund", response_model=ResponseModel)
async def request_refund_api(
    ma_lich_hen: str = Form(...),
    ma_benh_an: str = Form(...),
    bank_info: str = Form(...)
):
    return await request_refund(ma_lich_hen, ma_benh_an, bank_info)


@router.get("/medical-history", response_model=ResponseModel)
async def get_medical_history_api(ma_benh_an: str):
    return await get_medical_history(ma_benh_an)

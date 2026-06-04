from typing import Any, Optional

from fastapi import APIRouter, Form, Query
from pydantic import BaseModel

from service.letan_service import (
    checkin_patient,
    get_checkin_appointments,
    get_waiting_list_by_doctor,
    search_checkin_appointment,
)

router = APIRouter()


class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


@router.post("/checkin", response_model=ResponseModel)
async def checkin_patient_api(
    ma_lich_hen: str = Form(...),
    ma_chi_nhanh: str = Form(...),
    ma_le_tan: str = Form(...),
):
    return await checkin_patient(ma_lich_hen, ma_chi_nhanh, ma_le_tan)


@router.get("/checkin-appointments", response_model=ResponseModel)
async def get_checkin_appointments_api(
    ma_chi_nhanh: str = Query(...),
    ngay: str = Query(...),
):
    return await get_checkin_appointments(ma_chi_nhanh, ngay)


@router.get("/search-checkin-appointment", response_model=ResponseModel)
async def search_checkin_appointment_api(
    keyword: str = Query(...),
    ma_chi_nhanh: str = Query(...),
):
    return await search_checkin_appointment(keyword, ma_chi_nhanh)


@router.get("/waiting-list/{ma_bac_si}/{ngay}", response_model=ResponseModel)
async def get_waiting_list_by_doctor_api(
    ma_bac_si: str,
    ngay: str,
    ma_chi_nhanh: str = Query(...),
):
    return await get_waiting_list_by_doctor(ma_bac_si, ngay, ma_chi_nhanh)

from fastapi import APIRouter, HTTPException , Form
from pydantic import BaseModel
from typing import Optional, Any, List
from service.letan_service import checkin_patient, get_waiting_list_by_doctor, search_checkin_appointment
from service.auth_service import *

router = APIRouter()
class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
@router.post("/checkin", response_model=ResponseModel)
async def checkin_patient_api(ma_lich_hen: str = Form(...)):
    result = await checkin_patient(ma_lich_hen)
    return result
from fastapi import Query

@router.get("/search-checkin-appointment", response_model=ResponseModel)
async def search_checkin_appointment_api(keyword: str = Query(...)):
    result = await search_checkin_appointment(keyword)
    return result
@router.get("/waiting-list/{ma_bac_si}/{ngay}", response_model=ResponseModel)
async def get_waiting_list_by_doctor_api(ma_bac_si: str, ngay: str):
    result = await get_waiting_list_by_doctor(ma_bac_si, ngay)
    return result
from fastapi import APIRouter, HTTPException , Form, Query
from pydantic import BaseModel
from typing import Optional, Any, List
from service.doctor_service import *

router = APIRouter()
class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
class TestRequest(BaseModel):
    ma_dich_vu: Optional[str] = None

class MedicineRequest(BaseModel):
    ma_thuoc: Optional[str] = None
    so_luong: Optional[int] = None
    lieu_dung: Optional[str] = None

class TreatmentRequest(BaseModel):
    ma_dich_vu: Optional[str] = None
    so_buoi: Optional[int] = None
class ExamDataRequest(BaseModel):
    ma_lich_hen: str
    ma_bac_si: Optional[str] = None
    ma_benh: Optional[str] = None  # Mã bệnh theo ICD-10 (ví dụ: 'J00')
    trieu_chung: str
    loi_dan: Optional[str] = None
    xet_nghiem: Optional[List[TestRequest]] = None
    don_thuoc: Optional[List[MedicineRequest]] = None
    dieu_tri: Optional[List[TreatmentRequest]] = None
@router.get("/doctor/get-patients-by-date")
async def get_patients(
    ma_bac_si: str = Query(..., description="Mã bác sĩ"),
    ngay_kham: str = Query(..., description="Ngày khám định dạng YYYY-MM-DD")
):
    result = await get_patients_by_date(ma_bac_si, ngay_kham)
    return result


@router.get("/queue", response_model=ResponseModel)
async def get_doctor_queue_api(
    ma_bac_si: str = Query(..., description="Mã bác sĩ đang đăng nhập")
):
    return await get_doctor_queue(ma_bac_si)


@router.post("/update-appointment-status", response_model=ResponseModel)
async def update_appointment_status_api(ma_lich_hen: str = Form(...), trang_thai: str = Form(...)):
    return await update_appointment_status(ma_lich_hen, trang_thai)
@router.post("/complete-appointment", response_model=ResponseModel)
async def save_examination(request: ExamDataRequest):
    # Ép kiểu dữ liệu Pydantic thành Dictionary để truyền vào service
    exam_data = request.model_dump() # hoặc request.dict() nếu dùng Pydantic v1
    
    # Gọi hàm service bạn đã viết
    result = await save_examination_record(exam_data)
    return result
@router.get("/search-patients", response_model=ResponseModel)
async def search_patients_api(keyword: str = Query(...)):
    return await search_patient_history(keyword)

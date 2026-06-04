from fastapi import APIRouter, HTTPException , Form, Query
from pydantic import BaseModel
from typing import Optional, Any, List
from service.auth_service import *
from service.admin_service import *

router = APIRouter()
class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

@router.post(
    "/branches/create",
    response_model=ResponseModel
)
async def create_branch_api(
    ten_chi_nhanh: str = Form(...),
    dia_chi: str = Form(...),
    sdt: Optional[str] = Form(None)
):

    result = await create_branch(
        ten_chi_nhanh=ten_chi_nhanh,
        dia_chi=dia_chi,
        sdt=sdt
    )
    return result

@router.post(
    "/services/create",
    response_model=ResponseModel
)
async def create_service_api(
    ten_dich_vu: str = Form(...),
    chuyen_khoa: str = Form(...),
    loai_dich_vu: str = Form(...),
    gia_goc: int = Form(...)
):

    result = await create_service(
        ten_dich_vu=ten_dich_vu,
        chuyen_khoa=chuyen_khoa,
        loai_dich_vu=loai_dich_vu,
        gia_goc=gia_goc
    )
    return result

@router.post(
    "/doctor-schedules/create",
    response_model=ResponseModel
)
async def create_doctor_schedule_api(
    ma_bac_si: str = Form(...),
    ma_chi_nhanh: str = Form(...),
    ngay_truc: str = Form(...),
    ca_truc: int = Form(...)
):

    result = await create_doctor_schedule(
        ma_bac_si=ma_bac_si,
        ma_chi_nhanh=ma_chi_nhanh,
        ngay_truc=ngay_truc,
        ca_truc=ca_truc
    )
    return result

@router.post(
    "/reports",
    response_model=ResponseModel
)
async def get_report_api(
    start_date: str = Form(...),
    end_date: str = Form(...)
):

    result = await get_report(
        start_date=start_date,
        end_date=end_date
    )
    return result


@router.get("/reports/monthly", response_model=ResponseModel)
async def get_monthly_report_api(month: str = Query(...)):
    return await get_monthly_report(month)

from fastapi import APIRouter, Form
from pydantic import BaseModel
from typing import Optional, Any

from service.xetnghiem_service import (
    get_pending_tests,
    get_tests_by_branch,
    accept_test_request,
    update_test_result,
    get_test_detail
)

router = APIRouter()
class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

@router.get("/pending-tests", response_model=ResponseModel)
async def pending_tests(ma_chi_nhanh: str):
    return await get_pending_tests(ma_chi_nhanh)

@router.get("/tests", response_model=ResponseModel)
async def tests_by_branch(ma_chi_nhanh: str):
    return await get_tests_by_branch(ma_chi_nhanh)

@router.post("/accept-test", response_model=ResponseModel)
async def accept_test(
    MaChiTietXN: str = Form(...),
    MaChiNhanh: str = Form(...),
):
    return await accept_test_request(MaChiTietXN, MaChiNhanh)

@router.post("/update-result", response_model=ResponseModel)
async def update_result(
    MaChiTietXN: str = Form(...),
    KetQuaXetNghiem: str = Form(...),
    MaXNV: str = Form(...),
    MaChiNhanh: str = Form(...),
    GhiChu: Optional[str] = Form(None)
):
    return await update_test_result(
        MaChiTietXN,
        KetQuaXetNghiem,
        GhiChu,
        MaXNV,
        MaChiNhanh,
    )

@router.get("/test-detail", response_model=ResponseModel)
async def test_detail(
    MaChiTietXN: str
):
    return await get_test_detail(MaChiTietXN)

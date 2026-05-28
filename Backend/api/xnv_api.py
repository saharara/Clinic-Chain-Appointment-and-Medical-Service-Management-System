from fastapi import APIRouter, Form
from pydantic import BaseModel
from typing import Optional, Any

from service.xetnghiem_service import (
    get_pending_tests,
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
async def pending_tests():
    return await get_pending_tests()

@router.post("/accept-test", response_model=ResponseModel)
async def accept_test(
    MaChiTietXN: str = Form(...)
):
    return await accept_test_request(MaChiTietXN)

@router.post("/update-result", response_model=ResponseModel)
async def update_result(
    MaChiTietXN: str = Form(...),
    KetQuaXetNghiem: str = Form(...),
    GhiChu: Optional[str] = Form(None)
):
    return await update_test_result(
        MaChiTietXN,
        KetQuaXetNghiem,
        GhiChu
    )

@router.get("/test-detail", response_model=ResponseModel)
async def test_detail(
    MaChiTietXN: str
):
    return await get_test_detail(MaChiTietXN)
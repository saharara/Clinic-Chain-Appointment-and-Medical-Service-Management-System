from entities.dky_kham import DangKyKham

async def change_status_dky_kham(
    MaLichHen: str,
    new_status: str
):

    VALID_STATUS = [
        "Chưa xác nhận",
        "Chờ khám",
        "Đang khám",
        "Hoàn thành"
    ]
    if new_status not in VALID_STATUS:

        return {
            "success": False,
            "message": f"""
            Trạng thái không hợp lệ.
            Chỉ chấp nhận:
            {VALID_STATUS}
            """,
            "data": None
        }

    dky_kham = await DangKyKham.query.where(
        DangKyKham.MaLichHen == MaLichHen
    ).gino.first()

    if not dky_kham:

        return {
            "success": False,
            "message": "Không tìm thấy lịch hẹn.",
            "data": None
        }

    old_status = dky_kham.TrangThai
    dky_kham.TrangThai = new_status

    await dky_kham.update().apply()

    return {
        "success": True,
        "message": "Cập nhật trạng thái thành công.",
        "data": dky_kham
    }
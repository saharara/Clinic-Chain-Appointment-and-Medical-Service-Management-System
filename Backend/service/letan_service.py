import datetime

from check_db import get_connection


async def search_checkin_appointment(keyword: str, ma_chi_nhanh: str):
    conn = await get_connection()

    try:
        cursor = await conn.execute(
            """
            SELECT
                LH.MaLichHen,
                LH.MaBenhAn,
                BN.HoTen,
                BN.CCCD,
                BN.SDT,
                LH.MaCauHinh,
                CNDV.MaChiNhanh,
                LH.MaBacSi,
                LH.NgayKham,
                LH.CaKham,
                LH.STT,
                LH.TrangThai,
                LH.MaLeTan
            FROM LICH_HEN LH
            JOIN BENH_NHAN BN
                ON LH.MaBenhAn = BN.MaBenhAn
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE
                CNDV.MaChiNhanh = %s
                AND (
                    LH.MaLichHen = %s
                    OR BN.CCCD = %s
                    OR BN.SDT = %s
                    OR BN.MaBenhAn = %s
                    OR BN.HoTen LIKE %s
                )
            ORDER BY LH.NgayKham, LH.CaKham, LH.STT
            """,
            (
                ma_chi_nhanh,
                keyword,
                keyword,
                keyword,
                keyword,
                f"%{keyword}%",
            ),
        )
        rows = await cursor.fetchall()

        if not rows:
            return {
                "success": False,
                "message": "Không tìm thấy lịch khám tại chi nhánh phụ trách.",
                "data": None,
            }

        return {
            "success": True,
            "message": "Tìm thấy lịch khám.",
            "data": [dict(row) for row in rows],
        }

    finally:
        await conn.close()


async def checkin_patient(
    ma_lich_hen: str,
    ma_chi_nhanh: str,
    ma_le_tan: str,
):
    conn = await get_connection()

    try:
        cursor = await conn.execute(
            """
            SELECT
                LH.MaLichHen,
                LH.TrangThai,
                LH.NgayKham,
                LH.MaBacSi,
                CNDV.MaChiNhanh
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE LH.MaLichHen = %s
            """,
            (ma_lich_hen,),
        )
        lich_hen = await cursor.fetchone()

        if not lich_hen:
            return {
                "success": False,
                "message": "Không tìm thấy lịch hẹn.",
                "data": None,
            }

        if lich_hen["MaChiNhanh"] != ma_chi_nhanh:
            return {
                "success": False,
                "message": "Lễ tân không có quyền tiếp đón lịch hẹn của chi nhánh khác.",
                "data": None,
            }

        if lich_hen["TrangThai"] == "Chờ khám" and lich_hen.get("MaLeTan"):
            return {
                "success": False,
                "message": "Bệnh nhân đã check-in trước đó.",
                "data": None,
            }

        if lich_hen["TrangThai"] != "Chờ khám":
            return {
                "success": False,
                "message": "Lịch hẹn không hợp lệ để check-in.",
                "data": None,
            }

        queue_cursor = await conn.execute(
            """
            SELECT COALESCE(MAX(LH.STT), 0) + 1 AS NextQueueNumber
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE
                CNDV.MaChiNhanh = %s
                AND LH.MaBacSi = %s
                AND LH.NgayKham = %s
                AND LH.TrangThai IN ('Chờ khám', 'Đang khám')
            """,
            (
                ma_chi_nhanh,
                lich_hen["MaBacSi"],
                lich_hen["NgayKham"],
            ),
        )
        queue_row = await queue_cursor.fetchone()
        queue_number = queue_row["NextQueueNumber"]

        await conn.execute(
            """
            UPDATE LICH_HEN
            SET TrangThai = 'Chờ khám',
                STT = %s,
                MaLeTan = %s
            WHERE MaLichHen = %s
            """,
            (queue_number, ma_le_tan, ma_lich_hen),
        )

        await conn.commit()
        checkin_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return {
            "success": True,
            "message": "Check-in thành công.",
            "data": {
                "MaLichHen": ma_lich_hen,
                "MaChiNhanh": ma_chi_nhanh,
                "MaBacSi": lich_hen["MaBacSi"],
                "STT_HangDoi": queue_number,
                "TrangThaiMoi": "Chờ khám",
                "ThoiGianCheckIn": checkin_time,
            },
        }

    except Exception as exc:
        await conn.rollback()
        return {
            "success": False,
            "message": str(exc),
            "data": None,
        }

    finally:
        await conn.close()


async def get_waiting_list_by_doctor(
    ma_bac_si: str,
    ngay: str,
    ma_chi_nhanh: str,
):
    conn = await get_connection()

    try:
        cursor = await conn.execute(
            """
            SELECT
                LH.MaLichHen,
                BN.HoTen,
                BN.MaBenhAn,
                BN.SDT,
                LH.NgayKham,
                LH.CaKham,
                LH.STT,
                LH.MaBacSi,
                CNDV.MaChiNhanh,
                LH.TrangThai
            FROM LICH_HEN LH
            JOIN BENH_NHAN BN
                ON LH.MaBenhAn = BN.MaBenhAn
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE
                LH.MaBacSi = %s
                AND CNDV.MaChiNhanh = %s
                AND LH.NgayKham = %s
                AND LH.TrangThai = 'Chờ khám'
            ORDER BY LH.STT, LH.CaKham
            """,
            (
                ma_bac_si,
                ma_chi_nhanh,
                ngay,
            ),
        )
        rows = await cursor.fetchall()

        return {
            "success": True,
            "message": "Lấy danh sách chờ thành công.",
            "data": [dict(row) for row in rows],
        }

    finally:
        await conn.close()

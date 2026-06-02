import datetime

from database import get_connection
from aiomysql import DictCursor


async def search_checkin_appointment(
    keyword: str
):

    conn = await get_connection()

    try:

        # tìm theo MaLichHen / SDT / MaBenhAn / HoTen
        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT
                    LH.MaLichHen,
                    BN.MaBenhAn,
                    BN.HoTen,
                    BN.SDT,
                    LH.NgayKham,
                    LH.CaKham,
                    LH.TrangThai
                FROM LICH_HEN LH
                JOIN BENH_NHAN BN
                    ON LH.MaBenhAn = BN.MaBenhAn
                WHERE
                    LH.MaLichHen = %s
                    OR BN.SDT = %s
                    OR BN.MaBenhAn = %s
                    OR BN.HoTen LIKE %s
            """, (
                keyword,
                keyword,
                keyword,
                f"%{keyword}%"
            ))

            rows = await cursor.fetchall()

            if not rows:
                return {
                    "success": False,
                    "message": "Không tìm thấy lịch khám.",
                    "data": None
                }

            return {
                "success": True,
                "message": "Tìm thấy lịch khám.",
                "data": [dict(row) for row in rows]
            }

    finally:
        conn.close()



async def checkin_patient(
    ma_lich_hen: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            # 1. Lấy lịch hẹn
            await cursor.execute("""
                SELECT MaLichHen, TrangThai
                FROM LICH_HEN
                WHERE MaLichHen = %s
            """, (ma_lich_hen,))

            lh = await cursor.fetchone()

            if not lh:
                return {
                    "success": False,
                    "message": "Không tìm thấy lịch hẹn.",
                    "data": None
                }

            # 2. Kiểm tra trạng thái
            if lh["TrangThai"] == "Chờ khám":
                return {
                    "success": False,
                    "message": "Bệnh nhân đã check-in trước đó.",
                    "data": None
                }

            if lh["TrangThai"] == "Đang khám":
                return {
                    "success": False,
                    "message": "Bệnh nhân đang được khám.",
                    "data": None
                }

            if lh["TrangThai"] == "Hoàn thành":
                return {
                    "success": False,
                    "message": "Lượt khám đã hoàn thành.",
                    "data": None
                }

            await cursor.execute("""
                UPDATE LICH_HEN
                SET TrangThai = 'Chờ khám'
                WHERE MaLichHen = %s
            """, (ma_lich_hen,))
            
            checkin_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            await conn.commit()

            return {
                "success": True,
                "message": "Check-in thành công.",
                "data": {
                    "MaLichHen": ma_lich_hen,
                    "TrangThaiMoi": "Chờ khám",
                    "ThoiGianCheckIn": checkin_time
                }
            }

    except Exception as e:

        await conn.rollback()

        return {
            "success": False,
            "message": str(e),
            "data": None
        }

    finally:
        conn.close()

async def get_waiting_list_by_doctor(
    ma_bac_si: str,
    ngay: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT
                    LH.MaLichHen,
                    BN.HoTen,
                    BN.MaBenhAn,
                    LH.NgayKham,
                    LH.CaKham,
                    LH.TrangThai
                FROM LICH_HEN LH
                JOIN BENH_NHAN BN
                    ON LH.MaBenhAn = BN.MaBenhAn
            JOIN CHI_NHANH_DICH_VU CHDV
                ON LH.MaCauHinh = CHDV.MaCauHinh
            JOIN LICH_TRUC LT
                ON LT.MaChiNhanh = CHDV.MaChiNhanh
            WHERE
                LT.MaBacSi = %s
                AND LH.NgayKham = %s
                AND LH.TrangThai = 'ChoKham'
            ORDER BY LH.CaKham, LH.STT
        """, (
            ma_bac_si,
            ngay
        ))

        rows = await cursor.fetchall()

        return {
            "success": True,
            "message": "Lấy danh sách chờ thành công.",
            "data": [dict(row) for row in rows]
        }

    finally:
        conn.close()
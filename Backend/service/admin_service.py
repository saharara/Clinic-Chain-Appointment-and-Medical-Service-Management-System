import uuid
from datetime import datetime

from check_db import get_connection


ACTIVE_APPOINTMENT_STATUSES = ("Đã xác nhận", "Chờ khám", "Đang khám", "Chờ kết luận")


async def table_has_column(conn, table_name: str, column_name: str) -> bool:
    cursor = await conn.execute("""
        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = %s
            AND COLUMN_NAME = %s
    """, (table_name, column_name))
    row = await cursor.fetchone()
    return bool(row and row["total"])


async def insert_schedule_notification(conn, ma_lich_hen: str, ma_benh_an: str, noi_dung: str):
    ma_thong_bao = f"TB_{uuid.uuid4().hex[:10].upper()}"
    has_notification_status = await table_has_column(conn, "LICH_SU_THONG_BAO", "TrangThai")
    thoi_gian_gui = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if has_notification_status:
        await conn.execute("""
            INSERT INTO LICH_SU_THONG_BAO (
                MaThongBao,
                MaLichHen,
                MaBenhAn,
                NoiDung,
                TrangThai,
                Loi,
                ThoiGianGui
            )
            VALUES (%s, %s, %s, %s, 'Success', NULL, %s)
        """, (
            ma_thong_bao,
            ma_lich_hen,
            ma_benh_an,
            noi_dung,
            thoi_gian_gui,
        ))
    else:
        await conn.execute("""
            INSERT INTO LICH_SU_THONG_BAO (
                MaThongBao,
                MaLichHen,
                MaBenhAn,
                NoiDung,
                Loi,
                ThoiGianGui
            )
            VALUES (%s, %s, %s, %s, NULL, %s)
        """, (
            ma_thong_bao,
            ma_lich_hen,
            ma_benh_an,
            noi_dung,
            thoi_gian_gui,
        ))

    return ma_thong_bao


async def fetch_schedule_by_identity(conn, schedule_id=None, ma_lich_truc=None):
    has_schedule_status = await table_has_column(conn, "LICH_TRUC", "TrangThai")
    status_select = (
        "COALESCE(LTR.TrangThai, 'Đang hoạt động') AS TrangThai"
        if has_schedule_status
        else "'Đang hoạt động' AS TrangThai"
    )

    if schedule_id is not None:
        cursor = await conn.execute(f"""
            SELECT
                LTR.id,
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.ChuyenKhoa,
                BS.SDT,
                LTR.MaChiNhanh,
                CN.TenChiNhanh,
                LTR.NgayTruc,
                LTR.CaTruc,
                {status_select}
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS
                ON LTR.MaBacSi = BS.MaBacSi
            JOIN CHI_NHANH CN
                ON LTR.MaChiNhanh = CN.MaChiNhanh
            WHERE LTR.id = %s
            LIMIT 1
        """, (schedule_id,))
    else:
        cursor = await conn.execute(f"""
            SELECT
                LTR.id,
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.ChuyenKhoa,
                BS.SDT,
                LTR.MaChiNhanh,
                CN.TenChiNhanh,
                LTR.NgayTruc,
                LTR.CaTruc,
                {status_select}
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS
                ON LTR.MaBacSi = BS.MaBacSi
            JOIN CHI_NHANH CN
                ON LTR.MaChiNhanh = CN.MaChiNhanh
            WHERE LTR.MaLichTruc = %s
            LIMIT 1
        """, (ma_lich_truc,))

    row = await cursor.fetchone()
    return dict(row) if row else None


async def get_schedule_appointments(conn, schedule):
    cursor = await conn.execute("""
        SELECT
            LH.MaLichHen,
            LH.MaBenhAn,
            BN.HoTen AS TenBenhNhan,
            LH.MaCauHinh,
            LH.NgayKham,
            LH.CaKham,
            LH.STT,
            LH.TrangThai,
            LH.MaBacSi,
            DV.TenDichVu
        FROM LICH_HEN LH
        JOIN BENH_NHAN BN
            ON LH.MaBenhAn = BN.MaBenhAn
        JOIN CHI_NHANH_DICH_VU CNDV
            ON LH.MaCauHinh = CNDV.MaCauHinh
        JOIN DICH_VU DV
            ON CNDV.MaDichVu = DV.MaDichVu
        WHERE
            CNDV.MaChiNhanh = %s
            AND LH.NgayKham = %s
            AND LH.CaKham = %s
            AND LH.MaBacSi = %s
            AND LH.TrangThai IN ('Đã xác nhận', 'Chờ khám', 'Đang khám', 'Chờ kết luận')
        ORDER BY LH.STT, LH.MaLichHen
    """, (
        schedule["MaChiNhanh"],
        schedule["NgayTruc"],
        schedule["CaTruc"],
        schedule["MaBacSi"],
    ))
    return [dict(row) for row in await cursor.fetchall()]


async def get_admin_doctor_schedules(from_date: str = None, to_date: str = None, ma_bac_si: str = None):
    conn = await get_connection()
    try:
        where_clauses = []
        params = []

        if from_date:
            where_clauses.append("LTR.NgayTruc >= %s")
            params.append(from_date)

        if to_date:
            where_clauses.append("LTR.NgayTruc <= %s")
            params.append(to_date)

        if ma_bac_si and ma_bac_si != "all":
            where_clauses.append("LTR.MaBacSi = %s")
            params.append(ma_bac_si)

        where_sql = ""
        if where_clauses:
            where_sql = "WHERE " + " AND ".join(where_clauses)

        has_schedule_status = await table_has_column(conn, "LICH_TRUC", "TrangThai")
        status_select = "MAX(COALESCE(LTR.TrangThai, 'Đang hoạt động')) AS TrangThai" if has_schedule_status else "'Đang hoạt động' AS TrangThai"

        cursor = await conn.execute(
            f"""
            SELECT
                LTR.id,
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.ChuyenKhoa,
                BS.SDT,
                LTR.MaChiNhanh,
                CN.TenChiNhanh,
                LTR.NgayTruc,
                LTR.CaTruc,
                {status_select},
                COUNT(LH.MaLichHen) AS SoLichHenDangCo
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS
                ON LTR.MaBacSi = BS.MaBacSi
            JOIN CHI_NHANH CN
                ON LTR.MaChiNhanh = CN.MaChiNhanh
            LEFT JOIN CHI_NHANH_DICH_VU CNDV
                ON LTR.MaChiNhanh = CNDV.MaChiNhanh
            LEFT JOIN LICH_HEN LH
                ON LH.MaCauHinh = CNDV.MaCauHinh
                AND LH.NgayKham = LTR.NgayTruc
                AND LH.CaKham = LTR.CaTruc
                AND LH.MaBacSi = LTR.MaBacSi
                AND LH.TrangThai IN ('Đã xác nhận', 'Chờ khám', 'Đang khám', 'Chờ kết luận')
            {where_sql}
            GROUP BY
                LTR.id,
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen,
                BS.ChuyenKhoa,
                BS.SDT,
                LTR.MaChiNhanh,
                CN.TenChiNhanh,
                LTR.NgayTruc,
                LTR.CaTruc
            ORDER BY LTR.NgayTruc, LTR.CaTruc, LTR.MaChiNhanh, LTR.MaBacSi
            """,
            tuple(params),
        )
        rows = [dict(row) for row in await cursor.fetchall()]

        return {
            "success": True,
            "message": "Lấy danh sách lịch trực Admin thành công.",
            "data": rows,
        }
    except Exception as exc:
        return {"success": False, "message": str(exc), "data": None}
    finally:
        await conn.close()

async def create_branch(
    ten_chi_nhanh: str,
    dia_chi: str,
    sdt: str = None
):

    if not ten_chi_nhanh or not dia_chi:
        return {
            "success": False,
            "message": "Thiếu thông tin chi nhánh.",
            "data": None
        }

    conn = await get_connection()

    try:

        ma_chi_nhanh = "CN_" + uuid.uuid4().hex[:6].upper()

        await conn.execute("""
            INSERT INTO CHI_NHANH (
                MaChiNhanh,
                TenChiNhanh,
                DiaChi,
                SDT
            )
            VALUES (%s, %s, %s, %s)
        """, (
            ma_chi_nhanh,
            ten_chi_nhanh,
            dia_chi,
            sdt
        ))

        await conn.commit()

        return {
            "success": True,
            "message": "Tạo chi nhánh thành công.",
            "data": {
                "MaChiNhanh": ma_chi_nhanh
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
        await conn.close()

async def create_service(
    ten_dich_vu: str,
    chuyen_khoa: str,
    loai_dich_vu: str,
    gia_goc: int
):

    if not ten_dich_vu:
        return {
            "success": False,
            "message": "Thiếu tên dịch vụ.",
            "data": None
        }

    VALID_SERVICE_TYPES = ["Khám lâm sàng", "Xét nghiệm", "Điều trị"]

    if loai_dich_vu not in VALID_SERVICE_TYPES:
        return {
            "success": False,
            "message": "Loại dịch vụ không hợp lệ.",
            "data": None
        }

    if gia_goc < 0:
        return {
            "success": False,
            "message": "Giá dịch vụ không được âm.",
            "data": None
        }

    conn = await get_connection()

    try:

        ma_dich_vu = "DV_" + uuid.uuid4().hex[:6].upper()

        await conn.execute("""
            INSERT INTO DICH_VU (
                MaDichVu,
                TenDichVu,
                ChuyenKhoa,
                LoaiDichVu,
                GiaGoc
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            ma_dich_vu,
            ten_dich_vu,
            chuyen_khoa,
            loai_dich_vu,
            gia_goc
        ))

        await conn.commit()

        return {
            "success": True,
            "message": "Tạo dịch vụ thành công.",
            "data": {
                "MaDichVu": ma_dich_vu
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
        await conn.close()


async def create_doctor_schedule(
    ma_bac_si: str,
    ma_chi_nhanh: str,
    ngay_truc: str,
    ca_truc: int
):

    conn = await get_connection()

    try:

        # check doctor exists
        cursor = await conn.execute("""
            SELECT MaBacSi
            FROM BAC_SI
            WHERE MaBacSi = %s
        """, (ma_bac_si,))

        bac_si = await cursor.fetchone()

        if not bac_si:
            return {
                "success": False,
                "message": "Bác sĩ không tồn tại.",
                "data": None
            }

        # check duplicate active schedule
        has_schedule_status = await table_has_column(conn, "LICH_TRUC", "TrangThai")
        duplicate_status_filter = (
            "AND COALESCE(TrangThai, 'Đang hoạt động') <> 'Đã hủy'"
            if has_schedule_status
            else ""
        )

        cursor = await conn.execute(f"""
            SELECT id, MaLichTruc
            FROM LICH_TRUC
            WHERE MaBacSi = %s
              AND NgayTruc = %s
              AND CaTruc = %s
              {duplicate_status_filter}
        """, (ma_bac_si, ngay_truc, ca_truc))

        existed = await cursor.fetchone()

        if existed:
            return {
                "success": False,
                "message": "Lịch trực đã tồn tại.",
                "data": None
            }

        ma_lich_truc = "LT_" + uuid.uuid4().hex[:6].upper()

        insert_cursor = await conn.execute("""
            INSERT INTO LICH_TRUC (
                MaLichTruc,
                MaBacSi,
                MaChiNhanh,
                NgayTruc,
                CaTruc
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            ma_lich_truc,
            ma_bac_si,
            ma_chi_nhanh,
            ngay_truc,
            ca_truc
        ))

        await conn.commit()

        return {
            "success": True,
            "message": "Tạo lịch trực thành công.",
            "data": {
                "id": insert_cursor.lastrowid,
                "MaLichTruc": ma_lich_truc
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
        await conn.close()


async def cancel_doctor_schedule(schedule_id=None, ma_lich_truc: str = None):
    conn = await get_connection()
    try:
        schedule = await fetch_schedule_by_identity(conn, schedule_id=schedule_id, ma_lich_truc=ma_lich_truc)
        if not schedule:
            return {
                "success": False,
                "message": "Không tìm thấy ca trực cần hủy.",
                "data": None,
            }

        if schedule.get("TrangThai") == "Đã hủy":
            return {
                "success": False,
                "message": "Ca trực này đã được hủy trước đó.",
                "data": None,
            }

        affected_appointments = await get_schedule_appointments(conn, schedule)
        notification_rows = []

        for appointment in affected_appointments:
            message = (
                f"⚠️ CẢNH BÁO SỰ CỐ: Ca khám ngày {schedule['NgayTruc']} - "
                f"Ca {schedule['CaTruc']} của bạn đã bị hủy do bác sĩ gặp sự cố đột xuất. "
                "Vui lòng đặt lại lịch mới hoặc liên hệ hotline để được hỗ trợ xếp lịch lại!"
            )
            await insert_schedule_notification(
                conn,
                appointment["MaLichHen"],
                appointment["MaBenhAn"],
                message,
            )
            notification_rows.append({
                "MaBenhAn": appointment["MaBenhAn"],
                "MaBenhNhan": appointment["MaBenhAn"],
                "MaLichHen": appointment["MaLichHen"],
                "message": message,
            })

        await conn.execute("""
            UPDATE LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            SET LH.TrangThai = 'Đã hủy'
            WHERE
                CNDV.MaChiNhanh = %s
                AND LH.NgayKham = %s
                AND LH.CaKham = %s
                AND LH.MaBacSi = %s
                AND LH.TrangThai IN ('Đã xác nhận', 'Chờ khám', 'Đang khám', 'Chờ kết luận')
        """, (
            schedule["MaChiNhanh"],
            schedule["NgayTruc"],
            schedule["CaTruc"],
            schedule["MaBacSi"],
        ))

        has_schedule_status = await table_has_column(conn, "LICH_TRUC", "TrangThai")
        if has_schedule_status:
            await conn.execute("""
                UPDATE LICH_TRUC
                SET TrangThai = 'Đã hủy'
                WHERE id = %s
            """, (schedule["id"],))
        else:
            await conn.execute("""
                DELETE FROM LICH_TRUC
                WHERE id = %s
            """, (schedule["id"],))

        await conn.commit()

        return {
            "success": True,
            "message": "Đã hủy ca trực và phát thông báo cho bệnh nhân liên quan.",
            "data": {
                "schedule": {
                    **schedule,
                    "TrangThai": "Đã hủy",
                    "SoLichHenDangCo": 0,
                },
                "affectedPatients": notification_rows,
                "affectedCount": len(notification_rows),
            },
        }
    except Exception as exc:
        await conn.rollback()
        return {"success": False, "message": str(exc), "data": None}
    finally:
        await conn.close()


async def transfer_doctor_schedule(schedule_id=None, ma_lich_truc: str = None, new_ma_bac_si: str = None):
    conn = await get_connection()
    try:
        if not new_ma_bac_si:
            return {
                "success": False,
                "message": "Vui lòng chọn bác sĩ mới.",
                "data": None,
            }

        schedule = await fetch_schedule_by_identity(conn, schedule_id=schedule_id, ma_lich_truc=ma_lich_truc)
        if not schedule:
            return {
                "success": False,
                "message": "Không tìm thấy ca trực cần điều chuyển.",
                "data": None,
            }

        if schedule.get("TrangThai") == "Đã hủy":
            return {
                "success": False,
                "message": "Không thể điều chuyển một ca trực đã hủy.",
                "data": None,
            }

        doctor_cursor = await conn.execute("""
            SELECT MaBacSi, HoTen, ChuyenKhoa, SDT
            FROM BAC_SI
            WHERE MaBacSi = %s
            LIMIT 1
        """, (new_ma_bac_si,))
        new_doctor = await doctor_cursor.fetchone()
        if not new_doctor:
            return {
                "success": False,
                "message": "Bác sĩ mới không tồn tại.",
                "data": None,
            }

        has_schedule_status = await table_has_column(conn, "LICH_TRUC", "TrangThai")
        duplicate_status_filter = "AND COALESCE(TrangThai, 'Đang hoạt động') <> 'Đã hủy'" if has_schedule_status else ""

        duplicate_cursor = await conn.execute(f"""
            SELECT id
            FROM LICH_TRUC
            WHERE
                MaBacSi = %s
                AND MaChiNhanh = %s
                AND NgayTruc = %s
                AND CaTruc = %s
                AND id <> %s
                {duplicate_status_filter}
            LIMIT 1
        """, (
            new_ma_bac_si,
            schedule["MaChiNhanh"],
            schedule["NgayTruc"],
            schedule["CaTruc"],
            schedule["id"],
        ))
        if await duplicate_cursor.fetchone():
            return {
                "success": False,
                "message": "Bác sĩ mới đã có lịch trực tại chi nhánh, ngày và ca này.",
                "data": None,
            }

        affected_appointments = await get_schedule_appointments(conn, schedule)
        notification_rows = []

        for appointment in affected_appointments:
            message = (
                f"📢 THÔNG BÁO THAY ĐỔI: Ca khám ngày {schedule['NgayTruc']} - "
                f"Ca {schedule['CaTruc']} của bạn đã được điều chuyển sang Bác sĩ "
                f"{new_doctor['HoTen']} phụ trách do thay đổi lịch công tác của viện. "
                "Giờ khám giữ nguyên không đổi!"
            )
            await insert_schedule_notification(
                conn,
                appointment["MaLichHen"],
                appointment["MaBenhAn"],
                message,
            )
            notification_rows.append({
                "MaBenhAn": appointment["MaBenhAn"],
                "MaBenhNhan": appointment["MaBenhAn"],
                "MaLichHen": appointment["MaLichHen"],
                "message": message,
            })

        await conn.execute("""
            UPDATE LICH_TRUC
            SET MaBacSi = %s
            WHERE id = %s
        """, (new_ma_bac_si, schedule["id"]))

        await conn.execute("""
            UPDATE LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            SET LH.MaBacSi = %s
            WHERE
                CNDV.MaChiNhanh = %s
                AND LH.NgayKham = %s
                AND LH.CaKham = %s
                AND LH.MaBacSi = %s
                AND LH.TrangThai IN ('Đã xác nhận', 'Chờ khám', 'Đang khám', 'Chờ kết luận')
        """, (
            new_ma_bac_si,
            schedule["MaChiNhanh"],
            schedule["NgayTruc"],
            schedule["CaTruc"],
            schedule["MaBacSi"],
        ))

        await conn.commit()

        return {
            "success": True,
            "message": "Đã điều chuyển bác sĩ trực và phát thông báo cho bệnh nhân liên quan.",
            "data": {
                "schedule": {
                    **schedule,
                    "MaBacSi": new_ma_bac_si,
                    "TenBacSi": new_doctor["HoTen"],
                    "ChuyenKhoa": new_doctor["ChuyenKhoa"],
                    "SDT": new_doctor["SDT"],
                    "TrangThai": schedule.get("TrangThai") or "Đang hoạt động",
                    "SoLichHenDangCo": len(notification_rows),
                },
                "oldMaBacSi": schedule["MaBacSi"],
                "newMaBacSi": new_ma_bac_si,
                "affectedPatients": notification_rows,
                "affectedCount": len(notification_rows),
            },
        }
    except Exception as exc:
        await conn.rollback()
        return {"success": False, "message": str(exc), "data": None}
    finally:
        await conn.close()


async def get_report(
    start_date: str,
    end_date: str
):

    conn = await get_connection()

    try:

        # TOTAL VISITS
        cursor = await conn.execute("""
            SELECT COUNT(*) as total
            FROM LICH_HEN
            WHERE NgayKham BETWEEN %s AND %s
        """, (start_date, end_date))

        total_row = await cursor.fetchone()

        # BY BRANCH
        cursor = await conn.execute("""
            SELECT
                CN.TenChiNhanh AS TenChiNhanh,
                COUNT(*) AS SoLuotKham
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CHDV
                ON LH.MaCauHinh = CHDV.MaCauHinh
            JOIN CHI_NHANH CN
                ON CN.MaChiNhanh = CHDV.MaChiNhanh
            WHERE LH.NgayKham BETWEEN %s AND %s
            GROUP BY CN.MaChiNhanh
        """, (start_date, end_date))

        branch_rows = await cursor.fetchall()

        # BY SPECIALTY
        cursor = await conn.execute("""
            SELECT
                DV.ChuyenKhoa AS ChuyenKhoa,
                COUNT(*) AS SoLuotKham
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CHDV
                ON LH.MaCauHinh = CHDV.MaCauHinh
            JOIN DICH_VU DV
                ON DV.MaDichVu = CHDV.MaDichVu
            WHERE LH.NgayKham BETWEEN %s AND %s
            GROUP BY DV.ChuyenKhoa
        """, (start_date, end_date))

        specialty_rows = await cursor.fetchall()

        # TOP SERVICE
        cursor = await conn.execute("""
            SELECT
                DV.TenDichVu,
                COUNT(*) AS SoLan
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CHDV
                ON LH.MaCauHinh = CHDV.MaCauHinh
            JOIN DICH_VU DV
                ON DV.MaDichVu = CHDV.MaDichVu
            WHERE LH.NgayKham BETWEEN %s AND %s
            GROUP BY DV.MaDichVu
            ORDER BY SoLan DESC
            LIMIT 1
        """, (start_date, end_date))

        top_service = await cursor.fetchone()

        return {
            "success": True,
            "message": "Lấy báo cáo thành công.",
            "data": {
                "TongLuotKham": total_row["total"] if total_row else 0,
                "TheoChiNhanh": [dict(row) for row in branch_rows],
                "TheoChuyenKhoa": [dict(row) for row in specialty_rows],
                "DichVuPhoBienNhat": dict(top_service) if top_service else None
            }
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e),
            "data": None
        }

    finally:
        await conn.close()


async def get_monthly_report(month: str):
    start_date = f"{month}-01"
    year, month_number = month.split("-")
    next_month = int(month_number) + 1
    next_year = int(year)
    if next_month == 13:
        next_month = 1
        next_year += 1
    end_exclusive = f"{next_year}-{next_month:02d}-01"

    conn = await get_connection()

    try:
        appointment_cursor = await conn.execute("""
            SELECT
                LH.MaLichHen AS id,
                'Khám' AS type,
                CNDV.MaChiNhanh AS maChiNhanh,
                CN.TenChiNhanh AS tenChiNhanh,
                DV.MaDichVu AS maDichVu,
                DV.TenDichVu AS tenDichVu,
                DV.LoaiDichVu AS loaiDichVu,
                DV.ChuyenKhoa AS chuyenKhoa,
                DV.GiaGoc AS giaGoc,
                LH.GiaCuoi AS netRevenue,
                GREATEST(DV.GiaGoc - COALESCE(LH.GiaCuoi, DV.GiaGoc), 0) AS insuranceAmount,
                LH.MaBacSi AS maBacSi,
                BS.HoTen AS hoTenBacSi,
                LH.NgayKham AS ngayPhatSinh
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN CHI_NHANH CN ON CNDV.MaChiNhanh = CN.MaChiNhanh
            JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
            LEFT JOIN BAC_SI BS ON LH.MaBacSi = BS.MaBacSi
            WHERE
                LH.NgayKham >= %s
                AND LH.NgayKham < %s
                AND LH.TrangThai = 'Hoàn thành'
        """, (start_date, end_exclusive))
        appointment_rows = [dict(row) for row in await appointment_cursor.fetchall()]

        lab_cursor = await conn.execute("""
            SELECT
                CTXN.MaChiTietXN AS id,
                'Xét nghiệm' AS type,
                CNDV.MaChiNhanh AS maChiNhanh,
                CN.TenChiNhanh AS tenChiNhanh,
                DV.MaDichVu AS maDichVu,
                DV.TenDichVu AS tenDichVu,
                DV.LoaiDichVu AS loaiDichVu,
                DV.ChuyenKhoa AS chuyenKhoa,
                DV.GiaGoc AS giaGoc,
                COALESCE(CTXN.GiaCuoi, DV.GiaGoc) AS netRevenue,
                GREATEST(DV.GiaGoc - COALESCE(CTXN.GiaCuoi, DV.GiaGoc), 0) AS insuranceAmount,
                LK.MaBacSi AS maBacSi,
                BS.HoTen AS hoTenBacSi,
                LH.NgayKham AS ngayPhatSinh
            FROM CHI_TIET_XET_NGHIEM CTXN
            JOIN LUOT_KHAM LK ON CTXN.MaLuotKham = LK.MaLuotKham
            JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
            JOIN CHI_NHANH_DICH_VU CNDV ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN CHI_NHANH CN ON CNDV.MaChiNhanh = CN.MaChiNhanh
            JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu
            LEFT JOIN BAC_SI BS ON LK.MaBacSi = BS.MaBacSi
            WHERE
                LH.NgayKham >= %s
                AND LH.NgayKham < %s
                AND CTXN.TrangThaiXetNghiem = 'Đã có kết quả'
        """, (start_date, end_exclusive))
        lab_rows = [dict(row) for row in await lab_cursor.fetchall()]

        records = appointment_rows + lab_rows
        total_net_revenue = sum(int(row.get("netRevenue") or 0) for row in records)
        total_insurance_amount = sum(int(row.get("insuranceAmount") or 0) for row in records)

        total_appointments_cursor = await conn.execute("""
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN TrangThai = 'Đã hủy' THEN 1 ELSE 0 END) AS cancelled
            FROM LICH_HEN
            WHERE NgayKham >= %s AND NgayKham < %s
        """, (start_date, end_exclusive))
        total_appointment_row = await total_appointments_cursor.fetchone()
        total_appointments = int(total_appointment_row["total"] or 0) if total_appointment_row else 0
        cancelled_appointments = int(total_appointment_row["cancelled"] or 0) if total_appointment_row else 0
        cancellation_rate = round(cancelled_appointments / total_appointments * 100, 1) if total_appointments else 0

        branch_map = {}
        service_map = {}
        doctor_map = {}

        for record in records:
            branch_key = record.get("maChiNhanh")
            if branch_key:
                branch = branch_map.setdefault(branch_key, {
                    "maChiNhanh": branch_key,
                    "tenChiNhanh": record.get("tenChiNhanh") or branch_key,
                    "completedCount": 0,
                    "netRevenue": 0,
                    "insuranceAmount": 0,
                })
                if record.get("type") == "Khám":
                    branch["completedCount"] += 1
                branch["netRevenue"] += int(record.get("netRevenue") or 0)
                branch["insuranceAmount"] += int(record.get("insuranceAmount") or 0)

            service_key = record.get("maDichVu")
            if service_key:
                service = service_map.setdefault(service_key, {
                    "key": service_key,
                    "count": 0,
                    "value": 0,
                    "tenDichVu": record.get("tenDichVu") or service_key,
                    "loaiDichVu": record.get("type") or "",
                })
                service["count"] += 1
                service["value"] += int(record.get("netRevenue") or 0)

            doctor_key = record.get("maBacSi")
            if doctor_key and record.get("type") == "Khám":
                doctor = doctor_map.setdefault(doctor_key, {
                    "key": doctor_key,
                    "count": 0,
                    "value": 0,
                    "hoTen": record.get("hoTenBacSi") or doctor_key,
                    "chuyenKhoa": record.get("chuyenKhoa") or "",
                })
                doctor["count"] += 1
                doctor["value"] += 1

        return {
            "success": True,
            "message": "Lấy báo cáo tháng thành công.",
            "data": {
                "totalNetRevenue": total_net_revenue,
                "totalInsuranceAmount": total_insurance_amount,
                "completedAppointmentCount": len(appointment_rows),
                "cancellationRate": cancellation_rate,
                "totalServiceUsage": len(records),
                "branchRows": list(branch_map.values()),
                "doctorRows": sorted(doctor_map.values(), key=lambda row: row["value"], reverse=True),
                "serviceContributionRows": sorted(service_map.values(), key=lambda row: row["value"], reverse=True),
            },
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "data": None,
        }

    finally:
        await conn.close()

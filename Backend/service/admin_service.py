import uuid

from check_db import get_connection

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

        # check duplicate schedule
        cursor = await conn.execute("""
            SELECT id, MaLichTruc
            FROM LICH_TRUC
            WHERE MaBacSi = %s
              AND NgayTruc = %s
              AND CaTruc = %s
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

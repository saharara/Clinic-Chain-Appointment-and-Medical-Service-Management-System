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

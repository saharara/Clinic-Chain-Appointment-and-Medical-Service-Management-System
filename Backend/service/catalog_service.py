from check_db import get_connection


async def _fetch_all(sql: str, params: tuple = ()):
    conn = await get_connection()
    try:
        cursor = await conn.execute(sql, params)
        return [dict(row) for row in await cursor.fetchall()]
    finally:
        await conn.close()


async def _table_has_column(table_name: str, column_name: str) -> bool:
    conn = await get_connection()
    try:
        cursor = await conn.execute(
            """
            SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE
                TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = %s
                AND COLUMN_NAME = %s
            """,
            (table_name, column_name),
        )
        row = await cursor.fetchone()
        return bool(row and row["total"])
    finally:
        await conn.close()


async def get_branches():
    rows = await _fetch_all(
        """
        SELECT
            MaChiNhanh,
            TenChiNhanh,
            DiaChi,
            SDT
        FROM CHI_NHANH
        ORDER BY MaChiNhanh
        """
    )

    return {
        "success": True,
        "message": "Lấy danh sách chi nhánh thành công.",
        "data": rows,
    }


async def get_services():
    rows = await _fetch_all(
        """
        SELECT
            MaDichVu,
            TenDichVu,
            ChuyenKhoa,
            LoaiDichVu,
            GiaGoc,
            GiaGoc AS GiaDichVu
        FROM DICH_VU
        ORDER BY LoaiDichVu, ChuyenKhoa, MaDichVu
        """
    )

    return {
        "success": True,
        "message": "Lấy danh sách dịch vụ thành công.",
        "data": rows,
    }


async def get_branch_services():
    rows = await _fetch_all(
        """
        SELECT
            CNDV.MaCauHinh,
            CNDV.MaChiNhanh,
            CN.TenChiNhanh,
            CNDV.MaDichVu,
            DV.TenDichVu,
            DV.ChuyenKhoa,
            DV.LoaiDichVu,
            DV.GiaGoc,
            CNDV.SlotGioiHan
        FROM CHI_NHANH_DICH_VU CNDV
        JOIN CHI_NHANH CN
            ON CNDV.MaChiNhanh = CN.MaChiNhanh
        JOIN DICH_VU DV
            ON CNDV.MaDichVu = DV.MaDichVu
        ORDER BY CNDV.MaChiNhanh, DV.LoaiDichVu, DV.ChuyenKhoa, CNDV.MaDichVu
        """
    )

    return {
        "success": True,
        "message": "Lấy danh sách cấu hình dịch vụ chi nhánh thành công.",
        "data": rows,
    }


async def get_diseases():
    rows = await _fetch_all(
        """
        SELECT
            MaBenh,
            TenBenh
        FROM BENH
        ORDER BY MaBenh
        """
    )

    has_icd_mmll = any(row.get("MaBenh") == "ICD_MMLL" for row in rows)

    return {
        "success": True,
        "message": "Lấy danh mục bệnh thành công.",
        "data": rows,
        "meta": {
            "hasICD_MMLL": has_icd_mmll,
        },
    }


async def get_medicines():
    rows = await _fetch_all(
        """
        SELECT
            MaThuoc,
            TenThuoc,
            DonViTinh
        FROM THUOC
        ORDER BY TenThuoc
        """
    )

    return {
        "success": True,
        "message": "Lấy danh mục thuốc thành công.",
        "data": rows,
    }


async def get_bhyt_categories():
    rows = await _fetch_all(
        """
        SELECT
            KyTuDauBHYT,
            DoiTuongChinhSach,
            TyLeHuong
        FROM DANH_MUC_BHYT
        ORDER BY KyTuDauBHYT
        """
    )

    return {
        "success": True,
        "message": "Lấy danh mục BHYT thành công.",
        "data": rows,
    }


async def get_doctor_schedules(from_date: str = None, to_date: str = None):
    where_clauses = []
    params = []

    if from_date:
        where_clauses.append("LTR.NgayTruc >= %s")
        params.append(from_date)

    if to_date:
        where_clauses.append("LTR.NgayTruc <= %s")
        params.append(to_date)

    where_sql = ""
    if where_clauses:
        where_sql = "WHERE " + " AND ".join(where_clauses)

    has_schedule_status = await _table_has_column("LICH_TRUC", "TrangThai")
    status_select = (
        "COALESCE(LTR.TrangThai, 'Đang hoạt động') AS TrangThai"
        if has_schedule_status
        else "'Đang hoạt động' AS TrangThai"
    )

    rows = await _fetch_all(
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
            {status_select}
        FROM LICH_TRUC LTR
        JOIN BAC_SI BS
            ON LTR.MaBacSi = BS.MaBacSi
        JOIN CHI_NHANH CN
            ON LTR.MaChiNhanh = CN.MaChiNhanh
        {where_sql}
        ORDER BY LTR.NgayTruc, LTR.CaTruc, LTR.MaChiNhanh, LTR.MaBacSi
        """,
        tuple(params),
    )

    return {
        "success": True,
        "message": "Lấy danh sách lịch trực thành công.",
        "data": rows,
    }

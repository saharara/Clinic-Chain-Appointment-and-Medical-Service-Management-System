from database import get_connection
from aiomysql import DictCursor

async def get_pending_tests():

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT
                    CTXN.MaChiTietXN,
                    CTXN.MaLuotKham,
                    CTXN.MaDichVu,
                    DV.TenDichVu,
                    CTXN.TrangThaiXetNghiem,
                    BN.MaBenhAn,
                    BN.HoTen,
                    BS.MaBacSi,
                    BS.HoTen AS TenBacSi
                FROM CHI_TIET_XET_NGHIEM CTXN
                JOIN LUOT_KHAM LK
                    ON CTXN.MaLuotKham = LK.MaLuotKham
                JOIN LICH_HEN LH
                    ON LK.MaLichHen = LH.MaLichHen
                JOIN BENH_NHAN BN
                    ON LH.MaBenhNhan = BN.MaBenhNhan
                JOIN DICH_VU DV
                    ON CTXN.MaDichVu = DV.MaDichVu
                JOIN BAC_SI BS
                    ON LH.MaBacSi = BS.MaBacSi
                WHERE CTXN.TrangThaiXetNghiem = 'Chưa thực hiện'
            """)

            rows = await cursor.fetchall()

            if not rows:
                return {
                    "success": True,
                    "message": "Không có yêu cầu xét nghiệm mới.",
                    "data": []
                }

            return {
                "success": True,
                "message": "Danh sách yêu cầu xét nghiệm.",
                "data": [dict(row) for row in rows]
            }

    finally:
        conn.close()

async def accept_test_request(
    ma_chi_tiet_xn: str
):

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM CHI_TIET_XET_NGHIEM
                WHERE MaChiTietXN = %s
            """, (ma_chi_tiet_xn,))

            req = await cursor.fetchone()

            if not req:
                return {
                    "success": False,
                    "message": "Yêu cầu xét nghiệm không tồn tại.",
                    "data": None
                }

            if req["TrangThaiXetNghiem"] != "Chưa thực hiện":
                return {
                    "success": False,
                    "message": "Yêu cầu không hợp lệ.",
                    "data": None
                }

            await cursor.execute("""
                UPDATE CHI_TIET_XET_NGHIEM
                SET TrangThaiXetNghiem = 'Đã có kết quả'
                WHERE MaChiTietXN = %s
            """, (ma_chi_tiet_xn,))

            await conn.commit()

            return {
                "success": True,
                "message": "Đã nhận yêu cầu xét nghiệm.",
                "data": {
                    "MaChiTietXN": ma_chi_tiet_xn,
                    "TrangThaiMoi": "Đã có kết quả"
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

async def update_test_result(
    ma_chi_tiet_xn: str,
    ket_qua: str,
    ghi_chu: str = None
):

    if not ket_qua:
        return {
            "success": False,
            "message": "Thiếu thông tin kết quả xét nghiệm.",
            "data": None
        }

    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT *
                FROM CHI_TIET_XET_NGHIEM
                WHERE MaChiTietXN = %s
            """, (ma_chi_tiet_xn,))

            req = await cursor.fetchone()

            if not req:
                return {
                    "success": False,
                    "message": "Yêu cầu xét nghiệm không tồn tại.",
                    "data": None
                }

            if req["TrangThaiXetNghiem"] != "Đã có kết quả":
                return {
                    "success": False,
                    "message": "Trạng thái không hợp lệ.",
                    "data": None
                }

            await cursor.execute("""
            UPDATE CHI_TIET_XET_NGHIEM
            SET KetQuaXetNghiem = %s,
                TrangThaiXetNghiem = 'Đã có kết quả'
            WHERE MaChiTietXN = %s
        """, (
            ket_qua,
            ma_chi_tiet_xn
        ))

        await conn.commit()

        return {
            "success": True,
            "message": "Cập nhật kết quả xét nghiệm thành công.",
            "data": {
                "MaChiTietXN": ma_chi_tiet_xn,
                "TrangThaiMoi": "Đã có kết quả"
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
async def get_test_detail(ma_chi_tiet_xn: str):

    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            await cursor.execute("""
                SELECT 
                    CTXN.*,

                    DV_XN.TenDichVu, 
                    DV_XN.ChuyenKhoa, 
                    DV_XN.LoaiDichVu, 
                    DV_XN.GiaGoc,

                    LH.MaLichHen, 
                    LH.NgayKham, 
                    LH.CaKham, 
                    LH.TrangThai AS TrangThaiLichHen,

                    BN.MaBenhAn, 
                    BN.HoTen AS TenBenhNhan, 
                    BN.NgaySinh, 
                    BN.GioiTinh, 
                    BN.SDT AS SDTBenhNhan,

                    BS.MaBacSi, 
                    BS.HoTen AS TenBacSi, 
                    BS.ChuyenKhoa AS ChuyenKhoaBacSi,

                    XNV.MaXNV, 
                    XNV.HoTen AS TenXetNghiemVien, 
                    XNV.SDT AS SDTXNV

                FROM CHI_TIET_XET_NGHIEM CTXN

                JOIN LUOT_KHAM LK 
                    ON CTXN.MaLuotKham = LK.MaLuotKham

                JOIN LICH_HEN LH 
                    ON LK.MaLichHen = LH.MaLichHen

                JOIN BENH_NHAN BN 
                    ON LH.MaBenhAn = BN.MaBenhAn

                JOIN DICH_VU DV_XN 
                    ON CTXN.MaDichVu = DV_XN.MaDichVu

                LEFT JOIN CHI_NHANH_DICH_VU CNDV 
                    ON LH.MaCauHinh = CNDV.MaCauHinh

                LEFT JOIN DICH_VU DV_KHAM 
                    ON CNDV.MaDichVu = DV_KHAM.MaDichVu

                LEFT JOIN LICH_TRUC LTR 
                    ON CNDV.MaChiNhanh = LTR.MaChiNhanh 
                    AND LH.NgayKham = LTR.NgayTruc 
                    AND LH.CaKham = LTR.CaTruc

                LEFT JOIN BAC_SI BS 
                    ON LTR.MaBacSi = BS.MaBacSi 
                    AND BS.ChuyenKhoa = DV_KHAM.ChuyenKhoa

                LEFT JOIN XET_NGHIEM_VIEN XNV 
                    ON CTXN.MaXNV = XNV.MaXNV

                WHERE CTXN.MaChiTietXN = %s
            """, (ma_chi_tiet_xn,))

            row = await cursor.fetchone()

            if not row:
                return {
                    "success": False,
                    "message": "Không tìm thấy yêu cầu xét nghiệm.",
                    "data": None
                }

            return {
                "success": True,
                "message": "Chi tiết xét nghiệm.",
                "data": dict(row)
            }

    finally:
        conn.close()
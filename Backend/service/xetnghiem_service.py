from check_db import get_connection
import sqlite3

async def get_pending_tests():

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
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
            JOIN BENH_NHAN BN
                ON LK.MaLichHen = BN.MaBenhAn
            JOIN DICH_VU DV
                ON CTXN.MaDichVu = DV.MaDichVu
            JOIN BAC_SI BS
                ON LK.MaLichHen = LK.MaLichHen
            WHERE CTXN.TrangThaiXetNghiem = 'ChuaThucHien'
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
        await conn.close()

async def accept_test_request(
    ma_chi_tiet_xn: str
):

    conn = await get_connection()

    try:

        cursor = await conn.execute("""
            SELECT *
            FROM CHI_TIET_XET_NGHIEM
            WHERE MaChiTietXN = ?
        """, (ma_chi_tiet_xn,))

        req = await cursor.fetchone()

        if not req:
            return {
                "success": False,
                "message": "Yêu cầu xét nghiệm không tồn tại.",
                "data": None
            }

        if req["TrangThaiXetNghiem"] != "ChuaThucHien":
            return {
                "success": False,
                "message": "Yêu cầu không hợp lệ.",
                "data": None
            }

        await conn.execute("""
            UPDATE CHI_TIET_XET_NGHIEM
            SET TrangThaiXetNghiệm = 'DangThucHien'
            WHERE MaChiTietXN = ?
        """, (ma_chi_tiet_xn,))

        await conn.commit()

        return {
            "success": True,
            "message": "Đã nhận yêu cầu xét nghiệm.",
            "data": {
                "MaChiTietXN": ma_chi_tiet_xn,
                "TrangThaiMoi": "DangThucHien"
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

        cursor = await conn.execute("""
            SELECT *
            FROM CHI_TIET_XET_NGHIEM
            WHERE MaChiTietXN = ?
        """, (ma_chi_tiet_xn,))

        req = await cursor.fetchone()

        if not req:
            return {
                "success": False,
                "message": "Yêu cầu xét nghiệm không tồn tại.",
                "data": None
            }

        if req["TrangThaiXetNghiem"] != "DangThucHien":
            return {
                "success": False,
                "message": "Trạng thái không hợp lệ.",
                "data": None
            }

        await conn.execute("""
            UPDATE CHI_TIET_XET_NGHIEM
            SET KetQuaXetNghiem = ?,
                TrangThaiXetNghiem = 'DaCoKetQua'
            WHERE MaChiTietXN = ?
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
                "TrangThaiMoi": "DaCoKetQua"
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

async def get_test_detail(ma_chi_tiet_xn: str):
    conn = await get_connection()
    
    # Đảm bảo row trả về có thể parse thành dictionary bằng dict(row)
    conn.row_factory = sqlite3.Row 
    
    try:
        cursor = await conn.execute("""
            SELECT 
                CTXN.*,
                
                -- Thông tin dịch vụ xét nghiệm
                DV_XN.TenDichVu, 
                DV_XN.ChuyenKhoa, 
                DV_XN.LoaiDichVu, 
                DV_XN.GiaGoc,
                
                -- Thông tin lịch hẹn
                LH.MaLichHen, 
                LH.NgayKham, 
                LH.CaKham, 
                LH.TrangThai AS TrangThaiLichHen,
                
                -- Thông tin bệnh nhân
                BN.MaBenhAn, 
                BN.HoTen AS TenBenhNhan, 
                BN.NgaySinh, 
                BN.GioiTinh, 
                BN.SDT AS SDTBenhNhan,
                
                -- Thông tin Bác sĩ chỉ định (Tìm qua Lịch trực & Cấu hình dịch vụ)
                BS.MaBacSi, 
                BS.HoTen AS TenBacSi, 
                BS.ChuyenKhoa AS ChuyenKhoaBacSi,
                
                -- Thông tin Xét nghiệm viên thực hiện
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
                
            -- Dịch vụ CỦA XÉT NGHIỆM
            JOIN DICH_VU DV_XN 
                ON CTXN.MaDichVu = DV_XN.MaDichVu
                
            -- TÌM BÁC SĨ CHỈ ĐỊNH 
            -- 1. Lấy cấu hình dịch vụ khám ban đầu từ Lịch Hẹn
            JOIN CHI_NHANH_DICH_VU CNDV 
                ON LH.MaCauHinh = CNDV.MaCauHinh
            -- 2. Lấy chi tiết dịch vụ khám để biết Chuyên Khoa
            JOIN DICH_VU DV_KHAM 
                ON CNDV.MaDichVu = DV_KHAM.MaDichVu
            -- 3. Map với Lịch trực cùng Ngày, cùng Ca, cùng Chi nhánh
            JOIN LICH_TRUC LTR 
                ON CNDV.MaChiNhanh = LTR.MaChiNhanh 
                AND LH.NgayKham = LTR.NgayTruc 
                AND LH.CaKham = LTR.CaTruc
            -- 4. Map Bác sĩ trong ca trực đó (phải đúng chuyên khoa khám)
            JOIN BAC_SI BS 
                ON LTR.MaBacSi = BS.MaBacSi 
                AND BS.ChuyenKhoa = DV_KHAM.ChuyenKhoa
                
            -- Xét nghiệm viên (Dùng LEFT JOIN vì có thể chưa thực hiện)
            LEFT JOIN XET_NGHIEM_VIEN XNV 
                ON CTXN.MaXNV = XNV.MaXNV
                
            WHERE CTXN.MaChiTietXN = ?
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
        await conn.close()
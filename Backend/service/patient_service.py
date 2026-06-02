import uuid
from datetime import datetime
from database import get_connection
from aiomysql import DictCursor


async def register_account(data: dict):
    try:
        conn = await get_connection()
        # Extension 6a: Kiểm tra số điện thoại (tài khoản) đã tồn tại
        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute(
                "SELECT SDT FROM BENH_NHAN WHERE SDT = %s", (data['sdt'],)
            )
            if await cursor.fetchone():
                return {"success": False, "message": "Số điện thoại đã được sử dụng.", "data": None}

            # Khởi tạo mã bệnh án tự động
            ma_ba = f"BN_{uuid.uuid4().hex[:8].upper()}"
            
            # Xử lý Extension 4a: Bệnh nhân không có BHYT
            ky_tu_bhyt = data.get('ky_tu_bhyt')
            ma_so_bhyt = data.get('ma_so_bhyt')
            
            # Tiền xử lý: Nếu frontend gửi lên "string", chuỗi rỗng "", hoặc khoảng trắng -> Chuyển thành None (NULL trong SQL)
            if ky_tu_bhyt in ["string", "", " "] or not ky_tu_bhyt:
                ky_tu_bhyt = None
            if ma_so_bhyt in ["string", "", " "] or not ma_so_bhyt:
                ma_so_bhyt = None
            
            await cursor.execute("""
                INSERT INTO BENH_NHAN (MaBenhAn, HoTen, NgaySinh, GioiTinh, SDT, MatKhau, DiaChi, MaSoBHYT, KyTuDauBHYT)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (ma_ba, data['hoten'], data['ngaysinh'], data['gioitinh'], data['sdt'], 
                    data['matkhau'], data['diachi'], ma_so_bhyt, ky_tu_bhyt))
            
            await conn.commit()
            return {"success": True, "message": "Đăng ký thành công", "data": data}
        
    except Exception as e:
        await conn.rollback() # Extension 8a: Rollback khi lỗi
        return {"success": False, "message": f"Lỗi hệ thống: {str(e)}", "data": None}

async def search_available_slots(ma_chi_nhanh: str, chuyen_khoa: str, ngay_kham: str):
    conn = await get_connection()

    search_term = chuyen_khoa.replace(" ", "").lower()
    search_pattern = f"%{search_term}%"

    # Truy vấn tìm các ca trực
    async with conn.cursor(DictCursor) as cursor:
        await cursor.execute("""
            SELECT 
                LTR.CaTruc, 
                BS.HoTen AS TenBacSi, 
                CNDV.MaCauHinh,
                DV.TenDichVu, 
                DV.GiaGoc,
                CNDV.SlotGioiHan - (
                    SELECT COUNT(*) FROM LICH_HEN LH 
                    WHERE LH.MaCauHinh = CNDV.MaCauHinh AND LH.NgayKham = LTR.NgayTruc AND LH.CaKham = LTR.CaTruc
                ) AS SlotConTrong
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS ON LTR.MaBacSi = BS.MaBacSi
            JOIN DICH_VU DV ON BS.ChuyenKhoa = DV.ChuyenKhoa
            JOIN CHI_NHANH_DICH_VU CNDV ON DV.MaDichVu = CNDV.MaDichVu AND LTR.MaChiNhanh = CNDV.MaChiNhanh
            
            -- 2. Chuẩn hóa cột trong Database: Bỏ khoảng trắng, đưa về in thường và dùng LIKE
            WHERE LTR.MaChiNhanh = %s 
              AND REPLACE(LOWER(DV.ChuyenKhoa), ' ', '') LIKE %s 
              AND LTR.NgayTruc = %s
        """, (ma_chi_nhanh, search_pattern, ngay_kham))
        
        slots = await cursor.fetchall()
    
    # Lọc ra các slot còn chỗ (Extension 9a)
    available_slots = [dict(s) for s in slots if s['SlotConTrong'] > 0]
    
    if not available_slots:
        return {"success": False, "message": "Không có suất khám hoặc bác sĩ phù hợp.", "data": None}
        
    return {"success": True, "message": "Tìm thấy suất khám phù hợp.", "data": available_slots}

async def book_and_pay(
    ma_benh_an: str,
    ma_cau_hinh: str,
    ngay_kham: str,
    ca_kham: int
):
    conn = None

    try:
        conn = await get_connection()

        async with conn.cursor(DictCursor) as cursor:

            # ==================================================
            # 1. Kiểm tra bệnh nhân
            # ==================================================
            await cursor.execute("""
                SELECT
                    BN.MaBenhAn,
                    BN.KyTuDauBHYT,
                    BHYT.TyLeHuong
                FROM BENH_NHAN BN
                LEFT JOIN DANH_MUC_BHYT BHYT
                    ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
                WHERE BN.MaBenhAn = %s
            """, (ma_benh_an,))

            bn_info = await cursor.fetchone()

            if not bn_info:
                return {
                    "success": False,
                    "message": "Bệnh nhân không tồn tại.",
                    "data": None
                }

            # ==================================================
            # 2. Kiểm tra cấu hình dịch vụ
            # ==================================================
            await cursor.execute("""
                SELECT
                    CNDV.MaCauHinh,
                    CNDV.MaChiNhanh,
                    CNDV.MaDichVu,
                    DV.TenDichVu,
                    DV.GiaGoc
                FROM CHI_NHANH_DICH_VU CNDV
                JOIN DICH_VU DV
                    ON DV.MaDichVu = CNDV.MaDichVu
                WHERE CNDV.MaCauHinh = %s
            """, (ma_cau_hinh,))

            dv_info = await cursor.fetchone()

            if not dv_info:
                return {
                    "success": False,
                    "message": "Dịch vụ không tồn tại.",
                    "data": None
                }

            # ==================================================
            # 3. Kiểm tra đặt trùng
            # ==================================================
            await cursor.execute("""
                SELECT MaLichHen
                FROM LICH_HEN
                WHERE MaBenhAn = %s
                    AND NgayKham = %s
                    AND CaKham = %s
                    AND TrangThai <> 'DaHuy'
            """, (
                ma_benh_an,
                ngay_kham,
                ca_kham
            ))

            existed = await cursor.fetchone()

            if existed:
                return {
                    "success": False,
                    "message": "Bạn đã có lịch khám trong ca này.",
                    "data": None
                }

            # ==================================================
            # 4. Tính giá sau BHYT
            # ==================================================
            ty_le_huong = bn_info["TyLeHuong"] or 0

            gia_goc = dv_info["GiaGoc"]

            gia_cuoi = int(
                gia_goc * (1 - ty_le_huong)
            )

            # ==================================================
            # 5. Tính STT
            # ==================================================
            await cursor.execute("""
                SELECT
                    COALESCE(MAX(STT), 0) + 1 AS STT_MOI
                FROM LICH_HEN
                WHERE MaCauHinh = %s
                    AND NgayKham = %s
                    AND CaKham = %s
            """, (
                ma_cau_hinh,
                ngay_kham,
                ca_kham
            ))

            stt_info = await cursor.fetchone()

            stt = stt_info["STT_MOI"]

            # ==================================================
            # 6. Giả lập thanh toán
            # ==================================================
            payment_token = f"TOK_{uuid.uuid4().hex[:10].upper()}"

            # ==================================================
            # 7. Tạo lịch hẹn
            # ==================================================
            ma_lich_hen = f"LH_{uuid.uuid4().hex[:8].upper()}"

            await cursor.execute("""
                INSERT INTO LICH_HEN (
                    MaLichHen,
                    MaBenhAn,
                    MaCauHinh,
                    NgayKham,
                    CaKham,
                    STT,
                    PaymentToken,
                    GiaCuoi,
                    TrangThai
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    'Đã xác nhận'
                )
            """, (
                ma_lich_hen,
                ma_benh_an,
                ma_cau_hinh,
                ngay_kham,
                ca_kham,
                stt,
                payment_token,
                gia_cuoi
            ))

            await conn.commit()

            return {
                "success": True,
                "message": "Đặt lịch và thanh toán thành công.",
                "data": {
                    "MaLichHen": ma_lich_hen,
                    "STT": stt,
                    "GiaCuoi": gia_cuoi,
                    "PaymentToken": payment_token,
                    "TrangThai": "Đã xác nhận"
                }
            }

    except Exception as e:

        if conn:
            await conn.rollback()

        return {
            "success": False,
            "message": str(e),
            "data": None
        }

    finally:
        if conn:
            conn.close()

async def book_treatment(
    ma_lich_trinh: str,
    ngay_thuc_hien: str,
    ca_kham: int
):
    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            await cursor.execute("""
                SELECT *
                FROM LICH_TRINH_DIEU_TRI
                WHERE MaLichTrinh = %s
            """, (ma_lich_trinh,))

            lt = await cursor.fetchone()

            if not lt:
                return {
                    "success": False,
                    "message": "Không tìm thấy lịch trình điều trị.",
                    "data": None
                }

            if lt["TrangThai"] != "Chưa đặt lịch":
                return {
                    "success": False,
                    "message": "Buổi điều trị đã được đặt.",
                    "data": None
                }

            await cursor.execute("""
                UPDATE LICH_TRINH_DIEU_TRI
                SET
                    NgayThucHien = %s,
                    CaKham = %s,
                    TrangThai = 'Đã đặt lịch'
                WHERE MaLichTrinh = %s
            """, (
                ngay_thuc_hien,
                ca_kham,
                ma_lich_trinh
            ))

            await conn.commit()

            return {
                "success": True,
                "message": "Đặt lịch điều trị thành công.",
                "data": {
                    "MaLichTrinh": ma_lich_trinh,
                    "NgayThucHien": ngay_thuc_hien,
                    "CaKham": ca_kham,
                    "TrangThai": "Đã đặt lịch"
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

async def get_medical_history(ma_benh_an: str):
    conn = await get_connection()
    # 1. Lấy danh sách lượt khám tổng quát
    async with conn.cursor(DictCursor) as cursor:
        await cursor.execute("""
            SELECT LK.MaLuotKham, LH.NgayKham, B.TenBenh, LK.TrieuChung, LK.LoiDan
            FROM LUOT_KHAM LK
            JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
            LEFT JOIN BENH B ON LK.MaBenh = B.MaBenh
            WHERE LH.MaBenhAn = %s
            ORDER BY LH.NgayKham DESC
        """, (ma_benh_an))
        
        luot_kham_list = [dict(row) for row in await cursor.fetchall()]
        
        if not luot_kham_list:
            return {"success": False, "message": "Chưa có lịch sử khám.", "data": None} # Ext 3a
            
        # 2. Map chi tiết (Thuốc, XN) vào từng lượt khám
        for lk in luot_kham_list:
            ma_lk = lk['MaLuotKham']
            
            # Kéo Đơn Thuốc (Ext 11a)
            await cursor.execute("""
                SELECT T.TenThuoc, CTDT.SoLuong, CTDT.LieuDung 
                FROM CHI_TIET_DON_THUOC CTDT
                JOIN THUOC T ON CTDT.MaThuoc = T.MaThuoc
                WHERE CTDT.MaLuotKham = %s
            """, (ma_lk,))
            lk['DonThuoc'] = [dict(t) for t in await cursor.fetchall()]
            
            # Kéo Xét Nghiệm (Ext 8a)
            await cursor.execute("""
                SELECT DV.TenDichVu, CTXN.KetQuaXetNghiem 
                FROM CHI_TIET_XET_NGHIEM CTXN
                JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu
                WHERE CTXN.MaLuotKham = %s
            """, (ma_lk,))
            lk['XetNghiem'] = [dict(x) for x in await cursor.fetchall()]

    return {"success": True, "message": "Lấy lịch sử khám thành công.", "data": luot_kham_list}

async def receive_notification(
    MaBenhAn: str
):
    conn = await get_connection()

    try:

        async with conn.cursor(DictCursor) as cursor:

            await cursor.execute("""
                SELECT
                    MaThongBao,
                    MaLichHen,
                    NoiDung,
                    TrangThai,
                    ThoiGianGui
                FROM Lich_Su_Thong_Bao
                WHERE MaBenhAn = %s
                ORDER BY ThoiGianGui DESC
            """, (MaBenhAn,))

            notifications = await cursor.fetchall()

            return {
                "success": True,
                "message": "Lấy danh sách thông báo thành công.",
                "data": notifications
            }

    except Exception as e:

        return {
            "success": False,
            "message": str(e),
            "data": None
        }

    finally:
        conn.close()

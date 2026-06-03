import uuid
from check_db import get_connection


async def register_account(data: dict):
    conn = None
    try:
        conn = await get_connection()
        required_fields = ["hoten", "cccd", "ngaysinh", "gioitinh", "sdt", "matkhau", "diachi"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return {
                "success": False,
                "message": f"Thiếu thông tin bắt buộc: {', '.join(missing_fields)}.",
                "data": None,
            }

        # Extension 6a: Kiểm tra số điện thoại (tài khoản) đã tồn tại
        cursor = await conn.execute(
            "SELECT SDT FROM BENH_NHAN WHERE SDT = %s", (data['sdt'],)
        )
        if await cursor.fetchone():
            return {"success": False, "message": "Số điện thoại đã được sử dụng.", "data": None}

        cursor = await conn.execute(
            "SELECT CCCD FROM BENH_NHAN WHERE CCCD = %s", (data["cccd"],)
        )
        if await cursor.fetchone():
            return {"success": False, "message": "Số CCCD đã được sử dụng.", "data": None}

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
        
        await conn.execute("""
            INSERT INTO BENH_NHAN (MaBenhAn, HoTen, CCCD, NgaySinh, GioiTinh, SDT, MatKhau, DiaChi, MaSoBHYT, KyTuDauBHYT)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ma_ba,
            data['hoten'],
            data['cccd'],
            data['ngaysinh'],
            data['gioitinh'],
            data['sdt'],
            data['matkhau'],
            data['diachi'],
            ma_so_bhyt,
            ky_tu_bhyt,
        ))
        
        await conn.commit()
        return {"success": True, "message": "Đăng ký thành công", "data": {**data, "MaBenhAn": ma_ba}}
        
    except Exception as e:
        if conn:
            await conn.rollback() # Extension 8a: Rollback khi lỗi
        return {"success": False, "message": f"Lỗi hệ thống: {str(e)}", "data": None}
    finally:
        if conn:
            await conn.close()

async def search_available_slots(ma_chi_nhanh: str, chuyen_khoa: str, ngay_kham: str):
    conn = await get_connection()
    
    # 1. Chuẩn hóa từ khóa tìm kiếm: 
    # Bỏ khoảng trắng, đưa về in thường và bọc trong dấu % để dùng cho toán tử LIKE
    search_term = chuyen_khoa.replace(" ", "").lower()
    search_pattern = f"%{search_term}%"

    # Truy vấn tìm các ca trực
    cursor = await conn.execute("""
        SELECT 
            LTR.id,
            LTR.MaLichTruc,
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
        await conn.close()
        return {"success": False, "message": "Không có suất khám hoặc bác sĩ phù hợp.", "data": None}

    await conn.close()
    return {"success": True, "message": "Tìm thấy suất khám phù hợp.", "data": available_slots}

async def book_and_pay(
    ma_benh_an: str,
    ma_cau_hinh: str,
    ngay_kham: str,
    ca_kham: int,
    ma_bac_si: str,
):
    conn = None
    try:
        conn = await get_connection()
        # 1. Lấy thông tin BHYT của bệnh nhân
        cursor = await conn.execute("""
            SELECT BN.KyTuDauBHYT, BHYT.TyLeHuong 
            FROM BENH_NHAN BN
            LEFT JOIN DANH_MUC_BHYT BHYT ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
            WHERE BN.MaBenhAn = %s
        """, (ma_benh_an,))
        bn_info = await cursor.fetchone()
        if not bn_info:
            return {"success": False, "message": "Không tìm thấy bệnh nhân.", "data": None}
        
        # 2. Lấy giá gốc dịch vụ
        cursor = await conn.execute("""
            SELECT DV.GiaGoc 
            FROM CHI_NHANH_DICH_VU CNDV
            JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
            WHERE CNDV.MaCauHinh = %s
        """, (ma_cau_hinh,))
        dv_info = await cursor.fetchone()
        if not dv_info:
            return {"success": False, "message": "Không tìm thấy cấu hình dịch vụ.", "data": None}
        
        # Tính Giá Cuối (Main Success Scenario)
        ty_le = bn_info['TyLeHuong'] if bn_info and bn_info['TyLeHuong'] else 0.0
        gia_cuoi = int(dv_info['GiaGoc'] * (1 - ty_le))
        
        ma_lich_hen = f"LH_{uuid.uuid4().hex[:6].upper()}"
        stt_cursor = await conn.execute(
            """
            SELECT COALESCE(MAX(STT), 0) + 1 AS NextSTT
            FROM LICH_HEN
            WHERE MaCauHinh = %s
            """,
            (ma_cau_hinh,),
        )
        stt_row = await stt_cursor.fetchone()
        stt = stt_row["NextSTT"] if stt_row else 1

        # Giả lập đã thanh toán thành công qua QR
        payment_token = f"TOK_{uuid.uuid4().hex[:10]}"
        
        await conn.execute("""
            INSERT INTO LICH_HEN (
                MaLichHen,
                MaBenhAn,
                MaCauHinh,
                NgayKham,
                CaKham,
                STT,
                PaymentToken,
                GiaCuoi,
                TrangThai,
                MaBacSi
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Chờ khám', %s)
        """, (
            ma_lich_hen,
            ma_benh_an,
            ma_cau_hinh,
            ngay_kham,
            ca_kham,
            stt,
            payment_token,
            gia_cuoi,
            ma_bac_si,
        ))
        
        await conn.commit()
        return {
            "success": True,
            "message": "Đặt lịch và thanh toán thành công",
            "data": {
                "MaLichHen": ma_lich_hen,
                "MaBacSi": ma_bac_si,
                "PaymentToken": payment_token,
            },
        }
        
    except Exception as e:
        if conn:
            await conn.rollback() # Extension 12a
        return {"success": False, "message": "Lỗi tạo lịch khám", "data": None}
    finally:
        if conn:
            await conn.close()

async def book_treatment(ma_lich_trinh: str, ma_benh_an: str, ngay: str, ca: int):
    conn = await get_connection()
    # Đảm bảo lịch trình này thuộc về bệnh nhân (Bảo mật)
    cursor = await conn.execute("""
        SELECT LTDT.TrangThai FROM LICH_TRINH_DIEU_TRI LTDT
        JOIN LUOT_KHAM LK ON LTDT.MaLuotKham = LK.MaLuotKham
        JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
        WHERE LTDT.MaLichTrinh = %s AND LH.MaBenhAn = %s
    """, (ma_lich_trinh, ma_benh_an))
    
    row = await cursor.fetchone()
    if not row or row['TrangThai'] != 'Chưa đặt lịch':
        await conn.close()
        return {"success": False, "message": "Chỉ định không hợp lệ hoặc đã đặt lịch.", "data": None}
        
    await conn.execute("""
        UPDATE LICH_TRINH_DIEU_TRI 
        SET NgayThucHien = %s, CaKham = %s, TrangThai = 'Chờ khám'
        WHERE MaLichTrinh = %s
    """, (ngay, ca, ma_lich_trinh))
    
    await conn.commit()
    response = {"success": True, "message": "Hẹn lịch điều trị thành công.", "data": {
        "MaLichTrinh": ma_lich_trinh,
        "NgayThucHien": ngay,
        "CaKham": ca
    }}
    await conn.close()
    return response

async def request_refund(ma_lich_hen: str, ma_benh_an: str, bank_info: str):
    conn = await get_connection()
    cursor = await conn.execute("""
        SELECT MaLichHen
        FROM LICH_HEN
        WHERE MaLichHen = %s AND MaBenhAn = %s AND TrangThai = 'Đã hủy'
    """, (ma_lich_hen, ma_benh_an))
    
    if not await cursor.fetchone():
        await conn.close()
        return {"success": False, "message": "Lịch hẹn không đủ điều kiện hoàn tiền.", "data": None}
        
    # Thực tế sẽ lưu bank_info vào một bảng yêu cầu hoàn tiền riêng khi có schema chính thức.
    response = {"success": True, "message": "Đã gửi yêu cầu hoàn tiền.", "data": {
        "MaLichHen": ma_lich_hen,
        "BankInfo": bank_info
    }}
    await conn.close()
    return response

async def get_medical_history(ma_benh_an: str):
    conn = await get_connection()
    # 1. Lấy danh sách lượt khám tổng quát
    cursor = await conn.execute("""
        SELECT LK.MaLuotKham, LH.NgayKham, B.TenBenh, LK.TrieuChung, LK.LoiDan
        FROM LUOT_KHAM LK
        JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
        LEFT JOIN BENH B ON LK.MaBenh = B.MaBenh
        WHERE LH.MaBenhAn = %s
        ORDER BY LH.NgayKham DESC
    """, (ma_benh_an,))
    
    luot_kham_list = [dict(row) for row in await cursor.fetchall()]
    
    if not luot_kham_list:
        await conn.close()
        return {"success": False, "message": "Chưa có lịch sử khám.", "data": None} # Ext 3a
        
    # 2. Map chi tiết (Thuốc, XN) vào từng lượt khám
    for lk in luot_kham_list:
        ma_lk = lk['MaLuotKham']
        
        # Kéo Đơn Thuốc (Ext 11a)
        cur_thuoc = await conn.execute("""
            SELECT T.TenThuoc, CTDT.SoLuong, CTDT.LieuDung 
            FROM CHI_TIET_DON_THUOC CTDT
            JOIN THUOC T ON CTDT.MaThuoc = T.MaThuoc
            WHERE CTDT.MaLuotKham = %s
        """, (ma_lk,))
        lk['DonThuoc'] = [dict(t) for t in await cur_thuoc.fetchall()]
        
        # Kéo Xét Nghiệm (Ext 8a)
        cur_xn = await conn.execute("""
            SELECT DV.TenDichVu, CTXN.KetQuaXetNghiem 
            FROM CHI_TIET_XET_NGHIEM CTXN
            JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu
            WHERE CTXN.MaLuotKham = %s
        """, (ma_lk,))
        lk['XetNghiem'] = [dict(x) for x in await cur_xn.fetchall()]

    await conn.close()
    return {"success": True, "message": "Lấy lịch sử khám thành công.", "data": luot_kham_list}


async def receive_notification(ma_benh_an: str):
    conn = await get_connection()
    try:
        cursor = await conn.execute("""
            SELECT
                MaThongBao,
                MaLichHen,
                NoiDung,
                TrangThai,
                ThoiGianGui
            FROM LICH_SU_THONG_BAO
            WHERE MaBenhAn = %s
            ORDER BY ThoiGianGui DESC
        """, (ma_benh_an,))

        notifications = [dict(row) for row in await cursor.fetchall()]
        return {
            "success": True,
            "message": "Lấy danh sách thông báo thành công.",
            "data": notifications,
        }
    except Exception as exc:
        return {
            "success": False,
            "message": str(exc),
            "data": None,
        }
    finally:
        await conn.close()

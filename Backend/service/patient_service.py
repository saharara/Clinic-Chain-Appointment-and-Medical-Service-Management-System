import sqlite3
import uuid
from datetime import datetime
from check_db import get_connection


async def register_account(data: dict):
    try:
        conn = await get_connection()
        # Extension 6a: Kiểm tra số điện thoại (tài khoản) đã tồn tại
        cursor = await conn.execute(
            "SELECT SDT FROM BENH_NHAN WHERE SDT = ?", (data['sdt'],)
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
        
        await conn.execute("""
            INSERT INTO BENH_NHAN (MaBenhAn, HoTen, NgaySinh, GioiTinh, SDT, MatKhau, DiaChi, MaSoBHYT, KyTuDauBHYT)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (ma_ba, data['hoten'], data['ngaysinh'], data['gioitinh'], data['sdt'], 
                data['matkhau'], data['diachi'], ma_so_bhyt, ky_tu_bhyt))
        
        await conn.commit()
        return {"success": True, "message": "Đăng ký thành công", "data": data}
        
    except Exception as e:
        await conn.rollback() # Extension 8a: Rollback khi lỗi
        return {"success": False, "message": f"Lỗi hệ thống: {str(e)}", "data": None}

async def search_available_slots(ma_chi_nhanh: str, chuyen_khoa: str, ngay_kham: str):
    conn = await get_connection()
    conn.row_factory = sqlite3.Row # Đảm bảo trả về Row để ép kiểu dict()
    
    # 1. Chuẩn hóa từ khóa tìm kiếm: 
    # Bỏ khoảng trắng, đưa về in thường và bọc trong dấu % để dùng cho toán tử LIKE
    search_term = chuyen_khoa.replace(" ", "").lower()
    search_pattern = f"%{search_term}%"

    # Truy vấn tìm các ca trực
    cursor = await conn.execute("""
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
        WHERE LTR.MaChiNhanh = ? 
          AND REPLACE(LOWER(DV.ChuyenKhoa), ' ', '') LIKE ? 
          AND LTR.NgayTruc = ?
    """, (ma_chi_nhanh, search_pattern, ngay_kham))
    
    slots = await cursor.fetchall()
    
    # Lọc ra các slot còn chỗ (Extension 9a)
    available_slots = [dict(s) for s in slots if s['SlotConTrong'] > 0]
    
    if not available_slots:
        return {"success": False, "message": "Không có suất khám hoặc bác sĩ phù hợp.", "data": None}
        
    return {"success": True, "message": "Tìm thấy suất khám phù hợp.", "data": available_slots}

async def book_and_pay(ma_benh_an: str, ma_cau_hinh: str, ngay_kham: str, ca_kham: int):
    try:
        conn = await get_connection()
        # 1. Lấy thông tin BHYT của bệnh nhân
        cursor = await conn.execute("""
            SELECT BN.KyTuDauBHYT, BHYT.TyLeHuong 
            FROM BENH_NHAN BN
            LEFT JOIN DANH_MUC_BHYT BHYT ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
            WHERE BN.MaBenhAn = ?
        """, (ma_benh_an,))
        bn_info = await cursor.fetchone()
        
        # 2. Lấy giá gốc dịch vụ
        cursor = await conn.execute("""
            SELECT DV.GiaGoc 
            FROM CHI_NHANH_DICH_VU CNDV
            JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
            WHERE CNDV.MaCauHinh = ?
        """, (ma_cau_hinh,))
        dv_info = await cursor.fetchone()
        
        # Tính Giá Cuối (Main Success Scenario)
        ty_le = bn_info['TyLeHuong'] if bn_info and bn_info['TyLeHuong'] else 0.0
        gia_cuoi = int(dv_info['GiaGoc'] * (1 - ty_le))
        
        ma_lich_hen = f"LH_{uuid.uuid4().hex[:6].upper()}"
        stt = await conn.execute("SELECT COALESCE(MAX(STT), 0) + 1 FROM LICH_HEN WHERE MaCauHinh = ?", (ma_cau_hinh,))
        stt = await stt.fetchone()
        stt = stt[0]

        # Giả lập đã thanh toán thành công qua QR
        payment_token = f"TOK_{uuid.uuid4().hex[:10]}"
        
        await conn.execute("""
            INSERT INTO LICH_HEN (MaLichHen, MaBenhAn, MaCauHinh, NgayKham, CaKham, STT, PaymentToken, GiaCuoi, TrangThai)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DaXacNhan')
        """, (ma_lich_hen, ma_benh_an, ma_cau_hinh, ngay_kham, ca_kham, stt, payment_token, gia_cuoi))
        
        await conn.commit()
        return {"success": True, "message": "Đặt lịch và thanh toán thành công", "data": {"MaLichHen": ma_lich_hen}}
        
    except Exception as e:
        await conn.rollback() # Extension 12a
        return {"success": False, "message": "Lỗi tạo lịch khám", "data": None}

async def book_treatment(ma_lich_trinh: str, ma_benh_an: str, ngay: str, ca: int):
    conn = await get_connection()
    # Đảm bảo lịch trình này thuộc về bệnh nhân (Bảo mật)
    cursor = await conn.execute("""
        SELECT LTDT.TrangThai FROM LICH_TRINH_DIEU_TRI LTDT
        JOIN LUOT_KHAM LK ON LTDT.MaLuotKham = LK.MaLuotKham
        JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
        WHERE LTDT.MaLichTrinh = ? AND LH.MaBenhAn = ?
    """, (ma_lich_trinh, ma_benh_an))
    
    row = await cursor.fetchone()
    if not row or row['TrangThai'] != 'ChuaDatLich':
        return {"success": False, "message": "Chỉ định không hợp lệ hoặc đã đặt lịch.", "data": None}
        
    await conn.execute("""
        UPDATE LICH_TRINH_DIEU_TRI 
        SET NgayThucHien = ?, CaKham = ?, TrangThai = 'DaDatLich'
        WHERE MaLichTrinh = ?
    """, (ngay, ca, ma_lich_trinh))
    
    await conn.commit()
    return {"success": True, "message": "Hẹn lịch điều trị thành công.", "data": {
        "MaLichTrinh": ma_lich_trinh,
        "NgayThucHien": ngay,
        "CaKham": ca
    }}

async def request_refund(ma_lich_hen: str, ma_benh_an: str, bank_info: str):
    conn = await get_connection()
    cursor = await conn.execute("""
        UPDATE LICH_HEN 
        SET TrangThai = 'ChoHoanTien' 
        WHERE MaLichHen = ? AND MaBenhAn = ? AND TrangThai = 'DaHuy'
    """, (ma_lich_hen, ma_benh_an))
    
    if cursor.rowcount == 0:
        return {"success": False, "message": "Lịch hẹn không đủ điều kiện hoàn tiền.", "data": None}
        
    # Thực tế sẽ insert bank_info vào 1 bảng riêng
    await conn.commit()
    return {"success": True, "message": "Đã gửi yêu cầu hoàn tiền.", "data": {
        "MaLichHen": ma_lich_hen,
        "BankInfo": bank_info
    }}

async def get_medical_history(ma_benh_an: str):
    conn = await get_connection()
    # 1. Lấy danh sách lượt khám tổng quát
    cursor = await conn.execute("""
        SELECT LK.MaLuotKham, LH.NgayKham, B.TenBenh, LK.TrieuChung, LK.LoiDan
        FROM LUOT_KHAM LK
        JOIN LICH_HEN LH ON LK.MaLichHen = LH.MaLichHen
        LEFT JOIN BENH B ON LK.MaBenh = B.MaBenh
        WHERE LH.MaBenhAn = ?
        ORDER BY LH.NgayKham DESC
    """, (ma_benh_an))
    
    luot_kham_list = [dict(row) for row in await cursor.fetchall()]
    
    if not luot_kham_list:
        return {"success": False, "message": "Chưa có lịch sử khám.", "data": None} # Ext 3a
        
    # 2. Map chi tiết (Thuốc, XN) vào từng lượt khám
    for lk in luot_kham_list:
        ma_lk = lk['MaLuotKham']
        
        # Kéo Đơn Thuốc (Ext 11a)
        cur_thuoc = await conn.execute("""
            SELECT T.TenThuoc, CTDT.SoLuong, CTDT.LieuDung 
            FROM CHI_TIET_DON_THUOC CTDT
            JOIN THUOC T ON CTDT.MaThuoc = T.MaThuoc
            WHERE CTDT.MaLuotKham = ?
        """, (ma_lk,))
        lk['DonThuoc'] = [dict(t) for t in await cur_thuoc.fetchall()]
        
        # Kéo Xét Nghiệm (Ext 8a)
        cur_xn = await conn.execute("""
            SELECT DV.TenDichVu, CTXN.KetQuaXetNghiem 
            FROM CHI_TIET_XET_NGHIEM CTXN
            JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu
            WHERE CTXN.MaLuotKham = ?
        """, (ma_lk,))
        lk['XetNghiem'] = [dict(x) for x in await cur_xn.fetchall()]

    return {"success": True, "message": "Lấy lịch sử khám thành công.", "data": luot_kham_list}


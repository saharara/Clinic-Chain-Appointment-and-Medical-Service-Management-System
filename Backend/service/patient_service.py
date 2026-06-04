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
            SELECT
                DV.MaDichVu,
                DV.TenDichVu,
                DV.ChuyenKhoa,
                DV.LoaiDichVu,
                DV.GiaGoc,
                CNDV.MaChiNhanh,
                CNDV.SlotGioiHan
            FROM CHI_NHANH_DICH_VU CNDV
            JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
            WHERE CNDV.MaCauHinh = %s
        """, (ma_cau_hinh,))
        dv_info = await cursor.fetchone()
        if not dv_info:
            return {"success": False, "message": "Không tìm thấy cấu hình dịch vụ.", "data": None}

        if dv_info["LoaiDichVu"] != "Khám lâm sàng":
            return {
                "success": False,
                "message": "Chỉ được đặt lịch trực tuyến cho dịch vụ khám lâm sàng.",
                "data": None,
            }

        schedule_cursor = await conn.execute("""
            SELECT
                LTR.id,
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.ChuyenKhoa
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS
                ON LTR.MaBacSi = BS.MaBacSi
            WHERE
                LTR.MaChiNhanh = %s
                AND LTR.NgayTruc = %s
                AND LTR.CaTruc = %s
                AND LTR.MaBacSi = %s
            LIMIT 1
        """, (
            dv_info["MaChiNhanh"],
            ngay_kham,
            ca_kham,
            ma_bac_si,
        ))
        schedule_info = await schedule_cursor.fetchone()
        if not schedule_info:
            return {
                "success": False,
                "message": "Bác sĩ đã chọn không có lịch trực tại chi nhánh, ngày và ca này.",
                "data": None,
            }

        if schedule_info["ChuyenKhoa"] != dv_info["ChuyenKhoa"]:
            return {
                "success": False,
                "message": "Bác sĩ đã chọn không phụ trách chuyên khoa của dịch vụ này.",
                "data": None,
            }

        booked_cursor = await conn.execute("""
            SELECT COUNT(*) AS BookedCount
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE
                CNDV.MaChiNhanh = %s
                AND LH.NgayKham = %s
                AND LH.CaKham = %s
                AND LH.TrangThai != 'Đã hủy'
        """, (
            dv_info["MaChiNhanh"],
            ngay_kham,
            ca_kham,
        ))
        booked_row = await booked_cursor.fetchone()
        booked_count = booked_row["BookedCount"] if booked_row else 0
        slot_limit = dv_info["SlotGioiHan"] or 15

        if booked_count >= slot_limit:
            return {
                "success": False,
                "message": "Ca khám này đã hết slot tại chi nhánh đã chọn.",
                "data": None,
            }
        
        # Tính Giá Cuối (Main Success Scenario)
        ty_le = bn_info['TyLeHuong'] if bn_info and bn_info['TyLeHuong'] else 0.0
        gia_cuoi = int(dv_info['GiaGoc'] * (1 - ty_le))
        
        ma_lich_hen = f"LH_{uuid.uuid4().hex[:6].upper()}"

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
            VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, 'Đã xác nhận', %s)
        """, (
            ma_lich_hen,
            ma_benh_an,
            ma_cau_hinh,
            ngay_kham,
            ca_kham,
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
                "MaBenhAn": ma_benh_an,
                "MaCauHinh": ma_cau_hinh,
                "MaDichVu": dv_info["MaDichVu"],
                "MaChiNhanh": dv_info["MaChiNhanh"],
                "NgayKham": ngay_kham,
                "CaKham": ca_kham,
                "STT": None,
                "GiaCuoi": gia_cuoi,
                "TrangThai": "Đã xác nhận",
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


async def get_patient_appointments(ma_benh_an: str):
    conn = await get_connection()
    try:
        cursor = await conn.execute(
            """
            SELECT
                LH.MaLichHen,
                LH.MaBenhAn,
                LH.MaCauHinh,
                CNDV.MaDichVu,
                DV.TenDichVu,
                CNDV.MaChiNhanh,
                CN.TenChiNhanh,
                LH.NgayKham,
                LH.CaKham,
                LH.STT,
                LH.PaymentToken,
                LH.GiaCuoi,
                LH.TrangThai,
                LH.MaBacSi,
                BS.HoTen AS TenBacSi
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN DICH_VU DV
                ON CNDV.MaDichVu = DV.MaDichVu
            JOIN CHI_NHANH CN
                ON CNDV.MaChiNhanh = CN.MaChiNhanh
            LEFT JOIN BAC_SI BS
                ON LH.MaBacSi = BS.MaBacSi
            WHERE LH.MaBenhAn = %s
            ORDER BY LH.NgayKham DESC, LH.CaKham DESC, LH.STT DESC
            """,
            (ma_benh_an,),
        )
        rows = [dict(row) for row in await cursor.fetchall()]
        return {
            "success": True,
            "message": "Lấy danh sách lịch hẹn thành công.",
            "data": rows,
        }
    except Exception as exc:
        return {"success": False, "message": str(exc), "data": None}
    finally:
        await conn.close()

async def book_treatment(
    ma_lich_trinh: str,
    ma_benh_an: str,
    ma_cau_hinh: str,
    ngay: str,
    ca: int,
    ma_bac_si: str,
):
    conn = None
    try:
        conn = await get_connection()

        cursor = await conn.execute("""
            SELECT
                LTDT.MaLichTrinh,
                LTDT.MaLuotKham,
                LTDT.MaDichVu,
                LTDT.BuoiSo,
                LTDT.TrangThai,
                LTDT.MaLichHen,
                LH.MaBenhAn
            FROM LICH_TRINH_DIEU_TRI LTDT
            JOIN LUOT_KHAM LK
                ON LTDT.MaLuotKham = LK.MaLuotKham
            JOIN LICH_HEN LH
                ON LK.MaLichHen = LH.MaLichHen
            WHERE
                LTDT.MaLichTrinh = %s
                AND LH.MaBenhAn = %s
            LIMIT 1
        """, (ma_lich_trinh, ma_benh_an))
        treatment = await cursor.fetchone()

        if not treatment:
            return {"success": False, "message": "Không tìm thấy buổi điều trị của bệnh nhân.", "data": None}

        if treatment["TrangThai"] != "Chưa đặt lịch" or treatment.get("MaLichHen"):
            return {"success": False, "message": "Buổi điều trị này đã được đặt lịch.", "data": None}

        cursor = await conn.execute("""
            SELECT BN.KyTuDauBHYT, BHYT.TyLeHuong
            FROM BENH_NHAN BN
            LEFT JOIN DANH_MUC_BHYT BHYT
                ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
            WHERE BN.MaBenhAn = %s
        """, (ma_benh_an,))
        patient_info = await cursor.fetchone()
        if not patient_info:
            return {"success": False, "message": "Không tìm thấy bệnh nhân.", "data": None}

        cursor = await conn.execute("""
            SELECT
                CNDV.MaCauHinh,
                CNDV.MaChiNhanh,
                CNDV.SlotGioiHan,
                DV.MaDichVu,
                DV.TenDichVu,
                DV.ChuyenKhoa,
                DV.LoaiDichVu,
                DV.GiaGoc
            FROM CHI_NHANH_DICH_VU CNDV
            JOIN DICH_VU DV
                ON CNDV.MaDichVu = DV.MaDichVu
            WHERE CNDV.MaCauHinh = %s
            LIMIT 1
        """, (ma_cau_hinh,))
        service_info = await cursor.fetchone()
        if not service_info:
            return {"success": False, "message": "Không tìm thấy cấu hình dịch vụ điều trị.", "data": None}

        if service_info["MaDichVu"] != treatment["MaDichVu"]:
            return {"success": False, "message": "Dịch vụ đặt lịch không khớp với liệu trình được chỉ định.", "data": None}

        if service_info["LoaiDichVu"] != "Điều trị":
            return {"success": False, "message": "Chỉ được đặt lịch điều trị cho dịch vụ thuộc loại Điều trị.", "data": None}

        schedule_cursor = await conn.execute("""
            SELECT
                LTR.MaLichTruc,
                LTR.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.ChuyenKhoa
            FROM LICH_TRUC LTR
            JOIN BAC_SI BS
                ON LTR.MaBacSi = BS.MaBacSi
            WHERE
                LTR.MaChiNhanh = %s
                AND LTR.NgayTruc = %s
                AND LTR.CaTruc = %s
                AND LTR.MaBacSi = %s
            LIMIT 1
        """, (
            service_info["MaChiNhanh"],
            ngay,
            ca,
            ma_bac_si,
        ))
        schedule_info = await schedule_cursor.fetchone()
        if not schedule_info:
            return {
                "success": False,
                "message": "Bác sĩ đã chọn không có lịch trực tại chi nhánh, ngày và ca này.",
                "data": None,
            }

        if schedule_info["ChuyenKhoa"] != service_info["ChuyenKhoa"]:
            return {
                "success": False,
                "message": "Bác sĩ đã chọn không phụ trách chuyên khoa của dịch vụ điều trị này.",
                "data": None,
            }

        booked_cursor = await conn.execute("""
            SELECT COUNT(*) AS BookedCount
            FROM LICH_HEN LH
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            WHERE
                CNDV.MaChiNhanh = %s
                AND LH.NgayKham = %s
                AND LH.CaKham = %s
                AND LH.TrangThai != 'Đã hủy'
        """, (
            service_info["MaChiNhanh"],
            ngay,
            ca,
        ))
        booked_row = await booked_cursor.fetchone()
        booked_count = booked_row["BookedCount"] if booked_row else 0
        slot_limit = service_info["SlotGioiHan"] or 15

        if booked_count >= slot_limit:
            return {"success": False, "message": "Ca điều trị này đã hết slot tại chi nhánh đã chọn.", "data": None}

        ty_le = patient_info["TyLeHuong"] if patient_info and patient_info["TyLeHuong"] else 0.0
        gia_cuoi = int(service_info["GiaGoc"] * (1 - ty_le))
        ma_lich_hen = f"LH_{uuid.uuid4().hex[:6].upper()}"
        payment_token = f"TOK_TREAT_{uuid.uuid4().hex[:10]}"

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
            VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, 'Đã xác nhận', %s)
        """, (
            ma_lich_hen,
            ma_benh_an,
            ma_cau_hinh,
            ngay,
            ca,
            payment_token,
            gia_cuoi,
            ma_bac_si,
        ))

        await conn.execute("""
            UPDATE LICH_TRINH_DIEU_TRI
            SET
                NgayThucHien = %s,
                CaKham = %s,
                MaLichHen = %s,
                TrangThai = 'Đã đặt lịch'
            WHERE MaLichTrinh = %s
        """, (ngay, ca, ma_lich_hen, ma_lich_trinh))

        await conn.commit()
        return {
            "success": True,
            "message": "Thanh toán và đặt lịch điều trị thành công.",
            "data": {
                "appointment": {
                    "MaLichHen": ma_lich_hen,
                    "MaBenhAn": ma_benh_an,
                    "MaCauHinh": ma_cau_hinh,
                    "MaDichVu": service_info["MaDichVu"],
                    "TenDichVu": service_info["TenDichVu"],
                    "MaChiNhanh": service_info["MaChiNhanh"],
                    "NgayKham": ngay,
                    "CaKham": ca,
                    "STT": None,
                    "PaymentToken": payment_token,
                    "GiaCuoi": gia_cuoi,
                    "TrangThai": "Đã xác nhận",
                    "MaBacSi": ma_bac_si,
                    "TenBacSi": schedule_info["TenBacSi"],
                },
                "treatment": {
                    "MaLichTrinh": ma_lich_trinh,
                    "MaLuotKham": treatment["MaLuotKham"],
                    "MaDichVu": treatment["MaDichVu"],
                    "MaLichHen": ma_lich_hen,
                    "BuoiSo": treatment["BuoiSo"],
                    "NgayThucHien": ngay,
                    "CaKham": ca,
                    "TrangThai": "Đã đặt lịch",
                },
            },
        }
    except Exception as exc:
        if conn:
            await conn.rollback()
        return {"success": False, "message": str(exc), "data": None}
    finally:
        if conn:
            await conn.close()

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
    try:
        cursor = await conn.execute("""
            SELECT
                LK.MaLuotKham,
                LK.MaLichHen,
                LH.NgayKham,
                LH.CaKham,
                LH.MaBacSi,
                BS.HoTen AS TenBacSi,
                BS.SDT AS SDTBacSi,
                CNDV.MaChiNhanh,
                CN.TenChiNhanh,
                CNDV.MaDichVu AS MaDichVuKham,
                DV.TenDichVu AS TenDichVuKham,
                LK.MaBenh,
                B.TenBenh,
                LK.TrieuChung,
                LK.LoiDan
            FROM LUOT_KHAM LK
            JOIN LICH_HEN LH
                ON LK.MaLichHen = LH.MaLichHen
            LEFT JOIN BAC_SI BS
                ON LK.MaBacSi = BS.MaBacSi
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN CHI_NHANH CN
                ON CNDV.MaChiNhanh = CN.MaChiNhanh
            JOIN DICH_VU DV
                ON CNDV.MaDichVu = DV.MaDichVu
            LEFT JOIN BENH B
                ON LK.MaBenh = B.MaBenh
            WHERE LH.MaBenhAn = %s
            ORDER BY LH.NgayKham DESC, LH.CaKham DESC
        """, (ma_benh_an,))

        luot_kham_list = [dict(row) for row in await cursor.fetchall()]

        if not luot_kham_list:
            return {"success": False, "message": "Chưa có lịch sử khám.", "data": None}

        for lk in luot_kham_list:
            ma_lk = lk['MaLuotKham']

            cur_thuoc = await conn.execute("""
                SELECT
                    CTDT.MaDonThuoc,
                    T.MaThuoc,
                    T.TenThuoc,
                    T.DonViTinh,
                    CTDT.SoLuong,
                    CTDT.LieuDung
                FROM CHI_TIET_DON_THUOC CTDT
                JOIN THUOC T ON CTDT.MaThuoc = T.MaThuoc
                WHERE CTDT.MaLuotKham = %s
            """, (ma_lk,))
            lk['DonThuoc'] = [dict(t) for t in await cur_thuoc.fetchall()]

            cur_xn = await conn.execute("""
                SELECT
                    CTXN.MaChiTietXN,
                    DV.MaDichVu,
                    DV.TenDichVu,
                    CTXN.KetQuaXetNghiem,
                    CTXN.TrangThaiXetNghiem,
                    CTXN.MaXNV,
                    CTXN.PaymentToken,
                    CTXN.GiaCuoi
                FROM CHI_TIET_XET_NGHIEM CTXN
                JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu
                WHERE CTXN.MaLuotKham = %s
            """, (ma_lk,))
            lk['XetNghiem'] = [dict(x) for x in await cur_xn.fetchall()]

            cur_dieu_tri = await conn.execute("""
                SELECT
                    LTDT.MaLichTrinh,
                    LTDT.MaLichHen,
                    DV.MaDichVu,
                    DV.TenDichVu,
                    LTDT.BuoiSo,
                    LTDT.NgayThucHien,
                    LTDT.CaKham,
                    LTDT.TrangThai
                FROM LICH_TRINH_DIEU_TRI LTDT
                JOIN DICH_VU DV ON LTDT.MaDichVu = DV.MaDichVu
                WHERE LTDT.MaLuotKham = %s
                ORDER BY DV.MaDichVu, LTDT.BuoiSo
            """, (ma_lk,))
            lk['DieuTri'] = [dict(row) for row in await cur_dieu_tri.fetchall()]

        return {"success": True, "message": "Lấy lịch sử khám thành công.", "data": luot_kham_list}
    except Exception as exc:
        return {"success": False, "message": str(exc), "data": None}
    finally:
        await conn.close()


async def receive_notification(ma_benh_an: str):
    conn = await get_connection()
    try:
        status_cursor = await conn.execute("""
            SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE
                TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'LICH_SU_THONG_BAO'
                AND COLUMN_NAME = 'TrangThai'
        """)
        status_row = await status_cursor.fetchone()
        status_select = "TrangThai" if status_row and status_row["total"] else "'Success' AS TrangThai"

        cursor = await conn.execute(f"""
            SELECT
                MaThongBao,
                MaLichHen,
                NoiDung,
                {status_select},
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

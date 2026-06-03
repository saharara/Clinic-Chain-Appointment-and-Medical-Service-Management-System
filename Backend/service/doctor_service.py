import datetime
import uuid
from check_db import get_connection

async def get_patients_by_date(ma_bac_si: str, ngay_kham: str):
    conn = await get_connection()
    try:
        cursor = await conn.execute("""
            SELECT 
                LH.MaLichHen, LH.NgayKham, LH.CaKham, LH.STT, LH.TrangThai, LH.GiaCuoi, LH.PaymentToken,
                LH.MaBacSi,
                BN.MaBenhAn, BN.HoTen AS TenBenhNhan, BN.GioiTinh, BN.NgaySinh, BN.SDT AS SDTBenhNhan, BN.DiaChi, BN.MaSoBHYT,
                BHYT.KyTuDauBHYT, BHYT.DoiTuongChinhSach, BHYT.TyLeHuong,
                DV.MaDichVu, DV.TenDichVu, DV.ChuyenKhoa, DV.GiaGoc,
                CN.MaChiNhanh, CN.TenChiNhanh
            FROM LICH_HEN LH
            JOIN BENH_NHAN BN ON LH.MaBenhAn = BN.MaBenhAn
            LEFT JOIN DANH_MUC_BHYT BHYT ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
            JOIN CHI_NHANH_DICH_VU CNDV ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
            JOIN CHI_NHANH CN ON CNDV.MaChiNhanh = CN.MaChiNhanh
            WHERE LH.MaBacSi = %s AND LH.NgayKham = %s
            ORDER BY LH.CaKham, LH.STT
        """, (ma_bac_si, ngay_kham))
        
        rows = await cursor.fetchall()
        
        if not rows:
            return {"success": False, "message": "Không có bệnh nhân nào trong ngày này.", "data": []}
            
        return {"success": True, "message": "Lấy danh sách bệnh nhân thành công.", "data": [dict(row) for row in rows]}
    finally:
        await conn.close()


async def get_doctor_queue(ma_bac_si: str):
    conn = await get_connection()
    try:
        cursor = await conn.execute(
            """
            SELECT
                LH.MaLichHen,
                LH.NgayKham,
                LH.CaKham,
                LH.STT,
                LH.TrangThai,
                LH.GiaCuoi,
                LH.PaymentToken,
                LH.MaBacSi,
                BN.MaBenhAn,
                BN.HoTen AS TenBenhNhan,
                BN.GioiTinh,
                BN.NgaySinh,
                BN.CCCD,
                BN.SDT AS SDTBenhNhan,
                BN.DiaChi,
                DV.MaDichVu,
                DV.TenDichVu,
                DV.ChuyenKhoa,
                CN.MaChiNhanh,
                CN.TenChiNhanh
            FROM LICH_HEN LH
            JOIN BENH_NHAN BN
                ON LH.MaBenhAn = BN.MaBenhAn
            JOIN CHI_NHANH_DICH_VU CNDV
                ON LH.MaCauHinh = CNDV.MaCauHinh
            JOIN DICH_VU DV
                ON CNDV.MaDichVu = DV.MaDichVu
            JOIN CHI_NHANH CN
                ON CNDV.MaChiNhanh = CN.MaChiNhanh
            WHERE
                LH.MaBacSi = %s
                AND LH.TrangThai IN ('Chờ khám', 'Chờ kết luận', 'Đang khám')
            ORDER BY LH.NgayKham, LH.CaKham, LH.STT
            """,
            (ma_bac_si,),
        )
        rows = await cursor.fetchall()

        return {
            "success": True,
            "message": "Lấy hàng đợi bác sĩ thành công.",
            "data": [dict(row) for row in rows],
        }
    finally:
        await conn.close()


async def update_appointment_status(ma_lich_hen: str, trang_thai: str):
    valid_statuses = [
        "Chờ khám",
        "Đang khám",
        "Chờ kết luận",
        "Hoàn thành",
        "Đã hủy",
    ]
    if trang_thai not in valid_statuses:
        return {"success": False, "message": "Trạng thái không hợp lệ.", "data": None}

    conn = await get_connection()
    try:
        cursor = await conn.execute(
            "UPDATE LICH_HEN SET TrangThai = %s WHERE MaLichHen = %s",
            (trang_thai, ma_lich_hen)
        )
        
        if cursor.rowcount == 0:
            return {"success": False, "message": "Không tìm thấy lịch hẹn.", "data": None}
            
        await conn.commit()
        
        # Sau khi update, lấy lại toàn bộ thông tin lịch hẹn để trả về
        cursor_lh = await conn.execute("""
            SELECT LH.*, BN.HoTen, BN.SDT 
            FROM LICH_HEN LH 
            JOIN BENH_NHAN BN ON LH.MaBenhAn = BN.MaBenhAn 
            WHERE MaLichHen = %s
        """, (ma_lich_hen,))
        updated_row = await cursor_lh.fetchone()
        
        return {
            "success": True,
            "message": f"Đã cập nhật trạng thái thành {trang_thai}.",
            "data": dict(updated_row)
        }
    except Exception as e:
        await conn.rollback()
        return {"success": False, "message": str(e), "data": None}
    finally:
        await conn.close()


async def save_examination_record(exam_data: dict):
    conn = await get_connection()
    try:
        ma_lich_hen = exam_data.get('ma_lich_hen')
        is_draft = exam_data.get('is_draft', True)
        ma_benh = exam_data.get('ma_benh')
        ma_bac_si = exam_data.get('ma_bac_si')
        if not ma_bac_si:
            doctor_cursor = await conn.execute(
                "SELECT MaBacSi FROM LICH_HEN WHERE MaLichHen = %s",
                (ma_lich_hen,),
            )
            doctor_row = await doctor_cursor.fetchone()
            ma_bac_si = doctor_row["MaBacSi"] if doctor_row else None

        if ma_benh in ["string", "", " "] or not ma_benh:
            ma_benh = None

        xet_nghiem_hop_le = []
        for xn in (exam_data.get('xet_nghiem') or []):
            if xn.get('ma_dich_vu') not in ["string", "", " ", None]:
                xet_nghiem_hop_le.append(xn)

        don_thuoc_hop_le = []
        for t in (exam_data.get('don_thuoc') or []):
            if t.get('ma_thuoc') not in ["string", "", " ", None]:
                t['so_luong'] = max(1, t.get('so_luong', 1)) 
                don_thuoc_hop_le.append(t)

        dieu_tri_hop_le = []
        for dt in (exam_data.get('dieu_tri') or []):
            if dt.get('ma_dich_vu') not in ["string", "", " ", None]:
                dt['so_buoi'] = max(1, dt.get('so_buoi', 1)) 
                dieu_tri_hop_le.append(dt)
        cursor = await conn.execute("SELECT MaLuotKham FROM LUOT_KHAM WHERE MaLichHen = %s", (ma_lich_hen,))
        row = await cursor.fetchone()
        
        if row:
            ma_luot_kham = row["MaLuotKham"]
            await conn.execute("""
                UPDATE LUOT_KHAM 
                SET TrieuChung = %s, LoiDan = %s, MaBenh = %s
                WHERE MaLuotKham = %s
            """, (exam_data.get('trieu_chung'), exam_data.get('loi_dan'), ma_benh, ma_luot_kham))

            await conn.execute("DELETE FROM CHI_TIET_XET_NGHIEM WHERE MaLuotKham = %s", (ma_luot_kham,))
            await conn.execute("DELETE FROM CHI_TIET_DON_THUOC WHERE MaLuotKham = %s", (ma_luot_kham,))
            await conn.execute("DELETE FROM LICH_TRINH_DIEU_TRI WHERE MaLuotKham = %s", (ma_luot_kham,))
        else:

            cursor_max = await conn.execute("""
                SELECT MaLuotKham FROM LUOT_KHAM 
                ORDER BY CAST(SUBSTRING(MaLuotKham, 4) AS UNSIGNED) DESC LIMIT 1
            """)
            last_lk = await cursor_max.fetchone()
            
            if last_lk and "_" in last_lk["MaLuotKham"]:
                try:
                    last_num = int(last_lk["MaLuotKham"].split("_")[1])
                    ma_luot_kham = f"LK_{last_num + 1:03d}" 
                except ValueError:
                    ma_luot_kham = f"LK_{uuid.uuid4().hex[:6].upper()}"
            else:
                ma_luot_kham = "LK_001"
                
            await conn.execute("""
                INSERT INTO LUOT_KHAM (MaLuotKham, MaLichHen, MaBacSi, TrieuChung, LoiDan, MaBenh)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                ma_luot_kham,
                ma_lich_hen,
                ma_bac_si,
                exam_data.get('trieu_chung'),
                exam_data.get('loi_dan'),
                ma_benh,
            ))

        for xn in xet_nghiem_hop_le:
            ma_ctxn = f"CTXN_{uuid.uuid4().hex[:6].upper()}"
            await conn.execute("""
                INSERT INTO CHI_TIET_XET_NGHIEM (MaChiTietXN, MaLuotKham, MaDichVu, TrangThaiXetNghiem)
                VALUES (%s, %s, %s, 'Chưa thực hiện')
            """, (ma_ctxn, ma_luot_kham, xn['ma_dich_vu']))

        for thuoc in don_thuoc_hop_le:
            ma_don_thuoc = f"MDT_{uuid.uuid4().hex[:6].upper()}"
            await conn.execute("""
                INSERT INTO CHI_TIET_DON_THUOC (MaDonThuoc, MaLuotKham, MaThuoc, SoLuong, LieuDung)
                VALUES (%s, %s, %s, %s, %s)
            """, (ma_don_thuoc, ma_luot_kham, thuoc['ma_thuoc'], thuoc['so_luong'], thuoc['lieu_dung']))

        for dt in dieu_tri_hop_le:
            for buoi in range(1, dt['so_buoi'] + 1):
                ma_lt = f"LTDT_{uuid.uuid4().hex[:6].upper()}"
                await conn.execute("""
                    INSERT INTO LICH_TRINH_DIEU_TRI (MaLichTrinh, MaLuotKham, MaDichVu, BuoiSo, TrangThai)
                    VALUES (%s, %s, %s, %s, 'Chưa đặt lịch')
                """, (ma_lt, ma_luot_kham, dt['ma_dich_vu'], buoi))

        if not is_draft:
            await conn.execute("UPDATE LICH_HEN SET TrangThai = 'Hoàn thành' WHERE MaLichHen = %s", (ma_lich_hen,))
        else:
            await conn.execute("UPDATE LICH_HEN SET TrangThai = 'Đang khám' WHERE MaLichHen = %s", (ma_lich_hen,))
            
        await conn.commit()
        response_data = {
            "MaLuotKham": ma_luot_kham,
            "MaLichHen": ma_lich_hen,
            "TrieuChung": exam_data.get('trieu_chung') or "",
            "LoiDan": exam_data.get('loi_dan') or "",
            "MaBenh": ma_benh or "",
            "TrangThai": "Đang khám" if is_draft else "Hoàn thành"
        }

        if xet_nghiem_hop_le:
            cur_xn = await conn.execute("""
                SELECT CTXN.MaChiTietXN, DV.MaDichVu, DV.TenDichVu, CTXN.TrangThaiXetNghiem
                FROM CHI_TIET_XET_NGHIEM CTXN JOIN DICH_VU DV ON CTXN.MaDichVu = DV.MaDichVu WHERE CTXN.MaLuotKham = %s
            """, (ma_luot_kham,))
            response_data["XetNghiem"] = [dict(x) for x in await cur_xn.fetchall()]
        else:
            response_data["XetNghiem"] = []

        if don_thuoc_hop_le:
            cur_thuoc = await conn.execute("""
                SELECT CTDT.MaDonThuoc, T.MaThuoc, T.TenThuoc, CTDT.SoLuong, CTDT.LieuDung
                FROM CHI_TIET_DON_THUOC CTDT JOIN THUOC T ON CTDT.MaThuoc = T.MaThuoc WHERE CTDT.MaLuotKham = %s
            """, (ma_luot_kham,))
            response_data["DonThuoc"] = [dict(t) for t in await cur_thuoc.fetchall()]
        else:
            response_data["DonThuoc"] = []

        if dieu_tri_hop_le:
            cur_dt = await conn.execute("""
                SELECT LTDT.MaLichTrinh, DV.MaDichVu, DV.TenDichVu, LTDT.BuoiSo, LTDT.TrangThai
                FROM LICH_TRINH_DIEU_TRI LTDT JOIN DICH_VU DV ON LTDT.MaDichVu = DV.MaDichVu WHERE LTDT.MaLuotKham = %s
            """, (ma_luot_kham,))
            response_data["DieuTri"] = [dict(d) for d in await cur_dt.fetchall()]
        else:
            response_data["DieuTri"] = []

        return {"success": True, "message": "Lưu thông tin khám thành công.", "data": response_data}
    except Exception as e:
        await conn.rollback()
        return {"success": False, "message": str(e), "data": None}
    finally:
        await conn.close()

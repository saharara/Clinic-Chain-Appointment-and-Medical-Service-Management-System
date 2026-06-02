import datetime
import uuid
from database import get_connection
from aiomysql import DictCursor

async def get_patients_by_date(ma_bac_si: str, ngay_kham: str):
    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            await cursor.execute("""
                SELECT 
                    LH.MaLichHen, LH.NgayKham, LH.CaKham, LH.STT, LH.TrangThai, LH.GiaCuoi, LH.PaymentToken,
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
                JOIN LICH_TRUC LTR 
                    ON LTR.MaChiNhanh = CNDV.MaChiNhanh 
                    AND LTR.NgayTruc = LH.NgayKham 
                    AND LTR.CaTruc = LH.CaKham
                WHERE LTR.MaBacSi = %s 
                  AND LH.NgayKham = %s
                ORDER BY LH.CaKham, LH.STT
            """, (ma_bac_si, ngay_kham))

            rows = await cursor.fetchall()

            if not rows:
                return {"success": False, "message": "Không có bệnh nhân nào trong ngày này.", "data": []}

            return {
                "success": True,
                "message": "Lấy danh sách bệnh nhân thành công.",
                "data": [dict(row) for row in rows]
            }

    finally:
        conn.close()


async def update_appointment_status(ma_lich_hen: str, trang_thai: str):

    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            await cursor.execute("""
                UPDATE LICH_HEN 
                SET TrangThai = %s 
                WHERE MaLichHen = %s
            """, (trang_thai, ma_lich_hen))

            if cursor.rowcount == 0:
                return {"success": False, "message": "Không tìm thấy lịch hẹn.", "data": None}

        await conn.commit()

        # fetch lại data
        async with conn.cursor(DictCursor) as cursor:
            await cursor.execute("""
                SELECT LH.*, BN.HoTen, BN.SDT 
                FROM LICH_HEN LH 
                JOIN BENH_NHAN BN ON LH.MaBenhAn = BN.MaBenhAn 
                WHERE LH.MaLichHen = %s
            """, (ma_lich_hen,))

            updated_row = await cursor.fetchone()

        return {
            "success": True,
            "message": f"Đã cập nhật trạng thái thành {trang_thai}.",
            "data": dict(updated_row) if updated_row else None
        }

    except Exception as e:
        await conn.rollback()
        return {"success": False, "message": str(e), "data": None}

    finally:
        conn.close()


async def save_examination_record(exam_data: dict):

    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            ma_lich_hen = exam_data.get('ma_lich_hen')
            is_draft = exam_data.get('is_draft', True)

            ma_benh = exam_data.get('ma_benh')
            if not ma_benh or ma_benh in ["string", "", " "]:
                ma_benh = None

            # filter data
            xet_nghiem_hop_le = [
                xn for xn in (exam_data.get('xet_nghiem') or [])
                if xn.get('ma_dich_vu') not in ["string", "", " ", None]
            ]

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

            # check existing
            await cursor.execute("""
                SELECT MaLuotKham 
                FROM LUOT_KHAM 
                WHERE MaLichHen = %s
            """, (ma_lich_hen,))

            row = await cursor.fetchone()

            # ======================
            # UPDATE CASE
            # ======================
            if row:

                ma_luot_kham = row["MaLuotKham"]

                await cursor.execute("""
                    UPDATE LUOT_KHAM 
                    SET TrieuChung = %s,
                        LoiDan = %s,
                        MaBenh = %s
                    WHERE MaLuotKham = %s
                """, (
                    exam_data.get('trieu_chung'),
                    exam_data.get('loi_dan'),
                    ma_benh,
                    ma_luot_kham
                ))

                await cursor.execute("DELETE FROM CHI_TIET_XET_NGHIEM WHERE MaLuotKham = %s", (ma_luot_kham,))
                await cursor.execute("DELETE FROM CHI_TIET_DON_THUOC WHERE MaLuotKham = %s", (ma_luot_kham,))
                await cursor.execute("DELETE FROM LICH_TRINH_DIEU_TRI WHERE MaLuotKham = %s", (ma_luot_kham,))

            else:

                await cursor.execute("""
                    SELECT MaLuotKham 
                    FROM LUOT_KHAM 
                    ORDER BY MaLuotKham DESC 
                    LIMIT 1
                """)

                last_lk = await cursor.fetchone()

                if last_lk and last_lk["MaLuotKham"]:
                    try:
                        last_num = int(last_lk["MaLuotKham"].split("_")[1])
                        ma_luot_kham = f"LK_{last_num + 1:03d}"
                    except:
                        ma_luot_kham = f"LK_{uuid.uuid4().hex[:6].upper()}"
                else:
                    ma_luot_kham = "LK_001"

                await cursor.execute("""
                    INSERT INTO LUOT_KHAM (
                        MaLuotKham, MaLichHen, TrieuChung, LoiDan, MaBenh
                    )
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    ma_luot_kham,
                    ma_lich_hen,
                    exam_data.get('trieu_chung'),
                    exam_data.get('loi_dan'),
                    ma_benh
                ))

            for xn in xet_nghiem_hop_le:
                ma_ctxn = f"CTXN_{uuid.uuid4().hex[:6].upper()}"

                await cursor.execute("""
                    INSERT INTO CHI_TIET_XET_NGHIEM 
                    (MaChiTietXN, MaLuotKham, MaDichVu, TrangThaiXetNghiem)
                    VALUES (%s, %s, %s, 'ChuaThucHien')
                """, (ma_ctxn, ma_luot_kham, xn['ma_dich_vu']))

            for thuoc in don_thuoc_hop_le:
                ma_don_thuoc = f"MDT_{uuid.uuid4().hex[:6].upper()}"

                await cursor.execute("""
                    INSERT INTO CHI_TIET_DON_THUOC 
                    (MaDonThuoc, MaLuotKham, MaThuoc, SoLuong, LieuDung)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    ma_don_thuoc,
                    ma_luot_kham,
                    thuoc['ma_thuoc'],
                    thuoc['so_luong'],
                    thuoc['lieu_dung']
                ))

            for dt in dieu_tri_hop_le:
                for buoi in range(1, dt['so_buoi'] + 1):
                    ma_lt = f"LTDT_{uuid.uuid4().hex[:6].upper()}"

                    await cursor.execute("""
                        INSERT INTO LICH_TRINH_DIEU_TRI
                        (MaLichTrinh, MaLuotKham, MaDichVu, BuoiSo, TrangThai)
                        VALUES (%s, %s, %s, %s, 'ChuaDatLich')
                    """, (ma_lt, ma_luot_kham, dt['ma_dich_vu'], buoi))

            # update status
            await cursor.execute("""
                UPDATE LICH_HEN 
                SET TrangThai = %s 
                WHERE MaLichHen = %s
            """, (
                "DangKham" if is_draft else "HoanThanh",
                ma_lich_hen
            ))

        await conn.commit()

        return {
            "success": True,
            "message": "Lưu thông tin khám thành công.",
            "data": {"MaLuotKham": ma_luot_kham}
        }

    except Exception as e:
        await conn.rollback()
        return {"success": False, "message": str(e), "data": None}

    finally:
        conn.close()

async def search_patient_history(keyword: str):
    conn = await get_connection()

    try:
        async with conn.cursor(DictCursor) as cursor:

            like_keyword = f"%{keyword}%"

            await cursor.execute("""
                SELECT 
                    BN.MaBenhAn, BN.HoTen AS TenBenhNhan, BN.GioiTinh, BN.NgaySinh, BN.SDT AS SDTBenhNhan, BN.DiaChi, BN.MaSoBHYT,
                    BHYT.KyTuDauBHYT, BHYT.DoiTuongChinhSach, BHYT.TyLeHuong,
                    LH.MaLichHen, LH.NgayKham, LH.CaKham, LH.STT, LH.TrangThai, LH.GiaCuoi,
                    DV.MaDichVu, DV.TenDichVu
                FROM BENH_NHAN BN
                JOIN LICH_HEN LH ON BN.MaBenhAn = LH.MaBenhAn
                LEFT JOIN DANH_MUC_BHYT BHYT ON BN.KyTuDauBHYT = BHYT.KyTuDauBHYT
                JOIN CHI_NHANH_DICH_VU CNDV ON LH.MaCauHinh = CNDV.MaCauHinh
                JOIN DICH_VU DV ON CNDV.MaDichVu = DV.MaDichVu
                WHERE 
                    BN.HoTen LIKE %s OR 
                    BN.SDT LIKE %s OR 
                    BN.DiaChi LIKE %s OR 
                    BN.MaSoBHYT LIKE %s OR 
                    LH.MaLichHen LIKE %s
                ORDER BY LH.NgayKham DESC, LH.CaKham DESC
                LIMIT 50
            """, (like_keyword, like_keyword, like_keyword, like_keyword, like_keyword))

            rows = await cursor.fetchall()

            return {
                "success": True,
                "message": f"Tìm thấy {len(rows)} kết quả.",
                "data": [dict(row) for row in rows]
            }

    except Exception as e:
        return {"success": False, "message": str(e), "data": None}

    finally:
        conn.close()
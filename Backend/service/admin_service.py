from entities.bacsi import BacSi
from entities.cau_hinh_dich_vu import CauHinhDichVu
from entities.chi_nhanh import ChiNhanh
from entities.list_dichvu import DanhMucDichVu
from entities.le_tan import LeTan
from entities.lich_truc import LichTruc
from entities.xet_nghiem import XetNghiemVien
from entities.noti import LichSuThongBao
from entities.benh_nhan import BenhNhan
from entities.luot_kham import LuotKham
from entities.dky_kham import DangKyKham
from entities.lich_dieutri import LichTrinhDieuTri

async def creat_doctor_account(name: str, MaBacSi: str, chuyen_khoa: str, password: str):
    doctor = BacSi(
        MaBacSi=MaBacSi,
        HoTen=name,
        ChuyenKhoa=chuyen_khoa,
        MatKhau=password
    )
    if await BacSi.find_one(BacSi.MaBacSi == MaBacSi):
        return {
            "success": False,
            "message": "Tài khoản đã tồn tại.",
            "data": None
        }
        
    await doctor.insert()
    return {
        "success": True,
        "message": "Tạo tài khoản bác sĩ thành công",
        "data": doctor
    }
async def get_chi_nhanh(MaChiNhanh: str):
    chi_nhanh = await ChiNhanh.find_one(ChiNhanh.MaChiNhanh == MaChiNhanh)
    if not chi_nhanh:
        return {
            "success": False,
            "message": "Chi nhánh không tồn tại.",
            "data": None
        }
    return {
        "success": True,
        "message": "Lấy thông tin chi nhánh thành công",
        "data": chi_nhanh
    }
async def delete_doctor_account(MaBacSi: str):
    doctor = await BacSi.find_one(BacSi.MaBacSi == MaBacSi)
    if not doctor:
        return {
            "success": False,
            "message": "Tài khoản không tồn tại.",
            "data": None
        }
    await doctor.delete()
    return {
        "success": True,
        "message": "Xóa tài khoản bác sĩ thành công",
        "data": None
    }

async def change_doctor_password(MaBacSi: str, new_password: str):
    doctor = await BacSi.find_one(BacSi.MaBacSi == MaBacSi)
    if not doctor:
        return {
            "success": False,
            "message": "Tài khoản không tồn tại.",
            "data": None
        }
    doctor.MatKhau = new_password
    doctor.ChuyenKhoa = doctor.ChuyenKhoa
    doctor.HoTen = doctor.HoTen
    await doctor.update()
    return {
        "success": True,
        "message": "Đổi mật khẩu bác sĩ thành công",
        "data": doctor
    }
    
async def setting_service(
    MaCauHinh: str,
    MaChiNhanh: str,
    MaDichVu: str,
    GiaTieuChuan: int,
    GiaVIP: int,
    SlotGioiHan: int,
    TenDichVu: str,
    LoaiDichVu: str
):
    cauhinh = await CauHinhDichVu.find_one(
        CauHinhDichVu.MaCauHinh == MaCauHinh
    )

    dichvu = await DanhMucDichVu.find_one(
        DanhMucDichVu.MaDichVu == MaDichVu
    )

    if not cauhinh:
        return {
            "success": False,
            "message": "Không tìm thấy cấu hình dịch vụ"
        }

    if not dichvu:
        return {
            "success": False,
            "message": "Không tìm thấy dịch vụ"
        }

    # Update cấu hình
    cauhinh.MaChiNhanh = MaChiNhanh
    cauhinh.MaDichVu = MaDichVu
    cauhinh.GiaTieuChuan = GiaTieuChuan
    cauhinh.GiaVIP = GiaVIP
    cauhinh.SlotGioiHan = SlotGioiHan

    await cauhinh.update()

    return {
        "success": True,
        "message": "Cập nhật cấu hình dịch vụ thành công",
        "data": {
            "cauhinh": cauhinh,
            "dichvu": dichvu
        }
    }
    
async def get_dich_vu(MaDichVu: str, TenDichVu: str, LoaiDichVu: str):
    dichvu = await DanhMucDichVu.find_one(
        (DanhMucDichVu.MaDichVu == MaDichVu) | 
        (DanhMucDichVu.TenDichVu == TenDichVu) | 
        (DanhMucDichVu.LoaiDichVu == LoaiDichVu)
    )

    if not dichvu:
        return {
            "success": False,
            "message": "Không tìm thấy dịch vụ"
        }

    return {
        "success": True,
        "message": "Lấy thông tin dịch vụ thành công",
        "data": dichvu
    }
    

async def manage_lich_truc(MaLichTruc: str, MaNguoiDung: str, VaiTro: str, MaChiNhanh: str, NgayTruc: str, CaTruc: int):
    lichtruc = await LichTruc.find_one(LichTruc.MaLichTruc == MaLichTruc)

    if not lichtruc:
        return {
            "success": False,
            "message": "Không tìm thấy lịch trực"
        }

    lichtruc.MaNguoiDung = MaNguoiDung
    lichtruc.VaiTro = VaiTro
    lichtruc.MaChiNhanh = MaChiNhanh
    lichtruc.NgayTruc = NgayTruc
    lichtruc.CaTruc = CaTruc

    await lichtruc.update()

    return {
        "success": True,
        "message": "Cập nhật lịch trực thành công",
        "data": lichtruc
    }

async def get_lich_truc(MaNguoiDung: str):
    lichtruc = await LichTruc.find_one(LichTruc.MaNguoiDung == MaNguoiDung)

    if not lichtruc:
        return {
            "success": False,
            "message": "Không tìm thấy lịch trực"
        }

    return {
        "success": True,
        "message": "Lấy thông tin lịch trực thành công",
        "data": lichtruc
    }
    

async def import_monthly_lich_truc(admin_id: str, MaChiNhanh: str, Thang: str, entries: list):
    # Basic validation
    required = {"MaNguoiDung", "VaiTro", "NgayTruc", "CaTruc"}
    malformed = []
    for i, e in enumerate(entries):
        if not isinstance(e, dict) or not required.issubset(set(e.keys())):
            malformed.append(i)

    if malformed:
        return {
            "success": False,
            "message": f"Dữ liệu không hợp lệ ở các dòng: {malformed}",
            "data": None
        }

    # Check internal conflicts in uploaded data (same doctor, same date and shift)
    seen = set()
    conflicts = []
    for i, e in enumerate(entries):
        key = (e.get("MaNguoiDung"), e.get("NgayTruc"), int(e.get("CaTruc")))
        if key in seen:
            conflicts.append({"index": i, "entry": e})
        else:
            seen.add(key)

    if conflicts:
        return {
            "success": False,
            "message": "Tìm thấy xung đột nội bộ trong file nhập (bác sĩ trùng ngày/ca).",
            "data": {"conflicts": conflicts}
        }

    # If LichTruc has DB helpers, attempt atomic persistence with backup
    has_db = all(hasattr(LichTruc, name) for name in ("find", "find_one", "insert", "delete", "update"))

    if not has_db:
        # Return validated plan so caller can persist
        return {
            "success": True,
            "message": "Dữ liệu hợp lệ. Lưu ý: lớp `LichTruc` không có phương thức DB - gọi persistence layer để lưu.",
            "data": {"planned_count": len(entries), "entries": entries}
        }

    # DB-backed flow
    try:
        # fetch existing records for the month & branch as backup
        # This code assumes LichTruc.find can accept a filter; adapt to project's ORM as needed
        month_prefix = Thang  # expecting format YYYY-MM or similar used by NgayTruc startswith
        existing_cursor = await LichTruc.find((LichTruc.MaChiNhanh == MaChiNhanh) & (LichTruc.NgayTruc.startswith(month_prefix)))
        existing = [r async for r in existing_cursor]

        # Delete existing month records
        deleted = []
        for r in existing:
            await r.delete()
            deleted.append(r)

        # Insert new entries
        inserted = []
        for e in entries:
            obj = LichTruc.from_dict({
                "MaLichTruc": e.get("MaLichTruc") or f"LT_{e.get('MaNguoiDung')}_{e.get('NgayTruc')}_{e.get('CaTruc')}",
                "MaNguoiDung": e.get("MaNguoiDung"),
                "VaiTro": e.get("VaiTro"),
                "MaChiNhanh": e.get("MaChiNhanh") or MaChiNhanh,
                "NgayTruc": e.get("NgayTruc"),
                "CaTruc": int(e.get("CaTruc")),
            })
            await obj.insert()
            inserted.append(obj)

        return {
            "success": True,
            "message": "Cập nhật lịch trực tháng thành công",
            "data": {"inserted": inserted}
        }

    except Exception as ex:
        # attempt rollback when possible
        try:
            # remove any partially inserted
            if 'inserted' in locals():
                for ins in inserted:
                    try:
                        await ins.delete()
                    except Exception:
                        pass

            # restore backups
            if 'deleted' in locals():
                for old in deleted:
                    try:
                        await old.insert()
                    except Exception:
                        pass
        finally:
            return {
                "success": False,
                "message": f"Lưu lịch trực thất bại: {ex}",
                "data": None
            }


        
async def notify_error_for_patient(
    MaBenhNhan: str,
    message: str
):

    benh_nhan = await BenhNhan.find_one(
        BenhNhan.MaBenhNhan == MaBenhNhan
    )

    if not benh_nhan:
        return {
            "success": False,
            "message": "Bệnh nhân không tồn tại.",
            "data": None
        }

    # Giả lập gửi notification
    print(f"""
    NOTIFICATION TO: {benh_nhan.HoTen}
    MESSAGE: {message}
    """)

    return {
        "success": True,
        "message": f"Đã gửi thông báo cho bệnh nhân {MaBenhNhan}",
        "data": message
    }

async def cancel_appointment(MaLuotKham: str, reason: str):

    luot_kham = await LuotKham.find_one(
        LuotKham.MaLuotKham == MaLuotKham
    )

    if not luot_kham:

        return {
            "success": False,
            "message": "Lượt khám không tồn tại.",
            "data": None
        }
    lich_hen = await DangKyKham.find_one(
        DangKyKham.MaLichHen == luot_kham.MaLichHen
    )

    if not lich_hen:

        return {
            "success": False,
            "message": "Lịch hẹn không tồn tại.",
            "data": None
        }

    ma_benh_nhan = lich_hen.MaBenhAn
    
    await luot_kham.delete()

    notify_result = await notify_error_for_patient(
        MaBenhNhan=ma_benh_nhan,
        message=f"""
        Lịch khám {MaLuotKham} đã bị hủy.
        Lý do: {reason}
        """
    )

    return {
        "success": True,
        "message": f"Lượt khám {MaLuotKham} đã được hủy.",
        "notification": notify_result
    }
    
    
async def get_all_luot_kham():
    luot_kham_cursor = LuotKham.find()
    luot_kham_list = [lk async for lk in luot_kham_cursor]

    ma_bac_si_list = list(set([
        lk.MaBacSi
        for lk in luot_kham_list
    ]))

    bac_si_list = await BacSi.find(
        BacSi.MaBacSi.in_(ma_bac_si_list)
    ).to_list()

    bac_si_dict = {
        bs.MaBacSi: bs
        for bs in bac_si_list
    }

    ma_lich_hen_list = list(set([
        lk.MaLichHen
        for lk in luot_kham_list
    ]))

    lich_hen_list = await DangKyKham.find(
        DangKyKham.MaLichHen.in_(ma_lich_hen_list)
    ).to_list()

    lich_hen_dict = {
        lh.MaLichHen: lh
        for lh in lich_hen_list
    }

    ma_benh_nhan_list = list(set([
        lh.MaBenhAn
        for lh in lich_hen_list
    ]))

    benh_nhan_list = await BenhNhan.find(
        BenhNhan.MaBenhNhan.in_(ma_benh_nhan_list)
    ).to_list()

    benh_nhan_dict = {
        bn.MaBenhNhan: bn
        for bn in benh_nhan_list
    }

    result = []

    for lk in luot_kham_list:

        bac_si = bac_si_dict.get(lk.MaBacSi)

        lich_hen = lich_hen_dict.get(lk.MaLichHen)

        benh_nhan = None

        if lich_hen:
            benh_nhan = benh_nhan_dict.get(
                lich_hen.MaBenhAn
            )

        result.append({
            "MaLuotKham": lk.MaLuotKham,

            "NgayKham":
                lich_hen.NgayKham
                if lich_hen else None,

            "TenBacSi":
                bac_si.HoTen
                if bac_si else None,

            "TenBenhNhan":
                benh_nhan.HoTen
                if benh_nhan else None
        })

    return {
        "success": True,
        "message": "Lấy danh sách lượt khám thành công",
        "data": result
    }
async def get_all_lich_truc():
    lich_truc_cursor = await LichTruc.find()
    lich_truc_list = [lt async for lt in lich_truc_cursor]
    return {
        "success": True,
        "message": "Lấy danh sách lịch trực thành công",
        "data": lich_truc_list
    }

async def get_all_lich_dieu_tri():
    lich_dieu_tri_cursor = await LichTrinhDieuTri.find()
    lich_dieu_tri_list = [ldt async for ldt in lich_dieu_tri_cursor]
    return {
        "success": True,
        "message": "Lấy danh sách lịch điều trị thành công",
        "data": lich_dieu_tri_list
    }

async def search_luot_kham(
    MaLuotKham: str = None,
    NgayKham: str = None,
    TenBacSi: str = None,
    TenBenhNhan: str = None
):

    luot_kham_list = await LuotKham.find().to_list()

    ma_bac_si_list = list(set([
        lk.MaBacSi
        for lk in luot_kham_list
    ]))

    ma_lich_hen_list = list(set([
        lk.MaLichHen
        for lk in luot_kham_list
    ]))

    bac_si_list = await BacSi.find(
        BacSi.MaBacSi.in_(ma_bac_si_list)
    ).to_list()

    lich_hen_list = await DangKyKham.find(
        DangKyKham.MaLichHen.in_(ma_lich_hen_list)
    ).to_list()

    bac_si_dict = {
        bs.MaBacSi: bs
        for bs in bac_si_list
    }

    lich_hen_dict = {
        lh.MaLichHen: lh
        for lh in lich_hen_list
    }

    ma_benh_nhan_list = list(set([
        lh.MaBenhAn
        for lh in lich_hen_list
    ]))

    benh_nhan_list = await BenhNhan.find(
        BenhNhan.MaBenhNhan.in_(ma_benh_nhan_list)
    ).to_list()

    benh_nhan_dict = {
        bn.MaBenhNhan: bn
        for bn in benh_nhan_list
    }

    result = []

    for lk in luot_kham_list:

        bac_si = bac_si_dict.get(lk.MaBacSi)

        lich_hen = lich_hen_dict.get(lk.MaLichHen)

        benh_nhan = None

        if lich_hen:
            benh_nhan = benh_nhan_dict.get(
                lich_hen.MaBenhAn
            )

        item = {
            "MaLuotKham": lk.MaLuotKham,

            "NgayKham":
                lich_hen.NgayKham
                if lich_hen else None,

            "TenBacSi":
                bac_si.HoTen
                if bac_si else None,

            "TenBenhNhan":
                benh_nhan.HoTen
                if benh_nhan else None
        }

        if MaLuotKham:

            if MaLuotKham.lower() not in item["MaLuotKham"].lower():
                continue

        if NgayKham:

            if not item["NgayKham"] or NgayKham not in item["NgayKham"]:
                continue

        if TenBacSi:

            if (
                not item["TenBacSi"]
                or TenBacSi.lower()
                not in item["TenBacSi"].lower()
            ):
                continue

        if TenBenhNhan:

            if (
                not item["TenBenhNhan"]
                or TenBenhNhan.lower()
                not in item["TenBenhNhan"].lower()
            ):
                continue

        result.append(item)

    return {
        "success": True,
        "message": "Tìm kiếm lượt khám thành công",
        "total": len(result),
        "data": result
    }
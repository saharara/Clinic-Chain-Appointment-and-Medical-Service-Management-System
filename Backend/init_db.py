import sqlite3
from pathlib import Path

# =========================
# TẠO DB TRONG BACKEND
# =========================
DB_PATH = Path(__file__).resolve().parent / "hospital.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# BẬT FOREIGN KEY (QUAN TRỌNG)
cursor.execute("PRAGMA foreign_keys = ON;")

# =========================
# CREATE ALL TABLES
# =========================
cursor.executescript("""
-- =========================
-- GROUP 1: CORE ENTITIES
-- =========================

CREATE TABLE IF NOT EXISTS CHI_NHANH (
    MaChiNhanh TEXT PRIMARY KEY,
    TenChiNhanh TEXT NOT NULL,
    DiaChi TEXT
);

CREATE TABLE IF NOT EXISTS BAC_SI (
    MaBacSi TEXT PRIMARY KEY,
    HoTen TEXT NOT NULL,
    ChuyenKhoa TEXT NOT NULL,
    TenDangNhap TEXT NOT NULL UNIQUE,
    MatKhau TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS LE_TAN (
    MaLeTan TEXT PRIMARY KEY,
    HoTen TEXT NOT NULL,
    TenDangNhap TEXT NOT NULL UNIQUE,
    MatKhau TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS XET_NGHIEM_VIEN (
    MaXNV TEXT PRIMARY KEY,
    HoTen TEXT NOT NULL,
    TenDangNhap TEXT NOT NULL UNIQUE,
    MatKhau TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS DANH_MUC_BHYT (
    KyTuDauBHYT TEXT PRIMARY KEY,
    DoiTuongChinhSach INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS BENH_NHAN (
    MaBenhAn TEXT PRIMARY KEY,
    CCCD TEXT NOT NULL UNIQUE,
    HoTen TEXT NOT NULL,
    SoDienThoai TEXT NOT NULL,
    Email TEXT,
    MaSoBHYT TEXT,
    KyTuDauBHYT TEXT,
    MatKhau TEXT NOT NULL,
    FOREIGN KEY (KyTuDauBHYT) REFERENCES DANH_MUC_BHYT(KyTuDauBHYT)
);

-- =========================
-- GROUP 2: CATALOG
-- =========================

CREATE TABLE IF NOT EXISTS DANH_MUC_DICH_VU (
    MaDichVu TEXT PRIMARY KEY,
    TenDichVu TEXT NOT NULL,
    LoaiDichVu TEXT NOT NULL,
    CHECK (LoaiDichVu IN ('KhamLamSang', 'XetNghiem_CDHA'))
);

CREATE TABLE IF NOT EXISTS DANH_MUC_BENH (
    MaBenh TEXT PRIMARY KEY,
    TenBenh TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS DANH_MUC_TREATMENT (
    MaTreatment TEXT PRIMARY KEY,
    TenTreatment TEXT NOT NULL,
    GiaTien INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS DANH_MUC_THUOC (
    MaThuoc TEXT PRIMARY KEY,
    TenThuoc TEXT NOT NULL,
    DonViTinh TEXT NOT NULL
);

-- =========================
-- GROUP 3: SCHEDULING
-- =========================

CREATE TABLE IF NOT EXISTS CAU_HINH_DICH_VU (
    MaCauHinh TEXT PRIMARY KEY,
    MaChiNhanh TEXT NOT NULL,
    MaDichVu TEXT NOT NULL,
    GiaTieuChuan INTEGER NOT NULL,
    GiaVIP INTEGER NOT NULL,
    SlotGioiHan INTEGER NOT NULL,
    FOREIGN KEY (MaChiNhanh) REFERENCES CHI_NHANH(MaChiNhanh),
    FOREIGN KEY (MaDichVu) REFERENCES DANH_MUC_DICH_VU(MaDichVu)
);

CREATE TABLE IF NOT EXISTS LICH_TRUC (
    MaLichTruc TEXT PRIMARY KEY,
    MaNguoiDung TEXT NOT NULL,
    VaiTro TEXT NOT NULL,
    MaChiNhanh TEXT NOT NULL,
    NgayTruc TEXT NOT NULL,
    CaTruc INTEGER NOT NULL,
    FOREIGN KEY (MaChiNhanh) REFERENCES CHI_NHANH(MaChiNhanh),
    CHECK (VaiTro IN ('BacSi', 'LeTan', 'XNV_XetNghiem'))
);

CREATE TABLE IF NOT EXISTS DANG_KY_KHAM (
    MaLichHen TEXT PRIMARY KEY,
    MaBenhAn TEXT NOT NULL,
    MaCauHinh TEXT NOT NULL,
    NgayKham TEXT NOT NULL,
    CaKham INTEGER NOT NULL,
    STT INTEGER NOT NULL,
    LoaiSuat TEXT NOT NULL,
    PaymentToken TEXT,
    TrangThai TEXT NOT NULL,
    MaLeTan TEXT,
    FOREIGN KEY (MaBenhAn) REFERENCES BENH_NHAN(MaBenhAn),
    FOREIGN KEY (MaCauHinh) REFERENCES CAU_HINH_DICH_VU(MaCauHinh),
    FOREIGN KEY (MaLeTan) REFERENCES LE_TAN(MaLeTan),
    CHECK (TrangThai IN ('DaXacNhan', 'ChoKham', 'DangKham', 'HoanThanh'))
);

-- =========================
-- GROUP 4: MEDICAL CORE
-- =========================

CREATE TABLE IF NOT EXISTS LUOT_KHAM (
    MaLuotKham TEXT PRIMARY KEY,
    MaLichHen TEXT NOT NULL,
    MaBacSi TEXT NOT NULL,
    TrieuChung TEXT,
    MaBenh TEXT,
    LoiDan TEXT,
    FOREIGN KEY (MaLichHen) REFERENCES DANG_KY_KHAM(MaLichHen),
    FOREIGN KEY (MaBacSi) REFERENCES BAC_SI(MaBacSi),
    FOREIGN KEY (MaBenh) REFERENCES DANH_MUC_BENH(MaBenh)
);

CREATE TABLE IF NOT EXISTS CHI_TIET_DON_THUOC (
    MaDonThuoc TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaThuoc TEXT NOT NULL,
    SoLuong INTEGER NOT NULL,
    LieuDung TEXT,
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham),
    FOREIGN KEY (MaThuoc) REFERENCES DANH_MUC_THUOC(MaThuoc)
);

CREATE TABLE IF NOT EXISTS CHI_TIET_XET_NGHIEM (
    MaChiTietXetNghiem TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaDichVu TEXT NOT NULL,
    MaXNV TEXT,
    KetQuaXetNghiem TEXT,
    TrangThaiXetNghiem TEXT NOT NULL,
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham),
    FOREIGN KEY (MaDichVu) REFERENCES DANH_MUC_DICH_VU(MaDichVu),
    FOREIGN KEY (MaXNV) REFERENCES XET_NGHIEM_VIEN(MaXNV),
    CHECK (TrangThaiXetNghiem IN ('ChuaThucHien', 'DaCoKetQua'))
);

CREATE TABLE IF NOT EXISTS LICH_TRINH_DIEU_TRI (
    MaChiTietDieuTri TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaTreatment TEXT NOT NULL,
    LuotThu INTEGER NOT NULL,
    TrangThai TEXT NOT NULL,
    NgayThucHien TEXT,
    MaBacSiThucHien TEXT,
    KetQuaChiTiet TEXT,
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham),
    FOREIGN KEY (MaTreatment) REFERENCES DANH_MUC_TREATMENT(MaTreatment),
    FOREIGN KEY (MaBacSiThucHien) REFERENCES BAC_SI(MaBacSi),
    CHECK (TrangThai IN ('ChuaThucHien', 'DaThucHien'))
);

CREATE TABLE IF NOT EXISTS LICH_SU_THONG_BAO (
    MaThongBao TEXT PRIMARY KEY,
    MaLichKham TEXT,
    MaBenhNhan TEXT,
    NoiDung TEXT,
    KenhGui TEXT,
    TrangThai TEXT,
    Loi TEXT,
    ThoiGianGui DATETIME
);

""")
conn.commit()

# Kiểm tra bảng trước khi close
cursor.execute("""
    SELECT name
    FROM sqlite_master
    WHERE type='table';
""")

tables = cursor.fetchall()

print("✔ hospital.db created successfully")
print("Path:", DB_PATH)

print("\nDanh sách bảng:")
for table in tables:
    print("-", table[0])

conn.close()

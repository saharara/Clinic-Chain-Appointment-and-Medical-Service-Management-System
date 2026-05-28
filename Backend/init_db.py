import sqlite3
from pathlib import Path

drop = input("⚠ This will reset the database. Do you want to continue? (y/n): ")

if drop.lower() != 'y':
    print("Operation cancelled. Database initialization aborted.")
    exit()

DB_PATH = Path(__file__).resolve().parent / "hospital.db"

# Xóa DB cũ nếu tồn tại
if DB_PATH.exists():
    DB_PATH.unlink()
    print("Old database deleted.")

# Tạo DB mới
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Bật foreign key
cursor.execute("PRAGMA foreign_keys = ON;")

# =========================
# CREATE ALL TABLES
# =========================
cursor.executescript("""
-- ==========================================
-- 1. PHÂN HỆ CON NGƯỜI (NHÂN SỰ & BỆNH NHÂN)
-- ==========================================

CREATE TABLE BENH_NHAN (
    MaBenhAn TEXT PRIMARY KEY,
    HoTen TEXT NOT NULL,
    NgaySinh TEXT,
    GioiTinh TEXT,
    SDT TEXT NOT NULL, -- Số điện thoại dùng làm Username đăng nhập
    MatKhau TEXT NOT NULL, -- Mật khẩu đăng nhập của bệnh nhân
    DiaChi TEXT,
    MaSoBHYT TEXT, -- Số thẻ BHYT thực tế (nếu có)
    KyTuDauBHYT TEXT, -- Khóa ngoại kết nối danh mục giảm trừ BHYT
    FOREIGN KEY (KyTuDauBHYT) REFERENCES DANH_MUC_BHYT(KyTuDauBHYT) ON DELETE SET NULL
);


CREATE TABLE DANH_MUC_BHYT (
    KyTuDauBHYT TEXT PRIMARY KEY, -- Ví dụ: TE, DN, HT, GD...
    DoiTuongChinhSach TEXT NOT NULL, -- Ví dụ: Trẻ em dưới 6 tuổi, Người lao động...
    TyLeHuong REAL NOT NULL CHECK (TyLeHuong >= 0.0 AND TyLeHuong <= 1.0)
);


CREATE TABLE if NOT EXISTS BAC_SI (
    MaBacSi TEXT PRIMARY KEY, -- Dùng làm mã đăng nhập
    HoTen TEXT NOT NULL,
    ChuyenKhoa TEXT NOT NULL, -- Dùng để tự động lọc bác sĩ theo dịch vụ
    SDT TEXT,
    MatKhau TEXT NOT NULL
);

CREATE TABLE if NOT EXISTS LE_TAN (
    MaLeTan TEXT PRIMARY KEY, -- Dùng làm mã đăng nhập
    HoTen TEXT NOT NULL,
    SDT TEXT,
    MatKhau TEXT NOT NULL
);

CREATE TABLE if NOT EXISTS XET_NGHIEM_VIEN (
    MaXNV TEXT PRIMARY KEY, -- Dùng làm mã đăng nhập
    HoTen TEXT NOT NULL,
    SDT TEXT,
    MatKhau TEXT NOT NULL
);

-- ==========================================
-- 2. PHÂN HỆ CƠ SỞ VẬT CHẤT & GIÁ DỊCH VỤ
-- ==========================================

CREATE TABLE if NOT EXISTS CHI_NHANH (
    MaChiNhanh TEXT PRIMARY KEY,
    TenChiNhanh TEXT NOT NULL,
    DiaChi TEXT NOT NULL,
    SDT TEXT
);

CREATE TABLE if NOT EXISTS DICH_VU (
    MaDichVu TEXT PRIMARY KEY,
    TenDichVu TEXT NOT NULL,
    ChuyenKhoa TEXT NOT NULL,
    LoaiDichVu TEXT NOT NULL CHECK (LoaiDichVu IN ('KhamLamSang', 'XetNghiem', 'DieuTri')),
    GiaGoc INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE if NOT EXISTS CHI_NHANH_DICH_VU (
    MaCauHinh TEXT PRIMARY KEY,
    MaChiNhanh TEXT NOT NULL,
    MaDichVu TEXT NOT NULL,
    SlotGioiHan INTEGER NOT NULL,
    FOREIGN KEY (MaChiNhanh) REFERENCES CHI_NHANH(MaChiNhanh) ON DELETE CASCADE,
    FOREIGN KEY (MaDichVu) REFERENCES DICH_VU(MaDichVu) ON DELETE CASCADE
);

-- ==========================================
-- 3. PHÂN HỆ VẬN HÀNH, ĐẶT LỊCH & THÔNG BÁO
-- ==========================================

CREATE TABLE if NOT EXISTS LICH_TRUC (
    MaLichTruc TEXT PRIMARY KEY,
    MaBacSi TEXT NOT NULL,
    MaChiNhanh TEXT NOT NULL,
    NgayTruc TEXT NOT NULL, -- Định dạng YYYY-MM-DD
    CaTruc INTEGER NOT NULL CHECK (CaTruc IN (1, 2, 3, 4)), -- Chốt cứng 4 ca
    FOREIGN KEY (MaBacSi) REFERENCES BAC_SI(MaBacSi) ON DELETE CASCADE,
    FOREIGN KEY (MaChiNhanh) REFERENCES CHI_NHANH(MaChiNhanh) ON DELETE CASCADE
);

CREATE TABLE if NOT EXISTS LICH_HEN (
    MaLichHen TEXT PRIMARY KEY,
    MaBenhAn TEXT NOT NULL,
    MaCauHinh TEXT NOT NULL,
    NgayKham TEXT NOT NULL, -- Định dạng YYYY-MM-DD
    CaKham INTEGER NOT NULL CHECK (CaKham IN (1, 2, 3, 4)),
    STT INTEGER NOT NULL, -- Số thứ tự trong ca
    PaymentToken TEXT,
    GiaCuoi INTEGER NOT NULL DEFAULT 0, -- Giá thực tế thu sau chính sách
    TrangThai TEXT NOT NULL CHECK (TrangThai IN ('DaXacNhan', 'ChoKham', 'DangKham', 'HoanThanh')),
    MaLeTan TEXT, -- Ghi nhận người lễ tân bấm check-in tiếp nhận
    FOREIGN KEY (MaBenhAn) REFERENCES BENH_NHAN(MaBenhAn),
    FOREIGN KEY (MaCauHinh) REFERENCES CHI_NHANH_DICH_VU(MaCauHinh),
    FOREIGN KEY (MaLeTan) REFERENCES LE_TAN(MaLeTan)
);

CREATE TABLE if NOT EXISTS LICH_SU_THONG_BAO (
    MaThongBao TEXT PRIMARY KEY,
    MaLichHen TEXT NOT NULL,
    MaBenhAn TEXT NOT NULL,
    NoiDung TEXT NOT NULL,
    TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Success', 'Failed')),
    Loi TEXT,
    ThoiGianGui TEXT NOT NULL, -- Timestamp hệ thống gửi tin
    FOREIGN KEY (MaLichHen) REFERENCES LICH_HEN(MaLichHen) ON DELETE CASCADE,
    FOREIGN KEY (MaBenhAn) REFERENCES BENH_NHAN(MaBenhAn) ON DELETE CASCADE
);

-- ==========================================
-- 4. PHÂN HỆ CHUYÊN MÔN LÂM SÀNG (BÁC SĨ)
-- ==========================================

CREATE TABLE if NOT EXISTS BENH (
    MaBenh TEXT PRIMARY KEY, -- Mã bệnh chuẩn ICD-10
    TenBenh TEXT NOT NULL
);

CREATE TABLE if NOT EXISTS THUOC (
    MaThuoc TEXT PRIMARY KEY,
    TenThuoc TEXT NOT NULL,
    DonViTinh TEXT NOT NULL -- Viên, Gói, Chai...
);

CREATE TABLE if NOT EXISTS LUOT_KHAM (
    MaLuotKham TEXT PRIMARY KEY,
    MaLichHen TEXT NOT NULL UNIQUE, -- Đảm bảo ràng buộc quan hệ 1-1 với LICH_HEN
    TrieuChung TEXT,
    LoiDan TEXT,
    MaBenh TEXT,
    FOREIGN KEY (MaLichHen) REFERENCES LICH_HEN(MaLichHen) ON DELETE CASCADE,
    FOREIGN KEY (MaBenh) REFERENCES BENH(MaBenh)
);

-- ==========================================
-- 5. PHÂN HỆ CHỈ ĐỊNH SAU KHÁM (CẬN LÂM SÀNG & ĐIỀU TRỊ)
-- ==========================================

CREATE TABLE if NOT EXISTS CHI_TIET_DON_THUOC (
    MaDonThuoc TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaThuoc TEXT NOT NULL,
    SoLuong INTEGER NOT NULL CHECK (SoLuong > 0),
    LieuDung TEXT NOT NULL,
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham) ON DELETE CASCADE,
    FOREIGN KEY (MaThuoc) REFERENCES THUOC(MaThuoc)
);

CREATE TABLE if NOT EXISTS CHI_TIET_XET_NGHIEM (
    MaChiTietXN TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaDichVu TEXT NOT NULL, -- Chỉ chọn dịch vụ có LoaiDichVu = 'XetNghiem'
    KetQuaXetNghiem TEXT,
    MaXNV TEXT, -- Ghi nhận mã Xét nghiệm viên thực hiện
    GiaCuoi INTEGER NOT NULL DEFAULT 0, -- Thanh toán luôn lúc chỉ định
    PaymentToken TEXT,
    TrangThaiXetNghiem TEXT NOT NULL CHECK (TrangThaiXetNghiem IN ('ChuaThucHien', 'DaCoKetQua')),
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham) ON DELETE CASCADE,
    FOREIGN KEY (MaDichVu) REFERENCES DICH_VU(MaDichVu),
    FOREIGN KEY (MaXNV) REFERENCES XET_NGHIEM_VIEN(MaXNV)
);

CREATE TABLE if NOT EXISTS LICH_TRINH_DIEU_TRI (
    MaLichTrinh TEXT PRIMARY KEY,
    MaLuotKham TEXT NOT NULL,
    MaDichVu TEXT NOT NULL, -- Chỉ chọn dịch vụ có LoaiDichVu = 'DieuTri'
    BuoiSo INTEGER NOT NULL CHECK (BuoiSo > 0),
    NgayThucHien TEXT, -- Sẽ được cập nhật khi bệnh nhân tự đặt lịch cho buổi này
    CaKham INTEGER CHECK (CaKham IN (NULL, 1, 2, 3, 4)),
    TrangThai TEXT NOT NULL CHECK (TrangThai IN ('ChuaDatLich', 'DaDatLich', 'HoanThanh')),
    FOREIGN KEY (MaLuotKham) REFERENCES LUOT_KHAM(MaLuotKham) ON DELETE CASCADE,
    FOREIGN KEY (MaDichVu) REFERENCES DICH_VU(MaDichVu)
);

-- =========================================================================
-- SCRIPT CHÈN DATA GIẢ LẬP TOÀN BỘ CÁC BẢNG TRÊN SQLITE (CẬP NHẬT MỚI NHẤT)
-- =========================================================================

-- 1. BẢNG DANH_MUC_BHYT
INSERT INTO DANH_MUC_BHYT (KyTuDauBHYT, DoiTuongChinhSach, TyLeHuong) VALUES 
('TE', 'Trẻ em dưới 6 tuổi', 1.00),  -- Hưởng 100% (Bệnh nhân đồng chi trả 0%)
('HT', 'Cán bộ Hưu trí', 0.95),      -- Hưởng 95% (Bệnh nhân đồng chi trả 5%)
('DN', 'Người lao động doanh nghiệp', 0.80); -- Hưởng 80% (Bệnh nhân đồng chi trả 20%)

-- 2. BẢNG BENH_NHAN (Có Mật khẩu, Số thẻ BHYT và kết nối khóa ngoại KyTuDauBHYT)
INSERT INTO BENH_NHAN (MaBenhAn, HoTen, NgaySinh, GioiTinh, SDT, MatKhau, DiaChi, MaSoBHYT, KyTuDauBHYT) VALUES 
('BN001', 'Trần Quang Hải', '1995-04-12', 'Nam', '0901234567', 'password_hai95', 'Cầu Giấy, Hà Nội', 'DN4010123456789', 'DN'),
('BN002', 'Nguyễn Thị Mai', '2000-08-20', 'Nữ', '0907654321', 'password_mai00', 'Đống Đa, Hà Nội', NULL, NULL), -- Khám dịch vụ tự nguyện
('BN003', 'Phạm Lê Minh', '2021-11-05', 'Nam', '0911999888', 'password_minh21', 'Hai Bà Trưng, Hà Nội', 'TE1010999888777', 'TE');

-- 3. BẢNG BAC_SI
INSERT INTO BAC_SI (MaBacSi, HoTen, ChuyenKhoa, SDT, MatKhau) VALUES 
('BS001', 'Nguyễn Văn An', 'NoiTongQuat', '0911222333', 'hashed_bs001'),
('BS002', 'Lê Thị Bình', 'RangHamMat', '0922333444', 'hashed_bs002'),
('BS003', 'Phạm Hoàng Long', 'TaiMuiHong', '0933444555', 'hashed_bs003');

-- 4. BẢNG LE_TAN
INSERT INTO LE_TAN (MaLeTan, HoTen, SDT, MatKhau) VALUES 
('LT001', 'Phạm Minh Thư', '0988777666', 'hashed_lt001'),
('LT002', 'Nguyễn Hoàng Yến', '0988555444', 'hashed_lt002');

-- 5. BẢNG XET_NGHIEM_VIEN
INSERT INTO XET_NGHIEM_VIEN (MaXNV, HoTen, SDT, MatKhau) VALUES 
('XNV001', 'Trần Văn Cường', '0966111222', 'hashed_xnv001'),
('XNV002', 'Vũ Hồng Ngọc', '0966333444', 'hashed_xnv002');

-- 6. BẢNG CHI_NHANH
INSERT INTO CHI_NHANH (MaChiNhanh, TenChiNhanh, DiaChi, SDT) VALUES 
('CN_CG', 'Smart Clinic - Cơ sở Cầu Giấy', 'Số 1 Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0241234567'),
('CN_HBT', 'Smart Clinic - Cơ sở Hai Bà Trưng', 'Số 99 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', '0247654321');

-- 7. BẢNG DICH_VU (Có cột GiaGoc niêm yết)
INSERT INTO DICH_VU (MaDichVu, TenDichVu, ChuyenKhoa, LoaiDichVu, GiaGoc) VALUES 
('DV_KHAM_NOI', 'Khám Nội Tổng Quát', 'NoiTongQuat', 'KhamLamSang', 150000),
('DV_KHAM_RANG', 'Khám Răng Hàm Mặt', 'RangHamMat', 'KhamLamSang', 200000),
('DV_KHAM_TMH', 'Khám Tai Mũi Họng', 'TaiMuiHong', 'KhamLamSang', 180000),
('XN_MAU', 'Xét nghiệm công thức máu', 'XetNghiem', 'XetNghiem', 250000),
('SA_O_BUNG', 'Siêu âm ổ bụng tổng quát', 'XetNghiem', 'XetNghiem', 300000),
('DT_RANG_TUY', 'Liệu trình điều trị tủy răng', 'RangHamMat', 'DieuTri', 1200000),
('DT_KHIDUNG', 'Liệu trình khí dung mũi họng', 'TaiMuiHong', 'DieuTri', 450000);

-- 8. BẢNG CHI_NHANH_DICH_VU (Quản lý phân phối dịch vụ và Slot của từng cơ sở)
INSERT INTO CHI_NHANH_DICH_VU (MaCauHinh, MaChiNhanh, MaDichVu, SlotGioiHan) VALUES 
('CH_CG_KHAMNOI', 'CN_CG', 'DV_KHAM_NOI', 15),
('CH_CG_KHAMRANG', 'CN_CG', 'DV_KHAM_RANG', 10),
('CH_CG_XNMAU', 'CN_CG', 'XN_MAU', 20),
('CH_CG_SAOBUNG', 'CN_CG', 'SA_O_BUNG', 15),
('CH_CG_RANGTUY', 'CN_CG', 'DT_RANG_TUY', 5),
('CH_HBT_KHAMNOI', 'CN_HBT', 'DV_KHAM_NOI', 15),
('CH_HBT_KHAMTMH', 'CN_HBT', 'DV_KHAM_TMH', 12),
('CH_HBT_XNMAU', 'CN_HBT', 'XN_MAU', 20),
('CH_HBT_KHIDUNG', 'CN_HBT', 'DT_KHIDUNG', 8);

-- 9. BẢNG LICH_TRUC (Lịch trực của Bác sĩ theo Ngày/Ca)
INSERT INTO LICH_TRUC (MaLichTruc, MaBacSi, MaChiNhanh, NgayTruc, CaTruc) VALUES 
('LT_001', 'BS001', 'CN_CG', '2026-06-01', 1), -- BS An trực ca 1 tại Cầu Giấy
('LT_002', 'BS001', 'CN_CG', '2026-06-01', 2), -- BS An trực ca 2 tại Cầu Giấy
('LT_003', 'BS002', 'CN_CG', '2026-06-01', 3), -- BS Bình trực ca 3 tại Cầu Giấy
('LT_004', 'BS003', 'CN_HBT', '2026-06-01', 1); -- BS Long trực ca 1 tại HBT

-- 10. BẢNG LICH_HEN (Đồng nhất giá, lưu vết số tiền thu thực tế GiaCuoi theo diện BHYT)
INSERT INTO LICH_HEN (MaLichHen, MaBenhAn, MaCauHinh, NgayKham, CaKham, STT, PaymentToken, GiaCuoi, TrangThai, MaLeTan) VALUES 
-- BN001 (hưởng 80% BHYT, tự trả 20%): Giá gốc 150.000đ -> GiaCuoi = 30.000đ (Hoàn thành)
('LH_001', 'BN001', 'CH_CG_KHAMNOI', '2026-06-01', 1, 1, 'TOK_PAID_001', 30000, 'HoanThanh', 'LT001'),
-- BN002 (Khám dịch vụ tự nguyện): Giá gốc 200.000đ -> GiaCuoi = 200.000đ (Đã xác nhận đặt lịch trên mạng)
('LH_002', 'BN002', 'CH_CG_KHAMRANG', '2026-06-01', 3, 1, 'TOK_PAID_002', 200000, 'DaXacNhan', NULL),
-- BN003 (Trẻ em hưởng 100% BHYT): Giá gốc 150.000đ -> GiaCuoi = 0đ (Lễ tân đã tiếp nhận check-in tại quầy)
('LH_003', 'BN003', 'CH_CG_KHAMNOI', '2026-06-01', 2, 1, 'TOK_FREE_003', 0, 'ChoKham', 'LT001');

-- 11. BẢNG LICH_SU_THONG_BAO (Nhật ký SMS hệ thống)
INSERT INTO LICH_SU_THONG_BAO (MaThongBao, MaLichHen, MaBenhAn, NoiDung, TrangThai, Loi, ThoiGianGui) VALUES 
('TB_001', 'LH_001', 'BN001', 'Smart Clinic: Lich hen Ma LH_001 cua ban da duoc thanh toan va xac nhan thanh cong.', 'Success', NULL, '2026-05-31 20:00:00'),
('TB_002', 'LH_002', 'BN002', 'Smart Clinic: Lich hen Ma LH_002 cua ban da duoc thanh toan va xac nhan thanh cong.', 'Success', NULL, '2026-05-31 21:15:00');

-- 12. BẢNG BENH (Danh mục mã ICD-10)
INSERT INTO BENH (MaBenh, TenBenh) VALUES 
('K29', 'Viêm dạ dày và tá tràng'),
('J00', 'Viêm mũi họng cấp (Cảm thường)'),
('K04', 'Bệnh tủy và mô quanh chóp chân răng');

-- 13. BẢNG THUOC
INSERT INTO THUOC (MaThuoc, TenThuoc, DonViTinh) VALUES 
('TH_PARACETAMOL', 'Paracetamol 500mg', 'Viên'),
('TH_AMOXICILLIN', 'Amoxicillin 500mg', 'Viên'),
('TH_OMEPRAZOLE', 'Omeprazole 20mg', 'Viên');

-- 14. BẢNG LUOT_KHAM (Đẻ ra từ ca hẹn LH_001 của bệnh nhân BN001)
INSERT INTO LUOT_KHAM (MaLuotKham, MaLichHen, TrieuChung, LoiDan, MaBenh) VALUES 
('LK_001', 'LH_001', 'Đau rát vùng thượng vị theo chu kỳ, đầy hơi sau ăn', 'Ăn uống đúng giờ, kiêng đồ chua cay, không uống bia rượu. Nghỉ ngơi hợp lý.', 'K29');

-- 15. BẢNG CHI_TIET_DON_THUOC (Cập nhật khóa chính MaDonThuoc)
INSERT INTO CHI_TIET_DON_THUOC (MaDonThuoc, MaLuotKham, MaThuoc, SoLuong, LieuDung) VALUES 
('MDT_001', 'LK_001', 'TH_OMEPRAZOLE', 14, 'Uống 1 viên trước khi ăn sáng 30 phút'),
('MDT_002', 'LK_001', 'TH_PARACETAMOL', 10, 'Uống 1 viên khi đau nhiều hoặc sốt trên 38.5 độ');

-- 16. BẢNG CHI_TIET_XET_NGHIEM (Xét nghiệm thu tiền luôn tại chỗ khi chỉ định, BN001 tự chi trả 20%: 250.000đ -> GiaCuoi = 50.000đ)
INSERT INTO CHI_TIET_XET_NGHIEM (MaChiTietXN, MaLuotKham, MaDichVu, KetQuaXetNghiem, MaXNV, GiaCuoi, PaymentToken, TrangThaiXetNghiem) VALUES 
('CTXN_001', 'LK_001', 'XN_MAU', 'Số lượng hồng cầu ổn định, bạch cầu tăng nhẹ (10.8 giga/L). Nghi ngờ có ổ viêm nhiễm.', 'XNV001', 50000, 'TOK_LAB_001', 'DaCoKetQua');

-- 17. BẢNG LICH_TRINH_DIEU_TRI (Liệu trình bác sĩ chỉ định)
INSERT INTO LICH_TRINH_DIEU_TRI (MaLichTrinh, MaLuotKham, MaDichVu, BuoiSo, NgayThucHien, CaKham, TrangThai) VALUES 
-- Buổi số 1 bệnh nhân đã chọn lịch và làm thủ thuật xong
('LTDT_001', 'LK_001', 'DT_RANG_TUY', 1, '2026-06-02', 3, 'HoanThanh'),
-- Buổi số 2 bệnh nhân mới lên mạng đặt lịch hẹn trước, chưa đi làm
('LTDT_002', 'LK_001', 'DT_RANG_TUY', 2, '2026-06-05', 2, 'DaDatLich'),
-- Buổi số 3 bệnh nhân chưa lên app chọn ngày/ca thực hiện
('LTDT_003', 'LK_001', 'DT_RANG_TUY', 3, NULL, NULL, 'ChuaDatLich');


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

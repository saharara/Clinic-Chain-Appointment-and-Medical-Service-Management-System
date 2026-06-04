import datetime

# 1. Định nghĩa 8 nhóm chuyên khoa giữ nguyên từ dữ liệu gốc
chuyen_khoa_groups = [
    ["BS015", "BS016", "BS024", "BS032"],
    ["BS009", "BS010", "BS021", "BS029"],
    ["BS007", "BS008", "BS020", "BS028", "BS033"],
    ["BS001", "BS002", "BS017", "BS025"],
    ["BS005", "BS006", "BS019", "BS027"],
    ["BS011", "BS012", "BS022", "BS030"],
    ["BS003", "BS004", "BS018", "BS026"],
    ["BS013", "BS014", "BS023", "BS031"]
]

# 2. Chỉ cấu hình chạy duy nhất cho ngày 04/06/2026
target_date = datetime.date(2026, 6, 4)
ca_trucs = [1, 2, 3, 4]

sql_statements = [
    "SET FOREIGN_KEY_CHECKS = 0;\n",
    # KHÔNG DÙNG TRUNCATE để giữ nguyên dữ liệu từ ngày 05/06 trở đi
    "INSERT INTO `lich_truc` (`MaLichTruc`, `MaBacSi`, `MaChiNhanh`, `NgayTruc`, `CaTruc`) VALUES\n"
]

insert_rows = []

# Khởi tạo bước lùi: Vì ngày 05/06 bắt đầu chạy từ global_step = 1 đến 4 (cho 4 ca)
# Nên 4 ca của ngày 04/06 liền kề phía trước sẽ ứng với step = -3, -2, -1, 0.
global_step = -4 

date_str = target_date.strftime("%Y-%m-%d")
date_code = target_date.strftime("%y%m%d") # Định dạng YYMMDD -> 260604

for ca in ca_trucs:
    global_step += 1
    
    # Mã lịch trực chung chuẩn định dạng: LT_260604_C1 -> C4
    ma_lich_truc = f"LT_{date_code}_C{ca}"
    
    # Phân bổ cho Chi nhánh 1 (CN01)
    for idx, group in enumerate(chuyen_khoa_groups):
        bac_si_cn01 = group[(global_step + idx) % len(group)]
        row = f"('{ma_lich_truc}', '{bac_si_cn01}', 'CN01', '{date_str}', {ca})"
        insert_rows.append(row)
        
    # Phân bổ cho Chi nhánh 2 (CN02)
    for idx, group in enumerate(chuyen_khoa_groups):
        bac_si_cn02 = group[(global_step + idx + 1) % len(group)]
        row = f"('{ma_lich_truc}', '{bac_si_cn02}', 'CN02', '{date_str}', {ca})"
        insert_rows.append(row)

# Gộp dữ liệu thành chuỗi lệnh Bulk Insert
sql_statements.append(",\n".join(insert_rows) + ";\n")
sql_statements.append("SET FOREIGN_KEY_CHECKS = 1;\n")

# 3. Xuất ra file .sql riêng biệt
output_file = "insert_lich_truc_0406.sql"
with open(output_file, "w", encoding="utf-8") as f:
    f.writelines(sql_statements)

print(f"🎉 Xuất sắc! Đã sinh thêm {len(insert_rows)} bản ghi lịch trực riêng cho ngày 04/06/2026 vào file {output_file}!")
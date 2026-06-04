import datetime

# 1. Định nghĩa 8 nhóm chuyên khoa của bạn
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

# 2. Cấu hình mốc thời gian từ 05/06/2026 đến 30/06/2026
start_date = datetime.date(2026, 6, 5)
end_date = datetime.date(2026, 6, 30)
delta = datetime.timedelta(days=1)
ca_trucs = [1, 2, 3, 4]

sql_statements = [
    "SET FOREIGN_KEY_CHECKS = 0;\n",
    "TRUNCATE TABLE `lich_truc`;\n",
    # Chỉ insert vào các cột này, cột `id` để MySQL tự động tăng dần
    "INSERT INTO `lich_truc` (`MaLichTruc`, `MaBacSi`, `MaChiNhanh`, `NgayTruc`, `CaTruc`) VALUES\n"
]

insert_rows = []
global_step = 0

current_date = start_date
while current_date <= end_date:
    date_str = current_date.strftime("%Y-%m-%d")
    date_code = current_date.strftime("%y%m%d") # Định dạng YYMMDD
    
    for ca in ca_trucs:
        global_step += 1
        
        # Tạo mã lịch trực chung cực kỳ sạch đẹp: LT_YYMMDD_CX
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
                
    current_date += delta

# Gộp dữ liệu thành chuỗi lệnh Bulk Insert
sql_statements.append(",\n".join(insert_rows) + ";\n")
sql_statements.append("SET FOREIGN_KEY_CHECKS = 1;\n")

# 3. Xuất ra file .sql
with open("insert_lich_truc.sql", "w", encoding="utf-8") as f:
    f.writelines(sql_statements)

print(f"🎉 Xuất sắc! Đã sinh {len(insert_rows)} bản ghi khớp với cấu trúc AUTO_INCREMENT mới vào file insert_lich_truc.sql!")

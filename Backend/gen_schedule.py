from datetime import datetime, timedelta

# Danh sách bác sĩ chia theo chi nhánh
bacs_cg = [f"BS{i:03d}" for i in range(1, 13)]   # BS001 -> BS012 (12 bác sĩ)
bacsi_hbt = [f"BS{i:03d}" for i in range(13, 24)] # BS013 -> BS023 (11 bác sĩ)

start_date = datetime(2026, 6, 1)
end_date = datetime(2026, 7, 1) # Chạy đến hết ngày 01/07/2026

sql_lines = []
id_counter = 1

curr_date = start_date
idx_cg = 0
idx_hbt = 0

while curr_date <= end_date:
    date_str = curr_date.strftime("%Y-%m-%d")
    
    # Sinh 4 ca trực cho Chi nhánh Cầu Giấy (CN_CG)
    for ca in range(1, 5):
        bs = bacs_cg[idx_cg % len(bacs_cg)]
        sql_lines.append(f"('LT_{id_counter:03d}', '{bs}', 'CN_CG', '{date_str}', {ca})")
        id_counter += 1
        idx_cg += 1
        
    # Sinh 4 ca trực cho Chi nhánh Hai Bà Trưng (CN_HBT)
    for ca in range(1, 5):
        bs = bacsi_hbt[idx_hbt % len(bacsi_hbt)]
        sql_lines.append(f"('LT_{id_counter:03d}', '{bs}', 'CN_HBT', '{date_str}', {ca})")
        id_counter += 1
        idx_hbt += 1
        
    curr_date += timedelta(days=1)

# In ra câu lệnh SQL hoàn chỉnh
print("-- 11. LỊCH TRỰC BÁC SĨ (FULL CÁC CA TỪ 01/06/2026 ĐẾN 01/07/2026)")
print("INSERT INTO LICH_TRUC (MaLichTruc, MaBacSi, MaChiNhanh, NgayTruc, CaTruc) VALUES ")
print(",\n".join(sql_lines) + ";")
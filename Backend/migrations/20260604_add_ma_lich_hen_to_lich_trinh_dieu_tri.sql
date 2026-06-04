SET @has_ma_lich_hen := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'LICH_TRINH_DIEU_TRI'
      AND COLUMN_NAME = 'MaLichHen'
);

SET @ddl_add_column := IF(
    @has_ma_lich_hen = 0,
    'ALTER TABLE LICH_TRINH_DIEU_TRI ADD COLUMN MaLichHen VARCHAR(20) NULL AFTER CaKham',
    'SELECT ''MaLichHen already exists'' AS migration_message'
);
PREPARE stmt_add_column FROM @ddl_add_column;
EXECUTE stmt_add_column;
DEALLOCATE PREPARE stmt_add_column;

SET @has_ma_lich_hen_index := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'LICH_TRINH_DIEU_TRI'
      AND INDEX_NAME = 'idx_ltdt_ma_lich_hen'
);

SET @ddl_add_index := IF(
    @has_ma_lich_hen_index = 0,
    'ALTER TABLE LICH_TRINH_DIEU_TRI ADD INDEX idx_ltdt_ma_lich_hen (MaLichHen)',
    'SELECT ''idx_ltdt_ma_lich_hen already exists'' AS migration_message'
);
PREPARE stmt_add_index FROM @ddl_add_index;
EXECUTE stmt_add_index;
DEALLOCATE PREPARE stmt_add_index;

SET @has_ma_lich_hen_fk := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'LICH_TRINH_DIEU_TRI'
      AND CONSTRAINT_NAME = 'fk_ltdt_lich_hen'
);

SET @ddl_add_fk := IF(
    @has_ma_lich_hen_fk = 0,
    'ALTER TABLE LICH_TRINH_DIEU_TRI ADD CONSTRAINT fk_ltdt_lich_hen FOREIGN KEY (MaLichHen) REFERENCES LICH_HEN(MaLichHen) ON DELETE SET NULL',
    'SELECT ''fk_ltdt_lich_hen already exists'' AS migration_message'
);
PREPARE stmt_add_fk FROM @ddl_add_fk;
EXECUTE stmt_add_fk;
DEALLOCATE PREPARE stmt_add_fk;

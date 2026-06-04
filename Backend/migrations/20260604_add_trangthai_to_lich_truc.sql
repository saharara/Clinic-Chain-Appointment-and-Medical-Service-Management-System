-- Add soft-delete/status support for doctor schedules.
-- MySQL 8.0+ supports ADD COLUMN IF NOT EXISTS.
ALTER TABLE LICH_TRUC
ADD COLUMN IF NOT EXISTS TrangThai VARCHAR(30) NOT NULL DEFAULT 'Đang hoạt động';

UPDATE LICH_TRUC
SET TrangThai = 'Đang hoạt động'
WHERE TrangThai IS NULL OR TrangThai = '';

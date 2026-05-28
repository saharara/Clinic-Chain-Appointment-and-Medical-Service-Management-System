from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class LichTrinhDieuTri:
	MaLichTrinh: str
	MaLuotKham: str
	MaDichVu: str
	BuoiSo: int
	NgayThucHien: Optional[str]
	CaKham: int
	TrangThai: str

	__tablename__ = "LICH_TRINH_DIEU_TRI"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LichTrinhDieuTri":
		return cls(
			MaLichTrinh=d.get("MaLichTrinh"),
			MaLuotKham=d.get("MaLuotKham"),
			MaDichVu=d.get("MaDichVu"),
			BuoiSo=d.get("BuoiSo"),
			NgayThucHien=d.get("NgayThucHien"),
			CaKham=d.get("CaKham"),
			TrangThai=d.get("TrangThai"),
		)

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class LichTrinhDieuTri:
	"""Entity mapping for table LICH_TRINH_DIEU_TRI"""
	MaChiTietDieuTri: str
	MaLuotKham: str
	MaTreatment: str
	LuotThu: int
	TrangThai: str
	NgayThucHien: Optional[str]
	MaBacSiThucHien: Optional[str]
	KetQuaChiTiet: Optional[str]

	__tablename__ = "LICH_TRINH_DIEU_TRI"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LichTrinhDieuTri":
		return cls(
			MaChiTietDieuTri=d.get("MaChiTietDieuTri"),
			MaLuotKham=d.get("MaLuotKham"),
			MaTreatment=d.get("MaTreatment"),
			LuotThu=d.get("LuotThu"),
			TrangThai=d.get("TrangThai"),
			NgayThucHien=d.get("NgayThucHien"),
			MaBacSiThucHien=d.get("MaBacSiThucHien"),
			KetQuaChiTiet=d.get("KetQuaChiTiet"),
		)

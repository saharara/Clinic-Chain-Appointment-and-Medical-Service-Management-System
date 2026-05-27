from dataclasses import dataclass
from typing import Dict, Any, Optional


@dataclass
class LichTruc:
	"""Entity mapping for table LICH_TRUC"""
	MaLichTruc: str
	MaNguoiDung: str
	VaiTro: str
	MaChiNhanh: str
	NgayTruc: str
	CaTruc: int

	__tablename__ = "LICH_TRUC"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LichTruc":
		return cls(
			MaLichTruc=d.get("MaLichTruc"),
			MaNguoiDung=d.get("MaNguoiDung"),
			VaiTro=d.get("VaiTro"),
			MaChiNhanh=d.get("MaChiNhanh"),
			NgayTruc=d.get("NgayTruc"),
			CaTruc=d.get("CaTruc"),
		)

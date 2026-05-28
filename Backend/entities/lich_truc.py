from dataclasses import dataclass
from typing import Dict, Any, Optional


@dataclass
class LichTruc:
	MaLichTruc: str
	MaBacSi: str
	MaChiNhanh: str
	NgayTruc: str
	CaTruc: int

	__tablename__ = "LICH_TRUC"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LichTruc":
		return cls(
			MaLichTruc=d.get("MaLichTruc"),
			MaBacSi=d.get("MaBacSi"),
			MaChiNhanh=d.get("MaChiNhanh"),
			NgayTruc=d.get("NgayTruc"),
			CaTruc=d.get("CaTruc"),
		)

from dataclasses import dataclass
from typing import Dict, Any, Optional


@dataclass
class ChiNhanh:
	MaChiNhanh: str
	TenChiNhanh: str
	DiaChi: Optional[str]
	SDT: Optional[str]
	__tablename__ = "CHI_NHANH"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "ChiNhanh":
		return cls(
			MaChiNhanh=d.get("MaChiNhanh"),
			TenChiNhanh=d.get("TenChiNhanh"),
			DiaChi=d.get("DiaChi"),
			SDT=d.get("SDT"),
		)

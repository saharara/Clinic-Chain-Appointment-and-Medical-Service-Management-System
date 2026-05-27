from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class LeTan:
	"""Entity mapping for table LE_TAN (receptionist)"""
	MaLeTan: str
	HoTen: str
	TenDangNhap: str
	MatKhau: str

	__tablename__ = "LE_TAN"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LeTan":
		return cls(
			MaLeTan=d.get("MaLeTan"),
			HoTen=d.get("HoTen"),
			TenDangNhap=d.get("TenDangNhap"),
			MatKhau=d.get("MatKhau"),
		)

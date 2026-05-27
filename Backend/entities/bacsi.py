from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class BacSi:
	"""Entity mapping for table BAC_SI"""
	MaBacSi: str
	HoTen: str
	ChuyenKhoa: str
	TenDangNhap: str
	MatKhau: str

	__tablename__ = "BAC_SI"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "BacSi":
		return cls(
			MaBacSi=d.get("MaBacSi"),
			HoTen=d.get("HoTen"),
			ChuyenKhoa=d.get("ChuyenKhoa"),
			TenDangNhap=d.get("TenDangNhap"),
			MatKhau=d.get("MatKhau"),
		)

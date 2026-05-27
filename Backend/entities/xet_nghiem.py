from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class XetNghiemVien:
	MaXNV: str
	HoTen: str
	TenDangNhap: str
	MatKhau: str

	__tablename__ = "XET_NGHIEM_VIEN"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "XetNghiemVien":
		return cls(
			MaXNV=d.get("MaXNV"),
			HoTen=d.get("HoTen"),
			TenDangNhap=d.get("TenDangNhap"),
			MatKhau=d.get("MatKhau"),
		)

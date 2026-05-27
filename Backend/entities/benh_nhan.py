from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class BenhNhan:
	"""Entity mapping for table BENH_NHAN"""
	MaBenhAn: str
	CCCD: str
	HoTen: str
	SoDienThoai: str
	Email: Optional[str]
	MaSoBHYT: Optional[str]
	KyTuDauBHYT: Optional[str]
	MatKhau: str

	__tablename__ = "BENH_NHAN"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "BenhNhan":
		return cls(
			MaBenhAn=d.get("MaBenhAn"),
			CCCD=d.get("CCCD"),
			HoTen=d.get("HoTen"),
			SoDienThoai=d.get("SoDienThoai"),
			Email=d.get("Email"),
			MaSoBHYT=d.get("MaSoBHYT"),
			KyTuDauBHYT=d.get("KyTuDauBHYT"),
			MatKhau=d.get("MatKhau"),
		)

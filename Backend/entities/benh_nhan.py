from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class BenhNhan:
	MaBenhAn: str
	HoTen: str
	NgaySinh: Optional[str]
	GioiTinh: Optional[str]
	SDT: Optional[str]
	DiaChi: Optional[str]
	MatKhau: Optional[str]
	MaSoBHYT: Optional[str]
	KyTuDauBHYT: Optional[str]
	__tablename__ = "BENH_NHAN"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "BenhNhan":
		return cls(
			MaBenhAn=d.get("MaBenhAn"),
			HoTen=d.get("HoTen"),
			NgaySinh=d.get("NgaySinh"),
			GioiTinh=d.get("GioiTinh"),
			SDT=d.get("SDT"),
			MatKhau=d.get("MatKhau"),
			DiaChi=d.get("DiaChi"),
			MaSoBHYT=d.get("MaSoBHYT"),
			KyTuDauBHYT=d.get("KyTuDauBHYT")
		)

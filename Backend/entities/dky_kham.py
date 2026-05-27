from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class DangKyKham:
	"""Entity mapping for table DANG_KY_KHAM"""
	MaLichHen: str
	MaBenhAn: str
	MaCauHinh: str
	NgayKham: str
	CaKham: int
	STT: int
	LoaiSuat: str
	PaymentToken: Optional[str]
	TrangThai: str
	MaLeTan: Optional[str]

	__tablename__ = "DANG_KY_KHAM"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "DangKyKham":
		return cls(
			MaLichHen=d.get("MaLichHen"),
			MaBenhAn=d.get("MaBenhAn"),
			MaCauHinh=d.get("MaCauHinh"),
			NgayKham=d.get("NgayKham"),
			CaKham=d.get("CaKham"),
			STT=d.get("STT"),
			LoaiSuat=d.get("LoaiSuat"),
			PaymentToken=d.get("PaymentToken"),
			TrangThai=d.get("TrangThai"),
			MaLeTan=d.get("MaLeTan"),
		)

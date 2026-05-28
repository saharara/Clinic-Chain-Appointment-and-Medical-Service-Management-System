from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class LichHen:
	MaLichHen: str
	MaBenhAn: str
	MaCauHinh: str
	NgayKham: str
	CaKham: int
	STT: int
	PaymentToken: Optional[str]
	GiaCuoi: int
	TrangThai: str
	MaLeTan: Optional[str]

	__tablename__ = "LICH_HEN"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LichHen":
		return cls(
			MaLichHen=d.get("MaLichHen"),
			MaBenhAn=d.get("MaBenhAn"),
			MaCauHinh=d.get("MaCauHinh"),
			NgayKham=d.get("NgayKham"),
			CaKham=d.get("CaKham"),
			STT=d.get("STT"),
			PaymentToken=d.get("PaymentToken"),
			GiaCuoi=d.get("GiaCuoi"),
			TrangThai=d.get("TrangThai"),
			MaLeTan=d.get("MaLeTan"),
		)

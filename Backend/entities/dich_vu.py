from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class DichVu:
	MaDichVu: str
	TenDichVu: str
	ChuyenKhoa: str
	LoaiDichVu: str
	GiaGoc: int

	__tablename__ = "DICH_VU"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "DichVu":
		return cls(
			MaDichVu=d.get("MaDichVu"),
			TenDichVu=d.get("TenDichVu"),
			ChuyenKhoa=d.get("ChuyenKhoa"),
			LoaiDichVu=d.get("LoaiDichVu"),
			GiaGoc=d.get("GiaGoc"),
		)

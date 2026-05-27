from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class DanhMucDichVu:
	"""Entity mapping for table DANH_MUC_DICH_VU"""
	MaDichVu: str
	TenDichVu: str
	LoaiDichVu: str

	__tablename__ = "DANH_MUC_DICH_VU"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "DanhMucDichVu":
		return cls(
			MaDichVu=d.get("MaDichVu"),
			TenDichVu=d.get("TenDichVu"),
			LoaiDichVu=d.get("LoaiDichVu"),
		)

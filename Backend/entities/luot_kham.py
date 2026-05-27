from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class LuotKham:
	"""Entity mapping for table LUOT_KHAM"""
	MaLuotKham: str
	MaLichHen: str
	MaBacSi: str
	TrieuChung: Optional[str]
	MaBenh: Optional[str]
	LoiDan: Optional[str]

	__tablename__ = "LUOT_KHAM"

	@classmethod
	def from_dict(cls, d: Dict[str, Any]) -> "LuotKham":
		return cls(
			MaLuotKham=d.get("MaLuotKham"),
			MaLichHen=d.get("MaLichHen"),
			MaBacSi=d.get("MaBacSi"),
			TrieuChung=d.get("TrieuChung"),
			MaBenh=d.get("MaBenh"),
			LoiDan=d.get("LoiDan"),
		)

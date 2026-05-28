from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class LuotKham:
    MaLuotKham: str
    MaLichHen: str
    TrieuChung: Optional[str]
    LoiDan: Optional[str] # Lời dặn của bác sĩ sau khi khám
    MaBenh: Optional[str]

    __tablename__ = "LUOT_KHAM"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "LuotKham":
        return cls(
            MaLuotKham=d.get("MaLuotKham"),
            MaLichHen=d.get("MaLichHen"),
            TrieuChung=d.get("TrieuChung"),
            LoiDan=d.get("LoiDan"),
            MaBenh=d.get("MaBenh"),
        )
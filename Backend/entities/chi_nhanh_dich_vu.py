from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class ChiNhanhDichVu:
    MaCauHinh: str
    MaChiNhanh: str
    MaDichVu: str
    SlotGioiHan: int

    __tablename__ = "CHI_NHANH_DICH_VU"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "ChiNhanhDichVu":
        return cls(
            MaCauHinh=d.get("MaCauHinh"),
            MaChiNhanh=d.get("MaChiNhanh"),
            MaDichVu=d.get("MaDichVu"),
            SlotGioiHan=d.get("SlotGioiHan"),
        )

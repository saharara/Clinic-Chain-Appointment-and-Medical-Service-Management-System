from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class CauHinhDichVu:
    MaCauHinh: str
    MaChiNhanh: str
    MaDichVu: str
    GiaTieuChuan: int
    GiaVIP: int
    SlotGioiHan: int

    __tablename__ = "CAU_HINH_DICH_VU"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "CauHinhDichVu":
        return cls(
            MaCauHinh=d.get("MaCauHinh"),
            MaChiNhanh=d.get("MaChiNhanh"),
            MaDichVu=d.get("MaDichVu"),
            GiaTieuChuan=d.get("GiaTieuChuan"),
            GiaVIP=d.get("GiaVIP"),
            SlotGioiHan=d.get("SlotGioiHan"),
        )

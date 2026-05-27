from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class ChiTietXetNghiem:
    """Entity mapping for table CHI_TIET_XET_NGHIEM"""
    MaChiTietXetNghiem: str
    MaLuotKham: str
    MaDichVu: str
    MaXNV: Optional[str]
    KetQuaXetNghiem: Optional[str]
    TrangThaiXetNghiem: str

    __tablename__ = "CHI_TIET_XET_NGHIEM"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "ChiTietXetNghiem":
        return cls(
            MaChiTietXetNghiem=d.get("MaChiTietXetNghiem"),
            MaLuotKham=d.get("MaLuotKham"),
            MaDichVu=d.get("MaDichVu"),
            MaXNV=d.get("MaXNV"),
            KetQuaXetNghiem=d.get("KetQuaXetNghiem"),
            TrangThaiXetNghiem=d.get("TrangThaiXetNghiem"),
        )

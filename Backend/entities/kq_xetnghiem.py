from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class ChiTietXetNghiem:
    MaChiTietXN: str
    MaLuotKham: str
    MaDichVu: str
    MaXNV: Optional[str]
    KetQuaXetNghiem: Optional[str]
    TrangThaiXetNghiem: str
    GiaCuoi: Optional[int]
    PaymentToken: Optional[str]

    __tablename__ = "CHI_TIET_XET_NGHIEM"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "ChiTietXetNghiem":
        return cls(
            MaChiTietXN=d.get("MaChiTietXN"),
            MaLuotKham=d.get("MaLuotKham"),
            MaDichVu=d.get("MaDichVu"),
            MaXNV=d.get("MaXNV"),
            KetQuaXetNghiem=d.get("KetQuaXetNghiem"),
            TrangThaiXetNghiem=d.get("TrangThaiXetNghiem"),
            GiaCuoi=d.get("GiaCuoi"),
            PaymentToken=d.get("PaymentToken"),
        )

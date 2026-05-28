from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class ChiTietDonThuoc:
    MaDonThuoc: str
    MaLuotKham: str
    MaThuoc: str
    SoLuong: int
    LieuDung: Optional[str]

    __tablename__ = "CHI_TIET_DON_THUOC"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "ChiTietDonThuoc":
        return cls(
            MaDonThuoc=d.get("MaDonThuoc"),
            MaLuotKham=d.get("MaLuotKham"),
            MaThuoc=d.get("MaThuoc"),
            SoLuong=d.get("SoLuong"),
            LieuDung=d.get("LieuDung"),
        )

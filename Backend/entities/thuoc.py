from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Thuoc:
    MaThuoc: str
    TenThuoc: str
    DonViTinh: str

    __tablename__ = "THUOC"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "Thuoc":
        return cls(
            MaThuoc=d.get("MaThuoc"),
            TenThuoc=d.get("TenThuoc"),
            DonViTinh=d.get("DonViTinh"),
        )

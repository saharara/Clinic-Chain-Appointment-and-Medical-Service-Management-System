from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DanhMucThuoc:
    """Entity mapping for table DANH_MUC_THUOC"""
    MaThuoc: str
    TenThuoc: str
    DonViTinh: str

    __tablename__ = "DANH_MUC_THUOC"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "DanhMucThuoc":
        return cls(
            MaThuoc=d.get("MaThuoc"),
            TenThuoc=d.get("TenThuoc"),
            DonViTinh=d.get("DonViTinh"),
        )

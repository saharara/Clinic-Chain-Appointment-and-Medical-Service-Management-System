from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DanhMucBenh:
    """Entity mapping for table DANH_MUC_BENH"""
    MaBenh: str
    TenBenh: str

    __tablename__ = "DANH_MUC_BENH"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "DanhMucBenh":
        return cls(
            MaBenh=d.get("MaBenh"),
            TenBenh=d.get("TenBenh"),
        )

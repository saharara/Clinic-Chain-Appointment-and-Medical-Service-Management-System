from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DanhMucBHYT:
    """Entity mapping for table DANH_MUC_BHYT"""
    KyTuDauBHYT: str
    DoiTuongChinhSach: int

    __tablename__ = "DANH_MUC_BHYT"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "DanhMucBHYT":
        return cls(
            KyTuDauBHYT=d.get("KyTuDauBHYT"),
            DoiTuongChinhSach=d.get("DoiTuongChinhSach"),
        )

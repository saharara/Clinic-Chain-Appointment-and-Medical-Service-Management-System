from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DanhMucBHYT:
    KyTuDauBHYT: str
    DoiTuongChinhSach: str
    TyLeHuong: float

    __tablename__ = "DANH_MUC_BHYT"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "DanhMucBHYT":
        return cls(
            KyTuDauBHYT=d.get("KyTuDauBHYT"),
            DoiTuongChinhSach=d.get("DoiTuongChinhSach"),
            TyLeHuong=d.get("TyLeHuong"),
        )

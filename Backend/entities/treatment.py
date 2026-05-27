from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class DanhMucTreatment:
    MaTreatment: str
    TenTreatment: str
    GiaTien: int

    __tablename__ = "DANH_MUC_TREATMENT"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "DanhMucTreatment":
        return cls(
            MaTreatment=d.get("MaTreatment"),
            TenTreatment=d.get("TenTreatment"),
            GiaTien=d.get("GiaTien"),
        )

from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class LichSuThongBao:
    MaThongBao: str
    MaLichKham: str
    MaBenhNhan: str
    NoiDung: str
    KenhGui: Optional[str]
    TrangThai: Optional[str]
    Loi: Optional[str]
    ThoiGianGui: Optional[str]

    __tablename__ = "LICH_SU_THONG_BAO"

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "LichSuThongBao":
        return cls(
            MaThongBao=d.get("MaThongBao"),
            MaLichKham=d.get("MaLichKham"),
            MaBenhNhan=d.get("MaBenhNhan"),
            NoiDung=d.get("NoiDung"),
            KenhGui=d.get("KenhGui"),
            TrangThai=d.get("TrangThai"),
            Loi=d.get("Loi"),
            ThoiGianGui=d.get("ThoiGianGui"),
        )
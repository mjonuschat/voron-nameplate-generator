from enum import Enum

from pydantic import BaseModel, Field


class PrinterModel(str, Enum):
    VORON_LEGACY = "VL"
    VORON_ONE = "V1"
    VORON_SWITCHWIRE = "VS"
    VORON_TRIDENT = "VT"
    VORON_TWO = "V2"
    VORON_ZERO = "V0"
    VORON_ZERO_R2 = "V0.2"

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _info):
        try:
            return cls[v]
        except KeyError:
            raise ValueError(f"Invalid Value: {v}")


class NamePlateParameters(BaseModel):
    model: PrinterModel = Field(frozen=True)
    serial: int = Field(ge=0, lt=10000, validate_default=True, frozen=True)
    logo: bool = Field(default=True, validate_default=True, frozen=True)
    multi_material: bool = Field(default=False, validate_default=True, frozen=True)
    thickness: float = Field(
        default=3.0,
        ge=2.5,
        le=10.0,
        multiple_of=0.5,
        validate_default=True,
        frozen=True,
    )

    @property
    def download_name(self) -> str:
        return f"nameplate-{self.name}.stl"

    @property
    def name(self) -> str:
        return f"{self.model.value[:2]}.{self.serial}"

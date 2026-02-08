from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional

class PromocionesModel(BaseModel):
    id_promocion: Optional[int] = None
    descripcion: str = Field(..., min_length=3, max_length=50)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    porcentaje: float
    estado: bool

    @field_validator('estado')
    def validar_estado(cls, valor):
        if isinstance(valor, str):
            return valor.lower() == 'true'
        return bool(valor)

    @field_validator('fecha_inicio', 'fecha_fin')
    def parse_fecha(cls, valor):
        if valor is None:
            return None
        if isinstance(valor, str):
            try:
                return datetime.strptime(valor, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("La fecha debe tener el formato YYYY-MM-DD")
        return valor

    def to_dict(self):
        return {
            "id_promocion": self.id_promocion,
            "descripcion": self.descripcion,
            "fecha_inicio": str(self.fecha_inicio),
            "fecha_fin": str(self.fecha_fin),
            "porcentaje": self.porcentaje,
            "estado": self.estado
        }

    def model_dump(self, **kwargs):
        # Definimos el orden específico de los campos
        field_order = ['id_promocion', 'descripcion', 'fecha_inicio', 'fecha_fin', 'porcentaje', 'estado']
        ordered_dict = {}
        for field in field_order:
            value = getattr(self, field)
            if isinstance(value, date):
                value = str(value)
            ordered_dict[field] = value
        return ordered_dict

    class Config:
        json_encoders = {
            datetime: str,
            date: str
        }
        from_attributes = True
        populate_by_name = True
        validate_assignment = True


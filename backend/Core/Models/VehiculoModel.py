from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

class VehiculoModel(BaseModel):
    placa: str = Field(..., min_length=3, max_length=10)
    documento_cliente: str = Field(..., min_length=3, max_length=10)
    categoria: Literal["Moto", "Auto", "Cuatrimoto"] = Field(...)
    segmento: Optional[str] = None
    marca: str = Field(..., min_length=2, max_length=50)
    linea: Optional[str] = None
    modelo: int = Field(..., ge=1900, le=datetime.now().year + 1)
    cilindrada: int = Field(..., gt=0)
    grupo: int = Field(..., gt=0)

    model_config = {
        "json_schema_extra": {
            "example": {
                "placa": "ABC123",
                "documento_cliente": "1234567890",
                "categoria": "Auto",
                "segmento": "Sedan",
                "marca": "Toyota",
                "linea": "Corolla",
                "modelo": 2023,
                "cilindrada": 2000,
                "grupo": 1
            }
        }
    }

    def to_dict(self):
        """Convertir a diccionario"""
        return {
            "placa": self.placa,
            "documento_cliente": self.documento_cliente,
            "categoria": self.categoria,
            "segmento": self.segmento,
            "marca": self.marca,
            "linea": self.linea,
            "modelo": self.modelo,
            "cilindrada": self.cilindrada,
            "grupo": self.grupo
        }
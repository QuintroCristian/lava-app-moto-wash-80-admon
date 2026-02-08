# Core/Models/ConfigModel.py
from pydantic import BaseModel

class EmpresaModel(BaseModel):
    nombre: str
    nit: str
    telefono: str
    direccion: str
    iva: bool
    valor_iva: float
    iva_incluido: bool
    logo: str

class TemaModel(BaseModel):
    primario: str
    foregroundPrimario: str

class ConfigModel(BaseModel):
    empresa: EmpresaModel
    tema: TemaModel

    class Config:
        json_schema_extra = {
            "example": {
                "empresa": {
                    "nombre": "SPA Car Service",
                    "nit": "900000000-0",
                    "telefono": "+57 1234567890",
                    "direccion": "Dirección por defecto",
                    "iva": True,
                    "valor_iva": 19.0,
                    "iva_incluido": True,
                    "logo": "data:image/png;base64"
                },
                "tema": {
                    "primario": "100 80% 30%",
                    "foregroundPrimario": "0 0% 100%"
                }
            }
        }
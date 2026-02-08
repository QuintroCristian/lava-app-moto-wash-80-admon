from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class GrupoValor(BaseModel):
    id: int
    precio: float

class CategoriaValor(BaseModel):
    categoria: str
    grupos: List[GrupoValor]

class ServicioGeneralModel(BaseModel):
    id_servicio: Optional[int] = None
    nombre: str = Field(..., min_length=3, max_length=100)
    tipo_servicio: Literal["General"]
    valores: List[CategoriaValor]

    def to_dict(self):
        return {
            "id_servicio": self.id_servicio,
            "nombre": self.nombre,
            "tipo_servicio": self.tipo_servicio,
            "valores": [
                {
                    "categoria": cat.categoria,
                    "grupos": [
                        {"id": g.id, "precio": str(g.precio)}
                        for g in cat.grupos
                    ]
                }
                for cat in self.valores
            ]
        }

class ServicioAdicionalModel(BaseModel):
    id_servicio: Optional[int] = None
    nombre: str = Field(..., min_length=3, max_length=100)
    tipo_servicio: Literal["Adicional"]
    categorias: List[str]
    precio_variable: bool
    variable: Literal["und", "m2", "lt", "kg", None]
    precio_base: float

    def to_dict(self):
        return {
            "id_servicio": self.id_servicio,
            "nombre": self.nombre,
            "tipo_servicio": self.tipo_servicio,
            "categorias": self.categorias,
            "precio_variable": self.precio_variable,
            "variable": self.variable,
            "precio_base": self.precio_base
        }


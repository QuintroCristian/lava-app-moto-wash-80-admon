from pydantic import BaseModel, Field

class UserModel(BaseModel):
    usuario: str = Field(..., min_length=3, max_length=50)
    nombre: str = Field(..., min_length=3, max_length=50)
    apellido: str = Field(..., min_length=3, max_length=50)
    clave: str = Field(..., min_length=6)
    rol: str = Field(..., min_length=3, max_length=50)

class Usermodificar_facturaModel(BaseModel):
    usuario: str = Field(..., min_length=3, max_length=50)
    nombre: str = Field(..., min_length=3, max_length=50)
    apellido: str = Field(..., min_length=3, max_length=50)
    clave: str | None = Field(default=None, min_length=6)
    rol: str = Field(..., min_length=3, max_length=50)
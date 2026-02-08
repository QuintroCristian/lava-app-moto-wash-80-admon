from fastapi import FastAPI, HTTPException, APIRouter, Path, Query
from Core.Services.AutenticacionService import AuthService
from Core.Models.UserModel import UserModel, Usermodificar_facturaModel
from utilidades.responses import error_response, success_response
from pydantic import BaseModel

router = APIRouter()

class LoginBody(BaseModel):
    usuario: str
    clave: str

@router.get("", tags=["Usuarios"])
async def usuarios(usuario: str = Query(None, description="Username del usuario a consultar")):
    """Obtener lista de usuarios o un usuario específico usando query parameter"""
    if usuario:
        user = AuthService.obtener_usuario_sin_clave(usuario)
        if not user:
            return error_response(404, f"Usuario {usuario} no encontrado", "NotFound")
        return success_response(user)
        
    usuarios = AuthService.obtener_usuarios_sin_clave()
    return success_response(usuarios)

@router.post("", tags=["Usuarios"])
async def registrar_usuario(user: UserModel):
    """Registrar un nuevo usuario"""
    resultado = AuthService.registrar_usuario(user)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.post("/login", tags=["Usuarios"])
async def login(login_request: LoginBody):
    """Autenticar usuario"""
    user = AuthService.verificar_credenciales(login_request.usuario, login_request.clave)
    if not user:
        return error_response(401, "Usuario o contraseña inválida", "AuthenticationError")
    user_dict = user.dict()
    del user_dict['clave']
    return success_response(user_dict)

@router.put("", tags=["Usuarios"])
async def actualizar_usuario(user: Usermodificar_facturaModel):
    """Actualizar información de usuario"""
    resultado = AuthService.actualizar_usuario(user)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.delete("", tags=["Usuarios"])
async def eliminar_usuario(usuario: str = Query(..., description="Username del usuario a eliminar")):
    """Eliminar un usuario usando query parameter"""
    resultado = AuthService.eliminar_usuario(usuario)
    if "Error" in resultado:
        return error_response(404, resultado, "NotFound")
    return success_response(None, resultado)


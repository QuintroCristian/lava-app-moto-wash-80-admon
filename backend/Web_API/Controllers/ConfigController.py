from fastapi import APIRouter
from typing import Dict, Any
from Core.Services.ConfigService import ConfigService
from utilidades import config
from utilidades.responses import error_response, success_response

router = APIRouter()

@router.get("", tags=["Configuracion"])
async def obtener_config():
    """Obtener la configuración actual"""
    try:
        configuracion = ConfigService.obtener_config()
        return success_response(
            data=configuracion.model_dump(),
            message="Configuración obtenida exitosamente",
            status_code=200
        )
    except Exception as e:
        return error_response(500, str(e), "Error al obtener configuración")

@router.put("", tags=["Configuracion"])
async def actualizar_config(actualizaciones: Dict[str, Any]):
    """Actualizar configuración parcialmente"""
    try:
        configuracion = ConfigService.actualizar_config(actualizaciones)
        if isinstance(configuracion, str) and "Error" in configuracion:
            return error_response(400, configuracion)
        
        return success_response(
            data=None,
            message="Configuración actualizada exitosamente",
            status_code=200
        )
    except Exception as e:
        return error_response(400, str(e), "Error al actualizar configuración")

@router.put("/reset", tags=["Configuracion"])
async def restablecer_config():
    """Restablecer configuración a valores por defecto"""
    try:
        configuracion = ConfigService.restablecer_config()
        return success_response(
            data=configuracion.model_dump(),
            message="Configuración restablecida exitosamente",
            status_code=200
        )
    except Exception as e:
        return error_response(500, str(e), "Error al restablecer configuración")
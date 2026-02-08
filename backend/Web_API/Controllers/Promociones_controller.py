from fastapi  import FastAPI, HTTPException, APIRouter, Path, Query
from Core.Services.PromocionesService import PromocionesService
from Core.Models.PromocionesModel import PromocionesModel
from utilidades.responses import error_response, success_response
from pydantic import BaseModel

router = APIRouter()

    
@router.get("", tags=["Promociones"])
async def promociones(id_promocion: int = Query(None, description="ID de la promoción a buscar")):
    """Obtener todas las promociones"""
    if id_promocion:
      promocion = PromocionesService.consultar_por_id(id_promocion)
      if not promocion:
        return error_response(404, "Promoción no encontrada", "NotFound")
      return success_response(promocion)
    promociones = PromocionesService.cargar_datos()
    return success_response(promociones)
  
@router.post("", tags=["Promociones"])
async def agregar_promocion(promocion: PromocionesModel):
    """Agregar una nueva promoción"""
    resultado = PromocionesService.agregar_promocion(promocion)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)
  
@router.put("", tags=["Promociones"])
async def actualizar(promocion: PromocionesModel):
    """Actualizar información de promoción"""
    resultado = PromocionesService.actualizar(promocion)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)
  
@router.delete("", tags=["Promociones"])
async def eliminar(id_promocion: int = Query(..., description="ID de la promoción a eliminar")):
    """Eliminar una promoción usando query parameter"""
    resultado = PromocionesService.eliminar(id_promocion)
    if "Error" in resultado:
        return error_response(404, resultado, "NotFound")
    return success_response(None, resultado)
  

from fastapi import APIRouter, HTTPException, Query
from Core.Services.ClienteServices import ClientesServices
from Core.Models.ClienteModel import ClienteModel
from utilidades.responses import success_response, error_response

router = APIRouter()

@router.get("", tags=["Clientes"])
async def clientes(documento: str = Query(None, description="Documento del cliente a consultar")):
    """Obtener lista de clientes o un cliente específico usando query parameter"""
    if documento:
        cliente = ClientesServices.buscar(documento=documento)
        if not cliente:         
            return error_response(404, f"Cliente con documento {documento} no encontrado", "NotFound")
        return success_response(cliente.to_dict())
        
    ClientesServices.cargar_datos()
    content = [cliente.to_dict() for cliente in ClientesServices.lista]
    return success_response(content)

@router.post("", tags=["Clientes"])
async def clientes_agregar(cliente: ClienteModel):
    """Registrar un nuevo cliente"""
    resultado = ClientesServices.agregar(cliente)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.put("", tags=["Clientes"])
async def clientes_actualizar(cliente: ClienteModel):
    """Actualizar información de cliente"""
    resultado = ClientesServices.actualizar(cliente)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.delete("", tags=["Clientes"])
async def clientes_eliminar(documento: str = Query(..., description="Documento del cliente a eliminar")):
    """Eliminar un cliente usando query parameter"""
    resultado = ClientesServices.eliminar(documento)
    if "Error" in resultado:
        return error_response(404, resultado, "NotFound")
    return success_response(None, resultado)
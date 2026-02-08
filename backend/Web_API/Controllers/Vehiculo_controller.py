from fastapi import APIRouter, Query
from Core.Services.VehiculoServices import VehiculoServices
from Core.Models.VehiculoModel import VehiculoModel
from utilidades.responses import success_response, error_response

router = APIRouter()

@router.get("", tags=["Vehículos"])
async def vehiculos(placa: str = Query(None, description="Placa del vehículo a consultar"),
                   documento_cliente: str = Query(None, description="Documento del cliente propietario")):
    """Obtener lista de vehículos, buscar por placa o por documento del cliente"""
    if placa:
        vehiculo = VehiculoServices.buscar_placa(placa=placa)
        if not vehiculo:
            return error_response(404, f"Vehículo con placa {placa} no encontrado", "NotFound")
        return success_response(vehiculo.to_dict())
    
    if documento_cliente:
        vehiculos = VehiculoServices.buscar_cliente(documento_cliente=documento_cliente)
        if not vehiculos:
            return error_response(404, "No se encontraron vehículos para el cliente", "NotFound")
        return success_response([vehiculo.to_dict() for vehiculo in vehiculos])
    
    VehiculoServices.cargar_datos()
    content = [vehiculo.to_dict() for vehiculo in VehiculoServices.lista]
    return success_response(content)

@router.post("", tags=["Vehículos"])
async def vehiculos_agregar(vehiculo: VehiculoModel):
    """Registrar un nuevo vehículo"""
    resultado = VehiculoServices.agregar(vehiculo)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.put("", tags=["Vehículos"])
async def vehiculos_actualizar(vehiculo: VehiculoModel):
    """Actualizar información de vehículo"""
    resultado = VehiculoServices.actualizar(vehiculo)
    if "Error" in resultado:
        return error_response(400, resultado, "ValidationError")
    return success_response(None, resultado)

@router.delete("", tags=["Vehículos"])
async def vehiculos_eliminar(placa: str = Query(..., description="Placa del vehículo a eliminar")):
    """Eliminar un vehículo usando query parameter"""
    resultado = VehiculoServices.eliminar(placa)
    if "Error" in resultado:
        return error_response(404, resultado, "NotFound")
    return success_response(None, resultado)
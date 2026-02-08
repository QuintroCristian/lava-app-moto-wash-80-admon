# Reportes_Controller.py
from fastapi import APIRouter, Query
from Core.Services.ReporteService import ReporteServices
from utilidades.responses import error_response, success_response
from typing import Optional
from Core.Models.ReporteModel import ReporteFiltro
import csv

router = APIRouter()

@router.get("", tags=["Reportes"])
async def reportes_por_fechas(
    fecha_inicio: Optional[str] = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    fecha_fin: Optional[str] = Query(None, description="Fecha fin (YYYY-MM-DD)")
):
    """Obtener todas las facturas con filtro opcional por fechas"""
    try:
        filtro = ReporteFiltro(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)
        error = filtro.validar_fechas()
        if error:
            return error

        # Obtener facturas
        facturas = ReporteServices.get_all(fecha_inicio, fecha_fin)
        
        # Verificar si hay un mensaje de error
        if isinstance(facturas, str):
            return error_response(
                message=facturas,
                status_code=400
            )
            
        return success_response(data=facturas)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )

@router.get("/cliente", tags=["Reportes"])
async def reportes_por_cliente(
    cedula_cliente: str = Query(..., description="Cédula del cliente")
):
    """Obtener todas las facturas filtradas por cédula del cliente"""
    try:
        # Llamar al método específico para buscar por cliente
        facturas = ReporteServices.get_all(id_cliente=cedula_cliente)
        
        # Verificar si hay un mensaje de error
        if isinstance(facturas, str):
            return error_response(
                message=facturas,
                status_code=400
            )
            
        return success_response(data=facturas)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )

@router.get("/medio_pago", tags=["Reportes"])
async def reportes_por_medio_pago(
    medio_pago: str = Query(..., description="Medio de pago (TR/TD/TC/EF)")
):
    """Obtener todas las facturas filtradas por medio de pago"""
    try:
        # Obtener facturas por medio de pago usando el método específico
        facturas = ReporteServices.get_by_medio_pago(medio_pago.upper())
        
        if isinstance(facturas, str):
            return error_response(
                message=facturas,
                status_code=400
            )
            
        return success_response(data=facturas)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )

@router.get("/numero_factura", tags=["Reportes"])
async def reportes_por_numero_factura(
    numero_factura: int = Query(..., description="Número de la factura")
):
    """Obtener todas las facturas filtradas por número de factura"""
    try:
        # Obtener facturas por número de factura
        facturas = ReporteServices.get_all(numero_factura)
        
        # Verificar si hay un mensaje de error
        if isinstance(facturas, str):
            return error_response(
                message=facturas,
                status_code=400
            )
            
        return success_response(data=facturas)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )

@router.get("/placa", tags=["Reportes"])
async def reportes_por_placa(
    placa: str = Query(..., description="Número de placa del vehículo")
):
    """Obtener todas las facturas filtradas por número de placa"""
    try:
        # Llamar al método específico para buscar por placa
        facturas = ReporteServices.get_by_placa(placa.upper())
        
        if isinstance(facturas, str):
            return error_response(
                message=facturas,
                status_code=400
            )
            
        return success_response(data=facturas)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )

@router.get("/resumen", tags=["Reportes"])
async def resumen(
    fecha_inicio: Optional[str] = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    fecha_fin: Optional[str] = Query(None, description="Fecha fin (YYYY-MM-DD)")
):
    """Obtener resumen de ventas"""
    try:
        filtro = ReporteFiltro(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)
        error = filtro.validar_fechas()
        if error:
            return error

        # Obtener resumen de ventas
        resumen = ReporteServices.get_resumen(fecha_inicio, fecha_fin)
        
        # Verificar si hay un mensaje de error
        if isinstance(resumen, str):
            return error_response(
                message=resumen,
                status_code=400
            )
            
        return success_response(data=resumen)
        
    except Exception as e:
        return error_response(
            message=f"Error en el servidor: {str(e)}",
            status_code=500
        )
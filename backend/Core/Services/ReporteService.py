from datetime import datetime
from typing import List, Dict
from Core.Models.FacturaModel import Factura
from Core.Services.FacturaServices import FacturaServices
from Core.Models.FacturaModel import Factura
import csv
import os
import pandas as pd
from utilidades.config import FACTURAS_DB_PATH  # Asegúrate de importar la ruta del CSV

class ReporteServices:
    CATEGORIAS_DEFAULT = ["Moto", "Auto", "Cuatrimoto"]  # Añadir constante de categorías
    
    @classmethod
    def _read_csv(cls):
        """Lee el archivo CSV de facturas y retorna un DataFrame"""
        try:
            if not os.path.exists(FACTURAS_DB_PATH):
                return "Error: Archivo de facturas no encontrado"
            
            df = pd.read_csv(FACTURAS_DB_PATH, 
                           delimiter=';',
                           encoding='utf-8')
            
            return df
        except Exception as e:
            return f"Error al leer archivo CSV: {str(e)}"

    @classmethod
    def get_all(cls, fecha_inicio: str = None, fecha_fin: str = None, id_cliente: str = None):
        """Obtiene todas las facturas filtradas por rango de fecha y/o cliente."""
        try:
            # Obtener facturas usando FacturaServices
            facturas = FacturaServices.get_all()
            
            if isinstance(facturas, str) and "Error" in facturas:
                return facturas

            facturas_filtradas = facturas

            # Filtrar por cliente si se especifica
            if id_cliente:
                facturas_filtradas = [
                    factura for factura in facturas_filtradas 
                    if str(factura['cliente']).strip() == str(id_cliente).strip()
                ]
                
                if not facturas_filtradas:
                    return f"No se encontraron facturas para el cliente {id_cliente}"

            # Filtrar por fechas si se especifican
            if fecha_inicio and fecha_fin:
                try:
                    fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                    fecha_fin_dt = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                    
                    facturas_filtradas = [
                        factura for factura in facturas_filtradas
                        if fecha_inicio_dt <= datetime.fromisoformat(factura['fecha']).date() <= fecha_fin_dt
                    ]

                    if not facturas_filtradas:
                        return f"No se encontraron facturas para el rango de fechas especificado"

                except ValueError as e:
                    return f"Error en formato de fechas: {str(e)}"

            return facturas_filtradas
                
        except Exception as e:
            return f"Error al procesar reporte: {str(e)}"

    @classmethod
    def get_by_numero_factura(cls, numero_factura: int):
        """
        Obtiene las facturas filtradas por número de factura.
        """
        try:
            # Obtener todas las facturas
            facturas = FacturaServices.get_all()
            
            if isinstance(facturas, str) and "Error" in facturas:
                return facturas
            
            # Filtrar facturas por número de factura
            facturas_filtradas = [factura for factura in facturas if int(factura['FACTURA']) == numero_factura]
            
            # Convertir fechas a formato ISO
            for factura in facturas_filtradas:
                factura['fecha'] = datetime.fromisoformat(factura['FECHA']).isoformat()
            
            return facturas_filtradas
            
        except Exception as e:
            return f"Error al procesar reporte: {str(e)}"

    

    @classmethod
    def get_by_cliente(cls, id_cliente: str):
        """
        Obtiene todas las facturas de un cliente específico usando su ID.
        """
        try:
            facturas = FacturaServices.get_all()
            
            if isinstance(facturas, str) and "Error" in facturas:
                return facturas

            # Filtrar facturas por id_cliente
            facturas_cliente = []
            for factura in facturas:
                if str(factura.get('CLIENTE', '')).strip() == str(id_cliente).strip():
                    facturas_cliente.append(factura)

            # Verificar si se encontraron facturas
            if not facturas_cliente:
                return f"No se encontraron facturas para el cliente {id_cliente}"

            # Retornar las facturas encontradas
            return facturas_cliente

        except Exception as e:
            return f"Error al procesar reporte por cliente: {str(e)}"

    @classmethod
    def get_by_medio_pago(cls, medio_pago: str):
        """
        Obtiene todas las facturas filtradas por medio de pago.
        """
        try:
            df = cls._read_csv()
            if isinstance(df, str):
                return df
            
            # Convert to records without date conversion
            facturas_filtradas = df[df['MEDIO_PAGO'].str.contains(medio_pago, case=False, na=False)].to_dict('records')

            if not facturas_filtradas:
                return f"No se encontraron facturas con medio de pago {medio_pago}"

            return facturas_filtradas

        except Exception as e:
            return f"Error al procesar reporte por medio de pago: {str(e)}"

    @classmethod
    def get_by_placa(cls, placa: str):
        """
        Obtiene todas las facturas filtradas por número de placa.
        """
        try:
            df = cls._read_csv()
            if isinstance(df, str):
                return df
            
            # Convert to records without date conversion
            facturas_filtradas = df[df['PLACA'].str.upper() == placa.upper()].to_dict('records')

            if not facturas_filtradas:
                return f"No se encontraron facturas para la placa {placa}"

            return facturas_filtradas

        except Exception as e:
            return f"Error al procesar reporte por placa: {str(e)}"
            
    @classmethod
    def get_resumen(cls, fecha_inicio: str = None, fecha_fin: str = None) -> Dict:
        """Genera resumen de ventas optimizado"""
        try:
            df = cls._read_csv()
            if isinstance(df, str):
                return df

            
            if fecha_inicio and fecha_fin:
                df['FECHA'] = pd.to_datetime(df['FECHA'])
                fecha_inicio_dt = pd.to_datetime(fecha_inicio)
                fecha_fin_dt = pd.to_datetime(fecha_fin)
                mask = (df['FECHA'].dt.date >= fecha_inicio_dt.date()) & \
                      (df['FECHA'].dt.date <= fecha_fin_dt.date())
                df = df[mask]

            if df.empty:
                empty_response = {
                    "fecha_inicio": fecha_inicio,
                    "fecha_fin": fecha_fin,
                    "total_ventas": 0,
                    "numero_facturas": 0,
                    "ventas_medios_pago": [
                        {"medio_pago": mp, "total_ventas": 0, "numero_facturas": 0}
                        for mp in ["TR", "TD", "TC", "EF"]
                    ],
                    "ventas_diarias": []
                }
                return empty_response

            # Resumen general
            resumen = {
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "total_ventas": float(df['VALOR'].sum()),
                "numero_facturas": int(df['FACTURA'].nunique()),
                "ventas_medios_pago": [],
                "ventas_diarias": []
            }

            # Ventas por medio de pago
            medios_pago_base = {
                "TR": {"total_ventas": 0, "numero_facturas": 0},
                "TD": {"total_ventas": 0, "numero_facturas": 0},
                "TC": {"total_ventas": 0, "numero_facturas": 0},
                "EF": {"total_ventas": 0, "numero_facturas": 0}
            }

            medios_pago = df.groupby('MEDIO_PAGO').agg({
                'VALOR': 'sum',  # Changed from 'valor' to 'VALOR'
                'FACTURA': 'nunique'  # Changed from 'factura' to 'FACTURA'
            }).reset_index()

            # Procesar cada medio de pago encontrado
            for _, row in medios_pago.iterrows():
                medio = row['MEDIO_PAGO'][:2]  # Tomar solo los primeros 2 caracteres
                if medio in medios_pago_base:
                    medios_pago_base[medio] = {
                        "total_ventas": float(row['VALOR']),  # Changed from 'valor' to 'VALOR'
                        "numero_facturas": int(row['FACTURA'])  # Changed from 'factura' to 'FACTURA'
                    }

            # Convertir diccionario a lista manteniendo todos los medios de pago
            resumen["ventas_medios_pago"] = [
                {"medio_pago": mp, **datos}
                for mp, datos in medios_pago_base.items()
            ]

            # Ventas diarias con todas las categorías
            df['FECHA'] = pd.to_datetime(df['FECHA'])  # Ensure FECHA is datetime
            fechas_unicas = sorted(df['FECHA'].unique())
            for fecha in fechas_unicas:
                df_fecha = df[df['FECHA'] == fecha]
                ventas_diarias = {
                    "fecha": fecha.isoformat(),  # Use ISO format
                    "total_ventas": float(df_fecha['VALOR'].sum()),
                    "numero_facturas": int(df_fecha['FACTURA'].nunique()),
                    "categorias": []
                }

                # Inicializar todas las categorías en cero
                categorias_dict = {cat: {"total_ventas": 0, "numero_facturas": 0} 
                                 for cat in cls.CATEGORIAS_DEFAULT}

                # Actualizar valores para categorías existentes
                for categoria in cls.CATEGORIAS_DEFAULT:
                    df_cat = df_fecha[df_fecha['CATEGORIA'] == categoria]
                    if not df_cat.empty:
                        categorias_dict[categoria] = {
                            "total_ventas": float(df_cat['VALOR'].sum()),
                            "numero_facturas": int(df_cat['FACTURA'].nunique())
                        }

                # Convertir diccionario de categorías a lista
                ventas_diarias["categorias"] = [
                    {"categoria": cat, **datos}
                    for cat, datos in categorias_dict.items()
                ]

                resumen["ventas_diarias"].append(ventas_diarias)

            return resumen

        except Exception as e:
            return f"Error al procesar resumen: {str(e)}"
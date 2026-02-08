import csv
import os
import json
from datetime import timezone, datetime
from Core.Models.FacturaModel import Factura
from utilidades.config import FACTURAS_DB_PATH

class FacturaServices:
    lista = []
    COLUMNAS_CSV = [
        'FACTURA', 'FECHA', 'PLACA', 'CATEGORIA', 'GRUPO', 'CLIENTE', 
        'MEDIO_PAGO', 'IVA', 'VALOR_IVA', 'DESCUENTO', 'VLR_DESCUENTO', 'BRUTO', 'SUBTOTAL', 'TOTAL', 'SERVICIOS',
        'CANTIDAD', 'DESCRIPCION', 'VALOR'
    ]
    NUMERO_INICIAL_FACTURA = 10000

    @classmethod
    def _ensure_csv_exists(cls):
        if not os.path.exists(FACTURAS_DB_PATH):
            with open(FACTURAS_DB_PATH, 'w', newline='', encoding="utf-8") as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                writer.writeheader()

    @classmethod
    def _obtener_ultimo_id(cls):
        if not os.path.exists(FACTURAS_DB_PATH):
            return cls.NUMERO_INICIAL_FACTURA
        
        try:
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                ids = set([int(row['FACTURA']) for row in reader])  # Cambiado de 'factura' a 'FACTURA'
                return max(ids) + 1 if ids else cls.NUMERO_INICIAL_FACTURA
        except:
            return cls.NUMERO_INICIAL_FACTURA

    @classmethod
    def _safe_int_convert(cls, value):
        """Convierte de manera segura un valor a entero"""
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return 0

    @classmethod
    def get_all(cls):
        cls._ensure_csv_exists()
        try:
            facturas_dict = {}
            
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                
                for row in reader:
                    factura_id = row['FACTURA']
                    
                    if factura_id not in facturas_dict:
                        facturas_dict[factura_id] = {
                            'factura': cls._safe_int_convert(row['FACTURA']),
                            'fecha': row['FECHA'],
                            'placa': row['PLACA'],
                            'categoria': row['CATEGORIA'],
                            'grupo': cls._safe_int_convert(row['GRUPO']),
                            'cliente': row['CLIENTE'],
                            'medio_pago': row['MEDIO_PAGO'],
                            'iva': float(row['IVA']),
                            'valor_iva': float(row['VALOR_IVA']),
                            'descuento': float(row['DESCUENTO']),
                            'vlr_descuento': float(row['VLR_DESCUENTO']),
                            'bruto': float(row['BRUTO']),
                            'subtotal': float(row['SUBTOTAL']),
                            'total': float(row['TOTAL']),
                            'servicios': []
                        }
                    
                    servicio = {
                        'servicio': cls._safe_int_convert(row['SERVICIOS']),
                        'cantidad': cls._safe_int_convert(row['CANTIDAD']),
                        'descripcion': row['DESCRIPCION'],
                        'valor': float(row['VALOR']),
                    }
                    facturas_dict[factura_id]['servicios'].append(servicio)
            
            return list(facturas_dict.values())
            
        except Exception as e:
            return f"Error al consultar facturas: {e}"

    @classmethod
    def get_by_id(cls, factura_id: int):
        cls._ensure_csv_exists()
        try:
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                factura = None
                servicios = []
                for row in reader:
                    if int(row['FACTURA']) == factura_id:
                        if factura is None:
                            factura = cls._process_row(row)
                        servicio = {
                            'servicio': cls._safe_int_convert(row['SERVICIOS']),
                            'cantidad': cls._safe_int_convert(row['CANTIDAD']),
                            'descripcion': row['DESCRIPCION'],
                            'valor': float(row['VALOR']),
                        }
                        servicios.append(servicio)
                if factura:
                    factura['servicios'] = servicios
                return factura
            return None
        except Exception as e:
            return f"Error al consultar factura: {e}"

    @classmethod
    def _ordenar_y_guardar_registros(cls, rows):
        """Ordena los registros por número de factura y los guarda en el archivo"""
        # Ordenar registros por número de factura
        rows_ordenados = sorted(rows, key=lambda x: int(x['FACTURA']))  # Cambiado de 'factura' a 'FACTURA'
        
        # Guardar registros ordenados
        with open(FACTURAS_DB_PATH, 'w', newline='', encoding="utf-8") as df:
            writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
            writer.writeheader()
            writer.writerows(rows_ordenados)

    @classmethod
    def create(cls, factura: Factura):
        cls._ensure_csv_exists()
        try:
            if not factura.servicios:
                raise ValueError("La factura debe contener al menos un servicio")

            if any(s.valor <= 0 for s in factura.servicios):
                raise ValueError("El valor de los servicios debe ser mayor a 0")

            if factura.total <= 0:
                raise ValueError("El total de la factura debe ser mayor a 0")

            # Leer registros existentes
            existing_rows = []
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                existing_rows = list(reader)

            # Obtener nuevo número de factura
            nuevo_numero = cls._obtener_ultimo_id()
            
            factura_base = {
                'FACTURA': int(nuevo_numero),
                'FECHA': factura.fecha.isoformat(),
                'PLACA': factura.placa.upper(),
                'CATEGORIA': factura.categoria.capitalize(),
                'GRUPO': int(factura.grupo),
                'CLIENTE': factura.id_cliente,
                'MEDIO_PAGO': factura.medio_pago.upper(),
                'IVA': float(factura.iva),
                'VALOR_IVA': float(factura.vlr_iva),
                'DESCUENTO': float(factura.descuento),
                'VLR_DESCUENTO': float(factura.vlr_descuento),
                'BRUTO': float(factura.bruto),
                'SUBTOTAL': float(factura.subtotal),
                'TOTAL': float(factura.total),
            }
            
            # Crear nuevos registros
            nuevos_registros = []
            for servicio in factura.servicios:
                row = factura_base.copy()
                row.update({
                    'SERVICIOS': servicio.id_servicio,
                    'CANTIDAD': servicio.cantidad,
                    'DESCRIPCION': servicio.descripcion,
                    'VALOR': float(servicio.valor),
                })
                nuevos_registros.append(row)
            
            # Combinar y ordenar todos los registros
            existing_rows.extend(nuevos_registros)
            cls._ordenar_y_guardar_registros(existing_rows)
            
            # Actualizar el número de factura en el objeto antes de devolverlo
            factura.numero_factura = nuevo_numero
            return factura.to_dict()
        except ValueError as ve:
            return f"Error de validación: {str(ve)}"
        except Exception as e:
            return f"Error al crear factura: {str(e)}"

    @classmethod
    def update(cls, factura_id: int, factura: Factura):
        if factura_id <= 0:
            raise ValueError("ID de factura inválido")
            
        cls._ensure_csv_exists()
        rows = []
        
        try:
            # Verificar si la factura existe antes de actualizar
            if not cls.get_by_id(factura_id):
                raise ValueError("Factura no encontrada")

            # Leer todos los registros excepto los de la factura a actualizar
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                rows = [row for row in reader if int(row['factura']) != factura_id]

            # Agregar los nuevos registros de la factura actualizada
            factura_base = {
                'factura': int(factura_id),
                'fecha': factura.fecha.astimezone(timezone.utc).isoformat(),  # Updated format
                'placa': factura.placa,
                'categoria': factura.categoria.capitalize(),
                'grupo': int(factura.grupo),
                'cliente': factura.id_cliente,
                'medio_pago': factura.medio_pago.upper(),
                'iva': float(factura.iva),
                'valor_iva': float(factura.vlr_iva),
                'descuento': float(factura.descuento),
                'vlr_descuento': float(factura.vlr_descuento),
                'bruto': float(factura.bruto),
                'subtotal': float(factura.subtotal),
                'total': float(factura.total),
            }

            # Crear los nuevos registros para cada servicio
            nuevos_registros = []
            for servicio in factura.servicios:
                row = factura_base.copy()
                row.update({
                    'servicios': servicio.id_servicio,
                    'cantidad': servicio.cantidad,
                    'descripcion': servicio.descripcion,
                    'valor': float(servicio.valor),
                })
                nuevos_registros.append(row)

            if not nuevos_registros:
                raise ValueError("No hay servicios para actualizar en la factura")

            # Combinar y ordenar registros
            rows.extend(nuevos_registros)
            cls._ordenar_y_guardar_registros(rows)
            
            # Retornar la factura actualizada con todos sus servicios
            return {
                **factura_base,
                'servicios': [
                    {
                        'servicio': s.id_servicio,
                        'cantidad': s.cantidad,
                        'descripcion': s.descripcion,
                        'valor': float(s.valor),
                    } for s in factura.servicios
                ]
            }
        except ValueError as ve:
            raise ve
        except Exception as e:
            return f"Error al actualizar factura: {e}"

    @classmethod
    def delete(cls, factura_id: int):
        cls._ensure_csv_exists()
        rows = []
        deleted = False
        
        try:
            # Leer todas las filas excepto las que coinciden con factura_id
            with open(FACTURAS_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                total_rows = 0
                for row in reader:
                    total_rows += 1
                    if int(row['FACTURA']) != factura_id:
                        rows.append(row)
                
                # Verificar si se encontraron filas para eliminar
                deleted = len(rows) < total_rows
            
            if not deleted:
                raise ValueError("Factura no encontrada")
            
            # Ordenar registros restantes antes de guardar
            cls._ordenar_y_guardar_registros(rows)
            
            return True
        except Exception as e:
            return f"Error al eliminar factura: {e}"

    @classmethod
    def _process_row(cls, row):
        """Procesa una fila del CSV para convertir en el formato requerido"""
        servicio = {
            'servicio': cls._safe_int_convert(row['SERVICIOS']),
            'cantidad': cls._safe_int_convert(row['CANTIDAD']),
            'descripcion': row['DESCRIPCION'],
            'valor': float(row['VALOR']),
        }
        return {
            'factura': cls._safe_int_convert(row['FACTURA']),
            'fecha': row['FECHA'],
            'placa': row['FACTURA'],
            'categoria': row['CATEGORIA'],
            'grupo': cls._safe_int_convert(row['GRUPO']),
            'cliente': row['CLIENTE'],
            'medio_pago': row['MEDIO_PAGO'],
            'iva': float(row['IVA']),
            'valor_iva': float(row['VALOR_IVA']),
            'descuento': float(row['DESCUENTO']),
            'vlr_descuento': float(row['VLR_DESCUENTO']),
            'bruto': float(row['BRUTO']),
            'subtotal': float(row['SUBTOTAL']),
            'total': float(row['TOTAL']),
            'servicios': [servicio]
        }
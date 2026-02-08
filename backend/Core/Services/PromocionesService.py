from Core.Models.PromocionesModel import PromocionesModel
from utilidades import config
from datetime import datetime
import csv
import os

class PromocionesService:
    ListaPromociones = []
    COLUMNAS_CSV = ['ID_PROMOCION', 'DESCRIPCION', 'FECHA_INICIO', 'FECHA_FIN', 'PORCENTAJE', 'ESTADO']

    @classmethod
    def cargar_datos(cls):
        cls.ListaPromociones.clear()
        try:
            if not os.path.exists(config.PROMOCIONES_DB_PATH):
                with open(config.PROMOCIONES_DB_PATH, 'w', newline='\n', encoding='utf-8') as df:
                    writer = csv.writer(df, delimiter=';')
                    writer.writerow(cls.COLUMNAS_CSV)
                return []
            
            with open(config.PROMOCIONES_DB_PATH, newline='\n', encoding='utf-8') as df:
                reader = csv.DictReader(df, delimiter=';', fieldnames=cls.COLUMNAS_CSV)
                next(reader)
                for row in reader:
                    promocion = PromocionesModel(
                        id_promocion=int(row['ID_PROMOCION']),
                        descripcion=row['DESCRIPCION'],
                        fecha_inicio=row['FECHA_INICIO'] if row['FECHA_INICIO'] else None,
                        fecha_fin=row['FECHA_FIN'] if row['FECHA_FIN'] else None,
                        porcentaje=float(row['PORCENTAJE']),
                        estado=row['ESTADO'].lower() == 'true'
                    )
                    cls.ListaPromociones.append(promocion)
                return [p.model_dump() for p in cls.ListaPromociones]
        except Exception as e:
            print(f"Error al leer el archivo: {e}")
            return []

    @classmethod
    def agregar_promocion(cls, promocion: PromocionesModel):
        cls.cargar_datos()
        promocion.descripcion = promocion.descripcion.capitalize()
        
        # Generar nuevo ID
        if promocion.id_promocion is None:
            promocion.id_promocion = 1 if not cls.ListaPromociones else max(p.id_promocion for p in cls.ListaPromociones) + 1
        elif any(p.id_promocion == promocion.id_promocion for p in cls.ListaPromociones):
            return f"Error: La promoción con el ID {promocion.id_promocion} ya existe."
        
        try:
            archivo_existe = os.path.exists(config.PROMOCIONES_DB_PATH)
            modo = 'a' if archivo_existe else 'w'
            
            with open(config.PROMOCIONES_DB_PATH, mode=modo, newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                if not archivo_existe:
                    writer.writeheader()
                
                writer.writerow({
                    'ID_PROMOCION': promocion.id_promocion,
                    'DESCRIPCION': promocion.descripcion,
                    'FECHA_INICIO': promocion.fecha_inicio,
                    'FECHA_FIN': promocion.fecha_fin,
                    'PORCENTAJE': promocion.porcentaje,
                    'ESTADO': promocion.estado
                })
            
            cls.ListaPromociones.append(promocion)
            return f"Promoción '{promocion.descripcion}' agregada exitosamente."
        except Exception as e:
            return f"Error al escribir en el archivo: {e}"

    @classmethod
    def actualizar(cls, promocion: PromocionesModel):
        if promocion.id_promocion is None:
            return "Error: Se requiere un ID de promoción para actualizar"
            
        cls.cargar_datos()
        promocion.descripcion = promocion.descripcion.capitalize()
        
        if not any(p.id_promocion == promocion.id_promocion for p in cls.ListaPromociones):
            return f"Error: La promoción con el ID {promocion.id_promocion} no existe."
        
        try:
            with open(config.PROMOCIONES_DB_PATH, 'w', newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                writer.writeheader()
                for p in cls.ListaPromociones:
                    if p.id_promocion == promocion.id_promocion:
                        writer.writerow({
                            'ID_PROMOCION': promocion.id_promocion,
                            'DESCRIPCION': promocion.descripcion,
                            'FECHA_INICIO': promocion.fecha_inicio,
                            'FECHA_FIN': promocion.fecha_fin,
                            'PORCENTAJE': promocion.porcentaje,
                            'ESTADO': promocion.estado
                        })
                    else:
                        writer.writerow({
                            'ID_PROMOCION': p.id_promocion,
                            'DESCRIPCION': p.descripcion,
                            'FECHA_INICIO': p.fecha_inicio,
                            'FECHA_FIN': p.fecha_fin,
                            'PORCENTAJE': p.porcentaje,
                            'ESTADO': p.estado
                        })
            return "Promoción actualizada exitosamente."
        except Exception as e:
            return f"Error al actualizar promoción: {e}"
        
    @classmethod
    def consultar_por_id(cls, id_promocion):
        cls.cargar_datos()
        promocion = next((p for p in cls.ListaPromociones if p.id_promocion == id_promocion), None)
        if promocion:
            return promocion.model_dump()
        return None
        
    @classmethod
    def eliminar(cls, id_promocion: int):
        cls.cargar_datos()
        
        if not any(p.id_promocion == id_promocion for p in cls.ListaPromociones):
            return f"Error: La promoción con el ID {id_promocion} no existe."
        
        try:
            with open(config.PROMOCIONES_DB_PATH, 'w', newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                writer.writeheader()
                for p in cls.ListaPromociones:
                    if p.id_promocion != id_promocion:
                        writer.writerow({
                            'ID_PROMOCION': p.id_promocion,
                            'DESCRIPCION': p.descripcion,
                            'FECHA_INICIO': p.fecha_inicio,
                            'FECHA_FIN': p.fecha_fin,
                            'PORCENTAJE': p.porcentaje,
                            'ESTADO': p.estado
                        })
            return "Promoción eliminada exitosamente."
        except Exception as e:
            return f"Error al eliminar promoción: {e}"



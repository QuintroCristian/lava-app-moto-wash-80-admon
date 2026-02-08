from Core.Models.ServicioModel import ServicioGeneralModel, ServicioAdicionalModel, CategoriaValor, GrupoValor
from utilidades import config
from utilidades.config import SERVICIOS_ADICIONALES_DB_PATH, SERVICIOS_GENERALES_DB_PATH
import csv
import os


class ServiciosServices:
    lista_generales = []
    lista_adicionales = []
    COLUMNAS_GENERALES = ['ID_SERVICIO', 'NOMBRE', 'TIPO_SERVICIO', 'CATEGORIA', 'GRUPO', 'PRECIO']
    COLUMNAS_ADICIONALES = ['ID_SERVICIO', 'NOMBRE', 'TIPO_SERVICIO', 'CATEGORIA', 'PRECIO_VARIABLE', 'VARIABLE', 'PRECIO_BASE']
    
    ID_SERVICIO_GENERAL = 1000
    @classmethod
    def _obtener_ultimo_id_general(cls):
        if not os.path.exists(SERVICIOS_GENERALES_DB_PATH):
            return cls.ID_SERVICIO_GENERAL
        
        try:
            with open(SERVICIOS_GENERALES_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                ids = set([int(row['ID_SERVICIO']) for row in reader])
                return max(ids) + 1 if ids else cls.ID_SERVICIO_GENERAL
        except:
            return cls.ID_SERVICIO_GENERAL
        
    ID_SERVICIO_ADICIONAL = 5000
    @classmethod
    def _obtener_ultimo_id_adicional(cls):
        if not os.path.exists(SERVICIOS_ADICIONALES_DB_PATH):
            return cls.ID_SERVICIO_ADICIONAL
        
        try:
            with open(SERVICIOS_ADICIONALES_DB_PATH, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                ids = set([int(row['ID_SERVICIO']) for row in reader])
                return max(ids) + 1 if ids else cls.ID_SERVICIO_ADICIONAL
        except:
            return cls.ID_SERVICIO_ADICIONAL

    @classmethod
    def _servicio_existe(cls, archivo, nombre):
        if not os.path.exists(archivo):
            return False
        
        try:
            with open(archivo, 'r', newline='',encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    if row['NOMBRE'] == nombre.capitalize():
                        return True
            return False
        except:
            return False

    @classmethod
    def agregarGeneral(cls, servicio: ServicioGeneralModel):
        try:
            if cls._servicio_existe(config.SERVICIOS_GENERALES_DB_PATH, servicio.nombre):
                return f"Error: El servicio general con nombre '{servicio.nombre}' ya existe."
            
            archivo_existe = os.path.exists(config.SERVICIOS_GENERALES_DB_PATH)
            modo = 'a' if archivo_existe else 'w'
            
            # Obtener un único ID para todo el servicio
            id_servicio = cls._obtener_ultimo_id_general()
            
            with open(config.SERVICIOS_GENERALES_DB_PATH, mode=modo, newline='\n',encoding="utf-8") as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_GENERALES, delimiter=';')
                if not archivo_existe:
                    writer.writeheader()
                
                for valor in servicio.valores:
                    for grupo in valor.grupos:
                        writer.writerow({
                            'ID_SERVICIO': str(id_servicio),  # Mismo ID para todos los registros del servicio
                            'NOMBRE': servicio.nombre.capitalize(),
                            'TIPO_SERVICIO': servicio.tipo_servicio,
                            'CATEGORIA': valor.categoria,
                            'GRUPO': grupo.id,
                            'PRECIO': grupo.precio
                        })
            
            return f"Servicio {servicio.nombre} guardado exitosamente."
        except Exception as e:
            return f"Error al guardar servicio general: {e}"

    @classmethod
    def agregarAdicional(cls, servicio: ServicioAdicionalModel):
        try:
            if cls._servicio_existe(config.SERVICIOS_ADICIONALES_DB_PATH, servicio.nombre):
                return f"Error: El servicio adicional con nombre '{servicio.nombre}' ya existe."
            
            archivo_existe = os.path.exists(config.SERVICIOS_ADICIONALES_DB_PATH)
            modo = 'a' if archivo_existe else 'w'
            
            # Obtener un único ID para todo el servicio
            id_servicio = cls._obtener_ultimo_id_adicional()
            
            with open(config.SERVICIOS_ADICIONALES_DB_PATH, mode=modo, newline='\n',encoding="utf-8") as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_ADICIONALES, delimiter=';')
                if not archivo_existe:
                    writer.writeheader()
                
                for categoria in servicio.categorias:
                    writer.writerow({
                        'ID_SERVICIO': str(id_servicio),
                        'NOMBRE': servicio.nombre.capitalize(),
                        'TIPO_SERVICIO': servicio.tipo_servicio,
                        'CATEGORIA': categoria,
                        'PRECIO_VARIABLE': servicio.precio_variable,
                        'VARIABLE': servicio.variable,
                        'PRECIO_BASE': servicio.precio_base
                    })
            
            return f"Servicio {servicio.nombre} guardado exitosamente."
        except Exception as e:
            return f"Error al guardar servicio adicional: {e}"

    @classmethod
    def _ensure_csv_exists(cls, archivo, columnas):
        if not os.path.exists(archivo):
            with open(archivo, 'w', newline='', encoding="utf-8") as df:
                writer = csv.DictWriter(df, fieldnames=columnas, delimiter=';')
                writer.writeheader()

    @classmethod
    def _ordenar_y_guardar_registros(cls, archivo, columnas, rows):
        rows_ordenados = sorted(rows, key=lambda x: int(x['ID_SERVICIO']))
        with open(archivo, 'w', newline='', encoding="utf-8") as df:
            writer = csv.DictWriter(df, fieldnames=columnas, delimiter=';')
            writer.writeheader()
            writer.writerows(rows_ordenados)

    @classmethod
    def consultar_todos(cls, tipo_servicio):
        archivo = config.SERVICIOS_GENERALES_DB_PATH if tipo_servicio.capitalize() == 'General' else config.SERVICIOS_ADICIONALES_DB_PATH
        columnas = cls.COLUMNAS_GENERALES if tipo_servicio.capitalize() == 'General' else cls.COLUMNAS_ADICIONALES
        cls._ensure_csv_exists(archivo, columnas)

        try:
            servicios_dict = {}
            with open(archivo, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    id_servicio = row['ID_SERVICIO']
                    if id_servicio not in servicios_dict:
                        servicios_dict[id_servicio] = {
                            'id_servicio': int(id_servicio),
                            'nombre': row['NOMBRE'],
                            'tipo_servicio': row['TIPO_SERVICIO']
                        }
                        if tipo_servicio.capitalize() == 'General':
                            servicios_dict[id_servicio]['valores'] = {}
                        else:
                            servicios_dict[id_servicio].update({
                                'categorias': [],
                                'precio_variable': row['PRECIO_VARIABLE'].lower() == 'true',
                                'variable': row['VARIABLE'],
                                'precio_base': float(row['PRECIO_BASE'])
                            })

                    if tipo_servicio.capitalize() == 'General':
                        categoria = row['CATEGORIA']
                        if categoria not in servicios_dict[id_servicio]['valores']:
                            servicios_dict[id_servicio]['valores'][categoria] = {
                                'categoria': categoria,
                                'grupos': []
                            }
                        servicios_dict[id_servicio]['valores'][categoria]['grupos'].append({
                            'id': int(row['GRUPO']),
                            'precio': float(row['PRECIO'])
                        })
                    else:
                        if row['CATEGORIA'] not in servicios_dict[id_servicio]['categorias']:
                            servicios_dict[id_servicio]['categorias'].append(row['CATEGORIA'])

            # Convert the services to the final format
            resultado = []
            for servicio in servicios_dict.values():
                if tipo_servicio.capitalize() == 'General':
                    servicio['valores'] = list(servicio['valores'].values())
                resultado.append(servicio)

            return resultado
        except Exception as e:
            return f"Error al consultar servicios: {e}"

    @classmethod
    def update_servicio_general(cls, servicio: ServicioGeneralModel):
        try:
            archivo = config.SERVICIOS_GENERALES_DB_PATH
            rows = []
            servicio_encontrado = False
            
            with open(archivo, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    if str(row['ID_SERVICIO']) != str(servicio.id_servicio):
                        rows.append(row)
                    else:
                        servicio_encontrado = True

            if not servicio_encontrado:
                return "Error: Servicio general no encontrado"

            for valor in servicio.valores:
                for grupo in valor.grupos:
                    rows.append({
                        'ID_SERVICIO': str(servicio.id_servicio),
                        'NOMBRE': servicio.nombre.capitalize(),
                        'TIPO_SERVICIO': servicio.tipo_servicio,
                        'CATEGORIA': valor.categoria,
                        'GRUPO': str(grupo.id),
                        'PRECIO': str(grupo.precio)
                    })

            cls._ordenar_y_guardar_registros(archivo, cls.COLUMNAS_GENERALES, rows)
            return servicio
        except Exception as e:
            return f"Error al actualizar servicio general: {str(e)}"

    @classmethod
    def update_servicio_adicional(cls, servicio: ServicioAdicionalModel):
        try:
            archivo = config.SERVICIOS_ADICIONALES_DB_PATH
            rows = []
            servicio_encontrado = False
            
            with open(archivo, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    if str(row['ID_SERVICIO']) != str(servicio.id_servicio):
                        rows.append(row)
                    else:
                        servicio_encontrado = True

            if not servicio_encontrado:
                return "Error: Servicio adicional no encontrado"

            for categoria in servicio.categorias:
                rows.append({
                    'ID_SERVICIO': str(servicio.id_servicio),
                    'NOMBRE': servicio.nombre.capitalize(),
                    'TIPO_SERVICIO': servicio.tipo_servicio,
                    'CATEGORIA': categoria,
                    'PRECIO_VARIABLE': str(servicio.precio_variable),
                    'VARIABLE': servicio.variable,
                    'PRECIO_BASE': str(servicio.precio_base)
                })

            cls._ordenar_y_guardar_registros(archivo, cls.COLUMNAS_ADICIONALES, rows)
            return servicio
        except Exception as e:
            return f"Error al actualizar servicio adicional: {str(e)}"

    @classmethod
    def delete_servicio(cls, servicio_id, tipo_servicio):
        archivo = config.SERVICIOS_GENERALES_DB_PATH if tipo_servicio.capitalize() == 'General' else config.SERVICIOS_ADICIONALES_DB_PATH
        columnas = cls.COLUMNAS_GENERALES if tipo_servicio.capitalize() == 'General' else cls.COLUMNAS_ADICIONALES
        cls._ensure_csv_exists(archivo, columnas)

        try:
            rows = []
            deleted = False
            with open(archivo, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                total_rows = 0
                for row in reader:
                    total_rows += 1
                    if str(row['ID_SERVICIO']) != str(servicio_id):
                        rows.append(row)
                deleted = len(rows) < total_rows

            if not deleted:
                raise ValueError("Servicio no encontrado")

            cls._ordenar_y_guardar_registros(archivo, columnas, rows)
            return True
        except Exception as e:
            return f"Error al eliminar servicio: {e}"

    @classmethod
    def consultar_por_id(cls, tipo_servicio, id_servicio):
        archivo = config.SERVICIOS_GENERALES_DB_PATH if tipo_servicio.capitalize() == 'General' else config.SERVICIOS_ADICIONALES_DB_PATH
        columnas = cls.COLUMNAS_GENERALES if tipo_servicio.capitalize() == 'General' else cls.COLUMNAS_ADICIONALES
        cls._ensure_csv_exists(archivo, columnas)

        try:
            servicio_dict = None
            valores_dict = {}
            
            with open(archivo, 'r', newline='', encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    if str(row['ID_SERVICIO']) == str(id_servicio):
                        if servicio_dict is None:
                            servicio_dict = {
                                'id_servicio': int(row['ID_SERVICIO']),
                                'nombre': row['NOMBRE'],
                                'tipo_servicio': row['TIPO_SERVICIO'],
                                'valores' if tipo_servicio.capitalize() == 'General' else 'categorias': []
                            }
                        
                        if tipo_servicio.capitalize() == 'General':
                            categoria = row['CATEGORIA']
                            if categoria not in valores_dict:
                                valores_dict[categoria] = {
                                    'categoria': categoria,
                                    'grupos': []
                                }
                            valores_dict[categoria]['grupos'].append({
                                'id': int(row['GRUPO']),
                                'precio': float(row['PRECIO'])
                            })

            if servicio_dict:
                servicio_dict['valores' if tipo_servicio.capitalize() == 'General' else 'categorias'] = list(valores_dict.values())
                return servicio_dict
            return None
            
        except Exception as e:
            return f"Error al consultar servicio por ID: {e}"

    @classmethod
    def consultar_por_nombre(cls, tipo_servicio, nombre):
        archivo = config.SERVICIOS_GENERALES_DB_PATH if tipo_servicio.capitalize() == 'General' else config.SERVICIOS_ADICIONALES_DB_PATH
        if not os.path.exists(archivo):
            return None

        try:
            with open(archivo, 'r', newline='',encoding="utf-8") as df:
                reader = csv.DictReader(df, delimiter=';')
                for row in reader:
                    if row['NOMBRE'] == nombre:
                        return row
            return None
        except Exception as e:
            return f"Error al consultar servicio por nombre: {e}"

    @classmethod
    def calcular_valores_factura(cls, servicios: list) -> dict:
        """Calcula el subtotal, descuento y total de los servicios"""
        try:
            subtotal = sum(float(servicio['valor']) * float(servicio.get('cantidad', 1)) 
                          for servicio in servicios)
            
            return {
                'subtotal': round(subtotal, 2),
                'total': subtotal
            }
        except Exception as e:
            return f"Error al calcular valores: {e}"

    @classmethod
    def aplicar_descuento(cls, valores: dict, porcentaje_descuento: float) -> dict:
        """Aplica el descuento al total y calcula el valor del descuento"""
        try:
            if porcentaje_descuento < 0 or porcentaje_descuento > 100:
                raise ValueError("El descuento debe estar entre 0 y 100%")
            
            subtotal = valores['subtotal']
            vlr_descuento = round((subtotal * porcentaje_descuento) / 100, 2)
            total = round(subtotal - vlr_descuento, 2)
            
            return {
                'subtotal': subtotal,
                'descuento': porcentaje_descuento,
                'vlr_descuento': vlr_descuento,
                'total': total
            }
        except Exception as e:
            return f"Error al aplicar descuento: {e}"


from Core.Models.ClienteModel import ClienteModel as ClienteModel
from utilidades import config 
import csv
import os
from datetime import datetime

class ClientesServices:
    lista = []
    COLUMNAS_CSV = ['TIPO_DOCUMENTO', 'DOCUMENTO', 'NOMBRE', 'APELLIDO',
        'FECHA_NACI', 'TELEFONO', 'EMAIL']

    @classmethod
    def cargar_datos(cls):
        cls.lista.clear()
        try:
            if not os.path.exists(config.CLIENTES_DB_PATH):
                # Crear archivo con encabezados si no existe
                with open(config.CLIENTES_DB_PATH, 'w', newline='\n', encoding='utf-8') as df:
                    writer = csv.writer(df, delimiter=';')
                    writer.writerow(cls.COLUMNAS_CSV)
                return

            with open(config.CLIENTES_DB_PATH, newline='\n', encoding='utf-8') as df:
                reader = csv.DictReader(df, delimiter=';', fieldnames=cls.COLUMNAS_CSV)
                next(reader)  # Saltar encabezados
                for row in reader:
                    cliente = ClienteModel(
                        tipo_doc=row['TIPO_DOCUMENTO'],
                        documento=row['DOCUMENTO'],
                        nombre=row['NOMBRE'],
                        apellido=row['APELLIDO'],
                        fec_nacimiento=datetime.strptime(row['FECHA_NACI'], '%Y-%m-%d').date(),
                        telefono=row['TELEFONO'],
                        email=row['EMAIL']
                    )
                    cls.lista.append(cliente)
        except FileNotFoundError:
            print(f"Error: El archivo {config.CLIENTES_DB_PATH} no se encontró.")
        except Exception as e:
            print(f"Error al leer el archivo: {e}")

    @classmethod
    def agregar(cls, cliente: ClienteModel):
        cls.cargar_datos()
        cliente.nombre = cliente.nombre.capitalize()
        cliente.apellido = cliente.apellido.capitalize()
        
        # Verificar duplicados
        if any(c.documento == cliente.documento for c in cls.lista):
            return f"Error: El cliente con la cédula {cliente.documento} ya existe."
        
        try:
            archivo_existe = os.path.exists(config.CLIENTES_DB_PATH)
            modo = 'a' if archivo_existe else 'w'
            
            with open(config.CLIENTES_DB_PATH, mode=modo, newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                if not archivo_existe:
                    writer.writeheader()
                
                writer.writerow({
                    'TIPO_DOCUMENTO': cliente.tipo_doc,
                    'DOCUMENTO': cliente.documento,
                    'NOMBRE': cliente.nombre,
                    'APELLIDO': cliente.apellido,
                    'FECHA_NACI': cliente.fec_nacimiento.strftime('%Y-%m-%d'),
                    'TELEFONO': cliente.telefono,
                    'EMAIL': cliente.email
                })
                
            cls.lista.append(cliente)
            return f"Cliente {cliente.nombre} {cliente.apellido} agregado exitosamente."
        except Exception as e:
            return f"Error al escribir en el archivo: {e}"

    @classmethod
    def actualizar(cls, cliente: ClienteModel):
        cls.cargar_datos()
        for i, c in enumerate(cls.lista):
            if c.documento == cliente.documento:
                cls.lista[i] = cliente
                try:
                    with open(config.CLIENTES_DB_PATH, mode='w', newline='\n', encoding='utf-8') as df:
                        writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                        writer.writeheader()
                        
                        for c in cls.lista:
                            writer.writerow({
                                'TIPO_DOCUMENTO': c.tipo_doc,
                                'DOCUMENTO': c.documento,
                                'NOMBRE': c.nombre,
                                'APELLIDO': c.apellido,
                                'FECHA_NACI': c.fec_nacimiento,
                                'TELEFONO': c.telefono,
                                'EMAIL': c.email
                            })
                    return f"Cliente {cliente.nombre} {cliente.apellido} actualizado exitosamente."
                except Exception as e:
                    return f"Error al escribir en el archivo: {e}"
        return f"Error: El cliente con la cédula {cliente.documento} no existe."
    
    @classmethod
    def buscar(cls, documento):
        cls.cargar_datos()
        for cliente in cls.lista:
            if cliente.documento == documento:
                return cliente
        return None    
    
    @classmethod
    def eliminar(cls, documento: str):
        cls.cargar_datos()
        
        # Buscar el cliente a eliminar
        cliente_a_eliminar = None
        for i, cliente in enumerate(cls.lista):
            if cliente.documento == documento:
                cliente_a_eliminar = cls.lista.pop(i)
                break
        
        if not cliente_a_eliminar:
            return f"Error: El cliente con la cédula {documento} no existe."
        
        try:
            # Reescribir el archivo sin el cliente eliminado
            with open(config.CLIENTES_DB_PATH, mode='w', newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                writer.writeheader()
                
                for c in cls.lista:
                    writer.writerow({
                        'TIPO_DOCUMENTO': c.tipo_doc,
                        'DOCUMENTO': c.documento,
                        'NOMBRE': c.nombre,
                        'APELLIDO': c.apellido,
                        'FECHA_NACI': c.fec_nacimiento,
                        'TELEFONO': c.telefono,
                        'EMAIL': c.email
                    })
            return f"Cliente {cliente_a_eliminar.nombre} {cliente_a_eliminar.apellido} eliminado exitosamente."
        except Exception as e:
            return f"Error al escribir en el archivo: {e}"
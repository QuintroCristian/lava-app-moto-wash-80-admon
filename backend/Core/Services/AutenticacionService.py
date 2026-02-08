from Core.Models.UserModel import UserModel
from utilidades import config
import csv
import hashlib
import os

class AuthService:
    users = []
    COLUMNAS_CSV = ['USUARIO', 'NOMBRE','APELLIDO','CLAVE', 'ROL']

    @classmethod
    def cargar_usuarios(cls):
        cls.users.clear()
        try:
            if not os.path.exists(config.USERS_DB_PATH):
                with open(config.USERS_DB_PATH, 'w', newline='\n', encoding='utf-8') as df:
                    writer = csv.writer(df, delimiter=';')
                    writer.writerow(cls.COLUMNAS_CSV)
                return

            with open(config.USERS_DB_PATH, newline='\n', encoding='utf-8') as df:
                reader = csv.DictReader(df, delimiter=';', fieldnames=cls.COLUMNAS_CSV)
                next(reader)  # Saltar encabezados
                for row in reader:
                    user = UserModel(
                        usuario=row['USUARIO'].upper(),
                        nombre=row['NOMBRE'],
                        apellido=row['APELLIDO'],
                        clave=row['CLAVE'],
                        rol=row['ROL']
                    )
                    cls.users.append(user)
        except FileNotFoundError:
            print(f"Error: El archivo {config.USERS_DB_PATH} no se encontró.")
        except Exception as e:
            print(f"Error al leer el archivo: {e}")

    @classmethod
    def registrar_usuario(cls, user: UserModel):
        user.usuario = user.usuario.upper()
        user.nombre = user.nombre.capitalize()
        user.apellido = user.apellido.capitalize()
        user.rol = user.rol.upper()        

        cls.cargar_usuarios()
        
        if any(u.usuario == user.usuario for u in cls.users):
            return f"Error: El usuario {user.usuario} ya existe."

        hashed_clave = hashlib.sha256(user.clave.encode()).hexdigest()
        user.clave = hashed_clave

        try:
            archivo_existe = os.path.exists(config.USERS_DB_PATH)
            modo = 'a' if archivo_existe else 'w'
            
            with open(config.USERS_DB_PATH, mode=modo, newline='\n', encoding='utf-8') as df:
                writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                if not archivo_existe:
                    writer.writeheader()
                
                writer.writerow({
                    'USUARIO': user.usuario,
                    'NOMBRE': user.nombre,
                    'APELLIDO': user.apellido,
                    'CLAVE': user.clave,
                    'ROL': user.rol
                    })

            cls.users.append(user)
            return f"Usuario {user.usuario} registrado exitosamente."
        except Exception as e:
            return f"Error al escribir en el archivo: {e}"

    @classmethod
    def verificar_credenciales(cls, usuario: str, clave: str):
        usuario = usuario.upper()
        cls.cargar_usuarios()
        hashed_clave = hashlib.sha256(clave.encode()).hexdigest()
        
        for user in cls.users:
            if user.usuario == usuario and user.clave == hashed_clave:
                return user
        return None
            
    @classmethod
    def obtener_usuario(cls, usuario: str):
        cls.cargar_usuarios()
        usuario = usuario.upper()
        for user in cls.users:
            if user.usuario == usuario:
                return user
        return None

    @classmethod
    def actualizar_usuario(cls, user: UserModel):
        cls.cargar_usuarios()
        user.usuario = user.usuario.upper()
        
        for i, u in enumerate(cls.users):
            if u.usuario == user.usuario:
                # Solo actualizar la clave si se proporciona una nueva
                if user.clave is None:
                    user.clave = u.clave
                else:
                    user.clave = hashlib.sha256(user.clave.encode()).hexdigest()
                
                cls.users[i] = user
                
                try:
                    with open(config.USERS_DB_PATH, mode='w', newline='\n', encoding='utf-8') as df:
                        writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                        writer.writeheader()
                        for usuario in cls.users:
                            writer.writerow({
                                'USUARIO': usuario.usuario,
                                'NOMBRE': usuario.nombre,
                                'APELLIDO': usuario.apellido,
                                'CLAVE': usuario.clave,
                                'ROL': usuario.rol
                            })
                    return f"Usuario {user.usuario} actualizado exitosamente."
                except Exception as e:
                    return f"Error al escribir en el archivo: {e}"
        return f"Error: El usuario {user.usuario} no existe."

    @classmethod
    def eliminar_usuario(cls, usuario: str):
        usuario = usuario.upper()
        cls.cargar_usuarios()
        
        for i, u in enumerate(cls.users):
            if u.usuario == usuario:
                del cls.users[i]
                try:
                    with open(config.USERS_DB_PATH, mode='w', newline='\n', encoding='utf-8') as df:
                        writer = csv.DictWriter(df, fieldnames=cls.COLUMNAS_CSV, delimiter=';')
                        writer.writeheader()
                        for user in cls.users:
                            writer.writerow({
                                'USUARIO': user.usuario,
                                'NOMBRE': user.nombre,
                                'APELLIDO': user.apellido,
                                'CLAVE': user.clave,
                                'ROL': user.rol
                            })
                    return f"Usuario {usuario} eliminado exitosamente."
                except Exception as e:
                    return f"Error al escribir en el archivo: {e}"
        return f"Error: El usuario {usuario} no existe."

    @classmethod
    def listar_usuarios(cls):
        cls.cargar_usuarios()
        return cls.users

    @classmethod
    def obtener_usuarios_sin_clave(cls):
        cls.cargar_usuarios()
        return [
            {
                'usuario': user.usuario,
                'nombre': user.nombre,
                'apellido': user.apellido,
                'rol': user.rol
            } 
            for user in cls.users
        ]

    @classmethod
    def obtener_usuario_sin_clave(cls, usuario: str):
        usuario = usuario.upper()
        user = cls.obtener_usuario(usuario)
        if user:
            return {
                'usuario': user.usuario,
                'nombre': user.nombre,
                'apellido': user.apellido,
                'rol': user.rol
            }
        return None
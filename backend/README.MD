# SPA Car Backend

Una API RESTful para la gestión de un SPA de automóviles, construida con FastAPI y Python.

## Estructura Completa del Proyecto

- `main.py`: Punto de entrada de la aplicación.
- `ClienteModel.py`: Define el modelo de datos para los clientes.
- `ClienteServices.py`: Contiene los servicios para gestionar los datos de los clientes.
- `config.py`: Archivo de configuración que contiene rutas y otros parámetros de configuración.
- `utilidades.py`: Utilidades varias que ayudan en diferentes tareas del proyecto.
- `Web_API/Controllers/Cliente_controller.py`: Controlador que maneja las rutas y las solicitudes relacionadas con los clientes.
- `DbContext/clientes.csv`: Archivo CSV que almacena los datos de los clientes.
- `tests/`: Directorio que contiene las pruebas del proyecto.
- `Web_API/Controllers/`: Directorio que contiene los controladores de la API.
- `Core/Models/`: Directorio que contiene los modelos de datos.
- `Core/Models/VehiculoModel.py`: Define el modelo de datos para los vehículos.
- `Core/Models/UserModel.py`: Define el modelo de datos para los usuarios.
- `Core/Models/ServicioModel.py`: Define el modelo de datos para los servicios.

## Modelos de Datos

### Vehículo
El modelo Vehículo representa los autos que ingresan al SPA:
- placa: Identificador único del vehículo
- marca: Marca del vehículo
- modelo: Modelo del vehículo
- año: Año de fabricación
- color: Color del vehículo
- propietario_id: ID del cliente propietario

### Servicio
Representa los servicios disponibles en el SPA:
- id: Identificador único del servicio
- nombre: Nombre del servicio
- descripcion: Descripción detallada
- precio: Costo del servicio
- duracion: Tiempo estimado del servicio

### Usuario
Define los usuarios del sistema:
- id: Identificador único
- usuario: Nombre de usuario
- rol: Rol en el sistema (admin/operador)
- estado: Estado del usuario (activo/inactivo)

### Factura
El modelo Factura gestiona la facturación de servicios:
- numero: str (PK) - Número único de factura
- fecha_emision: datetime - Fecha y hora de emisión
- cliente_id: str (FK) - ID del cliente
- subtotal: float - Monto antes de impuestos
- iva: float - Impuesto al valor agregado
- total: float - Monto total a pagar
- estado: str (pendiente/pagada/anulada)
- metodo_pago: str (efectivo/tarjeta/transferencia)

### DetalleFactura
Representa los items individuales en una factura:
- id: int (PK)
- factura_id: str (FK)
- servicio_id: int (FK)
- cantidad: int
- precio_unitario: float
- subtotal: float

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## Instalación

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd spa_car_backend
    ```

2. Crea y activa un entorno virtual:

    ```sh
    python -m venv venv
    venv\Scripts\activate  # En Windows
    # source venv/bin/activate  # En macOS y Linux
    ```

3. Instala las dependencias:

    ```sh
    pip install -r requirements.txt
    ```

## Uso

1. Ejecuta la aplicación:

    ```sh
    uvicorn main:app --reload
    ```

2. La API estará disponible en `http://127.0.0.1:8001`.

## Endpoints

- `GET /clientes/{cliente_id}`: Obtiene la información de un cliente por su ID.
- `POST /clientes/agregar/`: Agrega un nuevo cliente.
- `PUT /clientes/actualizar/{cliente_id}`: Actualiza la información de un cliente existente.
- `DELETE /clientes/eliminar/{cliente_id}`: Elimina un cliente por su ID.

## Endpoints Adicionales

### Vehículos
- `GET /vehiculos/`: Lista todos los vehículos
- `GET /vehiculos/{placa}`: Obtiene un vehículo específico
- `POST /vehiculos/`: Registra un nuevo vehículo
- `PUT /vehiculos/{placa}`: Actualiza información del vehículo
- `DELETE /vehiculos/{placa}`: Elimina un vehículo

### Servicios
- `GET /servicios/`: Lista todos los servicios disponibles
- `GET /servicios/{id}`: Obtiene detalles de un servicio
- `POST /servicios/`: Crea un nuevo servicio
- `PUT /servicios/{id}`: Actualiza un servicio
- `DELETE /servicios/{id}`: Elimina un servicio

### Usuarios
- `POST /usuarios/login`: Autenticación de usuarios
- `POST /usuarios/registro`: Registro de nuevos usuarios
- `PUT /usuarios/{id}`: Actualización de datos de usuario
- `GET /usuarios/perfil`: Obtiene el perfil del usuario actual

### Facturas
- `GET /api/facturas/`: Lista todas las facturas
- `GET /api/facturas/{numero}`: Obtiene una factura específica
- `GET /api/facturas/cliente/{cliente_id}`: Lista facturas de un cliente
- `POST /api/facturas/`: Genera una nueva factura
- `PUT /api/facturas/{numero}/estado`: Actualiza el estado de la factura
- `GET /api/facturas/reporte`: Genera reporte de facturación
- `POST /api/facturas/{numero}/anular`: Anula una factura

### Configuración
- `GET /config/`: Obtiene la configuración actual del sistema
- `PATCH /config/`: Actualiza parcialmente la configuración
- `PUT /config/reset`: Restaura la configuración por defecto

## Manejo de Errores

La API maneja diferentes tipos de errores y devuelve respuestas adecuadas:

- `404 Not Found`: Cuando no se encuentra un cliente con el ID proporcionado.
- `400 Bad Request`: Cuando los datos proporcionados en la solicitud no son válidos.
- `500 Internal Server Error`: Cuando ocurre un error inesperado en el servidor.

## Archivos Principales

### `ClienteModel.py`

Define la clase `Cliente` que representa a un cliente del servicio de SPA para autos.

```python
class Cliente:
    def __init__(self, documento, nombre, apellido, fec_nacimiento, telefono, email):
        self.documento = documento
        self.nombre = nombre
        self.apellido = apellido
        self.fec_nacimiento = fec_nacimiento
        self.telefono = telefono
        self.email = email

    def to_dict(self):
        return {
            "documento": self.documento,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "fec_nacimiento": self.fec_nacimiento,
            "telefono": self.telefono,
            "email": self.email
        }
```

### `ClienteServices.py`

Contiene la clase `ClientesServices` que maneja la carga y búsqueda de datos de clientes.

```python
from Core.Models.ClienteModel import Cliente
from utilidades import config 
import csv

class ClientesServices:
    lista = []

    @classmethod
    def cargar_datos(cls):
        try:
            with open(config.DATABASE_PATH, newline='\n') as df:
                reader = csv.reader(df, delimiter=';')
                for documento, nombre, apellido, fec_nacimiento, telefono, email in reader:
                    cliente = Cliente(documento, nombre, apellido, fec_nacimiento, telefono, email)
                    cls.lista.append(cliente)
        except FileNotFoundError:
            print(f"Error: El archivo {config.DATABASE_PATH} no se encontró.")
        except Exception as e:
            print(f"Error al leer el archivo: {e}")

    @classmethod
    def buscar(self, documento):
        ClientesServices.cargar_datos()
        for cliente in self.lista:
            if cliente.documento == documento:
                return cliente
        return None
```

### `main.py`

Punto de entrada de la aplicación.

```python
from Web_API.Controllers.Cliente_controller import app

if __nombre__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
```

## Configuración

### `config.py`

Define las configuraciones necesarias para el proyecto, como la ruta a la base de datos.

```python
DATABASE_PATH = r'C:\ProyectoSPA\spa_car_backend\DbContext\clientes.csv'
Headers = {"Content-Type": "application/json, charset=utf-8"}
```

## Seguridad
- Autenticación mediante JWT (JSON Web Tokens)
- Roles y permisos configurables
- Encriptación de contraseñas con bcrypt
- Validación de datos en todas las peticiones

## Configuración Avanzada

### Variables de Entorno

## Contribuciones

## Módulos del Sistema

### 1. Módulo de Clientes
- **Modelo**: 
  - documento (PK): str
  - nombre: str
  - apellido: str
  - fec_nacimiento: date
  - telefono: str
  - email: str
  - direccion: str
  - ciudad: str
  - historial_servicios: List[Servicio]

- **Operaciones**:
  - Registro de clientes
  - Actualización de datos
  - Consulta de historial
  - Gestión de vehículos asociados
  - Reportes de servicios

### 2. Módulo de Vehículos
- **Modelo**:
  - placa (PK): str
  - marca: str
  - modelo: str
  - año: int
  - color: str
  - tipo: str (sedan/suv/pickup)
  - propietario_id: str
  - historial_servicios: List[Servicio]

- **Validaciones**:
  - Formato de placa
  - Año válido
  - Existencia del propietario

### 3. Módulo de Servicios
- **Modelo**:
  - id (PK): int
  - nombre: str
  - descripcion: str
  - precio: float
  - duracion: int
  - categoria: str
  - insumos_requeridos: List[str]
  - disponible: bool

- **Categorías**:
  - Lavado básico
  - Lavado premium
  - Encerado
  - Pulido
  - Detallado interior
  - Tratamiento de pintura

### 4. Módulo de Usuarios
- **Modelo**:
  - id (PK): str
  - usuario: str
  - password_hash: str
  - rol: str
  - estado: str
  - ultimo_acceso: datetime
  - permisos: List[str]

- **Roles**:
  - ADMIN: Acceso total
  - OPERADOR: Gestión servicios
  - RECEPCIONISTA: Clientes y citas
  - CLIENTE: Consultas propias

### 5. Módulo de Configuración
- **Modelo**:
  - empresa: EmpresaModel
  - tema: TemaModel

- **Operaciones**:
  - Obtener configuración actual
  - Actualizar configuración parcialmente
  - Restablecer configuración a valores por defecto

### Configuración

#### Modelo de Datos (ConfigModel)

## Módulo de Autenticación

### Descripción
El módulo de autenticación gestiona el registro, autenticación y administración de usuarios en el sistema.

### Endpoints

- `POST /usuarios/login`: Autenticación de usuarios.
- `POST /usuarios/registro`: Registro de nuevos usuarios.
- `PUT /usuarios/`: Actualización de datos de usuario.
- `DELETE /usuarios/`: Eliminación de usuarios.

### Modelos de Datos

#### UserModel
Define los usuarios del sistema:
- `usuario`: Nombre de usuario.
- `nombre`: Nombre del usuario.
- `apellido`: Apellido del usuario.
- `clave`: Contraseña del usuario.
- `rol`: Rol en el sistema (admin/operador).

#### Usermodificar_facturaModel
Modelo utilizado para actualizar la información de un usuario:
- `usuario`: Nombre de usuario.
- `nombre`: Nombre del usuario.
- `apellido`: Apellido del usuario.
- `clave`: Contraseña del usuario (opcional).
- `rol`: Rol en el sistema (admin/operador).

### Servicios

#### AuthService
Clase que proporciona métodos para gestionar usuarios:
- `cargar_usuarios()`: Carga los usuarios desde el archivo CSV.
- `registrar_usuario(user: UserModel)`: Registra un nuevo usuario.
- `verificar_credenciales(usuario: str, clave: str)`: Verifica las credenciales de un usuario.
- `obtener_usuario(usuario: str)`: Obtiene un usuario por su nombre de usuario.
- `actualizar_usuario(user: UserModel)`: Actualiza la información de un usuario.
- `eliminar_usuario(usuario: str)`: Elimina un usuario.
- `listar_usuarios()`: Lista todos los usuarios.
- `obtener_usuarios_sin_clave()`: Obtiene todos los usuarios sin incluir sus contraseñas.
- `obtener_usuario_sin_clave(usuario: str)`: Obtiene un usuario sin incluir su contraseña.

### Ejemplo de Uso

#### Registro de Usuario

## Documentación Técnica Completa

### Arquitectura del Sistema

El sistema está construido siguiendo una arquitectura en capas:

1. **Capa de Presentación (API)**
   - Controllers: Manejo de endpoints HTTP
   - Middleware: Autenticación y validación
   - DTOs: Objetos de transferencia de datos

2. **Capa de Negocio**
   - Services: Lógica de negocio
   - Validators: Validación de reglas de negocio
   - Mappers: Transformación de datos

3. **Capa de Datos**
   - Models: Entidades del dominio
   - Repositories: Acceso a datos
   - Context: Gestión de archivos CSV

### Patrones de Diseño

- **Repository Pattern**: Abstracción del acceso a datos
- **Service Layer**: Encapsulación de lógica de negocio
- **DTO Pattern**: Transferencia de datos entre capas
- **Factory Method**: Creación de instancias

### Manejo de Datos

1. **Persistencia**
   - Archivos CSV como almacenamiento principal
   - Caché en memoria para optimizar lecturas
   - Transacciones atómicas en escrituras

2. **Validaciones**
   - Esquemas de datos con Pydantic
   - Validaciones de negocio en Services
   - Middleware de validación de requests

### API REST

1. **Convenciones**
   - Uso de métodos HTTP estándar
   - Respuestas con códigos HTTP apropiados
   - Versionado mediante URL (/api/v1/...)

2. **Seguridad**
   - JWT para autenticación
   - Rate limiting por IP/usuario
   - Sanitización de inputs
   - CORS configurado

### Rendimiento

1. **Optimizaciones**
   - Caché en memoria de datos frecuentes
   - Paginación en listados largos
   - Compresión de respuestas HTTP

2. **Monitoreo**
   - Logging de operaciones críticas
   - Métricas de rendimiento
   - Trazabilidad de errores

### Pruebas

1. **Unitarias**
   - Cobertura de servicios principales
   - Mocking de dependencias
   - Casos de borde

2. **Integración**
   - Flujos completos de negocio
   - Pruebas de API end-to-end
   - Validación de respuestas

### Despliegue

1. **Requerimientos**
   - Python 3.8+
   - FastAPI
   - Uvicorn
   - Dependencias en requirements.txt

2. **Configuración**
   - Variables de entorno
   - Archivos de configuración
   - Logs y diagnóstico

### Mantenimiento

1. **Backup**
   - Respaldo diario de archivos CSV
   - Rotación de logs
   - Versión de configuraciones

2. **Actualizaciones**
   - Procedimiento de rollback
   - Migración de datos
   - Versionado de API

### Infraestructura

1. **Entornos**
   - Desarrollo: Localhost (127.0.0.1:8000)
   - Testing: Servidor de pruebas dedicado
   - Producción: Servidor con alta disponibilidad
   
2. **Recursos**
   - CPU: 2 cores mínimo recomendado
   - RAM: 4GB mínimo
   - Almacenamiento: 10GB para datos y logs
   - Red: 100Mbps mínimo

3. **Escalabilidad**
   - Horizontal: Múltiples instancias tras load balancer
   - Vertical: Incremento de recursos según demanda
   - Cache: Redis para datos frecuentes
   - Queue: RabbitMQ para procesos asíncronos

### Logging y Monitoreo

1. **Sistema de Logs**
   ```python
   # Estructura de logs
   {
     "timestamp": "2023-11-14T12:00:00Z",
     "level": "INFO|ERROR|WARNING",
     "service": "api|db|auth",
     "message": "Descripción del evento",
     "trace_id": "uuid4",
     "metadata": {}
   }
   ```

2. **Niveles de Log**
   - ERROR: Errores que requieren intervención
   - WARNING: Situaciones anómalas no críticas
   - INFO: Operaciones importantes completadas
   - DEBUG: Información detallada de desarrollo

3. **Métricas Clave**
   - Tiempo de respuesta API
   - Tasa de errores
   - Uso de recursos
   - Concurrencia de usuarios

### Estándares de Código

1. **Convenciones**
   - PEP 8 para estilo de código Python
   - Docstrings según PEP 257
   - Type hints según PEP 484
   - Nombres en español para mejor contexto

2. **Estructura de Clases**
   ```python
   class NombreClase:
       """Docstring describiendo la clase."""

       def __init__(self, param1: type1, param2: type2) -> None:
           """Docstring del constructor."""
           self.param1 = param1
           self.param2 = param2

       def metodo(self) -> return_type:
           """Docstring del método."""
           pass
   ```

3. **Manejo de Errores**
   ```python
   try:
       # Operación riesgosa
   except SpecificException as e:
       logger.error(f"Error específico: {str(e)}")
       raise CustomException(message="Mensaje amigable")
   ```

### Seguridad Avanzada

1. **Protección de Datos**
   - Encriptación en tránsito (TLS 1.3)
   - Datos sensibles hasheados (bcrypt)
   - Rotación periódica de claves
   - Auditoría de accesos

2. **Autenticación**
   ```python
   # Estructura JWT
   {
     "header": {"alg": "HS256", "typ": "JWT"},
     "payload": {
       "sub": "user_id",
       "rol": "admin|operador|cliente",
       "exp": 1699969200
     }
   }
   ```

3. **Autorización**
   - RBAC (Role-Based Access Control)
   - Permisos granulares por endpoint
   - Validación de tokens en middleware

### Contribución y Desarrollo

1. **Flujo de Trabajo**
   ```bash
   # Crear rama feature
   git checkout -b feature/nombre-feature

   # Commit convencional
   git commit -m "feat(modulo): descripción"

   # Pull request
   - Title: feat(modulo): descripción corta
   - Body: Descripción detallada
   ```

2. **Control de Calidad**
   - Coverage mínimo: 80%
   - Linting: flake8
   - Type checking: mypy
   - Tests automáticos en CI

3. **Documentación**
   - Docstrings actualizados
   - README por módulo
   - Diagramas actualizados
   - Changelog mantenido

## Módulo de Vehículos (Documentación Técnica)

### Estructura del Módulo
- `Core/Models/VehiculoModel.py`: Modelo de datos
- `Core/Services/VehiculoServices.py`: Servicios y lógica de negocio
- `Web_API/Controllers/Vehiculo_controller.py`: Controlador REST
- `DbContext/vehiculos.csv`: Almacenamiento persistente

### Modelo de Datos (VehiculoModel)

## Módulo de Vehículos (Documentación Técnica Detallada)

### 1. Estructura y Componentes
#### 1.1 Archivos del Módulo
- **VehiculoModel.py**: 
  - Define la estructura de datos de vehículos
  - Implementa validaciones mediante Pydantic
  - Incluye tipos de datos fuertemente tipados
  - Maneja serialización/deserialización

- **VehiculoServices.py**:
  - Implementa lógica de negocio
  - Gestiona operaciones CRUD
  - Maneja persistencia en CSV
  - Implementa validaciones de negocio

- **Vehiculo_controller.py**:
  - Expone endpoints REST
  - Maneja autenticación/autorización
  - Implementa validaciones de entrada
  - Gestiona respuestas HTTP

#### 1.2 Almacenamiento
- **vehiculos.csv**:
  - Formato: CSV con delimitador ";"
  - Codificación: UTF-8
  - Campos normalizados
  - Manejo de backups automáticos

### 2. Funcionalidades Principales

#### 2.1 Gestión de Vehículos
- **Registro de Vehículos**:
  - Validación de placa única
  - Verificación de propietario existente
  - Normalización de datos (mayúsculas, espacios)
  - Asignación automática de categorías

- **Actualización de Datos**:
  - Modificación parcial o total
  - Preservación de histórico
  - Validación de cambios críticos
  - Notificación de actualizaciones

- **Consultas y Búsquedas**:
  - Por placa (identificador único)
  - Por propietario (múltiples vehículos)
  - Filtros combinados
  - Ordenamiento configurable

#### 2.2 Validaciones Implementadas
- **Placa**:
  - Formato según normativa
  - Unicidad en el sistema
  - Caracteres permitidos
  - Longitud válida (3-10 caracteres)

- **Datos del Vehículo**:
  - Marca registrada
  - Modelo existente
  - Año válido (1900-actual+1)
  - Categoría permitida

- **Relaciones**:
  - Propietario existente
  - Permisos de modificación
  - Servicios asociados
  - Histórico de cambios

### 3. API REST Detallada

#### 3.1 Endpoints Principales
```

## Módulo de Servicios (Documentación Técnica)

### Estructura del Módulo
- `Core/Models/ServicioModel.py`: Modelo de datos
- `Core/Services/ServicioServices.py`: Servicios y lógica de negocio
- `Web_API/Controllers/Servicio_controller.py`: Controlador REST
- `DbContext/servicios_generales.csv`: Almacenamiento persistente para servicios generales
- `DbContext/servicios_adicionales.csv`: Almacenamiento persistente para servicios adicionales

### Modelo de Datos (ServicioModel)

#### ServicioGeneralModel
Representa un servicio general con múltiples categorías y grupos de valores.
- `id_servicio`: Identificador único del servicio (opcional).
- `nombre`: Nombre del servicio.
- `tipo_servicio`: Tipo de servicio (General).
- `valores`: Lista de categorías y grupos de valores asociados.

#### ServicioAdicionalModel
Representa un servicio adicional con categorías y precios variables.
- `id_servicio`: Identificador único del servicio (opcional).
- `nombre`: Nombre del servicio.
- `tipo_servicio`: Tipo de servicio (Adicional).
- `categorias`: Lista de categorías asociadas.
- `precio_variable`: Indica si el precio es variable.
- `variable`: Unidad de medida para el precio variable.
- `precio_base`: Precio base del servicio.

### Servicios (ServicioServices)

#### Métodos Principales

- `agregarGeneral(servicio: ServicioGeneralModel)`: Agrega un nuevo servicio general.
- `agregarAdicional(servicio: ServicioAdicionalModel)`: Agrega un nuevo servicio adicional.
- `consultar_todos(tipo_servicio: str)`: Consulta todos los servicios de un tipo específico.
- `consultar_por_id(tipo_servicio: str, id_servicio: int)`: Consulta un servicio por su ID.
- `consultar_por_nombre(tipo_servicio: str, nombre: str)`: Consulta un servicio por su nombre.
- `update_servicio_general(servicio: ServicioGeneralModel)`: Actualiza un servicio general existente.
- `update_servicio_adicional(servicio: ServicioAdicionalModel)`: Actualiza un servicio adicional existente.
- `delete_servicio(servicio_id: int, tipo_servicio: str)`: Elimina un servicio por su ID y tipo.
- `calcular_valores_factura(servicios: list)`: Calcula el subtotal y total de una lista de servicios.
- `aplicar_descuento(valores: dict, porcentaje_descuento: float)`: Aplica un descuento a los valores calculados.

### Controlador (Servicio_controller)

#### Endpoints

- `GET /servicios/`: Obtiene servicios por diferentes criterios.
- `POST /servicios/`: Crea un nuevo servicio.
- `PUT /servicios/`: Actualiza un servicio existente.
- `DELETE /servicios/`: Elimina un servicio.

### Almacenamiento

- **servicios_generales.csv**: Almacenamiento para servicios generales.
- **servicios_adicionales.csv**: Almacenamiento para servicios adicionales.

### Validaciones Implementadas

- **Nombre del Servicio**:
  - Longitud mínima de 3 caracteres.
  - Longitud máxima de 100 caracteres.
  - Unicidad del nombre del servicio.

- **Categorías y Grupos**:
  - Validación de categorías y grupos asociados a servicios generales.
  - Validación de categorías y precios variables para servicios adicionales.

### Ejemplo de Uso

#### Registro de Servicio General


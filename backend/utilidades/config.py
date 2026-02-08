from pathlib import Path

# Base directory configuration
BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR / "DbContext"

# Database paths
CLIENTES_DB_PATH = DB_DIR / "clientes.csv"
USERS_DB_PATH = DB_DIR / "usuarios.csv"
VEHICULOS_DB_PATH = DB_DIR / "vehiculos.csv"
FACTURAS_DB_PATH = DB_DIR / "facturas.csv"
CONFIG_FILE = DB_DIR / "config.json"
SERVICIOS_GENERALES_DB_PATH = DB_DIR / 'servicios_generales.csv'
SERVICIOS_ADICIONALES_DB_PATH = DB_DIR / 'servicios_adicionales.csv'
PROMOCIONES_DB_PATH = DB_DIR / 'promociones.csv'


# API Headers
Headers = {
    "Content-Type": "application/json, charset=utf-8"
}

# DATABASE_PATH = r'C:\ProyectoSPA\spa_car_backend\DbContext\clientes.csv'
# USERS_DB_PATH = r'C:\ProyectoSPA\spa_car_backend\DbContext\usuarios.csv'
# VEHICULOS_DB_PATH = r'C:\ProyectoSPA\spa_car_backend\DbContext\vehiculos.csv'
# SERVICIOS_DB_PATH = r'C:\ProyectoSPA\spa_car_backend\DbContext\servicios.csv'
# CONFIG_FILE = "DbContext/config.json"
# Headers = {"Content-Type": "application/json, charset=utf-8"}
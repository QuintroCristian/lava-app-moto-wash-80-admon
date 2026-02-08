from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from json.decoder import JSONDecodeError
from fastapi import HTTPException
from Web_API.Controllers.Cliente_controller import router as cliente_router
from Web_API.Controllers.Auth_Controller import router as auth_router
from Web_API.Controllers.Vehiculo_controller import router as vehiculo_router
from Web_API.Controllers.Servicio_controller import router as servicio_router
from Web_API.Controllers.ConfigController import router as config_router
from Web_API.Controllers.Promociones_controller import router as promocion_router
from Web_API.Controllers.Facturas_Controller import router as facturas_router
from Web_API.Controllers.Reportes_Controller import router as reportes_router

from Web_API.middleware.exception_handlers import (
    validation_exception_handler,
    json_decode_exception_handler,
    http_exception_handler,
    general_exception_handler
)

app = FastAPI(
    title="API de SPA CAR WASH",
    description="Esta API permite gestionar clientes, vehículos, realizar autenticación de usuarios y configuraciones de empresa",
    default_response_class=JSONResponse
)

api_router = APIRouter(prefix="/api")
api_router.include_router(cliente_router, prefix="/clientes", tags=["Clientes"])
api_router.include_router(auth_router, prefix="/usuarios", tags=["Usuarios"])
api_router.include_router(vehiculo_router, prefix="/vehiculos", tags=["Vehículos"])
api_router.include_router(servicio_router, prefix="/servicios", tags=["Servicios"])
api_router.include_router(config_router, prefix="/configuracion", tags=["Configuracion"])
api_router.include_router(promocion_router, prefix="/promociones", tags=["Promociones"])

api_router.include_router(facturas_router, prefix="/facturas", tags=["Facturas"])
api_router.include_router(reportes_router, prefix="/reportes", tags=["Reportes"])

app.include_router(api_router)

# Agregar los manejadores de excepciones
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(JSONDecodeError, json_decode_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen. Cambiar a dominios específicos en producción.
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

if __name__ == "__main__":
    import uvicorn
    # Change the run command to use the module path instead of the app instance
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
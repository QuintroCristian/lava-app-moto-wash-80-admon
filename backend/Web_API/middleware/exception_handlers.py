from fastapi import Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from json.decoder import JSONDecodeError
from utilidades.responses import error_response

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    simplified_errors = []
    
    for error in exc.errors():
        field = error["loc"][-1] if error.get("loc") else "unknown"
        simplified_errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message="Error de validación en los datos enviados",
        error_type="ValidationError",
        extra_data={"errors": simplified_errors}
    )

async def json_decode_exception_handler(request: Request, exc: JSONDecodeError):
    return error_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        message="Error en el formato JSON",
        error_type="JsonDecodeError",
        extra_data={"detail": str(exc)}
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    return error_response(
        status_code=exc.status_code,
        message=exc.detail,
        error_type="HTTPException",
        extra_data={"headers": exc.headers}
    )

async def general_exception_handler(request: Request, exc: Exception):
    return error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="Internal Server Error",
        error_type=exc.__class__.__name__,
        extra_data={"detail": str(exc)}
    )
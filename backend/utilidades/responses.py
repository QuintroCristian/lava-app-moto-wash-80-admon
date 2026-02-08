from fastapi.responses import JSONResponse
from utilidades import config

def error_response(status_code: int, message: str, error_type: str = "Error", extra_data: dict = None):
    content = {
        "status": "error",
        "type": error_type,
        "message": message,
        "code": status_code
    }
    
    if extra_data:
        content.update(extra_data)
        
    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=config.Headers
    )

def success_response(data, message: str = None, status_code: int = 200):
    content = {
        "status": "success",
        "code": status_code,
        "data": data
    }
    if message:
        content["message"] = message
        
    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=config.Headers
    )
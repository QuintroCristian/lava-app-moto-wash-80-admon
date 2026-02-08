from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from utilidades.responses import error_response

class ReporteFiltro(BaseModel):
    fecha_inicio: Optional[str] = None
    fecha_fin: Optional[str] = None

    def validar_fechas(self):
        if (self.fecha_inicio and not self.fecha_fin) or (self.fecha_fin and not self.fecha_inicio):
            return error_response(
                message="Se deben proporcionar ambas fechas o ninguna",
                status_code=400
            )

        if self.fecha_inicio and self.fecha_fin:
            try:
                fecha_inicio_dt = datetime.strptime(self.fecha_inicio, '%Y-%m-%d')
                fecha_fin_dt = datetime.strptime(self.fecha_fin, '%Y-%m-%d')
                
                if fecha_fin_dt < fecha_inicio_dt:
                    return error_response(
                        message="La fecha fin no puede ser anterior a la fecha inicio",
                        status_code=400
                    )
            except ValueError:
                return error_response(
                    message="Formato de fecha inválido. Use YYYY-MM-DD",
                    status_code=400
                )
        return None


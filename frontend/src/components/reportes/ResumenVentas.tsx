import { ResumenResponse } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumenVentasProps {
  resumen: ResumenResponse;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function ResumenVentasReporte({ resumen }: ResumenVentasProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Resumen General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
                <p className="text-2xl font-bold">{formatCurrency(resumen.total_ventas)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Facturas</p>
                <p className="text-xl font-semibold">{resumen.numero_facturas}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Periodo</p>
                <p className="text-sm">{resumen.fecha_inicio} - {resumen.fecha_fin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-2">
          {resumen.ventas_medios_pago.map((medio) => (
            <Card key={medio.medio_pago} className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {medio.medio_pago === "EF" ? "Efectivo" :
                    medio.medio_pago === "TD" ? "T. Débito" :
                      medio.medio_pago === "TC" ? "T. Crédito" : "Transferencia"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{formatCurrency(medio.total_ventas)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {medio.numero_facturas} facturas
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
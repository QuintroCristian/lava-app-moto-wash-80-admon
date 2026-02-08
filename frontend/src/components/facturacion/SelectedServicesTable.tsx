import { ServicioFactura } from "@/models/factura.model";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SelectedServicesTableProps {
  servicios: ServicioFactura[];
  onServiciosChange: (servicios: ServicioFactura[]) => void;
}

export function SelectedServicesTable({ servicios, onServiciosChange }: SelectedServicesTableProps) {

  const handleCantidadChange = (servicioId: number, value: string) => {
    // Reemplazar comas por puntos y limpiar el input
    const cleanValue = value.replace(',', '.');
    // Convertir a número y validar
    const cantidad = parseFloat(cleanValue);

    // Validar que la cantidad no sea negativa o NaN
    if (isNaN(cantidad) || cantidad < 0) {
      onServiciosChange(
        servicios.map(s =>
          s.id_servicio === servicioId ? { ...s, cantidad: 0 } : s
        )
      );
      return;
    }

    // Redondear a 2 decimales
    const cantidadRedondeada = Math.round(cantidad * 100) / 100;

    onServiciosChange(
      servicios.map(s =>
        s.id_servicio === servicioId ? { ...s, cantidad: cantidadRedondeada } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Servicio</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => {
            const total = servicio.valor * (servicio.cantidad || 0);

            return (
              <TableRow key={servicio.id_servicio}>
                <TableCell className="font-medium">{servicio.descripcion}</TableCell>
                <TableCell className="text-right">
                  ${servicio.valor.toLocaleString('es-CO')}
                </TableCell>
                <TableCell className="text-right">
                  {(servicio.precio_variable) ? (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
                      value={servicio.cantidad || ''}
                      onChange={(e) => handleCantidadChange(
                        servicio.id_servicio,
                        e.target.value
                      )}
                      className="w-14 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={!servicio.precio_variable}
                    />
                  ) : (
                    "1"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  ${total.toLocaleString('es-CO')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onServiciosChange(
                        servicios.filter((s) => s.id_servicio !== servicio.id_servicio)
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
import { useServicesStore } from "@/contexts/serviceStore";
import { ServicioFactura } from "@/models/factura.model";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ServiciosGeneralesProps {
  categoria: string;
  grupo: number;
  onServiceSelect: (servicio: ServicioFactura) => void;
  selectedServiceId?: number | null;
}

export function ListServiciosGenerales({
  categoria,
  grupo,
  onServiceSelect,
  selectedServiceId
}: ServiciosGeneralesProps) {
  const { serviciosGenerales, getPrecioServicioGeneral } = useServicesStore();

  const handleServiceSelect = (servicioId: string) => {
    const id = parseInt(servicioId);
    const servicio = serviciosGenerales.find(s => s.id_servicio === id);
    if (!servicio) return;

    const precio = getPrecioServicioGeneral(id, categoria, grupo) ?? 0;
    onServiceSelect({
      id_servicio: id,
      descripcion: servicio.nombre,
      valor: precio,
      cantidad: 1
    });
  };

  return (
    <RadioGroup
      value={selectedServiceId?.toString()}
      onValueChange={handleServiceSelect}
      className="grid grid-cols-3 gap-2"
    >
      {serviciosGenerales.map((servicio) => {
        const precio = getPrecioServicioGeneral(servicio?.id_servicio, categoria, grupo);
        return (
          <Card key={servicio.id_servicio} className="relative">
            <RadioGroupItem
              value={servicio.id_servicio ? servicio.id_servicio.toString() : ""}
              id={`servicio-${servicio.id_servicio}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`servicio-${servicio.id_servicio}`}
              className="flex flex-col justify-between p-4 h-20 cursor-pointer rounded-lg border-2 border-muted peer-data-[state=checked]:border-primary"
            >
              <span className="font-medium">{servicio.nombre}</span>
              <span className="text-sm text-muted-foreground">
                ${precio?.toLocaleString()}
              </span>
            </Label>
          </Card>
        );
      })}
    </RadioGroup>
  );
}
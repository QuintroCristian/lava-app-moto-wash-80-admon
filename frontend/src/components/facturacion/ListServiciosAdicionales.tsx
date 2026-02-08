import { useState } from "react";
import { Plus } from "lucide-react";
import { useServicesStore } from "@/contexts/serviceStore";
import { ServicioFactura } from "@/models/factura.model";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ListServiciosAdicionalesProps {
  categoria: string;
  serviciosSeleccionados: ServicioFactura[];
  onServiciosChange: (servicios: ServicioFactura[]) => void;
}

interface CustomService {
  descripcion: string;
  valor: number;
}

export function ListServiciosAdicionales({
  categoria,
  serviciosSeleccionados,
  onServiciosChange,
}: ListServiciosAdicionalesProps) {
  const { getServiciosAdicionalesByCategoria } = useServicesStore();
  const [customService, setCustomService] = useState<CustomService>({
    descripcion: "",
    valor: 0,
  });
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const serviciosDisponibles = getServiciosAdicionalesByCategoria(categoria);

  const handleServiceToggle = (servicioId: number, descripcion: string, precio: number, precio_variable: boolean | null) => {
    const isSelected = serviciosSeleccionados.some(s => s.id_servicio === servicioId);

    if (isSelected) {
      onServiciosChange(serviciosSeleccionados.filter(s => s.id_servicio !== servicioId));
    } else {
      onServiciosChange([
        ...serviciosSeleccionados,
        {
          id_servicio: servicioId,
          descripcion: descripcion,
          valor: precio,
          cantidad: 1,
          precio_variable: precio_variable
        },
      ]);
    }
  };

  const handleCustomServiceAdd = () => {
    if (customService.descripcion && customService.valor > 0) {
      onServiciosChange([
        ...serviciosSeleccionados,
        {
          id_servicio: 9999,
          descripcion: customService.descripcion,
          valor: customService.valor,
          cantidad: 1,
          precio_variable: true
        },
      ]);
      setCustomService({ descripcion: "", valor: 0 });
      setShowCustomDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {serviciosDisponibles.map((servicio) => {
          const isSelected = serviciosSeleccionados.some(
            (s) => s.id_servicio === servicio.id_servicio
          );

          return (
            <Card
              key={servicio.id_servicio}
              className={`relative cursor-pointer transition-colors hover:bg-accent ${isSelected ? 'border-2 border-primary' : ''}`}
              onClick={() =>
                handleServiceToggle(
                  servicio.id_servicio!,
                  servicio.nombre,
                  servicio.precio_base,
                  servicio.precio_variable
                )
              }
            >
              <Label className="flex flex-col justify-between p-4 h-20">
                <span className="font-medium">{servicio.nombre}</span>
                <span className="text-sm text-muted-foreground">
                  ${servicio.precio_base.toLocaleString()}
                  {servicio.precio_variable && ` ${servicio.variable}`}
                </span>
              </Label>
            </Card>
          );
        })}
      </div>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer bg-primary text-primary-foreground">
            <Label className="flex items-center text-lg font-bold justify-center p-4 h-20 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Agregar otro servicio
            </Label>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar servicio adicional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={customService.descripcion}
                onChange={(e) =>
                  setCustomService({ ...customService, descripcion: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Precio</Label>
              <Input
                type="number"
                value={customService.valor}
                onChange={(e) =>
                  setCustomService({
                    ...customService,
                    valor: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <Button onClick={handleCustomServiceAdd}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
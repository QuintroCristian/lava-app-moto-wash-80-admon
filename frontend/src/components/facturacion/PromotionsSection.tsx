import { useCallback, useEffect, useState } from "react";
import { parseISO, isWithinInterval, startOfDay, endOfDay, isBefore } from "date-fns";
import { promocionesService } from "@/api/promociones.service";
import { Promocion } from "@/models/promo.model";
import { handleApiResponse } from "@/utils/api-utils";
import { Label } from "@/components/ui/label";
import { UseFormSetValue } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FacturaCreada } from "@/models";
import { Checkbox } from "@/components/ui/checkbox";

interface PromotionsSectionProps {
  setValue: UseFormSetValue<FacturaCreada>;
}

export function PromotionsSection({ setValue }: PromotionsSectionProps) {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [selectedPromocion, setSelectedPromocion] = useState<number | null>(null);

  const adjustUTCDate = (dateStr: string | null, isEndDate: boolean = false) => {
    if (!dateStr) return undefined;
    const date = parseISO(dateStr);
    return isEndDate ? endOfDay(date) : startOfDay(date);
  };


  const isPromocionActiva = useCallback((promocion: Promocion) => {
    const now = new Date();
    const fechaInicio = promocion.fecha_inicio ? adjustUTCDate(promocion.fecha_inicio) : null;
    const fechaFin = promocion.fecha_fin ? adjustUTCDate(promocion.fecha_fin, true) : null;

    if (!fechaInicio && !fechaFin) return promocion.estado;

    if (fechaInicio && !fechaFin) {
      return promocion.estado && !isBefore(now, startOfDay(fechaInicio));
    }

    if (fechaInicio && fechaFin) {
      return promocion.estado && isWithinInterval(now, { start: fechaInicio, end: fechaFin });
    }

    return false;
  }, []);

  useEffect(() => {
    const fetchPromociones = async () => {
      const { success, data } = await handleApiResponse<Promocion[]>(
        () => promocionesService.getPromociones(),
        { showSuccessMessage: false }
      );

      if (success && data) {
        const promocionesActivas = data
          .filter(isPromocionActiva)
          .sort((a, b) => a.porcentaje - b.porcentaje);

        setPromociones(promocionesActivas);
        if (promocionesActivas.length > 0) {
          setValue("descuento", promocionesActivas[0].porcentaje);
        }
      }
    };

    fetchPromociones();
  }, [setValue, isPromocionActiva]);

  const handlePromocionChange = (checked: boolean, promocionId: number) => {
    if (checked) {
      const promocion = promociones.find(p => p.id_promocion === promocionId);
      setValue("descuento", promocion?.porcentaje || 0);
      setSelectedPromocion(promocionId);
    } else {
      setValue("descuento", 0);
      setSelectedPromocion(null);
    }
  };

  if (promociones.length === 0) {
    return <p className="text-muted-foreground">No hay promociones activas</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Promociones Disponibles</h3>
      <ScrollArea className="h-[calc(100vh-30rem)] pr-4">
        <div className="flex flex-col gap-2">
          {promociones.map((promocion) => (
            <div
              key={promocion.id_promocion}
              className="flex items-center space-x-0"
              onClick={() => handlePromocionChange(selectedPromocion !== promocion.id_promocion, promocion.id_promocion!)}
            >
              <div className="flex w-full items-center justify-between px-4 py-2 text-sm border rounded-md cursor-pointer hover:bg-muted data-[selected=true]:bg-primary/5 data-[selected=true]:border-primary/50" data-selected={selectedPromocion === promocion.id_promocion}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`promo-${promocion.id_promocion}`}
                    checked={selectedPromocion === promocion.id_promocion}
                    onCheckedChange={(checked) => handlePromocionChange(checked as boolean, promocion.id_promocion!)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={`promo-${promocion.id_promocion}`}
                    className="font-medium cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {promocion.descripcion}
                  </Label>
                </div>
                <span className="text-muted-foreground">{promocion.porcentaje}% descuento</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
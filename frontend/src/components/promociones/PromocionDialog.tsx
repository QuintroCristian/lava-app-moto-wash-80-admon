import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO, addHours } from "date-fns";
import { CalendarIcon, Percent } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Promocion } from "@/models";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { promocionesService } from "@/api/promociones.service";
import { handleApiResponse } from "@/utils/api-utils";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const promocionSchema = z.object({
  id_promocion: z.number().optional(),
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  fecha_inicio: z.string().nullable(),
  fecha_fin: z.string().nullable(),
  porcentaje: z.number()
    .min(1, "El porcentaje debe ser mayor a 0")
    .max(100, "El porcentaje no puede ser mayor a 100"),
  estado: z.boolean(),
});

interface PromocionDialogProps {
  promocion: Promocion | null;
  onSave: () => void;
  onCancel: () => void;
}

const adjustUTCDate = (dateStr: string | null) => {
  if (!dateStr) return undefined;
  const date = parseISO(dateStr);
  return addHours(date, 5);
};

export function PromocionDialog({ promocion, onSave, onCancel }: PromocionDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: promocion?.fecha_inicio ? adjustUTCDate(promocion.fecha_inicio) : undefined,
    to: promocion?.fecha_fin ? adjustUTCDate(promocion.fecha_fin) : undefined,
  }));

  const form = useForm<Promocion>({
    resolver: zodResolver(promocionSchema),
    defaultValues: {
      id_promocion: promocion?.id_promocion,
      descripcion: promocion?.descripcion || "",
      fecha_inicio: promocion?.fecha_inicio || null,
      fecha_fin: promocion?.fecha_fin || null,
      porcentaje: promocion?.porcentaje || 0,
      estado: promocion?.estado ?? true,
    },
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No seleccionada";
    // Ajustamos la fecha al formato deseado
    return format(date, "yyyy-MM-dd");
  };

  const onSelectDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
    form.setValue("fecha_inicio", range?.from ? format(range.from, "yyyy-MM-dd") : null);
    form.setValue("fecha_fin", range?.to ? format(range.to, "yyyy-MM-dd") : null);
  };

  const onSubmit = async (values: Promocion) => {
    const action = promocion
      ? () => promocionesService.updatePromocion({
        ...values,
        id_promocion: promocion.id_promocion,
      })
      : () => promocionesService.createPromocion(values);

    const { success } = await handleApiResponse(action);
    if (success) onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha_inicio"
          render={({ field: _ }) => (
            <FormItem>
              <FormLabel>Rango de Fechas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                          </>
                        ) : (
                          formatDate(dateRange.from)
                        )
                      ) : (
                        <span>Selecciona un rango de fechas</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={onSelectDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="porcentaje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje Descuento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    defaultValue={field.value ? 'true' : 'false'}
                    className="flex gap-4"
                  >
                    {[
                      { value: 'true', label: 'Activo', className: 'peer-data-[state=checked]:bg-primary/80 hover:bg-primary/20' },
                      { value: 'false', label: 'Inactivo', className: 'peer-data-[state=checked]:bg-red-600 hover:bg-red-100' }
                    ].map(({ value, label, className }) => (
                      <FormItem key={value} className="flex items-center space-x-0">
                        <FormControl>
                          <RadioGroupItem
                            value={value}
                            id={`estado-${value}`}
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`estado-${value}`}
                          className={cn(
                            "flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:text-white hover:text-black",
                            className
                          )}
                        >
                          {label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
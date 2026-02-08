import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { serviciosService } from "@/api/servicios.service";
import { handleApiResponse } from "@/utils/api-utils";
import { ServicioAdicional } from "@/models/service.model";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIAS,
  VARIABLES,
  getVariableLabel,
} from "@/constants/service.constants";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo_servicio: z.literal("Adicional"),
  categorias: z.array(z.string()).min(1, "Seleccione al menos una categoría"),
  precio_variable: z.boolean(),
  variable: z.enum(VARIABLES).nullable(),
  precio_base: z.number().min(1, "El precio base debe ser mayor a 1"),
}).refine((data) => {
  if (data.precio_variable) {
    return data.variable !== null;
  }
  return true;
}, {
  message: "Debe seleccionar una variable cuando el precio es variable",
  path: ["variable"]
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const parsePrice = (value: string) => {
  return Number(value.replace(/[^0-9-]/g, ''));
};

export function ServicioAdicionalForm({
  servicio,
  onSave,
  onCancel,
}: {
  servicio?: ServicioAdicional;
  onSave: () => void;
  onCancel: () => void;
}) {
  const defaultValues: ServicioAdicional = {
    nombre: servicio?.nombre || "",
    tipo_servicio: "Adicional",
    categorias: servicio?.categorias || [],
    precio_variable: servicio?.precio_variable || false,
    variable: servicio?.variable || null,
    precio_base: servicio?.precio_base || 0,
  };

  const form = useForm<ServicioAdicional>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchPrecioVariable = form.watch("precio_variable");

  const onSubmit = async (values: ServicioAdicional) => {
    const action = servicio
      ? () => serviciosService.updateServicio("Adicional", {
        ...values,
        id_servicio: servicio.id_servicio,
      })
      : () => serviciosService.createServicio("Adicional", values);

    const { success } = await handleApiResponse(action);
    if (success) {
      onSave();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="categorias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorías aplicables</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {CATEGORIAS.map((cat) => (
                        <ToggleGroupItem
                          key={cat}
                          value={cat}
                          variant={field.value.includes(cat) ? "default" : "outline"}
                          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border data-[state-on]:border-primary"
                        >
                          {cat}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio_variable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Precio Variable</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue('variable', null);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="precio_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Base</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={formatPrice(field.value)}
                      onChange={e => field.onChange(parsePrice(e.target.value))}
                      onBlur={e => {
                        const num = parsePrice(e.target.value);
                        e.target.value = formatPrice(num);
                        field.onChange(num);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchPrecioVariable && (
              <FormField
                control={form.control}
                name="variable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable</FormLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la variable" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VARIABLES.map((v) => (
                          <SelectItem key={v} value={v}>
                            {getVariableLabel(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
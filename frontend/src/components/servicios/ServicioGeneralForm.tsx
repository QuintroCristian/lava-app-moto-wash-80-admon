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
import { GRUPOS } from "@/constants/vehicle.constants";
import { ServicioGeneral } from "@/models/service.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIAS = {
  Moto: [101, 102, 103],
  Auto: [201, 202, 203],
  Cuatrimoto: [301],
};

const precioSchema = z.object({
  id: z.number(),
  precio: z.number().min(1, "El precio debe ser mayor a 0"),
});

const categoriaSchema = z.object({
  categoria: z.string(),
  grupos: z.array(precioSchema),
});

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo_servicio: z.literal("General"),
  valores: z.array(categoriaSchema),
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

export function ServicioGeneralForm({
  servicio,
  onSave,
  onCancel
}: {
  servicio?: ServicioGeneral,
  onSave: () => void,
  onCancel: () => void
}) {
  const defaultValues = servicio || {
    nombre: "",
    tipo_servicio: "General",
    valores: Object.entries(CATEGORIAS).map(([categoria, grupos]) => ({
      categoria,
      grupos: grupos.map(id => ({ id, precio: 0 })),
    })),
  };

  const form = useForm<ServicioGeneral>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: ServicioGeneral) => {
    const action = servicio
      ? () => serviciosService.updateServicio("General", {
        ...values,
        id_servicio: servicio.id_servicio,
      })
      : () => serviciosService.createServicio("General", values);

    const { success } = await handleApiResponse(action);
    if (success) {
      onSave();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
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

        <h2 className="mt-2 text-center text-lg font-semibold">Precios por categoría</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(CATEGORIAS).map(([categoria, grupos], catIndex) => (
            <Card key={categoria}>
              <CardHeader className="pb-2">
                <CardTitle>{categoria}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {grupos.map((grupoId, grupoIndex) => (
                    <FormField
                      key={grupoId}
                      control={form.control}
                      name={`valores.${catIndex}.grupos.${grupoIndex}.precio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{GRUPOS[grupoId]?.nombre || `Grupo ${grupoId}`}</FormLabel>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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
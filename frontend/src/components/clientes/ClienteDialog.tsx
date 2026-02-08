import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cliente } from "@/models";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientesService } from "@/api/clientes.service";
import { handleApiResponse } from "@/utils/api-utils";

const clienteSchema = z.object({
  tipo_doc: z.string().min(1, "Seleccione tipo de documento"),
  documento: z.string().min(3, "Debe tener al menos 3 caracteres"),
  nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
  apellido: z.string().min(3, "Debe tener al menos 3 caracteres"),
  fec_nacimiento: z.string()
    .min(1, "Ingrese fecha de nacimiento")
    .refine((date) => new Date(date) <= new Date(), {
      message: "La fecha no puede ser mayor al día actual"
    }),
  telefono: z.string()
    .min(7, "Debe tener al menos 7 caracteres")
    .regex(/^\d+$/, "Solo se permiten números"),
  email: z.string().email("Ingrese un email válido"),
});

const getCurrentDateUTC5 = () => {
  const date = new Date();
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const utc5Offset = 5 * 60 * 60000;
  return new Date(date.getTime() + userTimezoneOffset - utc5Offset).toISOString().split('T')[0];
};

interface ClienteDialogProps {
  cliente: Cliente | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ClienteDialog({ cliente, onSave, onCancel }: ClienteDialogProps) {
  const form = useForm<Cliente>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente || {
      tipo_doc: "",
      documento: "",
      nombre: "",
      apellido: "",
      fec_nacimiento: "",
      telefono: "",
      email: "",
    },
  });

  const onSubmit = async (data: Cliente) => {
    if (cliente) {
      const { success } = await handleApiResponse(() =>
        clientesService.updateCliente(data)
      );
      if (success) onSave();
    } else {
      const { success } = await handleApiResponse(() =>
        clientesService.createCliente(data)
      );
      if (success) onSave();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipo_doc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                    <SelectItem value="NIT">NIT</SelectItem>
                    <SelectItem value="PP">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fec_nacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="block"
                    max={getCurrentDateUTC5()}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}

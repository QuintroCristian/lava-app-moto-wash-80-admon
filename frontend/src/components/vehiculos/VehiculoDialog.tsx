import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Vehiculo, SegmentosPorCategoria, Cliente } from "@/models";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { vehiculosService } from "@/api/vehiculos.service";
import { handleApiResponse } from "@/utils/api-utils";
import { useEffect, useState } from "react";
import { calcularGrupo, getNombreGrupo } from "@/constants/vehicle.constants";
import { Search, Check, X, Loader2, Info } from "lucide-react";
import { clientesService } from "@/api/clientes.service";
import { Badge } from "@/components/ui/badge";

const nextYear = new Date().getFullYear() + 1;

const vehiculoSchema = z.object({
  placa: z.string().min(6, "Debe tener al menos 6 caracteres"),
  documento_cliente: z.string().min(3, "Documento del cliente requerido"),
  categoria: z.enum(['Moto', 'Auto', 'Cuatrimoto']),
  segmento: z.string().min(3, "Seleccione el segmento"),
  marca: z.string().min(3, "Ingrese la marca"),
  linea: z.string().min(3, "Ingrese la línea"),
  modelo: z.number()
    .min(1900, "Ingrese un año válido")
    .max(nextYear, `No puede ser mayor a ${nextYear}`),
  cilindrada: z.number().min(1, "Ingrese la cilindrada"),
  grupo: z.number(),
});

interface VehiculoDialogProps {
  vehiculo: Vehiculo | null;
  onSave: () => void;
  onCancel: () => void;
}

interface DocumentoInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  setError: (error: string | undefined) => void;
  setClienteName: (name: string) => void;
}

function DocumentoInput({ value, onChange, onBlur, setError, setClienteName }: DocumentoInputProps) {
  const [verificationState, setVerificationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const verifyDocument = async () => {
    if (!value) return;
    setVerificationState('loading');
    const { success, data } = await handleApiResponse<Cliente>(
      () => clientesService.getClientes(value),
      { showSuccessMessage: false, showErrorMessage: false }
    );

    if (success && data) {
      setVerificationState('success');
      setClienteName(`${data.nombre} ${data.apellido}`);
      setError(undefined);
    } else {
      setVerificationState('error');
      setClienteName('');
      setError("Cliente no encontrado");
    }
  };

  const icons = {
    idle: <Search className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />,
    success: <Check className="h-4 w-4 text-green-500" />,
    error: <X className="h-4 w-4 text-red-500" />
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setVerificationState('idle');
            setClienteName('');
          }}
          onBlur={onBlur}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={verifyDocument}
          disabled={verificationState === 'loading' || !value}
        >
          {icons[verificationState]}
        </Button>
      </div>
    </div>
  );
}

export function VehiculoDialog({ vehiculo, onSave, onCancel }: VehiculoDialogProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<'Moto' | 'Auto' | 'Cuatrimoto'>(
    vehiculo?.categoria || 'Moto'
  );
  const [isSegmentDisabled, setIsSegmentDisabled] = useState(false);
  const [clienteName, setClienteName] = useState<string>('');


  const form = useForm<Vehiculo>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: vehiculo || {
      placa: "",
      documento_cliente: "",
      categoria: "Moto",
      segmento: "",
      marca: "",
      linea: "",
      modelo: 0,
      cilindrada: 0,
      grupo: 0,
    },
  });

  const watchCategoria = form.watch("categoria");
  const watchCilindrada = form.watch("cilindrada");
  const watchSegmento = form.watch("segmento");

  useEffect(() => {
    const grupo = calcularGrupo(watchCategoria, watchCilindrada, watchSegmento);
    form.setValue("grupo", grupo);
  }, [watchCategoria, watchCilindrada, watchSegmento, form]);

  useEffect(() => {
    if (watchCategoria === "Cuatrimoto") {
      form.setValue("segmento", "Cuatrimoto");
      setIsSegmentDisabled(true);
    }
  }, [watchCategoria, form]);

  const onSubmit = async (data: Vehiculo) => {
    const { success } = await handleApiResponse(() =>
      vehiculo
        ? vehiculosService.updateVehiculo(data)
        : vehiculosService.createVehiculo(data)
    );
    if (success) onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="documento_cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento Cliente{clienteName && `: ${clienteName}`}</FormLabel>
                <FormControl>
                  <DocumentoInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    setError={(error) => {
                      if (error) {
                        form.setError("documento_cliente", { message: error });
                      } else {
                        form.clearErrors("documento_cliente");
                      }
                    }}
                    setClienteName={setClienteName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="placa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      setIsSegmentDisabled(true);
                      field.onChange(value);
                      setSelectedCategoria(value as 'Moto' | 'Auto' | 'Cuatrimoto');
                      form.setValue('segmento', '')
                      setTimeout(() => setIsSegmentDisabled(false), 100);
                    }}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-2 mt-0"
                  >
                    {['Moto', 'Auto', 'Cuatrimoto'].map((value) => (
                      <FormItem key={value} className="flex items-center space-x-0">
                        <FormControl>
                          <RadioGroupItem
                            value={value}
                            id={value}
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={value}
                          className="flex items-center justify-center px-3 py-2 mt-0 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted"
                        >
                          {value}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="segmento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segmento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSegmentDisabled || selectedCategoria === 'Cuatrimoto'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue aria-label="Seleccione segmento" placeholder="Seleccione segmento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SegmentosPorCategoria[selectedCategoria].map((segmento) => (
                      <SelectItem key={segmento} value={segmento}>
                        {segmento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Línea</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                    min={1900}
                    max={nextYear}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cilindrada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cilindrada</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grupo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo: {getNombreGrupo(field.value)}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end">
            <Badge variant="outline" className="flex items-center gap-2 py-2 px-3">
              <Info className="h-6 w-6" />
              <span>Grupo calculado automáticamente para facturación</span>
            </Badge>
          </div>

        </div>

        <div className="flex gap-4">
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Search, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { vehiculosService } from "@/api/vehiculos.service";
import { handleApiResponse } from "@/utils/api-utils";
import { Cliente, Vehiculo } from "@/models";
import { clientesService } from "@/api/clientes.service";
import { useServicesStore } from "@/contexts/serviceStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListServiciosGenerales } from "./ListServiciosGenerales";
import { ServicioFactura } from "@/models/factura.model";
import { MedioPago } from "@/constants/receipt.constants";
import { ListServiciosAdicionales } from "./ListServiciosAdicionales";
import { PaymentSection } from "./PaymentSection";
import { SelectedServicesTable } from "./SelectedServicesTable";
import { PromotionsSection } from "./PromotionsSection";

const facturaSchema = z.object({
  placa: z.string().min(6, "Debe tener al menos 6 caracteres"),
  fecha: z.string().optional(),
  id_cliente: z.string().min(3, "Documento del cliente requerido"),
  categoria: z.string().min(3, "Categoría requerida"),
  grupo: z.number(),
  medio_pago: z.custom<MedioPago>()
    .transform(val => val as MedioPago)
    .default('EF' as MedioPago),
  iva: z.number().default(0),
  vlr_iva: z.number().default(0),
  bruto: z.number().default(0),
  descuento: z.number().default(0),
  vlr_descuento: z.number().default(0),
  subtotal: z.number().default(0),
  total: z.number().default(0),
  servicios: z.array(z.object({
    id_servicio: z.number(),
    descripcion: z.string(),
    valor: z.number(),
    cantidad: z.number(),
    precio_variable: z.boolean().optional().nullable()
  }))
});

interface PlacaInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  setVehicleData: (vehicle: Vehiculo | null) => void;
  error?: string;
  setError: (error: string) => void;
}

function PlacaInput({ value, onChange, onBlur, setVehicleData, error, setError }: PlacaInputProps) {
  const [verificationState, setVerificationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const verifyPlaca = async () => {
    if (!value) return;
    setVerificationState('loading');
    const { success, data } = await handleApiResponse<Vehiculo>(
      () => vehiculosService.getVehiculos({ placa: value }),
      { showSuccessMessage: false, showErrorMessage: false }
    );

    if (success && data) {
      setVerificationState('success');
      setVehicleData(data);
      setError('');
    } else {
      setVerificationState('error');
      setVehicleData(null);
      setError('Vehículo no encontrado');
    }
  };

  const icons = {
    idle: <Search className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />,
    success: <Check className="h-4 w-4 text-green-500" />,
    error: <X className="h-4 w-4 text-red-500" />
  };

  return (
    <div>
      <div className="relative flex items-center">
        <Input
          value={value}
          onChange={(e) => {
            const newValue = e.target.value.toUpperCase();
            onChange(newValue);
            setVerificationState('idle');
            setError('');
            setVehicleData(null);
          }}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              verifyPlaca();
            }
          }}
          className={error ? "border-red-500" : ""}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={verifyPlaca}
          disabled={verificationState === 'loading' || !value}
        >
          {icons[verificationState]}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface RegistroData {
  vehiculo: Vehiculo | null;
  cliente: Cliente | null;
  showNextSections: boolean;
}

export function RegistroFactura() {
  const [registroData, setRegistroData] = useState<RegistroData>({
    vehiculo: null,
    cliente: null,
    showNextSections: false
  });
  const [placaError, setPlacaError] = useState('');
  const { fetchServicios } = useServicesStore();

  const form = useForm<z.infer<typeof facturaSchema>>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      placa: "",
      id_cliente: "",
      categoria: "",
      grupo: 0,
      medio_pago: "EF",
      iva: 0,
      vlr_iva: 0,
      bruto: 0,
      descuento: 0,
      vlr_descuento: 0,
      subtotal: 0,
      total: 0,
      servicios: []
    },
  });

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const handleServicioGeneralSelect = (servicio: ServicioFactura) => {
    const serviciosAdicionales = form.getValues("servicios")
      .filter(s => s.id_servicio === 9999 || s.id_servicio >= 5000);
    form.setValue("servicios", [servicio, ...serviciosAdicionales]);
  };

  const handleServiciosAdicionalesChange = (serviciosAdicionales: ServicioFactura[]) => {
    form.setValue("servicios", serviciosAdicionales);
  };

  const consultarCliente = async (documento: string) => {
    const { success, data } = await handleApiResponse<Cliente>(
      () => clientesService.getClientes(documento),
      { showSuccessMessage: false, showErrorMessage: false }
    );

    if (success && data) {
      setRegistroData(prev => ({
        ...prev,
        cliente: data
      }));
    }
  };

  const setVehicleData = (vehicle: Vehiculo | null) => {
    if (vehicle) {
      setRegistroData({
        vehiculo: vehicle,
        cliente: null, // Se actualiza al consultar el cliente
        showNextSections: true
      });

      form.setValue("id_cliente", vehicle.documento_cliente);
      form.setValue("categoria", vehicle.categoria);
      form.setValue("grupo", vehicle.grupo);
      consultarCliente(vehicle.documento_cliente);
    } else {
      const currentPlaca = form.getValues("placa");
      form.reset({
        placa: currentPlaca,
        id_cliente: "",
        categoria: "",
        grupo: 0,
        medio_pago: "EF",
        iva: 0,
        vlr_iva: 0,
        bruto: 0,
        descuento: 0,
        vlr_descuento: 0,
        subtotal: 0,
        total: 0,
        servicios: []
      });

      setRegistroData({
        vehiculo: null,
        cliente: null,
        showNextSections: false
      });
    }
  };

  const resetForm = () => {
    form.reset({
      placa: "",
      id_cliente: "",
      categoria: "",
      grupo: 0,
      medio_pago: "EF",
      iva: 0,
      vlr_iva: 0,
      bruto: 0,
      descuento: 0,
      vlr_descuento: 0,
      subtotal: 0,
      total: 0,
      servicios: []
    });
    setRegistroData({
      vehiculo: null,
      cliente: null,
      showNextSections: false
    });
    setPlacaError('');
  }

  const clienteNombreCompleto = registroData.cliente
    ? `${registroData.cliente.nombre} ${registroData.cliente.apellido}`
    : '';

  return (
    <Form {...form}>
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-4 items-stretch overflow-hidden">
        {/* Column 1: Client Data & Promotions */}
        <div className="grid col-span-1 h-full gap-4">
          <div className="flex flex-col row-span-1 gap-4">
            {/* Client Data Card */}
            <Card>
              <CardContent className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <PlacaInput
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            setVehicleData={setVehicleData}
                            error={placaError}
                            setError={setPlacaError}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="id_cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente{clienteNombreCompleto && `: ${clienteNombreCompleto}`}</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Segmento</FormLabel>
                    <Input
                      value={registroData.vehiculo?.segmento ?? ""}
                      readOnly
                    />
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="h-full row-span-2">
            {/* Promotions Card */}
            {registroData.showNextSections && (
              <Card className="h-full">
                <CardContent className="h-full p-4">
                  <PromotionsSection setValue={form.setValue} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Column 2: Services Selection */}
        <div className="col-span-1 row-span-3 h-full">
          {registroData.showNextSections && (
            <Card className="h-[calc(100%-4vh)] overflow-hidden">
              <CardContent className="h-full pt-6">
                <ScrollArea className="h-[calc(100%-2rem)] pr-4">
                  <Accordion type="single" defaultValue="servicios-generales" className="space-y-4">
                    <AccordionItem value="servicios-generales">
                      <AccordionTrigger className="text-lg font-semibold">
                        Servicios Generales
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <ListServiciosGenerales
                          categoria={form.watch("categoria")}
                          grupo={registroData.vehiculo?.grupo ?? 0}
                          onServiceSelect={handleServicioGeneralSelect}
                          selectedServiceId={form.watch("servicios")[0]?.id_servicio || null}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="servicios-adicionales">
                      <AccordionTrigger className="text-lg font-semibold">
                        Servicios Adicionales
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <ListServiciosAdicionales
                          categoria={form.watch("categoria")}
                          serviciosSeleccionados={form.watch("servicios")}
                          onServiciosChange={handleServiciosAdicionalesChange}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Column 3: Selected Services & Payment */}
        <div className="col-span-1 h-full">
          {registroData.showNextSections && (
            <div className="flex flex-col gap-4 overflow-hidden">
              {/* Selected Services Card */}
              <Card className="flex-1 overflow-hidden">
                <CardContent className="h-full p-2">
                  <ScrollArea className="h-[calc(100vh-29.5rem)]">
                    <SelectedServicesTable
                      servicios={form.watch("servicios")}
                      onServiciosChange={handleServiciosAdicionalesChange}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Payment Card */}
              <Card className="min-h-[200px]">
                <CardContent className="pt-6">
                  <PaymentSection
                    form={form}
                    resetForm={resetForm}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
}
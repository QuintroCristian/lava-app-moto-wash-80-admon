import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MEDIOS_PAGO, MEDIOS_PAGO_LABELS } from "@/constants/receipt.constants";
import { useEffect, useState } from "react";
import { Factura, FacturaCreada } from "@/models";
import { MedioPago } from '../../constants/receipt.constants';
import { PaymentDialog } from "./PaymentDialog";
import { facturacionService } from "@/api/facturacion.service";
import { handleApiResponse } from "@/utils/api-utils";
import { ReceiptDialog } from './ReceiptDialog';
import { useAppStore } from "@/contexts/appStore";

interface PaymentSectionProps {
  form: UseFormReturn<FacturaCreada>;
  resetForm: () => void;
}

export function PaymentSection({ form, resetForm }: PaymentSectionProps) {
  const { empresa } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedReceipt, setSavedReceipt] = useState<Factura | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSave = async () => {
    const formData = form.getValues();
    const cleanedServices = formData.servicios.map(({ precio_variable, ...service }) => service);

    const facturaToSave = {
      ...formData,
      servicios: cleanedServices,
      fecha: new Date().toISOString(),
    };

    const { success, data } = await handleApiResponse(
      () => facturacionService.createFactura(facturaToSave),
      { showSuccessMessage: true, showErrorMessage: true }
    );

    if (success && data) {
      setSavedReceipt(data as Factura);
      setDialogOpen(false);
      setShowReceipt(true);
    }
  };

  const handleDialogAction = (action: 'save' | 'cancel') => {
    switch (action) {
      case 'save':
        handleSave();
        break;
      case 'cancel':
        setDialogOpen(false);
        break;
    }
  };

  useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      if (name === "servicios" || name === "descuento") {
        const servicios = form.getValues("servicios");
        const descuentoPorcentaje = form.getValues("descuento") || 0;

        // Calcular valor bruto
        const bruto = servicios.reduce((acc, servicio) => {
          return acc + (servicio.valor * servicio.cantidad);
        }, 0);

        // Calcular valor del descuento
        const vlr_descuento = Math.round(bruto * (descuentoPorcentaje / 100));

        let subtotal = 0;
        let vlr_iva = 0;
        let total = 0;

        if (empresa?.iva) {
          const ivaRate = empresa.valor_iva / 100;

          if (empresa.iva_incluido) {
            // Si el IVA está incluido, calculamos hacia atrás
            subtotal = Math.round((bruto - vlr_descuento) / (1 + ivaRate));
            vlr_iva = Math.round((bruto - vlr_descuento) - subtotal);
          } else {
            // Si el IVA no está incluido, calculamos hacia adelante
            subtotal = bruto - vlr_descuento;
            vlr_iva = Math.round(subtotal * ivaRate);
          }
          total = subtotal + vlr_iva;
        } else {
          subtotal = bruto - vlr_descuento;
          total = subtotal;
          vlr_iva = 0;
        }

        // Actualizar valores en el formulario
        form.setValue("bruto", bruto);
        form.setValue("vlr_descuento", vlr_descuento);
        form.setValue("subtotal", subtotal);
        form.setValue("iva", empresa?.valor_iva ?? 0);
        form.setValue("vlr_iva", vlr_iva);
        form.setValue("total", total);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, empresa]);

  const bruto = form.watch("bruto");
  const descuento = form.watch("descuento");
  const vlr_descuento = form.watch("vlr_descuento");
  const subtotal = form.watch("subtotal");
  const vlr_iva = form.watch("vlr_iva");
  const total = form.watch("total");

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Valor Bruto:</span>
          <span>${bruto.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Descuento ({descuento}%):</span>
          <span>-${vlr_descuento.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        {empresa?.iva && (
          <div className="flex justify-between text-sm">
            <span>IVA ({empresa.valor_iva}%):</span>
            <span>${vlr_iva.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 items-end gap-2">
        <div className="col-span-1 flex flex-col justify-stretch">
          <label className="text-sm font-medium w-1/2">Medio de Pago</label>
          <Select
            onValueChange={(value) => form.setValue("medio_pago", value as MedioPago)}
            defaultValue={form.getValues("medio_pago")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione medio de pago" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MEDIOS_PAGO).map(([_key, value]) => (
                <SelectItem key={value} value={value}>
                  {MEDIOS_PAGO_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={resetForm}>
            Cancelar
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            Guardar
          </Button>
          <PaymentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onAction={handleDialogAction}
          />
          <ReceiptDialog
            open={showReceipt}
            onOpenChange={setShowReceipt}
            receipt={savedReceipt}
          />
        </div>
      </div>
    </>
  );
}
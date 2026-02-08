
import { ServicioAdicional, ServicioGeneral, isServicioGeneral } from "@/models";
import { ServicioGeneralForm } from "./ServicioGeneralForm";
import { ServicioAdicionalForm } from "./ServicioAdicionalForm";

interface EditarServicioDialogProps {
  servicio: ServicioGeneral | ServicioAdicional;
  onSave: () => void;
  onCancel: () => void;
}

export function EditServicioDialog({
  servicio,
  onSave,
  onCancel,
}: EditarServicioDialogProps) {



  return (
    <>
      {isServicioGeneral(servicio) ? (
        <ServicioGeneralForm
          servicio={servicio as ServicioGeneral}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <ServicioAdicionalForm
          servicio={servicio as ServicioAdicional}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </>
  );
}
import { useEffect, useState } from "react";
import { Promocion } from "@/models";
import { promocionesService } from "@/api/promociones.service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { handleApiResponse } from "@/utils/api-utils";
import { DataTablePromociones } from "@/components/promociones/DataTablePromociones";
import { PromocionDialog } from "@/components/promociones/PromocionDialog";
import { DataFiltersPromociones } from "@/components/promociones/DataFiltersPromociones";

export const Promociones = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [promocionToDelete, setPromocionToDelete] = useState<Promocion | null>(null);
  const [descripcionFilter, setDescripcionFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");

  const fetchPromociones = async () => {
    const { success, data } = await handleApiResponse<Promocion[]>(
      () => promocionesService.getPromociones(),
      { showSuccessMessage: false }
    );

    if (success && data) {
      setPromociones(data);
    }
  };

  useEffect(() => {
    fetchPromociones();
  }, []);

  const handleEdit = (promocion: Promocion) => {
    setSelectedPromocion(promocion);
    setOpenDialog(true);
  };

  const handleDelete = (promocion: Promocion) => {
    setPromocionToDelete(promocion);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (promocionToDelete?.id_promocion) {
      const { success } = await handleApiResponse(
        () => promocionesService.deletePromocion(promocionToDelete.id_promocion!.toString())
      );
      if (success) {
        await fetchPromociones();
        setPromocionToDelete(null);
        setDeleteDialog(false);
      }
    }
  };

  const handleCreate = () => {
    setSelectedPromocion(null);
    setOpenDialog(true);
  };

  const filteredPromociones = promociones.filter((promocion) => {
    const matchesDescripcion = promocion.descripcion.toLowerCase().includes(descripcionFilter.toLowerCase());
    const matchesEstado = estadoFilter === "Todos" ||
      (estadoFilter === "Activo" ? promocion.estado : !promocion.estado);
    return matchesDescripcion && matchesEstado;
  });

  return (
    <div className="container lg:max-w-screen-lg mx-auto h-full py-4">

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-4">
        <DataFiltersPromociones
          descripcionFilter={descripcionFilter}
          onDescripcionFilterChange={setDescripcionFilter}
          estadoFilter={estadoFilter}
          onEstadoFilterChange={setEstadoFilter}
        />
        <Button type="button" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Promoción
        </Button>
      </div>

      <DataTablePromociones
        data={filteredPromociones}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[600px]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedPromocion ? "Editar" : "Nueva"} Promoción
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {selectedPromocion ? "modificar" : "crear"} una promoción.
            </DialogDescription>
          </DialogHeader>
          <PromocionDialog
            promocion={selectedPromocion}
            onSave={() => {
              fetchPromociones();
              setOpenDialog(false);
            }}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de eliminar la promoción? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
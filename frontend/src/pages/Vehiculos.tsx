import { useEffect, useState } from "react";
import { Vehiculo } from "@/models";
import { vehiculosService } from "@/api/vehiculos.service";
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
import { DataTableVehiculos } from "@/components/vehiculos/DataTableVehiculos";
import { VehiculoDialog } from "@/components/vehiculos/VehiculoDialog";
import { DataFiltersVehiculos } from "@/components/vehiculos/DataFiltersVehiculos";

export const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(null);
  const [placaFilter, setPlacaFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("Todos");
  const [clienteFilter, setClienteFilter] = useState("");

  const fetchVehiculos = async () => {
    const { success, data } = await handleApiResponse<Vehiculo[]>(
      () => vehiculosService.getVehiculos({}),
      { showSuccessMessage: false }
    );

    if (success && data) {
      setVehiculos(data);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenDialog(true);
  };

  const handleDelete = (vehiculo: Vehiculo) => {
    setVehiculoToDelete(vehiculo);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (vehiculoToDelete?.placa) {
      const { success } = await handleApiResponse(
        () => vehiculosService.deleteVehiculo(vehiculoToDelete.placa)
      );
      if (success) {
        await fetchVehiculos();
        setVehiculoToDelete(null);
        setDeleteDialog(false);
      }
    }
  };

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setOpenDialog(true);
  };

  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const matchesPlaca = vehiculo.placa.toLowerCase().includes(placaFilter.toLowerCase());
    const matchesCategoria = categoriaFilter === "Todos" || vehiculo.categoria === categoriaFilter;
    const matchesCliente = vehiculo.documento_cliente.toLowerCase().includes(clienteFilter.toLowerCase());
    return matchesPlaca && matchesCategoria && matchesCliente;
  });

  return (
    <div className="container lg:max-w-screen-lg mx-auto h-full py-4">

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-4">
        <DataFiltersVehiculos
          placaFilter={placaFilter}
          onPlacaFilterChange={setPlacaFilter}
          categoriaFilter={categoriaFilter}
          onCategoriaFilterChange={setCategoriaFilter}
          clienteFilter={clienteFilter}
          onClienteFilterChange={setClienteFilter}
        />
        <Button type="button" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
        </Button>
      </div>

      <DataTableVehiculos
        data={filteredVehiculos}
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
              {selectedVehiculo ? "Editar" : "Nuevo"} Vehículo
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {selectedVehiculo ? "editar el" : "crear un nuevo"} vehículo.
            </DialogDescription>
          </DialogHeader>
          <VehiculoDialog
            vehiculo={selectedVehiculo}
            onSave={() => {
              fetchVehiculos();
              setOpenDialog(false);
            }}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px] max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de eliminar el vehículo <span className="font-medium">{vehiculoToDelete?.placa}</span>? Esta acción no se puede deshacer.
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
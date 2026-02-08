import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTableServiciosGenerales } from "@/components/servicios/DataTableServiciosGenerales";
import { DataTableServiciosAdicionales } from "@/components/servicios/DataTableServiciosAdicionales";
import { DataFiltersServicios } from "@/components/servicios/DataFiltersServicios";
import { ServicioAdicional, ServicioGeneral } from "@/models";
import { serviciosService } from "@/api/servicios.service";
import { CreateServicioDialog } from "@/components/servicios/CreateServicioDialog";
import { EditServicioDialog } from "@/components/servicios/EditServicioDialog";
import { handleApiResponse } from "@/utils/api-utils";

export const Servicios = () => {
  const [serviciosGenerales, setServiciosGenerales] = useState<ServicioGeneral[]>([]);
  const [serviciosAdicionales, setServiciosAdicionales] = useState<ServicioAdicional[]>([]);
  const [selectedServicio, setSelectedServicio] = useState<ServicioGeneral | ServicioAdicional | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState<ServicioGeneral | ServicioAdicional | null>(null);
  const [activeTab, setActiveTab] = useState("General");
  const [nombreFilter, setNombreFilter] = useState("");

  const fetchServicios = async () => {
    const { success: successGenerales, data: dataGenerales } = await handleApiResponse<ServicioGeneral[]>(
      () => serviciosService.getServicios('General'),
      { showSuccessMessage: false }
    );
    const { success: successAdicionales, data: dataAdicionales } = await handleApiResponse<ServicioAdicional[]>(
      () => serviciosService.getServicios('Adicional'),
      { showSuccessMessage: false }
    );

    if (successGenerales && dataGenerales) setServiciosGenerales(dataGenerales);
    if (successAdicionales && dataAdicionales) setServiciosAdicionales(dataAdicionales);
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleCreate = () => {
    setSelectedServicio(null);
    setOpenDialog(true);
  };

  const handleEdit = (servicio: ServicioGeneral | ServicioAdicional) => {
    setSelectedServicio(servicio);
    setOpenDialog(true);
  };

  const handleDelete = (servicio: ServicioGeneral | ServicioAdicional) => {
    setServicioToDelete(servicio);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (servicioToDelete?.id_servicio !== undefined) {
      const { success } = await handleApiResponse(
        () => serviciosService.deleteServicio(servicioToDelete.tipo_servicio, servicioToDelete.id_servicio)
      );
      if (success) {
        await fetchServicios();
        setServicioToDelete(null);
        setDeleteDialog(false);
      }
    }
  };

  const handleSave = async () => {
    await fetchServicios();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <div className="container lg:max-w-screen-lg mx-auto h-full py-4">

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-4">
        <DataFiltersServicios
          nombreFilter={nombreFilter}
          onNombreFilterChange={setNombreFilter}
        />
        <Button type="button" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
        </Button>
      </div>

      <Tabs defaultValue="General" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="General">Servicios Generales</TabsTrigger>
          <TabsTrigger value="Adicional">Servicios Adicionales</TabsTrigger>
        </TabsList>
        <TabsContent value="General">
          <DataTableServiciosGenerales
            data={serviciosGenerales.filter(s =>
              s.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
            )}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="Adicional">
          <DataTableServiciosAdicionales
            data={serviciosAdicionales.filter(s =>
              s.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
            )}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-[90vw] md:max-w-[800px] max-h-[98vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {selectedServicio ? "Editar" : "Nuevo"} Servicio {activeTab === "General" ? "General" : "Adicional"}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {selectedServicio ? "editar el" : "crear un nuevo"} servicio.
            </DialogDescription>
          </DialogHeader>
          {selectedServicio ? (
            <EditServicioDialog
              servicio={selectedServicio}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <CreateServicioDialog
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de eliminar el servicio <span className="font-medium">{servicioToDelete?.nombre}</span>? Esta acción no se puede deshacer.
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
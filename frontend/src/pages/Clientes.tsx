import { useEffect, useState } from "react";
import { Cliente } from "@/models";
import { clientesService } from "@/api/clientes.service";
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
import { DataTableClientes } from "@/components/clientes/DataTableClientes";
import { DataFiltersClientes } from "@/components/clientes/DataFiltersClientes";
import { ClienteDialog } from "@/components/clientes/ClienteDialog";
import { ClienteViewDialog } from "@/components/clientes/ClienteViewDialog";

export const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedViewCliente, setSelectedViewCliente] = useState<Cliente | null>(null);

  const fetchClientes = async () => {
    const { success, data } = await handleApiResponse<Cliente[]>(
      () => clientesService.getClientes(),
      { showSuccessMessage: false }
    );

    if (success && data) {
      setClientes(data);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setOpenDialog(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete?.documento !== undefined) {
      const { success } = await handleApiResponse(
        () => clientesService.deleteCliente(clienteToDelete.documento)
      );
      if (success) {
        await fetchClientes();
        setClienteToDelete(null);
        setDeleteDialog(false);
      }
    }
  };

  const handleCreate = () => {
    setSelectedCliente(null);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    await fetchClientes();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  }

  const handleRowClick = (cliente: Cliente) => {
    setSelectedViewCliente(cliente);
    setViewDialog(true);
  };

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDocument =
      documentFilter === "" ||
      cliente.documento.toLowerCase().includes(documentFilter.toLowerCase());

    return matchesSearch && matchesDocument;
  });

  return (
    <div className="container lg:max-w-screen-lg mx-auto h-full py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-4">
        <DataFiltersClientes
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          documentFilter={documentFilter}
          onDocumentFilterChange={setDocumentFilter}
        />
        <Button type="button" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <DataTableClientes
        data={filteredClientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] md:max-w-[600px]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {selectedCliente ? "editar el" : "crear un nuevo"} cliente.
            </DialogDescription>
          </DialogHeader>
          <ClienteDialog cliente={selectedCliente} onSave={handleSave} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px] max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de eliminar al cliente <span className="font-medium">{clienteToDelete?.nombre} {clienteToDelete?.apellido}</span>? Esta acción no se puede deshacer.
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

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[850px]">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>
              Información detallada del cliente seleccionado.
            </DialogDescription>
          </DialogHeader>
          <ClienteViewDialog cliente={selectedViewCliente} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

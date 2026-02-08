import { useEffect, useState } from "react";
import { User } from "@/models";
import { usuariosService } from "@/api/usuarios.service";
import { DataTableUsuarios } from "@/components/usuarios/DataTableUsuarios";
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
import { UserDialog } from "@/components/usuarios/UserDialog";
import { useAuthStore } from "@/contexts";
import { handleApiResponse } from "@/utils/api-utils";
import { DataFiltersUsuarios } from "@/components/usuarios/DataFiltersUsuarios";

export const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRol, setSelectedRol] = useState("Todos");

  const fetchUsers = async () => {
    const { success, data } = await handleApiResponse<User[]>(
      () => usuariosService.getUsuarios(),
      { showSuccessMessage: false }
    );

    if (success && data) {
      const loggedInUser = useAuthStore.getState().user;
      if (loggedInUser?.rol === "ADMINISTRADOR") {
        setUsers(data.filter((user: User) => user.rol === "POS"));
      } else {
        setUsers(data);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (userToDelete?.usuario !== undefined) {
      const { success } = await handleApiResponse(
        () => usuariosService.deleteUsuario(userToDelete.usuario)
      );
      if (success) {
        await fetchUsers();
        setUserToDelete(null);
        setDeleteDialog(false);
      }
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    await fetchUsers();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = selectedRol === "Todos" || user.rol === selectedRol;
    return matchesSearch && matchesRol;
  });

  return (
    <div className="container lg:max-w-screen-lg mx-auto h-full py-4">

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-4">
        <DataFiltersUsuarios
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRol={selectedRol}
          onRolChange={setSelectedRol}
        />
        <Button type="button" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <DataTableUsuarios
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-[90vw] md:max-w-[600px] max-h-[98vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para {selectedUser ? "editar el" : "crear un nuevo"} usuario.
            </DialogDescription>
          </DialogHeader>
          <UserDialog user={selectedUser} onSave={handleSave} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de eliminar al usuario <span className="font-medium">{userToDelete?.usuario}</span>? Esta acción no se puede deshacer.
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
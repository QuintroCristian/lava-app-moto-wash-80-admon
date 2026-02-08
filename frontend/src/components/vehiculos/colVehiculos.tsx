import { Vehiculo } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, ArrowUpDown } from "lucide-react";
import { useAuthStore } from "@/contexts/authStore";

export const ColVehiculos = (
  onEdit: (vehiculo: Vehiculo) => void,
  onDelete: (vehiculo: Vehiculo) => void,
  showActions: boolean = true
): ColumnDef<Vehiculo>[] => {
  const user = useAuthStore((state) => state.user);

  const columns: ColumnDef<Vehiculo>[] = [
    {
      accessorKey: "placa",
      size: 120,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Placa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "documento_cliente",
      size: 150,
      header: "Cliente",
    },
    {
      accessorKey: "categoria",
      size: 100,
      header: "Categoría",
    },
    {
      accessorKey: "marca",
      size: 120,
      header: "Marca",
    },
    {
      accessorKey: "linea",
      size: 120,
      header: "Línea",
    },
    {
      accessorKey: "modelo",
      size: 100,
      header: "Modelo",
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      size: 80,
      cell: ({ row }) => {
        const vehiculo = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(vehiculo);
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {user?.rol === 'ADMINISTRADOR' && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onDelete(vehiculo);
                }}>
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
};
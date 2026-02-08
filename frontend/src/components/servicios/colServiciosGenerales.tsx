import { ServicioGeneral } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, ArrowUpDown } from "lucide-react";

export const colServiciosGenerales = (
  handleEdit: (servicio: ServicioGeneral) => void,
  handleDelete: (servicio: ServicioGeneral) => void
): ColumnDef<ServicioGeneral>[] => [
    {
      accessorKey: "nombre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "valores",
      header: "Precios",
      cell: ({ row }) => {
        const valores = row.original.valores;
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        valores.forEach(categoria => {
          categoria.grupos.forEach(grupo => {
            minPrice = Math.min(minPrice, grupo.precio);
            maxPrice = Math.max(maxPrice, grupo.precio);
          });
        });

        return `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const servicio = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(servicio)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(servicio)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
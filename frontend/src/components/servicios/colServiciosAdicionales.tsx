import { ServicioAdicional } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, ArrowUpDown } from "lucide-react";
import { getVariableLabel, VariableType } from "@/constants/service.constants";

const getCategoryVariant = (category: string) => {
  switch (category.toLowerCase()) {
    case 'moto':
      return 'destructive';
    case 'auto':
      return 'default';
    case 'cuatrimoto':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const colServiciosAdicionales = (
  handleEdit: (servicio: ServicioAdicional) => void,
  handleDelete: (servicio: ServicioAdicional) => void
): ColumnDef<ServicioAdicional>[] => [
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
      accessorKey: "categorias",
      header: "Categorías",
      cell: ({ row }) => {
        const categorias = row.original.categorias;
        return (
          <div className="flex flex-wrap gap-1">
            {categorias.map((categoria) => (
              <Badge key={categoria} variant={getCategoryVariant(categoria)}>
                {categoria}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "precio_variable",
      header: "Precio Variable",
      cell: ({ row }) => {
        const precioVariable = row.original.precio_variable;
        const variable: VariableType | null = row.original.variable;
        return (
          <Badge variant={precioVariable ? "default" : "secondary"}>
            {precioVariable ? (variable ? getVariableLabel(variable) : "Variable") : "Fijo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "precio_base",
      header: "Precio Base",
      cell: ({ row }) => {
        const precio = row.original.precio_base;
        return `$${precio.toLocaleString()}`;
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
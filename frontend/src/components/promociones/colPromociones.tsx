import { Promocion } from "@/models";
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
import { parseISO, addHours, format } from "date-fns";

const formatUTCDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  const adjustedDate = addHours(date, 5);
  return format(adjustedDate, 'yyyy-MM-dd');
};

export const colPromociones = (
  handleEdit: (promocion: Promocion) => void,
  handleDelete: (promocion: Promocion) => void
): ColumnDef<Promocion>[] => [
    {
      accessorKey: "descripcion",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descripción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 200,
    },
    {
      accessorKey: "fecha_inicio",
      header: "Fecha Inicio",
      size: 120,
      cell: ({ row }) => {
        return formatUTCDate(row?.getValue("fecha_inicio"));
      },
    },
    {
      accessorKey: "fecha_fin",
      header: "Fecha Fin",
      size: 120,
      cell: ({ row }) => {
        return formatUTCDate(row?.getValue("fecha_fin"));
      },
    },
    {
      accessorKey: "porcentaje",
      header: "Porcentaje",
      size: 100,
      cell: ({ row }) => {
        return `${row.getValue("porcentaje")}%`;
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 100,
      cell: ({ row }) => {
        const estado = row.getValue("estado");
        return (
          <Badge className="w-16 justify-center" variant={estado ? "default" : "outline"}>
            {estado ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      size: 80,
      cell: ({ row }) => {
        const promocion = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(promocion)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(promocion)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
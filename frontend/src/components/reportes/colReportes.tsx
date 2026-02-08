import { Reporte } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const ColReportes = (): ColumnDef<Reporte>[] => {
  return [
    {
      accessorKey: "factura",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # Factura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => {
        const fecha = new Date(row.getValue("fecha"));
        return fecha.toLocaleDateString();
      },
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
    },
    {
      accessorKey: "placa",
      header: "Placa",
    },
    {
      accessorKey: "medio_pago",
      header: "Medio de Pago",
      cell: ({ row }) => {
        const mediosPago: { [key: string]: string } = {
          EF: "Efectivo",
          TD: "Tarjeta Débito",
          TC: "Tarjeta Crédito",
          TR: "Transferencia",
        };
        return mediosPago[row.getValue("medio_pago")] || row.getValue("medio_pago");
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"));
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(amount);
      },
    },
  ];
};
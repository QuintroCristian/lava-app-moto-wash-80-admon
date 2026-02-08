import { useState } from "react";
import { ServicioGeneral } from "@/models";
import { colServiciosGenerales } from "./colServiciosGenerales";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTablePagination } from "@/components/ui/DataTablePagination";

interface DataTableServiciosGeneralesProps {
  data: ServicioGeneral[];
  onEdit: (servicio: ServicioGeneral) => void;
  onDelete: (servicio: ServicioGeneral) => void;
}

export function DataTableServiciosGenerales({
  data,
  onEdit,
  onDelete
}: DataTableServiciosGeneralesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = colServiciosGenerales(onEdit, onDelete);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col rounded-md border">
      <Table>
        <ScrollArea className={table.getRowCount() > 5 ? 'h-[50vh]' : 'h-min'}>
          <TableHeader className="sticky top-0 bg-white shadow-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Table>
      {table.getRowCount() >= 10 && <DataTablePagination table={table} />}
    </div>
  );
}
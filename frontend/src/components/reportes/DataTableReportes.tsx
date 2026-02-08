import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Reporte } from "@/models";
import { ColReportes } from "./colReportes";
import { useState } from "react";
import { utils as xlsxUtils, write as xlsxWrite } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { ResumenResponse } from "@/models";

interface DataTableReportesProps {
  data: Reporte[];
  resumen?: ResumenResponse; // Añadimos el resumen como prop opcional
}

export function DataTableReportes({ data, resumen }: DataTableReportesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = ColReportes();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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

  const prepareDataForExport = () => data.map(row => ({
    'Factura': row.factura,
    'Fecha': new Date(row.fecha).toLocaleDateString(),
    'Cliente': row.cliente,
    'Placa': row.placa,
    'Categoría': row.categoria,
    'Medio de Pago': row.medio_pago === 'EF' ? 'Efectivo'
      : row.medio_pago === 'TD' ? 'Tarjeta Débito'
        : row.medio_pago === 'TC' ? 'Tarjeta Crédito'
          : 'Transferencia',
    'Subtotal': row.subtotal,
    'IVA': row.valor_iva,
    'Descuento': row.vlr_descuento,
    'Total': row.total,
    'Servicios': row.servicios.map(s =>
      `${s.descripcion} (${s.cantidad}x) - ${formatCurrency(s.valor)}`
    ).join('\n')
  }));

  const exportToExcel = () => {
    const exportData = prepareDataForExport();
    const ws = xlsxUtils.json_to_sheet(exportData);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, "Reportes");

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 10 }, // Factura
      { wch: 12 }, // Fecha
      { wch: 12 }, // Cliente
      { wch: 8 },  // Placa
      { wch: 10 }, // Categoría
      { wch: 15 }, // Medio de Pago
      { wch: 12 }, // Subtotal
      { wch: 10 }, // IVA
      { wch: 12 }, // Descuento
      { wch: 12 }, // Total
      { wch: 50 }, // Servicios
    ];
    ws['!cols'] = colWidths;

    const excelBuffer = xlsxWrite(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-ventas-${new Date().toLocaleDateString()}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const exportData = prepareDataForExport();

    // Título principal
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 10);

    // Añadir resumen si existe
    if (resumen) {
      doc.setFontSize(12);
      doc.text('Resumen General', 14, 20);

      // Datos generales
      doc.setFontSize(10);
      doc.text([
        `Periodo: ${resumen.fecha_inicio} - ${resumen.fecha_fin}`,
        `Total Ventas: ${formatCurrency(resumen.total_ventas)}`,
        `Número de Facturas: ${resumen.numero_facturas}`,
      ], 14, 25);

      // Ventas por medio de pago
      doc.setFontSize(12);
      doc.text('Ventas por Medio de Pago', 14, 45);

      const mediosPagoRows = resumen.ventas_medios_pago.map(medio => [
        medio.medio_pago === "EF" ? "Efectivo" :
          medio.medio_pago === "TD" ? "T. Débito" :
            medio.medio_pago === "TC" ? "T. Crédito" : "Transferencia",
        formatCurrency(medio.total_ventas),
        medio.numero_facturas.toString()
      ]);

      (doc as any).autoTable({
        head: [['Medio de Pago', 'Total', 'Facturas']],
        body: mediosPagoRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 8 },
        margin: { left: 14 },
        tableWidth: 100
      });

      // Detalle de transacciones (tabla principal)
      doc.setFontSize(12);
      doc.text('Detalle de Transacciones', 14, (doc as any).lastAutoTable.finalY + 15);

      (doc as any).autoTable({
        head: [['Factura', 'Fecha', 'Cliente', 'Placa', 'Medio de Pago', 'Total', 'Servicios']],
        body: exportData.map(row => [
          row['Factura'],
          row['Fecha'],
          row['Cliente'],
          row['Placa'],
          row['Medio de Pago'],
          formatCurrency(row['Total']),
          row['Servicios']
        ]),
        startY: (doc as any).lastAutoTable.finalY + 20,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 'auto' }
        },
      });
    } else {
      // Si no hay resumen, solo mostrar la tabla de transacciones como estaba antes
      doc.setFontSize(11);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 20);

      (doc as any).autoTable({
        head: [['Factura', 'Fecha', 'Cliente', 'Placa', 'Medio de Pago', 'Total', 'Servicios']],
        body: exportData.map(row => [
          row['Factura'],
          row['Fecha'],
          row['Cliente'],
          row['Placa'],
          row['Medio de Pago'],
          formatCurrency(row['Total']),
          row['Servicios']
        ]),
        startY: 25,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 'auto' }
        },
      });
    }

    doc.save(`reporte-ventas-${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="flex flex-col rounded-md border">
      <div className="p-4 flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={exportToExcel}
        >
          Exportar a Excel
        </Button>
        <Button
          variant="outline"
          onClick={exportToPDF}
        >
          Exportar a PDF
        </Button>
      </div>
      <Table>
        <ScrollArea className={table.getRowCount() > 5 ? 'h-[45vh]' : 'h-min'}>
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
                    <TableCell className="py-2" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
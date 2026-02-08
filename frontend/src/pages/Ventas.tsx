import { useState, useEffect } from "react";
import { reportesService } from "@/api";
import { Reporte, ResumenVentas } from "@/models";
import { DataTableReportes } from "@/components/reportes/DataTableReportes";
import { DataFiltersReportes } from "@/components/reportes/DataFiltersReportes";
import { handleApiResponse } from "@/utils/api-utils";
import { DateRange } from "react-day-picker";
import { ResumenVentasReporte } from "@/components/reportes/ResumenVentas";

const getLastWeekRange = () => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    from: lastWeek,
    to: today
  };
};

export const Ventas = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [resumen, setResumen] = useState<ResumenVentas | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getLastWeekRange());
  const [categoriaFilter, setCategoriaFilter] = useState("Todos");
  const [metodoPagoFilter, setMetodoPagoFilter] = useState("Todos");
  const [documentoFilter, setDocumentoFilter] = useState("");

  const fetchData = async () => {
    resetFilters();
    setReportes([]);
    setResumen(null);

    const [reportesResponse, resumenResponse] = await Promise.all([
      handleApiResponse(
        () => reportesService.getReportesPorFecha(
          dateRange?.from?.toISOString().split('T')[0],
          dateRange?.to?.toISOString().split('T')[0]
        ),
        { showSuccessMessage: false }
      ),
      handleApiResponse(
        () => reportesService.getResumenVentas(
          dateRange?.from?.toISOString().split('T')[0],
          dateRange?.to?.toISOString().split('T')[0]
        ),
        { showSuccessMessage: false }
      )
    ]);

    if (reportesResponse.success && reportesResponse.data) {
      setReportes(reportesResponse?.data);
    }

    if (resumenResponse.success && resumenResponse.data) {
      setResumen(resumenResponse?.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Solo se ejecuta al montar el componente

  const resetFilters = () => {
    setCategoriaFilter("Todos");
    setMetodoPagoFilter("Todos");
    setDocumentoFilter("");
  }

  const filteredReportes = reportes.filter((reporte) => {
    const matchesCategoria = categoriaFilter === "Todos" || reporte.categoria === categoriaFilter;
    const matchesMetodoPago = metodoPagoFilter === "Todos" || reporte.medio_pago === metodoPagoFilter;
    const matchesDocumento = documentoFilter === "" ||
      reporte.cliente.toString().toLowerCase().includes(documentoFilter.toLowerCase());

    return matchesCategoria && matchesMetodoPago && matchesDocumento;
  });

  return (
    <div className="container h-full mx-auto pb-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Filtros de Búsqueda</h2>
          <DataFiltersReportes
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categoriaFilter={categoriaFilter}
            onCategoriaFilterChange={setCategoriaFilter}
            metodoPagoFilter={metodoPagoFilter}
            onMetodoPagoFilterChange={setMetodoPagoFilter}
            documentoFilter={documentoFilter}
            onDocumentoFilterChange={setDocumentoFilter}
            onSearchClick={fetchData}
          />
        </div>
      </div>

      {resumen && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumen de Ventas</h2>
          <ResumenVentasReporte resumen={resumen} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Detalle de Transacciones</h2>
        <div className="bg-white rounded-lg shadow-md">
          <DataTableReportes data={filteredReportes} resumen={resumen} />
        </div>
      </div>
    </div>
  );
};
import { api } from "./axios";

export const reportesService = {
  getReportesPorFecha: (fecha_inicio?: string, fecha_fin?: string) =>
    api.get("/reportes", { params: { fecha_inicio, fecha_fin } }),

  getReportesPorCliente: (cedula_cliente: string) =>
    api.get("/reportes/cliente", { params: { cedula_cliente } }),

  getReportesPorMedioPago: (medio_pago: string) =>
    api.get("/reportes/medio_pago", { params: { medio_pago } }),

  getReportePorNumeroFactura: (numero_factura: number) =>
    api.get("/reportes/numero_factura", { params: { numero_factura } }),

  getReportesPorPlaca: (placa: string) =>
    api.get("/reportes/placa", { params: { placa } }),

  getResumenVentas: (fecha_inicio?: string, fecha_fin?: string) =>
    api.get("/reportes/resumen", { params: { fecha_inicio, fecha_fin } }),
};

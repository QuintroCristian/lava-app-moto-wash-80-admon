import { api } from "@/api";
import { Factura } from "@/models";

export const facturacionService = {
  getFacturas: (numeroFactura?: number) =>
    api.get("/facturas", {
      params: { ...(numeroFactura && { numeroFactura }) },
    }),

  createFactura: (factura: Factura) => api.post("/facturas", factura),

  updateFactura: (factura: Factura) => api.put("/facturas", factura),

  deleteFactura: (numeroFactura: number) =>
    api.delete("/facturas", { params: { numeroFactura } }),
};

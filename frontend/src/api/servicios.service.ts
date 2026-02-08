import { ServicioAdicional, ServicioGeneral } from "@/models";
import { api } from "./axios";

export const serviciosService = {
  getServicios: (tipo_servicio: "General" | "Adicional") =>
    api.get("/servicios", {
      params: { tipo_servicio },
    }),
  createServicio: (
    tipo_servicio: "General" | "Adicional",
    servicio: ServicioGeneral | ServicioAdicional
  ) => api.post("/servicios", servicio, { params: { tipo_servicio } }),
  updateServicio: (
    tipo_servicio: "General" | "Adicional",
    servicio: ServicioGeneral | ServicioAdicional
  ) => api.put("/servicios", servicio, { params: { tipo_servicio } }),
  deleteServicio: (
    tipo_servicio: "General" | "Adicional",
    id_servicio: number | undefined
  ) => api.delete("/servicios", { params: { tipo_servicio, id_servicio } }),
};

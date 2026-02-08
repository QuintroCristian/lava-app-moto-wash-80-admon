import { api } from "@/api";
import { Promocion } from "@/models";

export const promocionesService = {
  getPromociones: (promocion?: string) =>
    api.get("/promociones", { params: { ...(promocion && { promocion }) } }),

  createPromocion: (promocion: Promocion) =>
    api.post("/promociones", promocion),

  updatePromocion: (promocion: Promocion) => api.put("/promociones", promocion),

  deletePromocion: (promocion: string) =>
    api.delete("/promociones", { params: { promocion } }),
};

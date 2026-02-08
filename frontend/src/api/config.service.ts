import { api } from "@/api";
import { AppConfig } from "@/models";

export const configService = {
  getConfig: () => api.get("/configuracion"),
  updateConfig: (data: AppConfig) => api.put("/configuracion", data),
};

import { Cliente } from "@/models";
import { api } from "./axios";

export const clientesService = {
  getClientes: (documento?: string) =>
    api.get("/clientes", { params: { ...(documento && { documento }) } }),

  createCliente: (cliente: Cliente) => api.post("/clientes", cliente),

  updateCliente: (cliente: Cliente) => api.put("/clientes", cliente),

  deleteCliente: (documento: string) =>
    api.delete("/clientes", { params: { documento } }),
};

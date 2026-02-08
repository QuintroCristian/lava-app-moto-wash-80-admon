import { api } from "./axios";
import { Vehiculo } from "@/models";

export const vehiculosService = {
  getVehiculos: ({
    placa,
    documento_cliente,
  }: {
    placa?: string;
    documento_cliente?: string;
  }) =>
    api.get("/vehiculos", {
      params: {
        ...(placa && { placa }),
        ...(documento_cliente && { documento_cliente }),
      },
    }),

  createVehiculo: (vehiculo: Vehiculo) => api.post("/vehiculos", vehiculo),

  updateVehiculo: (vehiculo: Vehiculo) => api.put("/vehiculos", vehiculo),

  deleteVehiculo: (placa: string) =>
    api.delete("/vehiculos", { params: { placa } }),
};

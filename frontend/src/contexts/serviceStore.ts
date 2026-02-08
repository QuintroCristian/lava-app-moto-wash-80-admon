import { create } from "zustand";
import { ServicioGeneral, ServicioAdicional } from "@/models";
import { serviciosService } from "@/api/servicios.service";
import { handleApiResponse } from "@/utils/api-utils";

interface ServicesStore {
  serviciosGenerales: ServicioGeneral[];
  serviciosAdicionales: ServicioAdicional[];
  isLoading: boolean;
  fetchServicios: () => Promise<void>;
  getServiciosAdicionalesByCategoria: (
    categoria: string
  ) => ServicioAdicional[];
  getPrecioServicioGeneral: (
    servicioId: number | undefined,
    categoria: string,
    grupo: number
  ) => number | undefined;
}

export const useServicesStore = create<ServicesStore>((set, get) => ({
  serviciosGenerales: [] as ServicioGeneral[],
  serviciosAdicionales: [] as ServicioAdicional[],
  isLoading: false,

  fetchServicios: async () => {
    set({ isLoading: true });

    const [generalesResponse, adicionalesResponse] = await Promise.all([
      handleApiResponse(() => serviciosService.getServicios("General"), {
        showSuccessMessage: false,
        showErrorMessage: false,
      }),
      handleApiResponse(() => serviciosService.getServicios("Adicional"), {
        showSuccessMessage: false,
        showErrorMessage: false,
      }),
    ]);

    set({
      serviciosGenerales: (generalesResponse.data || []) as ServicioGeneral[],
      serviciosAdicionales: (adicionalesResponse.data ||
        []) as ServicioAdicional[],
      isLoading: false,
    });
  },

  getServiciosAdicionalesByCategoria: (categoria: string) => {
    return get().serviciosAdicionales.filter((servicio) =>
      servicio.categorias.includes(categoria)
    );
  },

  getPrecioServicioGeneral: (
    servicioId: number,
    categoria: string,
    grupo: number
  ) => {
    const servicio = get().serviciosGenerales.find(
      (s) => s.id_servicio === servicioId
    );
    if (!servicio) return undefined;

    const categoriaValor = servicio.valores.find(
      (c) => c.categoria === categoria
    );
    if (!categoriaValor) return undefined;

    const grupoValor = categoriaValor.grupos.find((g) => g.id === grupo);
    return grupoValor?.precio;
  },
}));

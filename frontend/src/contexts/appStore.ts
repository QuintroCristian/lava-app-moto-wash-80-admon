import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppConfig, AppState } from "@/models";
import { configService } from "@/api";
import axios from "axios";
import { handleApiResponse } from "@/utils/api-utils";
import { useAuthStore } from "./authStore";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      empresa: null,
      tema: null,
      isLoading: false,
      error: null,

      fetchConfig: async () => {
        // Si ya hay datos, no hacemos fetch
        set({ isLoading: true, error: null });
        if (get().empresa && get().tema) {
          set({ isLoading: false });
          return;
        }

        try {
          const response = await handleApiResponse<AppConfig>(
            () => configService.getConfig(),
            { showSuccessMessage: false }
          );

          if (response.success && response.data) {
            const { empresa, tema } = response.data;
            set({ empresa, tema });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            set({ error: error.message });
          } else {
            set({ error: String(error) });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      updateConfig: async (data: AppConfig) => {
        set({ isLoading: true, error: null });
        try {
          const response = await configService.updateConfig(data);
          if (response.status === 200) {
            set({
              empresa: data.empresa,
              tema: data.tema,
            });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            set({ error: error.message });
          } else {
            set({ error: String(error) });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      setCompanyData: (company) => set({ empresa: company }),
      setThemeColors: (colors) => set({ tema: colors }),
      resetStore: () =>
        set({
          empresa: null,
          tema: {
            primario: "222 47% 11%",
            foregroundPrimario: "0 0% 100%",
          },
          error: null,
        }),
    }),
    {
      name: "app-config",
    }
  )
);

// Sincronizar logout con authStore
useAuthStore.subscribe((state, prevState) => {
  if (prevState.user && !state.user) {
    useAppStore.getState().resetStore();
  }
});

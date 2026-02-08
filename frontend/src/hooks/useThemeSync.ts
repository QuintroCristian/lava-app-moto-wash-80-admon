import { useEffect } from "react";
import { useAppStore } from "@/contexts/appStore";
import { updateThemeColors } from "@/lib/theme";

export const useThemeSync = () => {
  const colors = useAppStore((state) => state.tema);

  useEffect(() => {
    if (colors) {
      updateThemeColors(colors.primario, colors.foregroundPrimario);
    }
  }, [colors]);
};

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/contexts";

export const useDocumentMeta = () => {
  const location = useLocation();
  const { empresa } = useAppStore();

  useEffect(() => {
    // Actualizar favicon
    if (empresa?.logo) {
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = empresa.logo;
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    // Actualizar título
    const baseTitle = empresa?.nombre || "LavApp";
    let pageTitle = baseTitle;

    if (location.pathname !== "/login") {
      const route = location.pathname.split("/").pop();
      const moduleName = route
        ? route.charAt(0).toUpperCase() + route.slice(1)
        : "";
      pageTitle = moduleName ? `${moduleName} | ${baseTitle}` : baseTitle;
    }

    document.title = pageTitle;
  }, [location.pathname, empresa]);
};

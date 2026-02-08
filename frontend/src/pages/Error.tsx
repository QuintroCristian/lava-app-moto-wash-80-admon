import { Button } from "@/components/ui/button";
import { useNavigate, useRouteError } from "react-router-dom";

interface RouterError {
  status?: number;
  statusText?: string;
  message?: string;
}

export const PaginaError = () => {
  const navigate = useNavigate();
  const error = useRouteError() as RouterError;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        {error.status || "404"}
      </h1>
      <p className="text-xl">
        {error.statusText || error.message || "Página no encontrada"}
      </p>
      <Button onClick={() => navigate(-1)}>Regresar</Button>
    </div>
  );
};
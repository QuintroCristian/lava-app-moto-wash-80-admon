import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataFiltersServiciosProps {
  nombreFilter: string;
  onNombreFilterChange: (value: string) => void;
}

export function DataFiltersServicios({
  nombreFilter,
  onNombreFilterChange,
}: DataFiltersServiciosProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-42">
        <Label htmlFor="nombre">Filtrar por nombre</Label>
        <Input
          id="nombre"
          value={nombreFilter}
          onChange={(e) => onNombreFilterChange(e.target.value)}
          placeholder="Buscar por nombre"
          className="max-w-sm"
        />
      </div>
    </div>
  );
}

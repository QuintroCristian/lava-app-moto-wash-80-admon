import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataFiltersPromocionesProps {
  descripcionFilter: string;
  onDescripcionFilterChange: (value: string) => void;
  estadoFilter: string;
  onEstadoFilterChange: (value: string) => void;
}

export function DataFiltersPromociones({
  descripcionFilter,
  onDescripcionFilterChange,
  estadoFilter,
  onEstadoFilterChange,
}: DataFiltersPromocionesProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-2">
        <Label>Descripción</Label>
        <Input
          placeholder="Buscar por descripción..."
          value={descripcionFilter}
          onChange={(e) => onDescripcionFilterChange(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Estado</Label>
        <Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
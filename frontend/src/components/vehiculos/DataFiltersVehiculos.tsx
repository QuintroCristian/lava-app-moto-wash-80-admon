import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataFiltersVehiculosProps {
  placaFilter: string;
  onPlacaFilterChange: (value: string) => void;
  categoriaFilter: string;
  onCategoriaFilterChange: (value: string) => void;
  clienteFilter: string;
  onClienteFilterChange: (value: string) => void;
}

export function DataFiltersVehiculos({
  placaFilter,
  onPlacaFilterChange,
  categoriaFilter,
  onCategoriaFilterChange,
  clienteFilter,
  onClienteFilterChange,
}: DataFiltersVehiculosProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-initial w-36">
        <label className="text-sm font-medium mb-2">Placa</label>
        <Input
          placeholder="Buscar por placa"
          value={placaFilter}
          onChange={(e) => onPlacaFilterChange(e.target.value.toUpperCase())}
          className="max-w-xs"
        />
      </div>
      <div className="flex-none w-42">
        <label className="text-sm font-medium mb-2">Cliente</label>
        <Input
          placeholder="Buscar por documento"
          value={clienteFilter}
          onChange={(e) => onClienteFilterChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="flex-none w-40">
        <label className="text-sm font-medium mb-2">Categoría</label>
        <Select value={categoriaFilter} onValueChange={onCategoriaFilterChange}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Moto">Moto</SelectItem>
            <SelectItem value="Auto">Auto</SelectItem>
            <SelectItem value="Cuatrimoto">Cuatrimoto</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}
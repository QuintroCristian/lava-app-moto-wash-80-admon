
import { Input } from "@/components/ui/input";

interface DataFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  documentFilter: string;
  onDocumentFilterChange: (value: string) => void;
}

export function DataFiltersClientes({
  searchTerm,
  onSearchChange,
  documentFilter,
  onDocumentFilterChange,
}: DataFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-52">
        <label className="text-sm font-medium mb-2">Nombre o Apellido</label>
        <Input
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="w-42">
        <label className="text-sm font-medium mb-2">Documento</label>
        <Input
          placeholder="Buscar por documento"
          value={documentFilter}
          onChange={(e) => onDocumentFilterChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
    </div>
  );
}
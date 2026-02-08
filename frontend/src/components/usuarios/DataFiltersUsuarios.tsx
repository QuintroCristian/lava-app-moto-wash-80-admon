import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useAuthStore } from "@/contexts";

interface DataFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRol: string;
  onRolChange: (value: string) => void;
}

export function DataFiltersUsuarios({
  searchTerm,
  onSearchChange,
  selectedRol,
  onRolChange,
}: DataFiltersProps) {
  const loggedInUser = useAuthStore(state => state.user);

  const getRoleOptions = () => {
    if (loggedInUser?.rol === "ADMINISTRADOR") {
      return [
        { value: "Todos", label: "Todos" },
        { value: "POS", label: "POS" }
      ];
    } else if (loggedInUser?.rol === "SOPORTE") {
      return [
        { value: "Todos", label: "Todos" },
        { value: "ADMINISTRADOR", label: "Administrador" },
        { value: "POS", label: "POS" },
        { value: "SOPORTE", label: "Soporte" }
      ];
    }
    return [];
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="w-36">
        <label className="text-sm font-medium mb-2">Usuario</label>
        <Input
          placeholder="Buscar por usuario"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="w-32">
        <label className="text-sm font-medium mb-2">Rol</label>
        <Select value={selectedRol} onValueChange={onRolChange}>
          <SelectTrigger>
            {selectedRol || "Filtrar por rol"}
          </SelectTrigger>
          <SelectContent>
            {getRoleOptions().map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
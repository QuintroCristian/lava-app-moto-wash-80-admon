import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface DataFiltersReportesProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  categoriaFilter: string;
  onCategoriaFilterChange: (value: string) => void;
  metodoPagoFilter: string;
  onMetodoPagoFilterChange: (value: string) => void;
  documentoFilter: string;
  onDocumentoFilterChange: (value: string) => void;
  onSearchClick: () => void;
}

export function DataFiltersReportes({
  dateRange,
  onDateRangeChange,
  categoriaFilter,
  onCategoriaFilterChange,
  metodoPagoFilter,
  onMetodoPagoFilterChange,
  documentoFilter,
  onDocumentoFilterChange,
  onSearchClick,
}: DataFiltersReportesProps) {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">Rango de Fechas</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Seleccione un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={onSearchClick}
            className="whitespace-nowrap"
          >
            Buscar
          </Button>
        </div>
      </div>

      <div className="flex-initial w-48">
        <label className="text-sm font-medium mb-2 block">Documento Cliente</label>
        <Input
          type="text"
          value={documentoFilter}
          onChange={(e) => onDocumentoFilterChange(e.target.value)}
          placeholder="Ingrese documento"
        />
      </div>

      <div className="flex-initial w-48">
        <label className="text-sm font-medium mb-2 block">Categoría</label>
        <Select value={categoriaFilter} onValueChange={onCategoriaFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas</SelectItem>
            <SelectItem value="Moto">Moto</SelectItem>
            <SelectItem value="Auto">Auto</SelectItem>
            <SelectItem value="Cuatrimoto">Cuatrimoto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-initial w-48">
        <label className="text-sm font-medium mb-2 block">Método de Pago</label>
        <Select value={metodoPagoFilter} onValueChange={onMetodoPagoFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="EF">Efectivo</SelectItem>
            <SelectItem value="TD">Tarjeta Débito</SelectItem>
            <SelectItem value="TC">Tarjeta Crédito</SelectItem>
            <SelectItem value="TR">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
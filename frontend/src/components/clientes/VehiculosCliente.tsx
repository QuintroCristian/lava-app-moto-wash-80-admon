import { useState, useEffect } from "react";
import { Vehiculo } from "@/models";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableVehiculos } from "../vehiculos/DataTableVehiculos";
import { handleApiResponse } from "@/utils/api-utils";
import { vehiculosService } from "@/api/vehiculos.service";

interface VehiculosClienteProps {
  documento_cliente: string;
}

export function VehiculosCliente({ documento_cliente }: VehiculosClienteProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      const response = await handleApiResponse(
        () => vehiculosService.getVehiculos({ documento_cliente }),
        { showErrorMessage: true }
      );

      if (response.success && response.data) {
        setVehiculos(response.data as Vehiculo[]);
      }
    };

    fetchVehiculos();
  }, [documento_cliente]);

  return (
    <Card>
      <CardContent className="pt-4">
        <DataTableVehiculos
          data={vehiculos}
          onEdit={() => { }}
          onDelete={() => { }}
          showActions={false}
        />
      </CardContent>
    </Card>
  );
}
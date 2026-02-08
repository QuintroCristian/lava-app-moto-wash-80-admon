import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cliente } from "@/models";
import { InfoCliente } from "./InfoCliente";
import { VehiculosCliente } from "./VehiculosCliente";

interface ClienteViewDialogProps {
  cliente: Cliente | null;
}

export function ClienteViewDialog({ cliente }: ClienteViewDialogProps) {
  if (!cliente) return null;

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Información del Cliente</TabsTrigger>
        <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <InfoCliente cliente={cliente} />
      </TabsContent>
      <TabsContent value="vehicles">
        <VehiculosCliente documento_cliente={cliente.documento} />
      </TabsContent>
    </Tabs>
  );
}
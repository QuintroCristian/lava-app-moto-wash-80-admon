import { RegistroFactura } from '../components/facturacion/RegistroFactura';
import { Card, CardContent } from "@/components/ui/card"

export const Facturacion = () => {

  return (
    <Card className="h-full w-full">
      <CardContent className="flex flex-col justify-stretch w-full h-full p-4 gap-2">
        {/* <h1 className="text-2xl text-center font-bold">Nueva Factura</h1> */}
        <RegistroFactura />

        {/* Tabs Para uso futuro
        <Tabs defaultValue="registro" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registro">Registrar Factura</TabsTrigger>
            <TabsTrigger value="consulta">Consultar Factura</TabsTrigger>
          </TabsList>
          <div className='flex-1 overflow-hidden'>
            <TabsContent className='h-full data-[state=active]:flex' value="registro">
              <RegistroFactura onFacturaCreada={setFacturaSeleccionada} />
            </TabsContent>
            <TabsContent value="consulta">
              <ConsultaFactura onFacturaSeleccionada={setFacturaSeleccionada} />
            </TabsContent>
          </div>
        </Tabs>
        */}
      </CardContent>
    </Card>
  );
};

import { Cliente } from "@/models";
import { Card, CardContent } from "@/components/ui/card";

interface InfoClienteProps {
  cliente: Cliente;
}

export function InfoCliente({ cliente }: InfoClienteProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Documento</label>
            <p>{cliente.documento}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Nombre Completo</label>
            <p>{cliente.nombre} {cliente.apellido}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Fecha de Nacimiento</label>
            <p>{cliente.fec_nacimiento}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <p>{cliente.telefono}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p>{cliente.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
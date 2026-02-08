
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicioGeneralForm } from "./ServicioGeneralForm";
import { ServicioAdicionalForm } from "./ServicioAdicionalForm";

interface CrearServicioDialogProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CreateServicioDialog({
  activeTab,
  setActiveTab,
  onSave,
  onCancel,
}: CrearServicioDialogProps) {

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="General">Servicio General</TabsTrigger>
        <TabsTrigger value="Adicional">Servicio Adicional</TabsTrigger>
      </TabsList>
      <TabsContent value="General">
        <ServicioGeneralForm
          // servicio={null}
          onSave={onSave}
          onCancel={onCancel}
        />
      </TabsContent>
      <TabsContent value="Adicional">
        <ServicioAdicionalForm
          onSave={onSave}
          onCancel={onCancel}
        />
      </TabsContent>
    </Tabs>
  );
}
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ReceiptPDF } from './ReceiptPDF';
import { Factura } from "@/models";
import { useAppStore } from "@/contexts";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Factura | null;
}

export function ReceiptDialog({ open, onOpenChange, receipt }: ReceiptDialogProps) {
  const navigate = useNavigate();
  const empresa = useAppStore((state) => state.empresa);
  const tema = useAppStore((state) => state.tema);

  const getFileName = () => {
    if (!receipt) return 'factura.pdf';
    const fecha = format(new Date(receipt.fecha), 'yyyyMMdd-HHmmss');
    return `factura-${receipt.id_cliente}-${fecha}.pdf`;
  };

  const handleClose = () => {
    onOpenChange(false);
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] h-[95vh] flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Factura</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {receipt && (
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <ReceiptPDF receipt={receipt} empresa={empresa} tema={tema} />
            </PDFViewer>
          )}
        </div>
        <div className="flex justify-end gap-2">
          {receipt && (
            <PDFDownloadLink
              document={<ReceiptPDF receipt={receipt} empresa={empresa} tema={tema} />}
              fileName={getFileName()}
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  {loading ? 'Generando...' : 'Descargar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          <Button onClick={handleClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { format } from 'date-fns';
import { AppState, Factura } from '@/models';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { MEDIOS_PAGO_LABELS } from '@/constants/receipt.constants';

interface ReceiptPDFProps {
  receipt: Factura;
  empresa: AppState['empresa'];
  tema: AppState['tema'];
}

export function ReceiptPDF({ receipt, empresa, tema }: ReceiptPDFProps) {
  const calculatePDFHeight = () => {
    const baseHeight = 250;
    const serviceRowHeight = 28;
    const totalHeight = baseHeight + (receipt.servicios.length * serviceRowHeight);
    return Math.max(400, totalHeight);
  };

  const styles = StyleSheet.create({
    page: {
      padding: 5,
      fontSize: 8,
      width: 300,
    },
    header: {
      marginHorizontal: 5,
      marginTop: 5,
      marginBottom: 8,
      backgroundColor: `hsl(${tema?.primario})`,
      color: `hsl(${tema?.foregroundPrimario})`,
      padding: 8,
      borderRadius: 10,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerInfo: {
      flex: 1,
    },
    headerLogo: {
      flex: 1,
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: 'auto',
      filter: 'brightness(0) invert(1)',
    },
    companyName: {
      fontSize: 14,
      marginBottom: 4,
      fontWeight: 'bold',
    },
    content: {
      padding: 8,
    },
    title: {
      fontSize: 14,
      marginBottom: 4,
      color: `hsl(${tema?.primario})`,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 8,
    },
    table: {
      display: 'flex',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: `hsl(${tema?.primario})`,
      marginVertical: 5,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: `hsl(${tema?.primario})`,
    },
    tableHeader: {
      backgroundColor: `hsl(${tema?.primario})`,
      padding: 4,
      color: `hsl(${tema?.foregroundPrimario})`,
    },
    tableCell: {
      padding: 4,
    },
    summary: {
      marginTop: 8,
      borderTop: 1,
      borderTopColor: `hsl(${tema?.primario})`,
      paddingTop: 5,
    },
    total: {
      fontSize: 12,
      color: `hsl(${tema?.primario})`,
      fontWeight: 'bold',
      marginTop: 3,
    },
    clientSection: {
      marginVertical: 5,
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: `hsl(${tema?.primario})`,
    },
    clientRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    clientLabel: {
      width: '30%',
      fontWeight: 'bold',
    },
    clientValue: {
      width: '70%',
    },
  });

  return (
    <Document>
      <Page size={[300, calculatePDFHeight()]} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <Text style={styles.companyName}>{empresa?.nombre}</Text>
              <Text>NIT: {empresa?.nit}</Text>
              <Text>{empresa?.direccion}</Text>
              <Text>Tel: {empresa?.telefono}</Text>
            </View>
            {empresa?.logo && (
              <View style={styles.headerLogo}>
                <Image style={styles.logo} src={empresa.logo} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Factura N° {receipt.numero_factura}</Text>

          <View style={styles.clientSection}>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Fecha:</Text>
              <Text style={styles.clientValue}>
                {receipt.fecha
                  ? format(new Date(receipt.fecha), 'yyyy-MM-dd hh:mm a')
                  : 'Fecha no disponible'}
              </Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Cliente:</Text>
              <Text style={styles.clientValue}>{receipt.id_cliente}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Placa:</Text>
              <Text style={styles.clientValue}>{receipt.placa}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Categoría:</Text>
              <Text style={styles.clientValue}>{receipt.categoria}</Text>
            </View>
            <View style={styles.clientRow}>
              <Text style={styles.clientLabel}>Medio de Pago:</Text>
              <Text style={styles.clientValue}>{MEDIOS_PAGO_LABELS[receipt.medio_pago]}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={{ width: '40%' }}>Servicio</Text>
              <Text style={{ width: '20%' }}>Valor</Text>
              <Text style={{ width: '20%' }}>Cantidad</Text>
              <Text style={{ width: '20%' }}>Total</Text>
            </View>
            {receipt.servicios.map((servicio, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: '40%' }}>{servicio.descripcion}</Text>
                <Text style={{ ...styles.tableCell, width: '20%' }}>
                  ${servicio.valor.toLocaleString()}
                </Text>
                <Text style={{ ...styles.tableCell, width: '20%' }}>{servicio.cantidad}</Text>
                <Text style={{ ...styles.tableCell, width: '20%' }}>
                  ${(servicio.valor * servicio.cantidad).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <Text>Valor Bruto: ${receipt.bruto.toLocaleString()}</Text>
            <Text>Descuento ({receipt.descuento}%): -${receipt.vlr_descuento.toLocaleString()}</Text>
            <Text>Subtotal: ${receipt.subtotal.toLocaleString()}</Text>
            {receipt.iva > 0 && (
              <Text>IVA ({receipt.iva}%): ${receipt.vlr_iva.toLocaleString()}</Text>
            )}
            <Text style={styles.total}>
              Total: ${receipt.total.toLocaleString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
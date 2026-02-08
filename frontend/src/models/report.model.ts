export interface Reporte {
  factura: number;
  fecha: string;
  placa: string;
  categoria: string;
  grupo: number;
  cliente: string;
  medio_pago: "TR" | "TD" | "TC" | "EF";
  iva: number;
  valor_iva: number;
  descuento: number;
  vlr_descuento: number;
  bruto: number;
  subtotal: number;
  total: number;
  servicios: ServicioReporte[];
}

export interface ServicioReporte {
  servicio: number;
  cantidad: number;
  descripcion: string;
  valor: number;
}

export interface ResumenVentas {
  total_ventas: number;
  total_servicios: number;
  ventas_por_medio_pago: {
    [key: string]: number;
  };
  servicios_mas_vendidos: {
    servicio: string;
    cantidad: number;
  }[];
}

export interface ResumenResponse {
  fecha_inicio: string;
  fecha_fin: string;
  total_ventas: number;
  numero_facturas: number;
  ventas_medios_pago: VentasMedioPago[];
  ventas_diarias: VentasDiarias[];
}

interface VentasMedioPago {
  medio_pago: string;
  total_ventas: number;
  numero_facturas: number;
}

interface VentasDiarias {
  fecha: string;
  total_ventas: number;
  numero_facturas: number;
  categorias: VentasCategoria[];
}

interface VentasCategoria {
  categoria: string;
  total_ventas: number;
  numero_facturas: number;
}

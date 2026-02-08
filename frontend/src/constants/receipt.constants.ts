export const MEDIOS_PAGO = {
  TRANSFERENCIA: "TR",
  EFECTIVO: "EF",
  TARJETA_DEBITO: "TD",
  TARJETA_CREDITO: "TC",
} as const;

export const MEDIOS_PAGO_LABELS: Record<string, string> = {
  TR: "Transferencia",
  EF: "Efectivo",
  TD: "Tarjeta Débito",
  TC: "Tarjeta Crédito",
};

export type MedioPago = (typeof MEDIOS_PAGO)[keyof typeof MEDIOS_PAGO];

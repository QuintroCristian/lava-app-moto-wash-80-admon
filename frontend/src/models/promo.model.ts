export interface Promocion {
  id_promocion?: number;
  descripcion: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  porcentaje: number;
  estado: boolean;
}

export interface Vehiculo {
  placa: string;
  documento_cliente: string;
  categoria: "Moto" | "Auto" | "Cuatrimoto";
  segmento: string;
  marca: string;
  linea: string;
  modelo: number;
  cilindrada: number;
  grupo: number;
}

export const SegmentosPorCategoria = {
  Moto: ["Scooter", "Deportiva", "Touring", "Naked", "Motocross", "Otro"],
  Auto: ["Sedan", "Coupe", "SUV", "Deportivo", "Van", "Pickup"],
  Cuatrimoto: ["Especiales"],
} as const;

export interface GrupoVehiculo {
  id: number;
  nombre: string;
}

export const GRUPOS: { [key: number]: GrupoVehiculo } = {
  101: { id: 101, nombre: "Moto Pequeña" },
  102: { id: 102, nombre: "Moto Mediana" },
  103: { id: 103, nombre: "Moto Grande" },
  201: { id: 201, nombre: "Auto Pequeño" },
  202: { id: 202, nombre: "Auto Mediano" },
  203: { id: 203, nombre: "Auto Grande" },
  301: { id: 301, nombre: "Cuatrimoto" },
};

export function calcularGrupo(
  categoria: string,
  cilindrada: number,
  segmento: string
): number {
  if (categoria === "Moto") {
    if (cilindrada === 0) return 0;
    if (cilindrada <= 250) return 101;
    if (cilindrada < 500) return 102;
    return 103;
  }

  if (categoria === "Auto") {
    if (["Sedan", "Coupe"].includes(segmento)) return 201;
    if (["SUV", "Deportivo"].includes(segmento)) return 202;
    if (["Van", "Pickup"].includes(segmento)) return 203;
  }

  if (categoria === "Cuatrimoto") return 301;

  return 0;
}

export function getNombreGrupo(id: number): string {
  return GRUPOS[id]?.nombre || "";
}

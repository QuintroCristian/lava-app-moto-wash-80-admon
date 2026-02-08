export const CATEGORIAS = ["Moto", "Auto", "Cuatrimoto"] as const;

export const VARIABLES = ["m2", "lt", "kg", "und"] as const;
export type VariableType = (typeof VARIABLES)[number];

export const VARIABLES_MAP: Record<VariableType, string> = {
  m2: "Metros cuadrados",
  lt: "Litros",
  kg: "Kilogramos",
  und: "Unidades",
};

export const getVariableLabel = (variable: VariableType): string => {
  return VARIABLES_MAP[variable];
};

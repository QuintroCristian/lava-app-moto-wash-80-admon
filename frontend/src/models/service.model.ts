interface GrupoValor {
  id: number;
  precio: number;
}

interface CategoriaValor {
  categoria: string;
  grupos: GrupoValor[];
}

interface BaseService {
  id_servicio?: number;
  nombre: string;
  tipo_servicio: "General" | "Adicional";
}

interface ServicioGeneral extends BaseService {
  tipo_servicio: "General";
  valores: CategoriaValor[];
}

interface ServicioAdicional extends BaseService {
  tipo_servicio: "Adicional";
  categorias: string[];
  precio_variable: boolean;
  variable: "m2" | "lt" | "kg" | "und" | null;
  precio_base: number;
}

function isServicioGeneral(service: BaseService): service is ServicioGeneral {
  return service.tipo_servicio === "General";
}

function isServicioAdicional(
  service: BaseService
): service is ServicioAdicional {
  return service.tipo_servicio === "Adicional";
}

type Servicio = ServicioGeneral | ServicioAdicional;

export type {
  GrupoValor,
  CategoriaValor,
  BaseService,
  ServicioGeneral,
  ServicioAdicional,
  Servicio,
};

export { isServicioGeneral, isServicioAdicional };

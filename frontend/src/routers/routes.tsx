import {
  LucideIcon,
  Users,
  Car,
  Wrench,
  UserCog,
  Gift,
  ShoppingCart,
  Receipt,
  Settings,
} from "lucide-react";
import {
  Ajustes,
  Clientes,
  Facturacion,
  Promociones,
  Servicios,
  Usuarios,
  Vehiculos,
  Ventas,
} from "@/pages";

interface PrivateRoute {
  path: string;
  element: JSX.Element;
  roles: string[];
  icon: LucideIcon;
  title: string;
}

export const privateRoutes: PrivateRoute[] = [
  {
    path: "facturacion",
    element: <Facturacion />,
    roles: ["ADMINISTRADOR", "POS"],
    icon: Receipt,
    title: "Nueva Factura",
  },
  {
    path: "ventas",
    element: <Ventas />,
    roles: ["ADMINISTRADOR"],
    icon: ShoppingCart,
    title: "Reportes de Ventas",
  },
  {
    path: "clientes",
    element: <Clientes />,
    roles: ["ADMINISTRADOR", "POS", "SOPORTE"],
    icon: Users,
    title: "Gestión de Clientes",
  },
  {
    path: "vehiculos",
    element: <Vehiculos />,
    roles: ["ADMINISTRADOR", "POS", "SOPORTE"],
    icon: Car,
    title: "Gestión de Vehículos",
  },
  {
    path: "servicios",
    element: <Servicios />,
    roles: ["ADMINISTRADOR", "SOPORTE"],
    icon: Wrench,
    title: "Servicios Disponibles",
  },
  {
    path: "usuarios",
    element: <Usuarios />,
    roles: ["ADMINISTRADOR", "SOPORTE"],
    icon: UserCog,
    title: "Gestión de Usuarios",
  },
  {
    path: "promociones",
    element: <Promociones />,
    roles: ["ADMINISTRADOR", "SOPORTE"],
    icon: Gift,
    title: "Gestión de Promociones",
  },
  {
    path: "ajustes",
    element: <Ajustes />,
    roles: ["SOPORTE"],
    icon: Settings,
    title: "Configuración de la app",
  },
];

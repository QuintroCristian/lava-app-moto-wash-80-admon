import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Dashboard, PaginaError, Login } from "@/pages";
import { MainLayout } from "@/components/Layouts";
import { useAuthStore } from "@/contexts";
import { privateRoutes } from "./routes";

export const MainRouter = () => {

  const user = useAuthStore((state) => state.user);

  const hasAccess = (allowedRoles: string[]): boolean => {
    return !!user && allowedRoles.includes(user.rol);
  }

  return createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={user ? "/dashboard" : "/login"} replace />,
      errorElement: <PaginaError />
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <ProtectedRoute isAllowed={!!user} redirectTo={"/login"}><MainLayout /></ProtectedRoute>,
      errorElement: <PaginaError />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        ...privateRoutes.map(route => ({
          path: route.path,
          element: (
            <ProtectedRoute isAllowed={hasAccess(route.roles)} redirectTo={"/dashboard"}>
              {route.element}
            </ProtectedRoute>
          )
        }))
      ]
    }
  ])
};
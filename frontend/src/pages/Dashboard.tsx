import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/contexts";
import { privateRoutes } from "@/routers";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const accessibleRoutes = privateRoutes.filter(
    route => route.roles.includes(user?.rol ?? '')
  );
  return (
    <div className="self-center w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-8">
        {accessibleRoutes.map((route) => (
          <DashboardCard
            key={route.path}
            icon={route.icon}
            title={route.title}
            onClick={() => navigate(`/${route.path}`)}
          />
        ))}
      </div>
    </div>
  );
};
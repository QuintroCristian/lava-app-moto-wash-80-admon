import { LoginForm } from "@/components/login/LoginForm";
import { useAuthStore } from "@/contexts/authStore";
import { useNavigate } from "react-router-dom";
import { usuariosService } from "@/api/usuarios.service";
import { Toaster } from "@/components/ui";
import { handleApiResponse } from "@/utils/api-utils";
import { User } from "@/models";
import { useAppStore } from "@/contexts/appStore";
import { useEffect } from "react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export const Login = () => {
  useDocumentMeta();
  const login = useAuthStore((state) => state.login);
  const fetchConfig = useAppStore((state) => state.fetchConfig);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleLogin = async (usuario: string, clave: string) => {
    const { success, data } = await handleApiResponse<User>(
      () => usuariosService.login(usuario, clave),
      { showSuccessMessage: false }
    );
    if (success && data) {
      login(data);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-screen w-full items-center justify-center px-4">
      <LoginForm onLogin={handleLogin} />
      <Toaster richColors theme="light" />
    </div>
  );
};
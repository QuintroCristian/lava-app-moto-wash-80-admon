import { api } from "@/api";
import { UserRegister } from "@/models";

export const usuariosService = {
  getUsuarios: (usuario?: string) =>
    api.get("/usuarios", { params: { ...(usuario && { usuario }) } }),

  createUsuario: (usuario: UserRegister) => api.post("/usuarios", usuario),

  updateUsuario: (usuario: UserRegister) => api.put("/usuarios", usuario),

  deleteUsuario: (usuario: string) =>
    api.delete("/usuarios", { params: { usuario } }),

  login: (usuario: string, clave: string) =>
    api.post("/usuarios/login", { usuario, clave }),
};

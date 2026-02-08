import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/contexts/authStore";
import { User, UserRegister } from "@/models";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usuariosService } from "@/api/usuarios.service";
import { useState } from "react";
import { handleApiResponse } from "@/utils/api-utils";

const createUserSchema = z.object({
  usuario: z.string().min(3, "Dener al menos 3 caracteres"),
  rol: z.string().min(1, "Seleccione un rol"),
  nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
  apellido: z.string().min(3, "Debe tener al menos 3 caracteres"),
  clave: z.string().min(6, "Debe tener al menos 6 caracteres"),
  confirmClave: z.string()
}).refine((data) => data.clave === data.confirmClave, {
  message: "Las contraseñas no coinciden",
  path: ["confirmClave"],
});

const editUserSchema = z.object({
  usuario: z.string().min(3, "Dener al menos 3 caracteres"),
  rol: z.string().min(1, "Seleccione un rol"),
  nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
  apellido: z.string().min(3, "Debe tener al menos 3 caracteres"),
  clave: z.string().optional(),
  confirmClave: z.string().optional()
}).refine((data) => {
  if (data.clave && data.clave !== '') {
    if (data.clave.length < 6) return false;
    return data.clave === data.confirmClave;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden o no cumplen con el mínimo de 6 caracteres",
  path: ["confirmClave"],
});

interface UserFormData extends UserRegister {
  confirmClave?: string;
}

interface UserDialogProps {
  user: User | null;
  onSave: () => void;
  onCancel: () => void;
}

export function UserDialog({ user, onSave, onCancel }: UserDialogProps) {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const loggedInUser = useAuthStore((state) => state.user);
  const form = useForm<UserFormData>({
    resolver: zodResolver(user ? editUserSchema : createUserSchema),
    defaultValues: user || {
      nombre: "",
      apellido: "",
      usuario: "",
      clave: "",
      confirmClave: "",
      rol: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if ((showPasswordFields || !user) && data.clave !== data.confirmClave) {
      form.setError("confirmClave", {
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    const { confirmClave, id, ...userData } = data;

    if (user) {
      if (!showPasswordFields) {
        delete userData.clave;
      }
      const { success } = await handleApiResponse(() =>
        usuariosService.updateUsuario({ ...userData, id })
      );
      if (success) onSave();
    } else {
      const { success } = await handleApiResponse(() =>
        usuariosService.createUsuario(userData)
      );
      if (success) onSave();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="usuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    value={field.value.toUpperCase()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loggedInUser?.rol === "ADMINISTRADOR" && (
                      <SelectItem value="POS">POS</SelectItem>
                    )}
                    {loggedInUser?.rol === "SOPORTE" && (
                      <>
                        <SelectItem value="POS">POS</SelectItem>
                        <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                        <SelectItem value="SOPORTE">Soporte</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clave"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmClave"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {user && (
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              {!showPasswordFields ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordFields(true)}
                >
                  Cambiar Contraseña
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordFields(false);
                    form.setValue('clave', '');
                    form.setValue('confirmClave', '');
                  }}
                >
                  Cancelar Cambio de Contraseña
                </Button>
              )}
            </div>

            {showPasswordFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmClave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        <div className="pt-4 flex gap-4">
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
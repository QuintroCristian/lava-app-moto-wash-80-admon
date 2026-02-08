import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { useAppStore } from "@/contexts/appStore";
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

const loginSchema = z.object({
  usuario: z.string().min(1, "Usuario es requerido"),
  clave: z.string().min(1, "Contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ onLogin }: { onLogin: (usuario: string, clave: string) => void }) {
  const { empresa } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      clave: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data.usuario.toUpperCase(), data.clave);
  };

  return (
    <Card className="mx-auto lg:w-full max-w-md overflow-hidden">
      <div className="bg-primary p-6 flex flex-col items-center justify-center gap-4">
        {empresa?.logo ? (
          <img
            src={empresa.logo}
            alt={empresa.nombre}
            className="h-20 w-auto object-contain"
          />
        ) : (
          <h1 className="text-2xl font-bold text-primary-foreground">
            {empresa?.nombre || "Bienvenido"}
          </h1>
        )}
      </div>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="usuario"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">Usuario</FormLabel>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 h-4 w-4 hover:bg-transparent hover:opacity-70 transition-opacity"
                          onMouseEnter={() => setIsPopoverOpen(true)}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-60"
                        onMouseEnter={() => setIsPopoverOpen(true)}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-primary">Usuarios por defecto:</h4>
                          <ul className="space-y-1 text-sm list-none pl-2">
                            <li className="text-muted-foreground">POS</li>
                            <li className="text-muted-foreground">ADMINISTRADOR</li>
                            <li className="text-muted-foreground">SOPORTE</li>
                          </ul>
                          <h4 className="font-medium text-primary pt-2">Contraseña:</h4>
                          <p className="text-sm text-muted-foreground pl-2">123456</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-11 transition-all duration-200"
                      placeholder="Ingrese su usuario"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      value={field.value.toUpperCase()}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clave"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base">Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="h-11 pr-10 transition-all duration-200"
                        placeholder="Ingrese su contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:opacity-70 transition-opacity"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

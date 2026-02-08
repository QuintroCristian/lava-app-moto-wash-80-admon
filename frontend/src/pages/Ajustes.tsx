import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppStore } from "@/contexts/appStore";
import { configService } from "@/api/config.service";
import { handleApiResponse } from "@/utils/api-utils";
import { Button } from "@/components/ui/button";
import { ColorPickerPopover } from "@/components/ui/ColorPickerPopover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useRef, useEffect } from "react";  // añadir useEffect
import { HslColor } from "react-colorful";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Percent } from "lucide-react";
import { getContrastColor, hslToString } from "@/lib/theme";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const configSchema = z.object({
  empresa: z.object({
    nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
    nit: z.string().min(3, "Debe tener al menos 3 caracteres"),
    telefono: z.string().min(7, "Debe tener al menos 7 caracteres"),
    direccion: z.string().min(3, "Debe tener al menos 3 caracteres"),
    logo: z.string().min(1, "Debe ingresar un logo"),
    iva: z.boolean(),
    valorIva: z.number().min(0).max(100),
    ivaIncluido: z.boolean(),
  }),
  tema: z.object({
    primario: z.string(),
    foregroundPrimario: z.string(),
  }),
});

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const parseHslToHex = (hslString: string): string => {
  const [h, s, l] = hslString.split(' ').map(val => parseFloat(val.replace('%', '')));
  return hslToHex(h, s, l);
};

export const Ajustes = () => {
  const { empresa, tema, setCompanyData, setThemeColors } = useAppStore();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // Función para parsear el string HSL
  const parseHslString = (hslString: string): HslColor => {
    const [h, s, l] = hslString.split(' ').map(val => parseFloat(val.replace('%', '')));
    return { h, s, l };
  };

  // Inicializar currentColor con el valor del tema
  const [currentColor, setCurrentColor] = useState<HslColor>(
    tema?.primario ? parseHslString(tema.primario) : { h: 0, s: 0, l: 0 }
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      empresa: {
        nombre: empresa?.nombre || "",
        nit: empresa?.nit || "",
        telefono: empresa?.telefono || "",
        direccion: empresa?.direccion || "",
        logo: empresa?.logo || "",
        iva: empresa?.iva || false,
        valorIva: empresa?.valor_iva || 0,
        ivaIncluido: empresa?.iva_incluido || false,
      },
      tema: {
        primario: tema?.primario || "0 0% 0%",
        foregroundPrimario: tema?.foregroundPrimario || "0 0% 100%",
      },
    },
  });

  const [primaryHex, setPrimaryHex] = useState<string>("#000000");
  const [foregroundHex, setForegroundHex] = useState<string>("#ffffff");

  useEffect(() => {
    const primary = form.getValues('tema.primario');
    const foreground = form.getValues('tema.foregroundPrimario');
    setPrimaryHex(parseHslToHex(primary));
    setForegroundHex(parseHslToHex(foreground));
  }, [form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      const currentLogo = form.getValues("empresa.logo");
      if (currentLogo) {
        form.setValue("empresa.logo", currentLogo);
      }
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      form.setError("empresa.logo", { message: "El archivo no debe superar 2MB" });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("empresa.logo", { message: "Formato de imagen no válido" });
      return;
    }


    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("empresa.logo", reader.result as string);
      form.clearErrors("empresa.logo");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLogo = () => {
    form.setValue("empresa.logo", ""); // Change null to empty string
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: z.infer<typeof configSchema>) => {
    const { success } = await handleApiResponse(() =>
      configService.updateConfig(data)
    );
    if (success) {
      setCompanyData(data.empresa);
      setThemeColors(data.tema);
    }
  };

  const updateColors = (color: HslColor) => {
    const contrastColor = getContrastColor(color);
    setCurrentColor(color);
    const newPrimary = `${color.h} ${color.s}% ${color.l}%`;
    const newForeground = hslToString(contrastColor);
    form.setValue("tema.primario", newPrimary);
    form.setValue("tema.foregroundPrimario", newForeground);
    setPrimaryHex(parseHslToHex(newPrimary));
    setForegroundHex(parseHslToHex(newForeground));
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Ajustes</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna de datos de empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Datos de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="empresa.nombre"
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
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="empresa.nit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIT</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="empresa.telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="empresa.direccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="empresa.iva"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>¿Aplicar IVA?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'true')}
                            defaultValue={field.value ? 'true' : 'false'}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center space-x-0">
                              <FormControl>
                                <RadioGroupItem value="true" className="sr-only peer" />
                              </FormControl>
                              <FormLabel className="flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white">
                                Sí
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-0">
                              <FormControl>
                                <RadioGroupItem value="false" className="sr-only peer" />
                              </FormControl>
                              <FormLabel className="flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white">
                                No
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("empresa.iva") && (
                    <>
                      <FormField
                        control={form.control}
                        name="empresa.valorIva"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porcentaje de IVA</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  defaultValue={0}
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value))}
                                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="empresa.ivaIncluido"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>IVA incluido</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => field.onChange(value === 'true')}
                                defaultValue={field.value ? 'true' : 'false'}
                                className="flex gap-4"
                              >
                                <FormItem className="flex items-center space-x-0">
                                  <FormControl>
                                    <RadioGroupItem value="true" className="sr-only peer" />
                                  </FormControl>
                                  <FormLabel className="flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white">
                                    Sí
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0">
                                  <FormControl>
                                    <RadioGroupItem value="false" className="sr-only peer" />
                                  </FormControl>
                                  <FormLabel className="flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>

            </Card>

            {/* Columna de apariencia */}
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start h-24 gap-4">
                  <FormField
                    control={form.control}
                    name="empresa.logo"
                    render={({ field: _ }) => (
                      <FormItem className="w-2/3">
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col items-center w-1/3 gap-2">
                    <span className="text-sm font-medium">Vista previa</span>
                    {form.watch("empresa.logo") ? (
                      <div className="relative">
                        <div className="w-20 aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                          <img
                            src={form.watch("empresa.logo") || undefined}
                            alt="Logo preview"
                            className="h-16 w-16 object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                          onClick={handleDeleteLogo}
                        >
                          <X className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center">Sin logo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 sm:w-36">
                    <ColorPickerPopover
                      open={colorPickerOpen}
                      setOpen={setColorPickerOpen}
                      color={currentColor}
                      setColor={updateColors}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-full min-h-[88px]"
                          style={{
                            backgroundColor: `hsl(${form.getValues('tema.primario')})`,
                            color: `hsl(${form.getValues('tema.foregroundPrimario')})`
                          }}
                        >
                          Elegir color
                        </Button>
                      }
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <FormField
                      control={form.control}
                      name="tema.primario"
                      render={({ field: _ }) => (
                        <FormItem>
                          <FormLabel>Color principal</FormLabel>
                          <FormControl>
                            <Input value={primaryHex} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tema.foregroundPrimario"
                      render={({ field: _ }) => (
                        <FormItem>
                          <FormLabel>Foreground</FormLabel>
                          <FormControl>
                            <Input value={foregroundHex} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button type="submit" className="w-fit mx-auto">
            Guardar Cambios
          </Button>
        </form>
      </Form>
    </div>
  );
};
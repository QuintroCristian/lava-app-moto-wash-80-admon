export const getContrastColor = (hsl: { h: number; s: number; l: number }) => {
  return hsl.l > 50
    ? { h: 0, s: 0, l: 0 } // negro para fondos claros
    : { h: 0, s: 0, l: 100 }; // blanco para fondos oscuros
};

export const hslToString = (hsl: { h: number; s: number; l: number }) => {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
};

export const updateThemeColors = (primary: string, foreground: string) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-foreground", foreground);
};

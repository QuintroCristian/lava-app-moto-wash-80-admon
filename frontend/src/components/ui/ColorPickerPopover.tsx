import React, { useEffect, useState } from 'react'
import { HslColor, HslColorPicker, HexColorInput } from 'react-colorful'
import { Button } from './button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

interface ColorPickerPopoverProps {
  open: boolean
  setOpen: (open: boolean) => void
  color: HslColor
  setColor: (color: HslColor) => void
  trigger?: React.ReactNode
}

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  open,
  setOpen,
  color,
  setColor,
  trigger
}) => {

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const hexToHsl = (hex: string): HslColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    const r = parseInt(result[1], 16) / 255
    const g = parseInt(result[2], 16) / 255
    const b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      h = max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4
      h *= 60
    }

    return { h, s: s * 100, l: l * 100 }
  }
  const [backupColor, setBackupColor] = useState<HslColor>(color)
  const [tempColor, setTempColor] = useState<HslColor>(color)
  const [hexColor, setHexColor] = useState(hslToHex(color.h, color.s, color.l))

  useEffect(() => {
    if (open) {
      setBackupColor(color)
      setTempColor(color)
      setHexColor(hslToHex(color.h, color.s, color.l))
    }
  }, [open])

  const handleColorPickerChange = (newColor: HslColor) => {
    setTempColor(newColor)
    setHexColor(hslToHex(newColor.h, newColor.s, newColor.l))
    setColor(newColor)
  }

  const handleColorInputChange = (newColor: string) => {
    setHexColor(newColor)
    const hslColor = hexToHsl(newColor)
    setTempColor(hslColor)
    setColor(hslColor)
  }

  const handleCancel = () => {
    setColor(backupColor)
    setOpen(false)
  }

  const handleOk = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} >
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      {open && (
        <PopoverContent className="w-auto p-3" forceMount
          side='left'
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <HslColorPicker color={tempColor} onChange={handleColorPickerChange} />
          <HexColorInput
            color={hexColor}
            onChange={handleColorInputChange}
            className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="#000000"
            prefixed
          />
          <div className="flex gap-2 mt-3">
            <Button
              variant="default"
              onClick={handleOk}
              className="flex-1"
            >
              OK
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
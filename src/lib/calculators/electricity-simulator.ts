const PRINTER_PRESETS: Record<string, number> = {
  "Creality Ender-3（150W）": 150,
  "Creality Ender-3 S1（180W）": 180,
  "Bambu Lab A1（175W）": 175,
  "Bambu Lab P1S（350W）": 350,
  "Bambu Lab X1C（350W）": 350,
  "Prusa MK4（120W）": 120,
  "Anycubic Kobra 2（240W）": 240,
};

export function calculateElectricitySimulator(values: Record<string, number | string>) {
  const preset = values.printerPreset as string;
  const presetPower = PRINTER_PRESETS[preset];
  const power = presetPower !== undefined ? presetPower : Number(values.power) || 0;
  const monthlyHours = Number(values.monthlyHours) || 0;
  const electricityRate = Number(values.electricityRate) || 0;

  const monthlyElectric = Math.round((power / 1000) * monthlyHours * electricityRate);
  const yearlyElectric = monthlyElectric * 12;
  const costPerHour = Math.round((power / 1000) * electricityRate * 10) / 10;

  return {
    monthlyElectric,
    yearlyElectric,
    costPerHour,
  };
}

export { PRINTER_PRESETS };

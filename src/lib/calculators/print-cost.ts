export function calculatePrintCost(values: Record<string, number | string>) {
  const usage = Number(values.usage) || 0;
  const filamentPrice = Number(values.filamentPrice) || 0;
  const power = Number(values.power) || 0;
  const printTime = Number(values.printTime) || 0;
  const electricityRate = Number(values.electricityRate) || 0;

  const filamentCost = (usage / 1000) * filamentPrice;
  const electricityCost = (power / 1000) * printTime * electricityRate;
  const totalCost = filamentCost + electricityCost;
  const costPerGram = usage > 0 ? totalCost / usage : 0;

  return {
    filamentCost: Math.round(filamentCost),
    electricityCost: Math.round(electricityCost * 10) / 10,
    totalCost: Math.round(totalCost),
    costPerGram: costPerGram.toFixed(2),
  };
}

export function calculatePrintTimeEstimator(values: Record<string, number | string>) {
  const width = Number(values.width) || 0;
  const depth = Number(values.depth) || 0;
  const height = Number(values.height) || 0;
  const infill = Number(values.infill) || 20;
  const layerHeight = Number(values.layerHeight) || 0.2;
  const printSpeed = Number(values.printSpeed) || 60;
  const filamentPrice = Number(values.filamentPrice) || 2500;

  if (width <= 0 || depth <= 0 || height <= 0) {
    return { estimatedTime: "—", filamentUsage: "0", estimatedCost: "0" };
  }

  // シェル体積の推定（外壁2周 + インフィル）
  const shellThickness = 1.2; // mm
  const layerCount = height / layerHeight;
  const perimeterLength = 2 * (width + depth);
  const shellVolume = perimeterLength * shellThickness * height;
  const infillVolume = Math.max(0, (width - 2 * shellThickness) * (depth - 2 * shellThickness) * height * (infill / 100));
  const totalVolumeMm3 = shellVolume + infillVolume;

  // フィラメント長さ換算（1.75mm径フィラメント密度≒1.24g/cm³ for PLA）
  const filamentDiameter = 1.75;
  const density = 1.24; // g/cm³
  const volumeCm3 = totalVolumeMm3 / 1000;
  const filamentUsageGrams = volumeCm3 * density;

  // 時間推定（簡易モデル：移動距離 / 速度）
  // 1レイヤーあたりの移動距離 = 外周 + インフィルグリッド
  const infillSpacing = printSpeed > 0 ? 0.4 : 0.4; // ライン幅
  const infillLines = (width / infillSpacing) + (depth / infillSpacing);
  const travelPerLayer = perimeterLength * 2 + (infillLines * (infill / 100));
  const totalTravelMm = travelPerLayer * layerCount;
  const printSpeedMms = printSpeed;
  const printMinutes = totalTravelMm / printSpeedMms / 60;
  const overheadFactor = 1.4; // 加減速・移動のオーバーヘッド
  const totalMinutes = printMinutes * overheadFactor;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  const timeStr = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;

  const estimatedCost = Math.round((filamentUsageGrams / 1000) * filamentPrice);

  return {
    estimatedTime: timeStr,
    filamentUsage: filamentUsageGrams.toFixed(1),
    estimatedCost: estimatedCost,
  };
}

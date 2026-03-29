"use client";

import { useState } from "react";
import { trackToolUse } from "@/lib/analytics";

const FILAMENTS = [
  {
    name: "PLA",
    strength: 3,
    flexible: 1,
    heat: 1,
    beauty: 5,
    cost: 5,
    ease: 5,
    description: "最も扱いやすい定番素材。初心者に最適。耐熱性は低い。",
    color: "#4CAF50",
  },
  {
    name: "ABS",
    strength: 4,
    flexible: 2,
    heat: 4,
    beauty: 3,
    cost: 3,
    ease: 2,
    description: "耐熱・高強度。エンクロージャーが必要で中上級者向け。",
    color: "#FF5722",
  },
  {
    name: "PETG",
    strength: 4,
    flexible: 3,
    heat: 3,
    beauty: 4,
    cost: 3,
    ease: 4,
    description: "PLAとABSの中間。汎用性が高くバランスが良い。",
    color: "#2196F3",
  },
  {
    name: "TPU",
    strength: 2,
    flexible: 5,
    heat: 2,
    beauty: 3,
    cost: 2,
    ease: 3,
    description: "ゴムのような弾力性。ケースやガスケットに最適。",
    color: "#9C27B0",
  },
  {
    name: "ナイロン",
    strength: 5,
    flexible: 4,
    heat: 4,
    beauty: 3,
    cost: 2,
    ease: 2,
    description: "高強度・高靭性。機械部品に最適だが吸湿性が高い。",
    color: "#FF9800",
  },
  {
    name: "PC",
    strength: 5,
    flexible: 2,
    heat: 5,
    beauty: 4,
    cost: 1,
    ease: 1,
    description: "最高クラスの耐熱・強度。高温ノズル・エンクロージャー必須。",
    color: "#607D8B",
  },
  {
    name: "ASA",
    strength: 4,
    flexible: 2,
    heat: 4,
    beauty: 4,
    cost: 2,
    ease: 2,
    description: "耐UV・耐候性が高く屋外使用に最適。ABSの後継。",
    color: "#795548",
  },
];

type PurposeKey = "strength" | "flexible" | "heat" | "beauty" | "cost";

const PURPOSES: { id: PurposeKey; label: string; icon: string }[] = [
  { id: "strength", label: "強度重視", icon: "💪" },
  { id: "flexible", label: "柔軟性・弾力が欲しい", icon: "🔄" },
  { id: "heat", label: "耐熱性が必要", icon: "🔥" },
  { id: "beauty", label: "美しい仕上がり重視", icon: "✨" },
  { id: "cost", label: "コスト重視", icon: "💰" },
];

const AXIS_LABELS: { key: keyof typeof FILAMENTS[0]; label: string }[] = [
  { key: "strength", label: "強度" },
  { key: "flexible", label: "柔軟性" },
  { key: "heat", label: "耐熱性" },
  { key: "beauty", label: "美観" },
  { key: "cost", label: "コスト" },
  { key: "ease", label: "扱いやすさ" },
];

function RadarChart({ filament, size = 160 }: { filament: typeof FILAMENTS[0]; size?: number }) {
  const axes = AXIS_LABELS.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const labelR = size * 0.48;

  const angleStep = (2 * Math.PI) / axes;
  const startAngle = -Math.PI / 2;

  const toXY = (i: number, r: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid rings
  const gridLevels = [1, 2, 3, 4, 5];
  const gridPaths = gridLevels.map((level) => {
    const r = (maxR * level) / 5;
    const points = Array.from({ length: axes }, (_, i) => toXY(i, r));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  });

  // Axis lines
  const axisLines = Array.from({ length: axes }, (_, i) => {
    const end = toXY(i, maxR);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  // Data polygon
  const dataPoints = AXIS_LABELS.map((axis, i) => {
    const val = filament[axis.key as keyof typeof filament] as number;
    const r = (maxR * val) / 5;
    return toXY(i, r);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Labels
  const labels = AXIS_LABELS.map((axis, i) => {
    const pos = toXY(i, labelR);
    return { ...pos, label: axis.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
      ))}
      {/* Axes */}
      {axisLines.map((line, i) => (
        <line key={i} {...line} stroke="#d1d5db" strokeWidth="0.5" />
      ))}
      {/* Data */}
      <path d={dataPath} fill={filament.color} fillOpacity="0.25" stroke={filament.color} strokeWidth="1.5" />
      {/* Labels */}
      {labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#374151"
        >
          {label.label}
        </text>
      ))}
    </svg>
  );
}

function scoreFilament(filament: typeof FILAMENTS[0], selected: Set<PurposeKey>): number {
  if (selected.size === 0) return 0;
  let total = 0;
  selected.forEach((key) => {
    total += filament[key] as number;
  });
  return total / selected.size;
}

export default function FilamentComparison() {
  const [selected, setSelected] = useState<Set<PurposeKey>>(new Set());
  const [compareSlug, setCompareSlug] = useState<string | null>(null);

  const toggle = (id: PurposeKey) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    trackToolUse("filament-comparison", Object.fromEntries([...next].map((k) => [k, true])));
  };

  const ranked = selected.size === 0
    ? FILAMENTS
    : [...FILAMENTS].sort((a, b) => scoreFilament(b, selected) - scoreFilament(a, selected));

  const compareFilament = compareSlug ? FILAMENTS.find((f) => f.name === compareSlug) : null;

  return (
    <div className="space-y-6">
      {/* Purpose selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-700 mb-4">用途・重視する点を選択（複数可）</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                selected.has(p.id)
                  ? "border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-primary)] font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <span className="text-xl">{p.icon}</span>
              <span>{p.label}</span>
              {selected.has(p.id) && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
        {selected.size === 0 && (
          <p className="text-sm text-gray-400 mt-3">用途を選択するとおすすめ順にランキングされます</p>
        )}
      </div>

      {/* Ranking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-700 mb-4">
          {selected.size > 0 ? "おすすめフィラメント ランキング" : "全フィラメント一覧"}
        </h3>
        <div className="space-y-3">
          {ranked.map((filament, index) => {
            const score = selected.size > 0 ? scoreFilament(filament, selected) : null;
            return (
              <div
                key={filament.name}
                className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                {selected.size > 0 && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-200 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                )}
                <div
                  className="w-3 h-8 rounded flex-shrink-0"
                  style={{ backgroundColor: filament.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800">{filament.name}</span>
                    {score !== null && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-xs ${s <= Math.round(score) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-tight">{filament.description}</p>
                </div>
                <button
                  onClick={() => setCompareSlug(compareSlug === filament.name ? null : filament.name)}
                  className={`text-xs px-2 py-1 rounded border flex-shrink-0 transition-colors ${
                    compareSlug === filament.name
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-bg)]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  チャート
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar chart detail */}
      {compareFilament && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-700 mb-4">{compareFilament.name} — 特性レーダーチャート</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <RadarChart filament={compareFilament} size={200} />
            <div className="flex-1 space-y-2">
              {AXIS_LABELS.map((axis) => {
                const val = compareFilament[axis.key as keyof typeof compareFilament] as number;
                return (
                  <div key={axis.key} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20">{axis.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${val * 20}%`, backgroundColor: compareFilament.color }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-4">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        <h3 className="font-bold text-gray-700 mb-4">全素材スペック比較表</h3>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-3 text-gray-600">素材</th>
              {AXIS_LABELS.map((a) => (
                <th key={a.key} className="text-center py-2 px-2 text-gray-600">{a.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILAMENTS.map((f) => (
              <tr key={f.name} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 pr-3 font-medium" style={{ color: f.color }}>{f.name}</td>
                {AXIS_LABELS.map((a) => {
                  const val = f[a.key as keyof typeof f] as number;
                  return (
                    <td key={a.key} className="text-center py-2 px-2">
                      <div className="flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-xs ${s <= val ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

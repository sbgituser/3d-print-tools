"use client";

import { useState, useCallback } from "react";
import { trackToolUse } from "@/lib/analytics";
import { calculatePrintCost } from "@/lib/calculators/print-cost";
import { calculatePrintTimeEstimator } from "@/lib/calculators/print-time-estimator";
import { calculateElectricitySimulator } from "@/lib/calculators/electricity-simulator";
import { PRINTER_PRESETS } from "@/lib/calculators/electricity-simulator";

const calculators: Record<string, (values: Record<string, number | string>) => Record<string, string | number>> = {
  "print-cost-calculator": calculatePrintCost,
  "print-time-estimator": calculatePrintTimeEstimator,
  "electricity-simulator": calculateElectricitySimulator,
};

interface ToolInput {
  id: string;
  label: string;
  type: "number" | "select" | "checkbox";
  unit?: string;
  default: number | string | boolean;
  options?: string[];
}

interface ToolOutput {
  id: string;
  label: string;
  unit?: string;
}

interface CalculatorProps {
  slug: string;
  inputs: ToolInput[];
  outputs: ToolOutput[];
}

export default function Calculator({ slug, inputs, outputs }: CalculatorProps) {
  const initialValues = Object.fromEntries(
    inputs.map((i) => [i.id, i.default as number | string])
  );
  const [values, setValues] = useState<Record<string, number | string>>(initialValues);

  const calculate = calculators[slug];

  const handleChange = useCallback(
    (id: string, value: string) => {
      const input = inputs.find((i) => i.id === id);
      let parsed: number | string = value;

      if (input?.type === "number") {
        parsed = parseFloat(value) || 0;
      }

      // Handle electricity-simulator preset: auto-fill power
      const newValues: Record<string, number | string> = { ...values, [id]: parsed };
      if (slug === "electricity-simulator" && id === "printerPreset" && value !== "カスタム") {
        const presetPower = PRINTER_PRESETS[value];
        if (presetPower !== undefined) {
          newValues["power"] = presetPower;
        }
      }

      setValues(newValues);
      trackToolUse(slug, newValues);
    },
    [values, inputs, slug]
  );

  if (!calculate) {
    return <p className="text-gray-500">このツールの計算ロジックは未実装です。</p>;
  }

  const results = calculate(values);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4 mb-6">
        {inputs.map((input) => (
          <div key={input.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {input.label}
              {input.unit && <span className="text-gray-400 ml-1">（{input.unit}）</span>}
            </label>
            {input.type === "select" ? (
              <select
                value={values[input.id] as string}
                onChange={(e) => handleChange(input.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {input.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={values[input.id] as number}
                onChange={(e) => handleChange(input.id, e.target.value)}
                step={input.id === "layerHeight" ? 0.05 : 1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg)] rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm">計算結果</h3>
        {outputs.map((output) => (
          <div key={output.id} className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">{output.label}</span>
            <span className="font-bold text-[var(--color-primary)] text-lg">
              {typeof results[output.id] === "number"
                ? results[output.id].toLocaleString()
                : results[output.id]}
              {output.unit && <span className="text-sm font-normal ml-1">{output.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
